"use server"

import mongoose from "mongoose"
import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import { requireAdmin, ADMIN_DENIED } from "@root/src/lib/auth/session"
import ContactMessageModel from "@root/src/models/ContactMessage"

type ActionResult = { success: true } | { success: false; error: string }

const refresh = () => {
    revalidatePath("/p-admin/messages")
    revalidatePath("/p-admin", "layout")
}

export async function setContactMessageReadAction(id: string, read: boolean): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }

    await connectDB()
    try {
        const updated = await ContactMessageModel.findByIdAndUpdate(id, { status: read ? "خوانده شده" : "خوانده نشده" })
        if (!updated) return { success: false, error: "پیام یافت نشد" }
        refresh()
        return { success: true }
    } catch (error) {
        console.error("Error updating contact message:", error)
        return { success: false, error: "خطا در بروزرسانی پیام" }
    }
}

export async function markAllContactMessagesReadAction(): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED

    await connectDB()
    try {
        await ContactMessageModel.updateMany({ status: "خوانده نشده" }, { status: "خوانده شده" })
        refresh()
        return { success: true }
    } catch (error) {
        console.error("Error marking all contact messages read:", error)
        return { success: false, error: "خطا در بروزرسانی پیام‌ها" }
    }
}

export async function deleteContactMessageAction(id: string): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }

    await connectDB()
    try {
        const deleted = await ContactMessageModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "پیام یافت نشد" }
        refresh()
        return { success: true }
    } catch (error) {
        console.error("Error deleting contact message:", error)
        return { success: false, error: "خطا در حذف پیام" }
    }
}
