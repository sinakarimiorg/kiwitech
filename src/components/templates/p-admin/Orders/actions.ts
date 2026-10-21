"use server"

import { connectDB } from "@root/src/lib/mongodb";
import { getCurrentUser } from "@root/src/lib/auth/session";
import { OrderStatus } from "@/types/adminOrderType";
import OrderModel from "@root/src/models/Order"
import { reserveStock, releaseStock, type StockItem } from "@root/src/lib/orders/stock"
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string }

const VALID_STATUSES: OrderStatus[] = ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"]

// Orders that hold stock (not canceled yet)
const holdsStock = (status: OrderStatus) => status !== "لغو شده"

async function verifyAdmin(): Promise<ActionResult | null> {
    const user = await getCurrentUser()
    if (!user || user.role !== "ادمین") {
        return { success: false, error: "شما دسترسی لازم برای این کار را ندارید" }
    }
    return null
}

const toStockItems = (items: any[]): StockItem[] =>
    items.map(item => ({
        product: item.product ?? null,
        color: item.color ?? null,
        count: item.count,
        title: item.title,
    }))

function revalidateAll() {
    revalidatePath("/p-admin/orders")
    revalidatePath("/p-admin/products")
    revalidatePath("/p-admin")
    revalidatePath("/p-user/userOrders")
    revalidatePath("/p-user")
}

// ────────────────────────────────
// Update order status
// ────────────────────────────────
export async function UpdateOrderStatusAction(id: string, status: OrderStatus): Promise<ActionResult> {
    const denied = await verifyAdmin()
    if (denied) return denied

    if (!VALID_STATUSES.includes(status)) return { success: false, error: "وضعیت نامعتبر است" }

    await connectDB()

    try {
        const order = await OrderModel.findById(id)
        if (!order) return { success: false, error: "سفارش یافت نشد" }

        const previous = order.status as OrderStatus
        if (previous === status) return { success: true }

        const items = toStockItems(order.items)

        if (holdsStock(previous) && !holdsStock(status)) {
            await releaseStock(items)
        } else if (!holdsStock(previous) && holdsStock(status)) {
            const reserved = await reserveStock(items)
            if (!reserved.ok) {
                return { success: false, error: `موجودی «${reserved.title ?? "یکی از کالاها"}» برای بازگرداندن این سفارش کافی نیست` }
            }
        }

        order.status = status
        await order.save()

        revalidateAll()
        return { success: true }
    } catch (error) {
        console.error("Error updating order status:", error)
        return { success: false, error: "خطا در تغییر وضعیت سفارش" }
    }
}

// ────────────────────────────────
// Delete order
// ────────────────────────────────
export async function deleteOrderAction(id: string): Promise<ActionResult> {
    const denied = await verifyAdmin()
    if (denied) return denied

    await connectDB()
    try {
        const deleted = await OrderModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "سفارش یافت نشد" }

        if (deleted.status === "در حال پردازش" || deleted.status === "ارسال شده") {
            await releaseStock(toStockItems(deleted.items))
        }

        revalidateAll()
        return { success: true }
    } catch (error) {
        console.log("Error deleting order", error);
        return { success: false, error: "خطا در حذف سفارش" }
    }
}
