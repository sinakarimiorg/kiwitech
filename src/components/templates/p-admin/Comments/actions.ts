"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import CommentModel from "@root/src/models/Comment"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Approve Comment
// ────────────────────────────────
export async function approveCommentAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await CommentModel.findByIdAndUpdate(id, { status: "تایید شده" }, { new: true })
        if (!updated) return { success: false, error: "نظر یافت نشد" }

        revalidatePath("/p-admin/comments")
        return { success: true }
    } catch (error) {
        console.error("Error approving comment:", error)
        return { success: false, error: "خطا در تایید نظر" }
    }
}

// ────────────────────────────────
// Recect
// ────────────────────────────────
export async function rejectCommentAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await CommentModel.findByIdAndUpdate(id, { status: "رد شده" }, { new: true })
        if (!updated) return { success: false, error: "نظر یافت نشد" }

        revalidatePath("/p-admin/comments")
        return { success: true }
    } catch (error) {
        console.error("Error rejecting comment:", error)
        return { success: false, error: "خطا در رد نظر" }
    }
}

// ────────────────────────────────
// Delete
// ────────────────────────────────
export async function deleteCommentAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const deleted = await CommentModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "نظر یافت نشد" }

        revalidatePath("/p-admin/comments")
        return { success: true }
    } catch (error) {
        console.error("Error deleting comment:", error)
        return { success: false, error: "خطا در حذف نظر" }
    }
}
