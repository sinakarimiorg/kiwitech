"use server"

import { revalidatePath } from "next/cache"
import { invalidate } from "@root/src/lib/cache"
import { connectDB } from "@root/src/lib/mongodb"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { saveImageFile } from "@root/src/lib/uploads"
import ProductModel from "@root/src/models/Product"
import { parseProductFormData } from "./productParser"

type ActionResult = { success: true } | { success: false; error: string }

const MAX_IMAGES = 10

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

async function verifyAdmin(): Promise<ActionResult | null> {
    const user = await getCurrentUser()
    if (!user || user.role !== "ادمین") {
        return { success: false, error: "شما دسترسی لازم برای این کار را ندارید" }
    }
    return null
}

async function saveImages(files: File[]): Promise<{ paths: string[] } | { error: string }> {
    const valid = files.filter(file => file && typeof file !== "string" && file.size > 0)
    if (valid.length > MAX_IMAGES) return { error: `حداکثر ${MAX_IMAGES} تصویر مجاز است` }

    const paths: string[] = []
    for (let i = 0; i < valid.length; i++) {
        const saved = await saveImageFile(valid[i], i)
        if ("error" in saved) return { error: saved.error }
        paths.push(saved.path)
    }
    return { paths }
}

// ────────────────────────────────
// Create Product
// ────────────────────────────────
export async function addProductAction(formData: FormData): Promise<ActionResult> {
    const denied = await verifyAdmin()
    if (denied) return denied

    const parsed = parseProductFormData(formData)
    if (!parsed.ok) return { success: false, error: parsed.error }

    const imageFiles = formData.getAll("images") as File[]
    if (!imageFiles.length) return { success: false, error: "تصویر محصول الزامی است" }

    await connectDB()

    try {
        const saved = await saveImages(imageFiles)
        if ("error" in saved) return { success: false, error: saved.error }
        if (!saved.paths.length) return { success: false, error: "تصویر محصول الزامی است" }

        await ProductModel.create({
            ...parsed.data,
            img: saved.paths[0],
            images: saved.paths.slice(1),
        })

        invalidate("products")

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error creating product:", error)
        if (isDuplicateKeyError(error)) return { success: false, error: "این نام لینک قبلاً برای محصول دیگری ثبت شده است" }
        return { success: false, error: "خطا در ثبت محصول" }
    }
}

// ────────────────────────────────
// Update Product
// ────────────────────────────────
export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
    const denied = await verifyAdmin()
    if (denied) return denied

    const parsed = parseProductFormData(formData)
    if (!parsed.ok) return { success: false, error: parsed.error }

    await connectDB()

    try {
        const saved = await saveImages(formData.getAll("newImages") as File[])
        if ("error" in saved) return { success: false, error: saved.error }

        let existingImages: string[] = []
        try {
            const parsedImages = JSON.parse(String(formData.get("existingImages") ?? "[]"))
            if (Array.isArray(parsedImages)) {
                existingImages = parsedImages.filter((src): src is string => typeof src === "string" && src.startsWith("/uploads/"))
            }
        } catch { }

        const allImages = [...existingImages, ...saved.paths]
        if (!allImages.length) return { success: false, error: "حداقل یک تصویر برای محصول لازم است" }

        const updated = await ProductModel.findByIdAndUpdate(
            id,
            { ...parsed.data, img: allImages[0], images: allImages.slice(1) },
            { new: true, runValidators: true }
        )
        if (!updated) return { success: false, error: "محصولی با این شناسه یافت نشد" }

        invalidate("products")

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error updating product:", error)
        if (isDuplicateKeyError(error)) return { success: false, error: "این نام لینک قبلاً برای محصول دیگری ثبت شده است" }
        return { success: false, error: "خطا در ویرایش محصول" }
    }
}

// ────────────────────────────────
// Delete Product
// ────────────────────────────────
export async function deleteProductAction(id: string): Promise<ActionResult> {
    const denied = await verifyAdmin()
    if (denied) return denied

    await connectDB()

    try {
        const deleted = await ProductModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "محصول یافت نشد" }

        invalidate("products")

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { success: false, error: "خطا در حذف محصول" }
    }
}
