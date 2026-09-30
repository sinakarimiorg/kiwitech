"use server"

import { getCurrentUser } from "@root/src/lib/auth/session";
import { connectDB } from "@root/src/lib/mongodb";
import { HomeSectionConfig } from "@root/src/types/siteSettingsType";
import { validateAndCleanSections } from "@/types/siteSettingsType"
import SiteSettingsModel from "@models/SiteSettings"
import { revalidatePath } from "next/cache";

type ActionResult =
    | { success: false; error: string }
    | { success: true; sections: HomeSectionConfig[] }

// ────────────────────────────────
// Save home sections settings
// ────────────────────────────────
export async function saveHomeSectionsAction(sections: HomeSectionConfig[]): Promise<ActionResult> {
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