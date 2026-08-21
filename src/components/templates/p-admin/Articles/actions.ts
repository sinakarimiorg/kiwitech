"use server"

import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import path from "path"
import { connectDB } from "@root/src/lib/mongodb"
import ArticleModel from "@root/src/models/Article"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// افزودن مقاله
// ────────────────────────────────
export async function addArticleAction(formData: FormData): Promise<ActionResult> {
    await connectDB()

    const imageFile = formData.get("image") as File | null
    if (!imageFile || !imageFile.size) {
        return { success: false, error: "تصویر کاور مقاله الزامی است" }
    }

    try {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
        const imgPath = path.join(process.cwd(), "public/uploads", filename)
        await writeFile(imgPath, buffer)

        const tagsInput = formData.get("tags") as string | null
        const publish = formData.get("publish") === "true"

        await ArticleModel.create({
            title: formData.get("title"),
            linkName: formData.get("shortName"),
            category: formData.get("category"),
            excerpt: formData.get("excerpt") || null,
            content: formData.get("content") || null,
            tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
            img: `/uploads/${filename}`,
            status: publish ? "منتشر شده" : "پیش‌نویس",
        })

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error creating article:", error)
        return { success: false, error: "خطا در ثبت مقاله" }
    }
}

// ────────────────────────────────
// ویرایش مقاله
// ────────────────────────────────
export async function updateArticleAction(id: string, formData: FormData): Promise<ActionResult> {
    await connectDB()

    try {
        const imageFile = formData.get("image") as File | null
        let img = formData.get("existingImage") as string

        if (imageFile && imageFile.size) {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
            const imgPath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(imgPath, buffer)
            img = `/uploads/${filename}`
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

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error updating article:", error)
        return { success: false, error: "خطا در ویرایش مقاله" }
    }
}

// ────────────────────────────────
// حذف مقاله
// ────────────────────────────────
export async function deleteArticleAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const deleted = await ArticleModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "مقاله یافت نشد" }

        revalidatePath("/p-admin/articles")
        return { success: true }
    } catch (error) {
        console.error("Error deleting article:", error)
        return { success: false, error: "خطا در حذف مقاله" }
    }
}
