"use server"

import { connectDB } from "@root/src/lib/mongodb";
import { OrderStatus } from "./OrdersList";
import OrderModel from "@root/src/models/Order"
import { revalidatePath } from "next/cache";


type ActionResult = { success: true } | { success: false; error: string }

// ────────────────────────────────
// Update order status
// ────────────────────────────────
export async function UpdateOrderStatusAction(id: string, status: OrderStatus): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await OrderModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
        if (!updated) return { success: false, error: "سفارش یافت نشد" }
        revalidatePath("p-admin/orders")
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
    await connectDB()
    try {
        const deleted = await OrderModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "سفارش یافت نشد" }

        revalidatePath("/p-admin/orders")
        return { success: true }
    } catch (error) {
        console.log("Error deleting order", error);
        return { success: false, error: "خطا در حذف سفارش" }
    }
}