"use server"

import { revalidatePath } from "next/cache"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { connectDB } from "@root/src/lib/mongodb"
import { getCurrentUser } from "@root/src/lib/auth/session"
import ProductModel from "@root/src/models/Product"
import { parseProductFormData } from "./productParser"

type ActionResult = { success: true } | { success: false; error: string }

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
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

    const uploadDir = path.join(process.cwd(), "public/uploads")
    await mkdir(uploadDir, { recursive: true })

    const paths: string[] = []
    for (let i = 0; i < valid.length; i++) {
        const file = valid[i]
        if (!file.type.startsWith("image/")) return { error: "فقط فایل تصویری مجاز است" }
        if (file.size > MAX_IMAGE_SIZE) return { error: "حجم هر تصویر حداکثر ۵ مگابایت است" }

        const rawExt = path.extname(file.name).toLowerCase()
        const ext = /^\.[a-z0-9]{1,5}$/.test(rawExt) ? rawExt : ".jpg"
        const filename = `${Date.now()}-${i}${ext}`
        await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))
        paths.push(`/uploads/${filename}`)
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

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { success: false, error: "خطا در حذف محصول" }
    }
}
