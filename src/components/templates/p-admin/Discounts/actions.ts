"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import DiscountModel from "@root/src/models/Discount"
import type { DiscountStatus, DiscountType } from "@root/src/types/adminDiscountType"

type ActionResult = { success: true } | { success: false; error: string }

type DiscountInput = {
    code: string
    type: DiscountType
    value: number
    minOrderAmount: number
    usageLimit: number
    expiresAt: string
    status: DiscountStatus
}

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

// ────────────────────────────────
// افزودن کد تخفیف
// ────────────────────────────────
export async function addDiscountAction(data: DiscountInput): Promise<ActionResult> {
    await connectDB()

    try {
        await DiscountModel.create({
            ...data,
            code: data.code.trim().toUpperCase(),
            usedCount: 0,
        })

        revalidatePath("/p-admin/discounts")
        return { success: true }
    } catch (error) {
        console.error("Error creating discount:", error)
        if (isDuplicateKeyError(error)) {
            return { success: false, error: "این کد تخفیف قبلاً ثبت شده است" }
        }
        return { success: false, error: "خطا در ثبت کد تخفیف" }
    }
}

// ────────────────────────────────
// ویرایش کد تخفیف
// ────────────────────────────────
export async function updateDiscountAction(id: string, data: DiscountInput): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await DiscountModel.findByIdAndUpdate(
            id,
            { ...data, code: data.code.trim().toUpperCase() },
            { new: true, runValidators: true }
        )

        if (!updated) return { success: false, error: "کد تخفیفی با این شناسه یافت نشد" }

        revalidatePath("/p-admin/discounts")
        return { success: true }
    } catch (error) {
        console.error("Error updating discount:", error)
        if (isDuplicateKeyError(error)) {
            return { success: false, error: "این کد تخفیف قبلاً ثبت شده است" }
        }
        return { success: false, error: "خطا در ویرایش کد تخفیف" }
    }
}

// ────────────────────────────────
// حذف کد تخفیف
// ────────────────────────────────
export async function deleteDiscountAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const deleted = await DiscountModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "کد تخفیف یافت نشد" }

        revalidatePath("/p-admin/discounts")
        return { success: true }
    } catch (error) {
        console.error("Error deleting discount:", error)
        return { success: false, error: "خطا در حذف کد تخفیف" }
    }
}
