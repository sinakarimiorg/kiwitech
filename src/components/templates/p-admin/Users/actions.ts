"use server"

import { connectDB } from "@root/src/lib/mongodb"
import { UserStatus } from "@root/src/types/adminUserType"
import UserModel from "@root/src/models/User"
import { revalidatePath } from "next/cache"

type ActionResult = { success: true } | { success: false, error: string }

type UserInput = {
    name: string
    phone: string
    email?: string
    status: UserStatus
}

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

// Add User Action
export async function addUserAction(data: UserInput): Promise<ActionResult> {
    await connectDB()

    try {
        await UserModel.create({ ...data, ordersCount: 0, totalSpent: 0, adresses: [], favorites: [], walletBalance: 0, role: "کاربر" })
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

// Update User Action
export async function updateUserAction(id: string, data: UserInput): Promise<ActionResult> {
    await connectDB()
    try {
        const updated = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!updated) return { success: false, error: "مشتری یافت نشد" }

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

//Change User Status Action
export async function toggleUserStatusAction(id: string, newStatus: UserStatus): Promise<ActionResult> {
    await connectDB()
    try {
        const updated = await UserModel.findByIdAndUpdate(id, { status: newStatus }, { new: true, runValidators: true })
        if (!updated) return { success: false, error: "مشتری یافت نشد" }
        revalidatePath("/p-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error toggling user status:", error)
        return { success: false, error: "خطا در تغییر وضعیت مشتری" }
    }
}


// Delete User Action
export async function deleteUserAction(id: string): Promise<ActionResult> {
    await connectDB()
    try {
        const deleted = await UserModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "مشتری یافت نشد" }
        revalidatePath("/p-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "خطا در حذف مشتری" }
    }
}