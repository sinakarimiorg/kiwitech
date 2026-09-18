"use server"

import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import path from "path"
import { connectDB } from "@root/src/lib/mongodb"
import BannerModel from "@root/src/models/Banner"
import type { BannerPosition, BannerStatus } from "@root/src/types/adminBannerType"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Add new banner
// ────────────────────────────────
export async function addBannerAction(formData: FormData): Promise<ActionResult> {
    await connectDB()

    const imageFile = formData.get("image") as File | null
    if (!imageFile || !imageFile.size) {
        return { success: false, error: "تصویر بنر الزامی است" }
    }

    try {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
        const imgPath = path.join(process.cwd(), "public/uploads", filename)
        await writeFile(imgPath, buffer)

        const position = formData.get("position") as BannerPosition
        const siblingsCount = await BannerModel.countDocuments({ position })

        await BannerModel.create({
            title: formData.get("title"),
            position,
            image: `/uploads/${filename}`,
            linkUrl: (formData.get("linkUrl") as string) || "#",
            order: siblingsCount + 1,
            status: (formData.get("status") as BannerStatus) || "active",
        })

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error creating banner:", error)
        return { success: false, error: "خطا در ثبت بنر" }
    }
}

// ────────────────────────────────
// Update banner
// ────────────────────────────────
export async function updateBannerAction(id: string, formData: FormData): Promise<ActionResult> {
    await connectDB()

    try {
        const imageFile = formData.get("image") as File | null
        let image = formData.get("existingImage") as string

        if (imageFile && imageFile.size) {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
            const imgPath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(imgPath, buffer)
            image = `/uploads/${filename}`
        }

        if (!image) {
            return { success: false, error: "تصویر بنر الزامی است" }
        }

        const updated = await BannerModel.findByIdAndUpdate(
            id,
            {
                title: formData.get("title"),
                position: formData.get("position"),
                image,
                linkUrl: (formData.get("linkUrl") as string) || "#",
                status: formData.get("status"),
            },
            { new: true, runValidators: true }
        )

        if (!updated) return { success: false, error: "بنری با این شناسه یافت نشد" }

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error updating banner:", error)
        return { success: false, error: "خطا در ویرایش بنر" }
    }
}

// ────────────────────────────────
// حذف بنر
// ────────────────────────────────
export async function deleteBannerAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const deleted = await BannerModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "بنر یافت نشد" }

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error deleting banner:", error)
        return { success: false, error: "خطا در حذف بنر" }
    }
}

// ────────────────────────────────
// Toggle banner status
// ────────────────────────────────
export async function toggleBannerStatusAction(id: string, status: BannerStatus): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await BannerModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
        if (!updated) return { success: false, error: "بنر یافت نشد" }

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error toggling banner status:", error)
        return { success: false, error: "خطا در تغییر وضعیت بنر" }
    }
}

// ────────────────────────────────
// change banner situation
// ────────────────────────────────
export async function moveBannerAction(id: string, direction: "up" | "down"): Promise<ActionResult> {
    await connectDB()

    try {
        const target = await BannerModel.findById(id)
        if (!target) return { success: false, error: "بنر یافت نشد" }

        const siblings = await BannerModel.find({ position: target.position }).sort({ order: 1 })
        const index = siblings.findIndex(b => b._id.toString() === id)
        const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1]

        if (!swapWith) return { success: true }

        const targetOrder = target.order
        target.order = swapWith.order
        swapWith.order = targetOrder

        await target.save()
        await swapWith.save()

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error moving banner:", error)
        return { success: false, error: "خطا در تغییر ترتیب بنر" }
    }
}
