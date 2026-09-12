"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import FavoriteModel from "@root/src/models/Favorite"
import { getCurrentUser } from "@root/src/lib/auth/session"

type ActionResult =
    | { success: true; isFavorite: boolean }
    | { success: false; error: string }

// ────────────────────────────────
// Add or Delete Product Of Favorites
// ────────────────────────────────

export async function toggleFavoriteAction(productId: string): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: "برای افزودن به علاقه‌مندی‌ها ابتدا وارد حساب کاربری خود شوید" }
    }

    await connectDB()

    try {
        const existing = await FavoriteModel.findOne({ user: user._id, product: productId })

        if (existing) {
            await existing.deleteOne()
            revalidatePath("/p-user/favorites")
            return { success: true, isFavorite: false }
        }

        await FavoriteModel.create({ user: user._id, product: productId })
        revalidatePath("/p-user/favorites")
        return { success: true, isFavorite: true }
    } catch (error) {
        console.error("Error toggling favorite:", error)
        return { success: false, error: "خطا در ثبت علاقه‌مندی" }
    }
}