"use server"

import { requireAdmin, ADMIN_DENIED } from "@root/src/lib/auth/session"
import { revalidatePath } from "next/cache"
import { invalidate } from "@root/src/lib/cache"
import { connectDB } from "@root/src/lib/mongodb"
import { saveImageFile, isUploadPath } from "@root/src/lib/uploads"
import mongoose from "mongoose"
import BannerModel from "@root/src/models/Banner"
import type { BannerPosition, BannerStatus } from "@root/src/types/adminBannerType"

type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Add new banner
// ────────────────────────────────
export async function addBannerAction(formData: FormData): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    await connectDB()

    const imageFile = formData.get("image") as File | null
    if (!imageFile || !imageFile.size) {
        return { success: false, error: "تصویر بنر الزامی است" }
    }

    try {
        const saved = await saveImageFile(imageFile)
        if ("error" in saved) return { success: false, error: saved.error }

        const position = formData.get("position") as BannerPosition
        const siblingsCount = await BannerModel.countDocuments({ position })

        await BannerModel.create({
            title: formData.get("title"),
            position,
            image: saved.path,
            linkUrl: (formData.get("linkUrl") as string) || "#",
            order: siblingsCount + 1,
            status: (formData.get("status") as BannerStatus) || "active",
        })

        invalidate("banners")

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
    if (!(await requireAdmin())) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }
    await connectDB()

    try {
        const imageFile = formData.get("image") as File | null
        let image = formData.get("existingImage") as string

        if (imageFile && imageFile.size) {
            const saved = await saveImageFile(imageFile)
            if ("error" in saved) return { success: false, error: saved.error }
            image = saved.path
        } else if (!isUploadPath(image)) {
            return { success: false, error: "تصویر بنر نامعتبر است" }
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

        invalidate("banners")

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error updating banner:", error)
        return { success: false, error: "خطا در ویرایش بنر" }
    }
}

// ────────────────────────────────
// Delete banner
// ────────────────────────────────
export async function deleteBannerAction(id: string): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED
    await connectDB()

    try {
        const deleted = await BannerModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "بنر یافت نشد" }

        invalidate("banners")

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
    if (!(await requireAdmin())) return ADMIN_DENIED
    await connectDB()

    try {
        const updated = await BannerModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
        if (!updated) return { success: false, error: "بنر یافت نشد" }

        invalidate("banners")

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
    if (!(await requireAdmin())) return ADMIN_DENIED
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

        invalidate("banners")

        revalidatePath("/p-admin/banners")
        return { success: true }
    } catch (error) {
        console.error("Error moving banner:", error)
        return { success: false, error: "خطا در تغییر ترتیب بنر" }
    }
}
