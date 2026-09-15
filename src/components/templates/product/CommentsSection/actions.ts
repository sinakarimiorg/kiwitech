"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import CommentModel from "@root/src/models/Comment"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Add New Comment IN Client Side
// ────────────────────────────────
export async function addCommentAction(
    productId: string,
    linkName: string,
    formData: FormData
): Promise<ActionResult> {
    await connectDB()

    const author = ((formData.get("author") as string) || "").trim()
    const text = ((formData.get("text") as string || "")).trim()
    const rating = Number(formData.get("rating")) || 0

    if (!author || !text) {
        return { success: false, error: "لطفاً نام و متن نظر را وارد کنید" }
    }
    if (rating < 1 || rating > 5) {
        return { success: false, error: "لطفاً یک امتیاز بین ۱ تا ۵ ستاره انتخاب کنید" }
    }

    try {
        await CommentModel.create({
            author,
            product: productId,
            text,
            rating,
            status: "در انتظار بررسی",
        })
        return { success: true }
    } catch (error) {
        console.error("Error creating comment:", error)
        return { success: false, error: "خطا در ثبت نظر، لطفاً دوباره تلاش کنید" }
    }


}