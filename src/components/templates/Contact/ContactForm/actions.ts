"use server"

import { connectDB } from "@root/src/lib/mongodb"
import { getClientIp, rateLimit } from "@root/src/lib/rateLimit"
import { isValidMobile, normalizePhone } from "@root/src/utils/phone"
import ContactMessageModel from "@root/src/models/ContactMessage"

type ActionResult = { success: true } | { success: false; error: string }

export async function submitContactMessageAction(formData: FormData): Promise<ActionResult> {
    await connectDB()

    // جلوگیری از اسپم: ۵ پیام در ساعت برای هر IP
    const ip = await getClientIp()
    if (!(await rateLimit(`contact:ip:${ip}`, 5, 3600))) {
        return { success: false, error: "تعداد پیام‌های ارسالی زیاد است؛ بعداً دوباره تلاش کنید" }
    }

    const name = ((formData.get("name") as string) || "").trim().slice(0, 80)
    const rawPhone = ((formData.get("phone") as string) || "").trim()
    const email = ((formData.get("email") as string) || "").trim().slice(0, 120)
    const subject = ((formData.get("subject") as string) || "").trim().slice(0, 150)
    const message = ((formData.get("message") as string) || "").trim().slice(0, 3000)

    if (!name || !rawPhone || !subject || !message) {
        return { success: false, error: "لطفاً فیلدهای الزامی را تکمیل کنید" }
    }
    if (!isValidMobile(rawPhone)) {
        return { success: false, error: "شماره موبایل وارد شده معتبر نیست" }
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: "ایمیل وارد شده معتبر نیست" }
    }
    const phone = normalizePhone(rawPhone)

    try {
        await ContactMessageModel.create({
            name,
            phone,
            email: email || undefined,
            subject,
            message,
        })

        return { success: true }
    } catch (error) {
        console.error("Error creating contact message:", error)
        return { success: false, error: "خطا در ارسال پیام، لطفاً دوباره تلاش کنید" }
    }
}
