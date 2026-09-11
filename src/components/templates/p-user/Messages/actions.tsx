"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import MessagesModel from "@models/Message"
import { revalidatePath } from "next/cache"


type ActionResult = { success: true } | { success: false, error: string }

// ────────────────────────────────
// Mark A Message As Read
// ────────────────────────────────
export async function markMessageAsReadAction(id: string): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB()

    try {
        const updated = await MessagesModel.findOneAndUpdate(
            { _id: id, user: user._id },
            { isRead: true },
            { new: true }
        )
        if (!updated) return { success: false, error: "پیام یافت نشد!" }

        revalidatePath("/p-user/messages")
        return { success: true }
    } catch (error) {
        console.log("Error marking message as read:", error)
        return { success: false, error: "خطا در بروزرسانی پیام" }
    }
}


// ────────────────────────────────
// Mark All Messages As Read
// ────────────────────────────────
export async function markAllMessagesAsReadAction(): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB()

    try {
        await MessagesModel.updateMany({ user: user._id, isRead: false }, { isRead: true })
        revalidatePath("/p-user/messages")
        return { success: true }
    } catch (error) {
        console.log("Error marking all messages as read:", error)
        return { success: false, error: "خطا در بروزرسانی پیام‌ها" }
    }
}

// ────────────────────────────────
// Delete Message
// ────────────────────────────────
export async function deleteMessageAction(id: string): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB()
    try {
        const deleted = await MessagesModel.findOneAndDelete({ _id: id, user: user._id })
        if (!deleted) return { success: false, error: "پیام یافت نشد!" }

        revalidatePath("/p-user/messages")
        return { success: true }
    } catch (error) {
        console.log("Error deleting message:", error)
        return { success: false, error: "خطا در حذف پیام" }
    }
}