"use server"

import { getCurrentUser } from "@root/src/lib/auth/session";
import { connectDB } from "@root/src/lib/mongodb";
import { HomeSectionConfig } from "@root/src/types/siteSettingsType";
import { validateAndCleanSections } from "@/types/siteSettingsType"
import SiteSettingsModel from "@models/SiteSettings"
import { revalidatePath } from "next/cache";
import SettingModel from "@root/src/models/Setting"
import type { ShippingSettings } from "@root/src/types/siteSettingsType"

type SectionsActionResult =
    | { success: false; error: string }
    | { success: true; sections: HomeSectionConfig[] }

type ActionResult = { success: true } | { success: false; error: string }

const SHIPPING_KEY = "shipping"
// ────────────────────────────────
// Save home sections settings
// ────────────────────────────────
export async function saveHomeSectionsAction(sections: HomeSectionConfig[]): Promise<SectionsActionResult> {
    const user = await getCurrentUser()
    if (!user || user.role !== "ادمین") {
        return { success: false, error: "شما دسترسی لازم برای این کار را ندارید" }
    }

    try {
        await connectDB()

        const clean = validateAndCleanSections(sections)

        await SiteSettingsModel.findOneAndUpdate(
            { key: "main" },
            { key: "main", homeSections: clean },
            { upsert: true, returnDocument: "after" }
        )

        revalidatePath("/")
        revalidatePath("/p-admin/settings")
        return { success: true, sections: clean }
    } catch (error) {
        console.error("Error saving home sections:", error)
        return { success: false, error: "خطا در ذخیره‌ی تنظیمات" }
    }
}

// ────────────────────────────────
// Get Shipping Settings (creates default doc on first call)
// ────────────────────────────────
export async function getShippingSettingsAction(): Promise<ShippingSettings> {
    await connectDB()

    const doc = await SettingModel.findOneAndUpdate(
        { key: SHIPPING_KEY },
        { $setOnInsert: { key: SHIPPING_KEY } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).lean()

    const setting = doc as unknown as ShippingSettings

    return {
        freeShippingThreshold: setting.freeShippingThreshold,
        standardShippingCost: setting.standardShippingCost,
    }
}

// ────────────────────────────────
// Update Shipping Settings (admin panel)
// ────────────────────────────────
export async function updateShippingSettingsAction(data: ShippingSettings): Promise<ActionResult> {
    if (
        typeof data.freeShippingThreshold !== "number" ||
        typeof data.standardShippingCost !== "number" ||
        data.freeShippingThreshold < 0 ||
        data.standardShippingCost < 0
    ) {
        return { success: false, error: "مقادیر وارد شده معتبر نیست" }
    }

    await connectDB()

    try {
        await SettingModel.findOneAndUpdate(
            { key: SHIPPING_KEY },
            {
                key: SHIPPING_KEY,
                freeShippingThreshold: data.freeShippingThreshold,
                standardShippingCost: data.standardShippingCost,
            },
            { upsert: true, returnDocument: 'after', runValidators: true }
        )

        revalidatePath("/p-admin/settings")
        revalidatePath("/checkout/cart")
        revalidatePath("/checkout/shipping")
        revalidatePath("/checkout/payment")
        return { success: true }
    } catch (error) {
        console.error("Error updating shipping settings:", error)
        return { success: false, error: "خطا در ذخیره تنظیمات ارسال" }
    }
}