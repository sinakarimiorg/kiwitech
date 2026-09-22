"use server"

import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import { revalidatePath } from "next/cache"
import OrderModel from "@models/Order"
import MessageModel from "@models/Message"

type OrderItemInput = {
    title: string
    img: string
    price: number
    count: number
}

type CreateOrderInput = {
    items: OrderItemInput[]
    address: string
    phone: string
    shippingCost: number
}

type ActionResult =
    | { success: true; orderId: string }
    | { success: false; error: string }

// ────────────────────────────────
// Create Order
// ────────────────────────────────
export async function createOrderAction(data: CreateOrderInput): Promise<ActionResult> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: "برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید" }
    }

    if (!data.items.length) {
        return { success: false, error: "سبد خرید خالی است" }
    }

    await connectDB()

    try {
        const order = await OrderModel.create({
            user: user._id,
            items: data.items,
            address: data.address,
            phone: data.phone,
            shippingCost: data.shippingCost,
            status: "در حال پردازش",
        })

        await MessageModel.create({
            user: user._id,
            title: "سفارش شما ثبت شد",
            body: "سفارش شما با موفقیت ثبت شد و در حال پردازش است. می‌توانید وضعیت آن را از بخش «سفارش‌های من» پیگیری کنید.",
            type: "سفارش",
            isRead: false,
        })

        revalidatePath("/p-user/userOrders")
        revalidatePath("/p-user/messages")
        revalidatePath("/p-user")
        revalidatePath("/p-admin/orders")
        return { success: true, orderId: order._id.toString() }
    } catch (error) {
        console.error("Error creating order:", error)
        return { success: false, error: "خطا در ثبت سفارش" }
    }
}