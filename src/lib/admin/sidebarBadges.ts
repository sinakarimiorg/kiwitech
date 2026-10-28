import { connectDB } from "../mongodb"
import OrderModel from "@models/Order"
import CommentModel from "@models/Comment"
import UserModel from "@models/User"
import ContactMessageModel from "@models/ContactMessage"

export type AdminSidebarBadges = {
    orders: number
    comments: number
    users: number
    messages: number
}

export async function getAdminSidebarBadges(): Promise<AdminSidebarBadges> {
    try {
        await connectDB()

        const [ordersCount, commentsCount, usersCount, messagesCount] = await Promise.all([
            OrderModel.countDocuments({ status: "در حال پردازش" }),
            CommentModel.countDocuments({ status: "در انتظار بررسی" }),
            UserModel.countDocuments({ isSeenByAdmin: false }),
            ContactMessageModel.countDocuments({ status: "خوانده نشده" }),
        ])

        return { orders: ordersCount, comments: commentsCount, users: usersCount, messages: messagesCount }
    } catch (error) {
        console.error("Error fetching admin sidebar badges:", error)
        return { orders: 0, comments: 0, users: 0, messages: 0  }
    }
}