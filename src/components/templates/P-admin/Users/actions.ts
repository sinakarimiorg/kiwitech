"use server"

import mongoose from "mongoose"
import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import { requireAdmin, ADMIN_DENIED, destroyAllSessions } from "@root/src/lib/auth/session"
import { isValidMobile, normalizePhone } from "@root/src/utils/phone"
import { UserStatus } from "@root/src/types/userType"
import UserModel from "@root/src/models/User"

type ActionResult = { success: true } | { success: false, error: string }

type UserInput = {
    name: string
    phone: string
    email?: string
    status: UserStatus
}

const VALID_STATUSES: UserStatus[] = ["فعال", "مسدود"]

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

function pickUserInput(data: UserInput): { ok: true; value: UserInput } | { ok: false; error: string } {
    const name = String(data?.name ?? "").trim().slice(0, 80)
    const email = String(data?.email ?? "").trim().toLowerCase().slice(0, 120)
    if (!name) return { ok: false, error: "نام مشتری الزامی است" }
    if (!isValidMobile(data?.phone)) return { ok: false, error: "شماره موبایل معتبر نیست" }
    if (!VALID_STATUSES.includes(data?.status)) return { ok: false, error: "وضعیت نامعتبر است" }
    return { ok: true, value: { name, phone: normalizePhone(data.phone), status: data.status, ...(email ? { email } : {}) } }
}

// ────────────────────────────────
// Add User Action
// ────────────────────────────────
export async function addUserAction(data: UserInput): Promise<ActionResult> {
    if (!(await requireAdmin())) return ADMIN_DENIED

    const picked = pickUserInput(data)
    if (!picked.ok) return { success: false, error: picked.error }

    await connectDB()

    try {
        await UserModel.create({ ...picked.value, ordersCount: 0, totalSpent: 0, addresses: [], favorites: [], walletBalance: 0, role: "کاربر" })
        revalidatePath("/p-admin/users")
        return { success: true }

    } catch (error) {
        console.error("Error creating user:", error)
        if (isDuplicateKeyError(error)) {
            return { success: false, error: "این شماره موبایل قبلاً ثبت شده است" }
        }
        return { success: false, error: "خطا در ثبت مشتری" }
    }
}

// ────────────────────────────────
// Update User Action
// ────────────────────────────────
export async function updateUserAction(id: string, data: UserInput): Promise<ActionResult> {
    const admin = await requireAdmin()
    if (!admin) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }

    const picked = pickUserInput(data)
    if (!picked.ok) return { success: false, error: picked.error }
    if (id === admin._id && picked.value.status === "مسدود") {
        return { success: false, error: "نمی‌توانید حساب خودتان را مسدود کنید" }
    }

    await connectDB()
    try {
        const updated = await UserModel.findByIdAndUpdate(id, { $set: picked.value }, { new: true, runValidators: true })
        if (!updated) return { success: false, error: "مشتری یافت نشد" }

        if (picked.value.status === "مسدود") await destroyAllSessions(id)

        revalidatePath("/p-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error updating user:", error)
        if (isDuplicateKeyError(error)) {
            return { success: false, error: "این شماره موبایل قبلاً ثبت شده است" }
        }
        return { success: false, error: "خطا در به‌روزرسانی مشتری" }
    }
}

// ────────────────────────────────
//Change User Status Action
// ────────────────────────────────
export async function toggleUserStatusAction(id: string, newStatus: UserStatus): Promise<ActionResult> {
    const admin = await requireAdmin()
    if (!admin) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }
    if (!VALID_STATUSES.includes(newStatus)) return { success: false, error: "وضعیت نامعتبر است" }
    if (id === admin._id && newStatus === "مسدود") {
        return { success: false, error: "نمی‌توانید حساب خودتان را مسدود کنید" }
    }

    await connectDB()
    try {
        const updated = await UserModel.findByIdAndUpdate(id, { status: newStatus }, { new: true, runValidators: true })
        if (!updated) return { success: false, error: "مشتری یافت نشد" }
        if (newStatus === "مسدود") await destroyAllSessions(id)
        revalidatePath("/p-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error toggling user status:", error)
        return { success: false, error: "خطا در تغییر وضعیت مشتری" }
    }
}

// ────────────────────────────────
// Delete User Action
// ────────────────────────────────
export async function deleteUserAction(id: string): Promise<ActionResult> {
    const admin = await requireAdmin()
    if (!admin) return ADMIN_DENIED
    if (!mongoose.isValidObjectId(id)) return { success: false, error: "شناسه نامعتبر است" }
    if (id === admin._id) return { success: false, error: "نمی‌توانید حساب خودتان را حذف کنید" }

    await connectDB()
    try {
        const deleted = await UserModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "مشتری یافت نشد" }
        await destroyAllSessions(id)
        revalidatePath("/p-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "خطا در حذف مشتری" }
    }
}