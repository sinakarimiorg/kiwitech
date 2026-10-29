import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import PaymentModel, { type PaymentPurpose } from "@models/Payment"
import OrderModel from "@models/Order"
import MessageModel from "@models/Message"
import UserModel from "@models/User"
import WalletTransactionModel from "@models/WalletTransaction"
import { releaseStock, type StockItem } from "@root/src/lib/orders/stock"
import { invalidate } from "@root/src/lib/cache"
import { requestPayment, verifyPayment } from "./zarinpal"

const PAYMENT_TTL_MS = 20 * 60 * 1000
const VERIFYING_STALE_MS = 60 * 1000

type OrderSnapshot = { items: (StockItem & { price: number })[]; address: string; phone: string; shippingCost: number }

async function getBaseUrl(): Promise<string> {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http")
    return `${proto}://${host}`
}

type StartResult = { ok: true; paymentUrl: string } | { ok: false; error: string }

export async function startPayment(params: {
    userId: string
    userPhone?: string
    purpose: PaymentPurpose
    amount: number
    description: string
    orderSnapshot?: OrderSnapshot
}): Promise<StartResult> {
    await connectDB()

    const payment = await PaymentModel.create({
        user: params.userId,
        purpose: params.purpose,
        amount: params.amount,
        status: "pending",
        expiresAt: new Date(Date.now() + PAYMENT_TTL_MS),
        orderSnapshot: params.orderSnapshot,
    })

    const gateway = await requestPayment({
        amount: params.amount,
        description: params.description,
        callbackUrl: `${await getBaseUrl()}/api/payment/callback`,
        mobile: params.userPhone,
    })

    if (!gateway.ok) {
        await PaymentModel.updateOne({ _id: payment._id }, { status: "failed" })
        if (params.orderSnapshot) {
            await releaseStock(params.orderSnapshot.items)
            invalidate("products")
        }
        return { ok: false, error: gateway.error }
    }

    await PaymentModel.updateOne({ _id: payment._id }, { authority: gateway.authority })
    return { ok: true, paymentUrl: gateway.url }
}

export type FinalizeResult =
    | { state: "paid"; purpose: PaymentPurpose; orderId?: string }
    | { state: "failed"; purpose: PaymentPurpose | null }
    | { state: "pending" }

async function failPayment(paymentId: unknown, snapshot: OrderSnapshot | undefined, status: "failed" | "expired" = "failed") {
    await PaymentModel.updateOne({ _id: paymentId }, { status })
    if (snapshot) {
        await releaseStock(snapshot.items)
        invalidate("products")
    }
}

