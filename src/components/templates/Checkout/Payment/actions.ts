"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { rateLimit } from "@root/src/lib/rateLimit"
import { evaluateDiscount } from "@root/src/lib/discounts"

type PreviewResult =
    | { success: true; code: string; amount: number }
    | { success: false; error: string }

export async function previewDiscountAction(code: string, itemsTotal: number): Promise<PreviewResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    if (!(await rateLimit(`discount:user:${user._id}`, 15, 600))) {
        return { success: false, error: "تعداد تلاش‌ها زیاد است؛ چند دقیقه بعد دوباره امتحان کنید" }
    }
    if (typeof itemsTotal !== "number" || !Number.isFinite(itemsTotal) || itemsTotal <= 0) {
        return { success: false, error: "سبد خرید خالی است" }
    }

    const result = await evaluateDiscount(code, itemsTotal)
    return result.ok ? { success: true, code: result.code, amount: result.amount } : { success: false, error: result.error }
}
