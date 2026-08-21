"use server"

import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import path from "path"
import { connectDB } from "@root/src/lib/mongodb"
import ProductModel from "@root/src/models/Product"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Create Product
// ────────────────────────────────
export async function addProductAction(formData: FormData): Promise<ActionResult> {
    await connectDB()

    const imageFiles = formData.getAll("images") as File[]
    if (!imageFiles.length) {
        return { success: false, error: "تصویر محصول الزامی است" }
    }

    try {
        const savedPaths: string[] = []
        for (let i = 0; i < imageFiles.length; i++) {
            const img = imageFiles[i]
            const buffer = Buffer.from(await img.arrayBuffer())
            const filename = `${Date.now()}-${i}-${img.name.replace(/\s+/g, "-")}`
            const imgPath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(imgPath, buffer)
            savedPaths.push(`/uploads/${filename}`)
        }

        const exPriceInput = formData.get("exPrice") as Number | null
        const descriptionInput = formData.get("description") as string | null
        const tagsInput = formData.get("tags") as string | null

        await ProductModel.create({
            name: formData.get("name"),
            linkName: formData.get("linkName"),
            price: Number(formData.get("price")),
            exPrice: exPriceInput ? Number(exPriceInput) : null,
            discount: Number(formData.get("discount")) || 0,
            stock: Number(formData.get("stock")),
            category: formData.get("category"),
            subCategory: formData.get("subCategory"),
            description: descriptionInput || null,
            colors: formData.get("colors"),
            tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
            img: savedPaths[0],
            images: savedPaths.slice(1),
        })

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error creating product:", error)
        return { success: false, error: "خطا در ثبت محصول" }
    }
}

// ────────────────────────────────
// Update Product
// ────────────────────────────────
export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
    await connectDB()

    try {
        const newImageFiles = formData.getAll("newImages") as File[]
        const newSavedPaths: string[] = []

        for (let i = 0; i < newImageFiles.length; i++) {
            const img = newImageFiles[i]
            if (!img || typeof img === "string" || !img.size) continue
            const buffer = Buffer.from(await img.arrayBuffer())
            const filename = `${Date.now()}-${i}-${img.name.replace(/\s+/g, "-")}`
            const imgPath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(imgPath, buffer)
            newSavedPaths.push(`/uploads/${filename}`)
        }

        const existingImagesRaw = formData.get("existingImages") as string | null
        const existingImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : []
        const allImages = [...existingImages, ...newSavedPaths]

        if (!allImages.length) {
            return { success: false, error: "حداقل یک تصویر برای محصول لازم است" }
        }

        const exPriceInput = formData.get("exPrice")
        const descriptionInput = formData.get("description") as string | null
        const tagsInput = formData.get("tags") as string | null

        const updated = await ProductModel.findByIdAndUpdate(
            id,
            {
                name: formData.get("name"),
                linkName: formData.get("linkName"),
                price: Number(formData.get("price")),
                exPrice: exPriceInput ? Number(exPriceInput) : null,
                discount: Number(formData.get("discount")) || 0,
                stock: Number(formData.get("stock")),
                category: formData.get("category"),
                subCategory: formData.get("subCategory"),
                description: descriptionInput || null,
                colors: formData.get("colors"),
                tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
                img: allImages[0],
                images: allImages.slice(1),
            },
            { new: true, runValidators: true }
        )

        if (!updated) return { success: false, error: "محصولی با این شناسه یافت نشد" }

        revalidatePath("/p-admin/products")
        return { success: true }
    } catch (error) {
        console.error("Error updating product:", error)
        return { success: false, error: "خطا در ویرایش محصول" }
    }
}

// ────────────────────────────────
// Delete Product
// ────────────────────────────────
export async function deleteProductAction(id: string): Promise<ActionResult> {
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
