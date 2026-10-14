"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import UserModel from "@root/src/models/User"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { validateProfile, type ProfileErrors } from "@root/src/utils/profileValidation"

type ActionResult =
    | { success: true }
    | { success: false; error: string; fieldErrors?: ProfileErrors }

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

    const { values, errors } = validateProfile(data)
    if (Object.keys(errors).length > 0) {
        return { success: false, error: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors: errors }
    }

    await connectDB()

    try {
        const [emailTaken, nationalCodeTaken] = await Promise.all([
            values.email
                ? UserModel.exists({ email: values.email, _id: { $ne: currentUser._id } })
                : null,
            values.nationalCode
                ? UserModel.exists({ nationalCode: values.nationalCode, _id: { $ne: currentUser._id } })
                : null,
        ])

        const fieldErrors: ProfileErrors = {}
        if (emailTaken) fieldErrors.email = "این ایمیل قبلاً برای حساب دیگری ثبت شده است."
        if (nationalCodeTaken) fieldErrors.nationalCode = "این کد ملی قبلاً برای حساب دیگری ثبت شده است."
        if (Object.keys(fieldErrors).length > 0) {
            return { success: false, error: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors }
        }

        const $set: Record<string, string> = { name: values.name }
        const $unset: Record<string, ""> = {}

        for (const key of ["email", "nationalCode", "birthDate"] as const) {
            if (values[key]) $set[key] = values[key]
            else $unset[key] = ""
        }

        await UserModel.findByIdAndUpdate(
            currentUser._id,
            Object.keys($unset).length > 0 ? { $set, $unset } : { $set },
            { runValidators: true }
        )

        // نام کاربر در سایدبار و داشبورد هم نمایش داده می‌شود، پس کل لایه‌ی پنل را رفرش می‌کنیم
        revalidatePath("/p-user", "layout")
        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: "خطا در بروزرسانی اطلاعات" }
    }
}
