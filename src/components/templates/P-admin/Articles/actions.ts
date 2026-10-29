"use server"

import { requireAdmin, ADMIN_DENIED } from "@root/src/lib/auth/session"
import { revalidatePath } from "next/cache"
import { invalidate } from "@root/src/lib/cache"
import { connectDB } from "@root/src/lib/mongodb"
import { saveImageFile, isUploadPath } from "@root/src/lib/uploads"
import mongoose from "mongoose"
import ArticleModel from "@root/src/models/Article"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Add new article action
// ────────────────────────────────
export async function addArticleAction(formData: FormData): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    await connectDB()

    const imageFile = formData.get("image") as File | null
    if (!imageFile || !imageFile.size) {
        return { success: false, error: "تصویر کاور مقاله الزامی است" }
    }

    try {
        const saved = await saveImageFile(imageFile)
        if ("error" in saved) return { success: false, error: saved.error }

        const tagsInput = formData.get("tags") as string | null
        const publish = formData.get("publish") === "true"

        await ArticleModel.create({
            title: formData.get("title"),
            linkName: formData.get("shortName"),
            category: formData.get("category"),
            excerpt: formData.get("excerpt") || null,
            content: formData.get("content") || null,
            tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
            img: saved.path,
            status: publish ? "منتشر شده" : "پیش‌نویس",
        })

        invalidate("articles")

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error creating article:", error)
        return { success: false, error: "خطا در ثبت مقاله" }
    }
}

// ────────────────────────────────
// Update existing article action
// ────────────────────────────────
export async function updateArticleAction(id: string, formData: FormData): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }
    await connectDB()

    try {
        const imageFile = formData.get("image") as File | null
        let img = formData.get("existingImage") as string

        if (imageFile && imageFile.size) {
            const saved = await saveImageFile(imageFile)
            if ("error" in saved) return { success: false, error: saved.error }
            img = saved.path
        } else if (!isUploadPath(img)) {
            return { success: false, error: "تصویر مقاله نامعتبر است" }
        }

        if (!img) {
            return { success: false, error: "تصویر کاور مقاله الزامی است" }
        }

        const tagsInput = formData.get("tags") as string | null
        const publish = formData.get("publish") === "true"

        const updated = await ArticleModel.findByIdAndUpdate(
            id,
            {
                title: formData.get("title"),
                linkName: formData.get("shortName"),
                category: formData.get("category"),
                excerpt: formData.get("excerpt") || null,
                content: formData.get("content") || null,
                tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
                img,
                status: publish ? "منتشر شده" : "پیش‌نویس",
            },
            { new: true, runValidators: true }
        )

        if (!updated) return { success: false, error: "مقاله‌ای با این شناسه یافت نشد" }

        invalidate("articles")

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error updating article:", error)
        return { success: false, error: "خطا در ویرایش مقاله" }
    }
}

// ────────────────────────────────
// Delete article action
// ────────────────────────────────
export async function deleteArticleAction(id: string): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    await connectDB()

    try {
        const deleted = await ArticleModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "مقاله یافت نشد" }

        invalidate("articles")

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error deleting article:", error)
        return { success: false, error: "خطا در حذف مقاله" }
    }
}
