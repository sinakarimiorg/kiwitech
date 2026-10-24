"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import UserModel from "@root/src/models/User"
import WalletTransactionModel from "@root/src/models/WalletTransaction"
import { revalidatePath } from "next/cache"


type ActionResult = { success: false, error: string } | { success: true }

// ────────────────────────────────
// Top Up Wallet Balance
// ────────────────────────────────
export async function topUpWalletAction(amount: number): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "ابتدا وارد حساب کاربری خود شوید" }

    if (process.env.NODE_ENV === "production" && process.env.ALLOW_FAKE_WALLET_TOPUP !== "true") {
        return { success: false, error: "شارژ کیف پول فعلاً در دسترس نیست" }
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 100_000_000) {
        return { success: false, error: "مبلغ وارد شده معتبر نیست" }
    }

    await connectDB()

    try {
        await UserModel.findByIdAndUpdate(user._id, { $inc: { walletBalance: amount } })

        await WalletTransactionModel.create({
            user: user._id,
            type: "واریز",
            amount,
            description: "افزایش موجودی کیف پول",
        })

        revalidatePath("/p-user/wallet")
        revalidatePath("/p-user/profile")
        return { success: true }

    } catch (error) {
        console.error("Error topping up wallet:", error)
        return { success: false, error: "خطا در افزایش موجودی" }
    }
}