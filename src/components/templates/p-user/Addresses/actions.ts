"use server"

import { connectDB } from "@root/src/lib/mongodb"
import AddressModel from "@models/Address"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { revalidatePath } from "next/cache"


type ActionResult = { success: true } | { success: false, error: string }

type AddressInput = {
    title: string
    receiver: string
    phone: string
    fullAddress: string
}

// ────────────────────────────────
// Add new Address
// ────────────────────────────────
export async function addAddressAction(data: AddressInput): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB()

    try {
        const count = await AddressModel.countDocuments({ user: user._id })
        await AddressModel.create({ ...data, user: user._id, isDefault: count === 0 })

        revalidatePath("/p-user/addresses")
        return { success: true }
    } catch (error) {
        console.log("error creating address:", error)
        return { success: false, error: "خطا در ثبت آدرس" }
    }
}

// ────────────────────────────────
// Update Address
// ────────────────────────────────
export async function updateAddressAction(id: string, data: AddressInput): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    await connectDB();
    try {
        const updated = await AddressModel.findOneAndUpdate(
            { _id: id, user: user._id },
            data,
            { new: true, runValidators: true }
        )
        if (!updated) return { success: false, error: "آدرس یافت نشد!" }

        revalidatePath("/p-user/addresses")
        return { success: true }
    } catch (error) {
        console.log("Error updating address:", error)
        return { success: false, error: "خطا در ویرایش آدرس" }
    }
}

// ────────────────────────────────
// Delete Address
// ────────────────────────────────
export async function deleteAddressAction(id: string): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری شوید" }

    await connectDB()

    try {
        const deleted = await AddressModel.findOneAndDelete({ _id: id, user: user._id })
        if (!deleted) return { success: false, error: "آدرس یافت نشد!" }

        // Change Default Address
        if (deleted.isDefault) {
            const nextAddress = await AddressModel.findOne({ user: user._id }).sort({ _id: 1 })
            if (nextAddress) {
                nextAddress.isDefault = true
                await nextAddress.save()
            }
        }

        revalidatePath("p-user/addresses")
        return { success: true }

    } catch (error) {
        console.log("Error deleting address:", error)
        return { success: false, error: "خطا در حذف آدرس" }
    }
}

// ────────────────────────────────
// Set Default Address
// ────────────────────────────────
export async function setDefaultAddressAction(id: string): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید!" }

    await connectDB()

    try {
        await AddressModel.updateMany({ user: user._id }, { isDefault: false })
        const updated = await AddressModel.findOneAndUpdate(
            { user: user._id, _id: id },
            { isDefault: true },
            { returnDocument: 'after' }
        )
        if (!updated) return { success: false, error: "آدرس یافت نشد!" }
        revalidatePath("/p-user/addresses")
        return { success: true }

    } catch (error) {
        console.error("Error setting default address:", error)
        return { success: false, error: "خطا در تنظیم آدرس پیش‌فرض" }
    }
}