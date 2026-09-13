"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import UserModel from "@root/src/models/User"
import { getCurrentUser } from "@root/src/lib/auth/session"

type ActionResult = { success: true } | { success: false; error: string }

type ProfileInput = {
    name: string
    email?: string
    nationalCode?: string
    birthDate: string
}

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

// ────────────────────────────────
// Edit Profile Info
// ────────────────────────────────
export async function updateProfileAction(data: ProfileInput): Promise<ActionResult> {
    const currentUser = await getCurrentUser()
    if (!currentUser) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB()

    try {
        await UserModel.findByIdAndUpdate(
            currentUser._id,
            {
                name: data.name,
                email: data.email || undefined,
                nationalCode: data.nationalCode || undefined,
                birthDate: data.birthDate,
            },
            { runValidators: true }
        )

        revalidatePath("/p-user/profile")
        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        if (isDuplicateKeyError(error)) {
            return { success: false, error: "این ایمیل قبلاً ثبت شده است" }
        }
        return { success: false, error: "خطا در بروزرسانی اطلاعات" }
    }
}
