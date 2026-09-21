import { connectDB } from "../mongodb"
import OrderModel from "@models/Order"
import CommentModel from "@models/Comment"
import UserModel from "@models/User"

export type AdminSidebarBadges = {
    orders: number
    comments: number
    users: number
}

export async function getAdminSidebarBadges(): Promise<AdminSidebarBadges> {
    try {
        await connectDB()

        const [ordersCount, commentsCount, usersCount] = await Promise.all([
            OrderModel.countDocuments({ status: "در حال پردازش" }),
            CommentModel.countDocuments({ status: "در انتظار بررسی" }),
            UserModel.countDocuments({ isSeenByAdmin: false }),
        ])

        return { orders: ordersCount, comments: commentsCount, users: usersCount }
    } catch (error) {
        console.error("Error fetching admin sidebar badges:", error)
        return { orders: 0, comments: 0, users: 0 }
    }
}