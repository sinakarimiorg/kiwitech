"use server"

import { connectDB } from "@root/src/lib/mongodb";
import UserModel from "@root/src/models/User";
import OtpModel from "@root/src/models/Otp";
import { cookies } from "next/headers";

type RequestOtpResult =
    | { success: true; devCode?: string }
    | { success: false; error: string }

type VerifyOtpResult =
    | { success: true; isNewUser: boolean }
    | { success: false; error: string }

const OTP_EXPIRE_MINUTES = 2
const PHONE_REGEX = /^0?9\d{9}$/


function normalizePhone(phone: string) {
    const trimmed = phone.trim()
    return trimmed.startsWith("0") ? trimmed : `0${trimmed}`
}

function generateOtpCode() {
    return String(Math.floor(10000 + Math.random() * 90000))
}


// ────────────────────────────────
// Request OTP Action
// ────────────────────────────────
export async function requestOtpAction(phone: string): Promise<RequestOtpResult> {
    if (!PHONE_REGEX.test(phone.trim())) {
        return { success: false, error: "شماره موبایل وارد شده معتبر نیست" }
    }
    await connectDB();
    const normalizedPhone = normalizePhone(phone)

    try {
        const existingUser = await UserModel.findOne({ phone: normalizedPhone })
        if (existingUser && existingUser.status === "مسدود") {
            return { success: false, error: "حساب کاربری شما مسدود شده است" }
        }

        const code = generateOtpCode()
        const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000)

                await OtpModel.deleteMany({ phone: normalizedPhone })
                await OtpModel.create({ phone: normalizedPhone, code, expiresAt })

        console.log(`[OTP] کد تایید برای ${normalizedPhone}: ${code}`)

        return {
            success: true,
            devCode: process.env.NODE_ENV !== "production" ? code : undefined,
        }

    } catch (error) {
        console.error("Error requesting OTP:", error);
        return { success: false, error: "خطا در ارسال کد تایید" }
    }
}

// ────────────────────────────────
// Verify OTP Action
// ────────────────────────────────
export async function verifyOtpAction(phone: string, code: string): Promise<VerifyOtpResult> {
    if (!code.trim()) {
        return { success: false, error: "کد تایید وارد نشده است" }
    }

    await connectDB();
    const normalizedPhone = normalizePhone(phone)

    try {
        const otp = await OtpModel.findOne({ phone: normalizedPhone, code: code.trim() })
        if (!otp) {
            return { success: false, error: "کد تایید وارد شده معتبر نیست" }
        }

        if (otp.expiresAt < new Date()) {
            return { success: false, error: "کد تایید منقضی شده است" }
        }

        await otp.deleteOne()

        let user = await UserModel.findOne({ phone: normalizedPhone })
        let isNewUser = !user

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

        const cookieStore = await cookies()
        cookieStore.set("kiwitech_session", user._id.toString(), {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        })

        return { success: true, isNewUser }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, error: "خطا در تایید کد تایید" }
    }
}

// ────────────────────────────────
// Logout Action
// ────────────────────────────────
export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete("kiwitech_session")
}