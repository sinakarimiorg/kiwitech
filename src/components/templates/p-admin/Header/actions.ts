"use server"

import { connectDB } from "@root/src/lib/mongodb"
import { revalidatePath } from "next/cache"
import OrderModel from "@models/Order"
import CommentModel from "@models/Comment"

type ActionResult = { success: true } | { success: false, error: string }

// ────────────────────────────────
// Mark single order notification as read
// ────────────────────────────────
export async function markOrderNotificationReadAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await OrderModel.findByIdAndUpdate(id, { isRead: true }, { returnDocument: 'after' })
        if (!updated) return { success: false, error: "سفارش یافت نشد" }

        revalidatePath("/p-admin", "layout")
        return { success: true }
    } catch (error) {
        console.log("Error marking order notification as read:", error)
        return { success: false, error: "خطا در بروزرسانی اعلان سفارش" }
    }
}

// ────────────────────────────────
// Mark single comment notification as read
// ────────────────────────────────
export async function markCommentNotificationReadAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await CommentModel.findByIdAndUpdate(id, { isRead: true }, { returnDocument: "after" })
        if (!updated) return { success: false, error: "نظر یافت نشد" }

        revalidatePath("/p-admin", "layout")
        return { success: true }
    } catch (error) {
        console.log("Error marking comment notification as read:", error)
        return { success: false, error: "خطا در بروزرسانی اعلان نظر" }
    }
}

// ────────────────────────────────
// Mark all fetched (unread) order + comment notifications as read
// ────────────────────────────────
export async function markAllNotificationsReadAction(
    orderIds: string[],
    commentIds: string[]
): Promise<ActionResult> {
    await connectDB()

    try {
        await Promise.all([
            orderIds.length ? OrderModel.updateMany({ _id: { $in: orderIds } }, { isRead: true }) : Promise.resolve(),
            commentIds.length ? CommentModel.updateMany({ _id: { $in: commentIds } }, { isRead: true }) : Promise.resolve()
        ])

        revalidatePath("/p-admin", "layout")
        return { success: true }
    } catch (error) {
        console.log("Error marking all notifications as read:", error)
        return { success: false, error: "خطا در بروزرسانی اعلان‌ها" }
    }
}



