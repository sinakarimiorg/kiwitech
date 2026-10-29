"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import { Types } from "mongoose"
import ProductModel from "@models/Product"
import { getShippingSettingsAction } from "@root/src/components/templates/P-admin/Settings/actions"
import { resolveVariant, hasColors, findColor } from "@root/src/lib/productVariants"
import { reserveStock, releaseStock } from "@root/src/lib/orders/stock"
import { invalidate } from "@root/src/lib/cache"
import { expireStalePayments, startPayment } from "@root/src/lib/payment/service"
import type { AdminProduct } from "@root/src/types/adminProductType"

type OrderItemInput = {
    product: string
    color?: string
    count: number
}

type CreateOrderInput = {
    items: OrderItemInput[]
    address: string
    phone: string
}

type ActionResult =
    | { success: true; paymentUrl: string }
    | { success: false; error: string }

const MAX_ITEMS = 50
const MAX_COUNT_PER_ITEM = 100

// ────────────────────────────────
// Create Order
// ────────────────────────────────
export async function createOrderAction(data: CreateOrderInput): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: "برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید" }
    }

    if (!Array.isArray(data?.items) || !data.items.length) {
        return { success: false, error: "سبد خرید خالی است" }
    }
    if (data.items.length > MAX_ITEMS) {
        return { success: false, error: "تعداد اقلام سبد خرید بیش از حد مجاز است" }
    }
    if (!data.address?.trim() || !data.phone?.trim()) {
        return { success: false, error: "آدرس و شماره تماس الزامی است" }
    }

    const merged = new Map<string, OrderItemInput>()
    for (const raw of data.items) {
        const count = Math.floor(Number(raw?.count))
        if (!Types.ObjectId.isValid(raw?.product) || !Number.isFinite(count) || count < 1) {
            return { success: false, error: "اطلاعات سبد خرید معتبر نیست" }
        }
        const key = `${raw.product}:${raw.color ?? ""}`
        const existing = merged.get(key)
        const nextCount = (existing?.count ?? 0) + count
        if (nextCount > MAX_COUNT_PER_ITEM) return { success: false, error: "تعداد درخواستی یک کالا بیش از حد مجاز است" }
        merged.set(key, { product: raw.product, color: raw.color || undefined, count: nextCount })
    }
    const lines = [...merged.values()]

    await connectDB()
    await expireStalePayments(20).catch(() => { })

    try {
        const productDocs = await ProductModel.find({ _id: { $in: lines.map(line => line.product) } }).lean()
        const productMap = new Map<string, AdminProduct>(
            productDocs.map((doc: any) => [String(doc._id), JSON.parse(JSON.stringify(doc)) as AdminProduct])
        )

        const orderItems: {
            product: string
            title: string
            img: string
            price: number
            count: number
            color?: string
            colorHex?: string
        }[] = []

        for (const line of lines) {
            const product = productMap.get(line.product)
            if (!product) return { success: false, error: "یکی از کالاهای سبد خرید دیگر موجود نیست" }

            if (hasColors(product) && !line.color) {
                return { success: false, error: `برای «${product.name}» رنگ انتخاب نشده است` }
            }
            if (line.color && !findColor(product, line.color)) {
                return { success: false, error: `رنگ انتخاب‌شده برای «${product.name}» دیگر وجود ندارد` }
            }

            const variant = resolveVariant(product, line.color)
            const label = variant.color ? `${product.name} (${variant.color.name})` : product.name

            if (!variant.available) return { success: false, error: `«${label}» ناموجود شده است` }
            if (line.count > variant.stock) {
                return { success: false, error: `از «${label}» فقط ${variant.stock} عدد موجود است` }
            }

            orderItems.push({
                product: line.product,
                title: product.name,
                img: product.img,
                price: variant.price,
                count: line.count,
                ...(variant.color ? { color: variant.color.name, colorHex: variant.color.hex } : {}),
            })
        }

        const shipping = await getShippingSettingsAction()
        const itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.count, 0)
        const shippingCost = itemsTotal > 0 && itemsTotal < shipping.freeShippingThreshold ? shipping.standardShippingCost : 0

        const reserved = await reserveStock(orderItems)
        if (!reserved.ok) {
            return { success: false, error: `موجودی «${reserved.title ?? "یکی از کالاها"}» هم‌اکنون کافی نیست؛ سبد خرید را بررسی کنید` }
        }

        invalidate("products")  //Reserve stock invalidated

        // The order is only created after payment confirmation (service.finalizePayment); until then, the stock is reserved
        let started
        try {
            started = await startPayment({
                userId: user._id,
                userPhone: user.phone,
                purpose: "order",
                amount: itemsTotal + shippingCost,
                description: `پرداخت سفارش کیوی‌تک (${orderItems.length} قلم)`,
                orderSnapshot: {
                    items: orderItems,
                    address: data.address.trim().slice(0, 600),
                    phone: data.phone.trim().slice(0, 20),
                    shippingCost,
                },
            })
        } catch (error) {
            await releaseStock(orderItems)
            throw error
        }

        if (!started.ok) return { success: false, error: started.error }
        return { success: true, paymentUrl: started.paymentUrl }
    } catch (error) {
        console.error("Error creating order:", error)
        return { success: false, error: "خطا در ثبت سفارش" }
    }
}