export async function finalizePayment(authority: string, userCancelled: boolean): Promise<FinalizeResult> {
    await connectDB()
    const now = Date.now()

    let payment = await PaymentModel.findOneAndUpdate(
        { authority, status: "pending" },
        { status: "verifying", verifyingAt: new Date() },
        { returnDocument: "after" }
    )

    if (!payment) {
        const existing = await PaymentModel.findOne({ authority })
        if (!existing) return { state: "failed", purpose: null }
        if (existing.status === "paid") return { state: "paid", purpose: existing.purpose, orderId: existing.order?.toString() }
        if (existing.status !== "verifying") return { state: "failed", purpose: existing.purpose }

        // verifying: یا هنوز در جریان است، یا وسط کار قطع شده
        payment = await PaymentModel.findOneAndUpdate(
            { authority, status: "verifying", verifyingAt: { $lt: new Date(now - VERIFYING_STALE_MS) } },
            { verifyingAt: new Date() },
            { returnDocument: "after" }
        )
        if (!payment) return { state: "pending" }
    }

    const snapshot = payment.orderSnapshot as OrderSnapshot | undefined
    const expired = payment.expiresAt.getTime() < now

    if (userCancelled) {
        await failPayment(payment._id, snapshot)
        return { state: "failed", purpose: payment.purpose }
    }

    const verified = await verifyPayment({ amount: payment.amount, authority })
    if (!verified.ok) {
        if (verified.unknown) {
            // نتیجه نامعلوم: به pending برمی‌گردد تا رفرش/تلاش بعدی دوباره verify کند
            await PaymentModel.updateOne({ _id: payment._id }, { status: "pending" })
            return { state: "pending" }
        }
        await failPayment(payment._id, snapshot)
        return { state: "failed", purpose: payment.purpose }
    }

    // پول از کاربر کسر شده است
    if (payment.purpose === "order") {
        if (expired && !payment.order) {
            // موجودی قبلاً آزاد شده یا ممکن است آزاد شود؛ سفارش خودکار ساخته نمی‌شود، نیاز به بررسی دستی/بازگشت وجه
            console.error(`[payment] پرداخت موفق بعد از انقضا — نیاز به بررسی دستی: ${payment._id} refId=${verified.refId}`)
            await PaymentModel.updateOne({ _id: payment._id }, { status: "review", refId: verified.refId, cardPan: verified.cardPan })
            return { state: "failed", purpose: "order" }
        }

        let orderId = payment.order?.toString()
        if (!orderId && snapshot) {
            const order = await OrderModel.create({
                user: payment.user,
                items: snapshot.items,
                address: snapshot.address,
                phone: snapshot.phone,
                shippingCost: snapshot.shippingCost,
                status: "در حال پردازش",
            })
            orderId = order._id.toString()
            await PaymentModel.updateOne({ _id: payment._id }, { order: order._id })

            try {
                await MessageModel.create({
                    user: payment.user,
                    title: "سفارش شما ثبت شد",
                    body: "پرداخت شما با موفقیت انجام و سفارش ثبت شد. می‌توانید وضعیت آن را از بخش «سفارش‌های من» پیگیری کنید.",
                    type: "سفارش",
                    isRead: false,
                })
            } catch (error) {
                console.error("Error creating order message:", error)
            }
        }

        await PaymentModel.updateOne({ _id: payment._id }, { status: "paid", refId: verified.refId, cardPan: verified.cardPan })

        for (const path of ["/p-user/userOrders", "/p-user/messages", "/p-user", "/p-admin/orders", "/p-admin/products", "/p-admin"]) {
            revalidatePath(path)
        }
        return { state: "paid", purpose: "order", orderId }
    }

    // wallet: ثبت تراکنش فقط یک بار (claim اتمیک روی verifying → paid)
    const claimed = await PaymentModel.findOneAndUpdate(
        { _id: payment._id, status: "verifying" },
        { status: "paid", refId: verified.refId, cardPan: verified.cardPan },
        { returnDocument: "after" }
    )
    if (claimed) {
        await UserModel.updateOne({ _id: payment.user }, { $inc: { walletBalance: payment.amount } })
        await WalletTransactionModel.create({
            user: payment.user,
            type: "واریز",
            amount: payment.amount,
            description: `افزایش موجودی از درگاه بانکی (پیگیری ${verified.refId})`,
        })
        revalidatePath("/p-user/wallet")
        revalidatePath("/p-user")
    }
    return { state: "paid", purpose: "wallet" }
}

/** پرداخت‌های منقضی‌شده را می‌بندد و موجودی رزروشده را آزاد می‌کند. */
export async function expireStalePayments(limit = 50): Promise<number> {
    await connectDB()
    let count = 0

    for (let i = 0; i < limit; i++) {
        const stale = await PaymentModel.findOneAndUpdate(
            { status: "pending", expiresAt: { $lt: new Date() } },
            { status: "expired" },
            { returnDocument: "after" }
        )
        if (!stale) break
        const snapshot = stale.orderSnapshot as OrderSnapshot | undefined
        if (snapshot) {
            await releaseStock(snapshot.items)
            invalidate("products")
        }
        count++
    }
    return count
}

export const isValidAuthority = (value: unknown): value is string =>
    typeof value === "string" && /^[A-Za-z0-9]{10,64}$/.test(value)

