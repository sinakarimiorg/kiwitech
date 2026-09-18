"use server"

import { connectDB } from "@root/src/lib/mongodb"
import ContactMessageModel from "@root/src/models/ContactMessage"

type ActionResult = { success: true } | { success: false; error: string }

export async function submitContactMessageAction(formData: FormData): Promise<ActionResult> {
    await connectDB()

    const name = ((formData.get("name") as string) || "").trim()
    const phone = ((formData.get("phone") as string) || "").trim()
    const email = ((formData.get("email") as string) || "").trim()
    const subject = ((formData.get("subject") as string) || "").trim()
    const message = ((formData.get("message") as string) || "").trim()

    if (!name || !phone || !subject || !message) {
        return { success: false, error: "لطفاً فیلدهای الزامی را تکمیل کنید" }
    }
    if (!/^0?9\d{9}$/.test(phone)) {
        return { success: false, error: "شماره موبایل وارد شده معتبر نیست" }
    }

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
