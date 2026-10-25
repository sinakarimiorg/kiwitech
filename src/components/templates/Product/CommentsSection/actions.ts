"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import mongoose from "mongoose"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { getClientIp, rateLimit } from "@root/src/lib/rateLimit"
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
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "برای ثبت نظر ابتدا وارد حساب کاربری شوید" }

    if (!mongoose.isValidObjectId(productId)) return { success: false, error: "محصول نامعتبر است" }

    // 5 comments per hour for each user and 20 comments for each IP
    const ip = await getClientIp()
    const userOk = await rateLimit(`comment:user:${user._id}`, 5, 3600)
    const ipOk = await rateLimit(`comment:ip:${ip}`, 20, 3600)
    if (!userOk || !ipOk) return { success: false, error: "تعداد نظرات ثبت‌شده زیاد است؛ بعداً دوباره تلاش کنید" }

    await connectDB()

    const author = (((formData.get("author") as string) || user.name || "").trim()).slice(0, 60)
    const text = ((formData.get("text") as string || "")).trim().slice(0, 2000)
    const rating = Math.round(Number(formData.get("rating")) || 0)

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