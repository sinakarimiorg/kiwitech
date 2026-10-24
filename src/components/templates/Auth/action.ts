"use server"

import { createHash, randomInt } from "crypto"
import { connectDB } from "@root/src/lib/mongodb"
import UserModel from "@root/src/models/User"
import OtpModel from "@root/src/models/Otp"
import { createSession, destroySession, getCurrentUser } from "@root/src/lib/auth/session"
import { getClientIp, rateLimit, resetRateLimit } from "@root/src/lib/rateLimit"
import { isValidMobile, normalizePhone } from "@root/src/utils/phone"
import { toEnglishDigits } from "@root/src/utils/profileValidation"

type RequestOtpResult =
    | { success: true; devCode?: string }
    | { success: false; error: string }

type VerifyOtpResult =
    | { success: true; isNewUser: boolean }
    | { success: false; error: string }

type CompleteProfileResult =
    | { success: true }
    | { success: false; error: string }

type SessionUser = { name: string; phone: string; role: string } | null

const OTP_EXPIRE_MINUTES = 2
const OTP_COOLDOWN_SECONDS = 60
const OTP_REQUESTS_PER_HOUR_PER_PHONE = 5
const OTP_REQUESTS_PER_HOUR_PER_IP = 20
const OTP_VERIFY_ATTEMPTS = 5
const OTP_VERIFY_WINDOW_SECONDS = 10 * 60

// کد در دیتابیس هش می‌شود (به شماره هم وابسته است)
const hashCode = (phone: string, code: string) =>
    createHash("sha256").update(`${phone}:${code}`).digest("hex")

// ۵ رقمی با منبع تصادفی امن
const generateOtpCode = () => String(randomInt(10000, 100000))

// TODO: اتصال به سرویس پیامک (کاوه‌نگار / قاصدک و ...)
async function sendOtpSms(_phone: string, _code: string) {
    // await smsProvider.send(phone, code)
}

// ────────────────────────────────
// Request OTP Action
// ────────────────────────────────
export async function requestOtpAction(phone: string): Promise<RequestOtpResult> {
    if (!isValidMobile(phone)) {
        return { success: false, error: "شماره موبایل وارد شده معتبر نیست" }
    }
    const normalizedPhone = normalizePhone(phone)

    await connectDB()

    const ip = await getClientIp()
    if (!(await rateLimit(`otp-cooldown:${normalizedPhone}`, 1, OTP_COOLDOWN_SECONDS))) {
        return { success: false, error: "لطفاً چند لحظه صبر کنید و دوباره تلاش کنید" }
    }
    const phoneOk = await rateLimit(`otp-req:phone:${normalizedPhone}`, OTP_REQUESTS_PER_HOUR_PER_PHONE, 3600)
    const ipOk = await rateLimit(`otp-req:ip:${ip}`, OTP_REQUESTS_PER_HOUR_PER_IP, 3600)
    if (!phoneOk || !ipOk) {
        return { success: false, error: "تعداد درخواست‌های شما زیاد است؛ بعداً دوباره تلاش کنید" }
    }

    try {
        const existingUser = await UserModel.findOne({ phone: normalizedPhone })
        if (existingUser && existingUser.status === "مسدود") {
            return { success: false, error: "حساب کاربری شما مسدود شده است" }
        }

        const code = generateOtpCode()
        const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000)

        await OtpModel.deleteMany({ phone: normalizedPhone })
        await OtpModel.create({ phone: normalizedPhone, code: hashCode(normalizedPhone, code), expiresAt })

        await sendOtpSms(normalizedPhone, code)

        return {
            success: true,
            devCode: process.env.NODE_ENV !== "production" ? code : undefined,
        }
    } catch (error) {
        console.error("Error requesting OTP:", error)
        return { success: false, error: "خطا در ارسال کد تایید" }
    }
}

// ────────────────────────────────
// Verify OTP Action
// ────────────────────────────────
export async function verifyOtpAction(phone: string, code: string): Promise<VerifyOtpResult> {
    const cleanCode = toEnglishDigits(String(code ?? "")).trim()
    if (!cleanCode) {
        return { success: false, error: "کد تایید وارد نشده است" }
    }
    if (!isValidMobile(phone)) {
        return { success: false, error: "شماره موبایل وارد شده معتبر نیست" }
    }
    const normalizedPhone = normalizePhone(phone)

    await connectDB()

    // جلوگیری از brute force روی کد ۵ رقمی
    const attemptKey = `otp-verify:${normalizedPhone}`
    if (!(await rateLimit(attemptKey, OTP_VERIFY_ATTEMPTS, OTP_VERIFY_WINDOW_SECONDS))) {
        return { success: false, error: "تعداد تلاش‌های ناموفق زیاد است؛ چند دقیقه بعد دوباره امتحان کنید" }
    }

    try {
        const otp = await OtpModel.findOne({ phone: normalizedPhone, code: hashCode(normalizedPhone, cleanCode) })
        if (!otp) {
            return { success: false, error: "کد تایید وارد شده معتبر نیست" }
        }

        if (otp.expiresAt < new Date()) {
            return { success: false, error: "کد تایید منقضی شده است" }
        }

        await otp.deleteOne()
        await resetRateLimit(attemptKey)

        let user = await UserModel.findOne({ phone: normalizedPhone })
        const isNewUser = !user

        if (!user) {
            user = await UserModel.create({
                name: "کاربر جدید",
                phone: normalizedPhone,
                ordersCount: 0,
                totalSpent: 0,
                addresses: [],
                favorites: [],
                walletBalance: 0,
                role: "کاربر",
                status: "فعال",
            })
        }

        if (user.status === "مسدود") {
            return { success: false, error: "حساب کاربری شما مسدود شده است" }
        }

        await createSession(user._id.toString())

        return { success: true, isNewUser }
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return { success: false, error: "خطا در تایید کد تایید" }
    }
}

// ────────────────────────────────
// Complete Profile Action
// ────────────────────────────────
export async function completeProfileAction(fullName: string, email?: string): Promise<CompleteProfileResult> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: "کاربر یافت نشد، لطفاً دوباره تلاش کنید" }
    }

    const name = String(fullName ?? "").trim().slice(0, 80)
    const cleanEmail = String(email ?? "").trim().toLowerCase().slice(0, 120)
    if (!name) return { success: false, error: "نام و نام خانوادگی الزامی است" }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, error: "ایمیل وارد شده معتبر نیست" }
    }

    await connectDB()

    try {
        if (cleanEmail && (await UserModel.exists({ email: cleanEmail, _id: { $ne: user._id } }))) {
            return { success: false, error: "این ایمیل قبلاً برای حساب دیگری ثبت شده است" }
        }

        await UserModel.findByIdAndUpdate(
            user._id,
            { name, ...(cleanEmail ? { email: cleanEmail } : {}) },
            { runValidators: true }
        )

        return { success: true }
    } catch (error) {
        console.error("Error completing profile:", error)
        return { success: false, error: "خطا در ثبت اطلاعات کاربری" }
    }
}

// ────────────────────────────────
// Get Session User Action
// ────────────────────────────────
export async function getSessionUserAction(): Promise<SessionUser> {
    const user = await getCurrentUser()
    if (!user) return null
    return { name: user.name, phone: user.phone, role: user.role }
}

// ────────────────────────────────
// Logout Action
// ────────────────────────────────
export async function logoutAction(): Promise<void> {
    await destroySession()
}
