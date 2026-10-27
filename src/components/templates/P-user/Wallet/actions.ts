"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { startPayment } from "@root/src/lib/payment/service"

type ActionResult = { success: false, error: string } | { success: true; paymentUrl: string }

// ────────────────────────────────
// Top Up Wallet Balance
// ────────────────────────────────
const MIN_TOPUP = 10_000
const MAX_TOPUP = 100_000_000

export async function topUpWalletAction(amount: number): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    if (typeof amount !== "number" || !Number.isInteger(amount) || amount < MIN_TOPUP || amount > MAX_TOPUP) {
        return { success: false, error: "مبلغ باید بین ۱۰٬۰۰۰ تا ۱۰۰٬۰۰۰٬۰۰۰ تومان باشد" }
    }

    try {
        const started = await startPayment({
            userId: user._id,
            userPhone: user.phone,
            purpose: "wallet",
            amount,
            description: "افزایش موجودی کیف پول کیوی‌تک",
        })
        if (!started.ok) return { success: false, error: started.error }
        return { success: true, paymentUrl: started.paymentUrl }
    } catch (error) {
        console.error("Error starting wallet payment:", error)
        return { success: false, error: "خطا در اتصال به درگاه پرداخت" }
    }
}
