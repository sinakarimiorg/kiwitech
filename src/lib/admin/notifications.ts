import { connectDB } from "@root/src/lib/mongodb"
import OrderModel from "@root/src/models/Order"
import CommentModel from "@root/src/models/Comment"
import ProductModel from "@root/src/models/Product"

export type NotificationType = "order" | "comment" | "product" | "message"

export type AdminNotificationItem = {
    _id: string
    type: NotificationType
    title: string
    subtitle: string
    createdAt?: string
    read: boolean
}

export type AdminNotificationsData = {
    pendingOrders: AdminNotificationItem[]
    pendingComments: AdminNotificationItem[]
    lowStockProducts: AdminNotificationItem[]
    totalCount: number
}

const LOW_STOCK_THRESHOLD = 5
const LIST_LIMIT = 8

export async function getAdminNotifications(): Promise<AdminNotificationsData> {
    try {
        await connectDB()

        const [pendingOrdersRaw, pendingCommentsRaw, lowStockRaw] = await Promise.all([
            OrderModel.find({ status: "در حال پردازش" })
                .sort({ _id: -1 })
                .limit(LIST_LIMIT)
                .lean(),
            CommentModel.find({ status: "در انتظار بررسی" })
                .populate("product", "name")
                .sort({ _id: -1 })
                .limit(LIST_LIMIT)
                .lean(),
            ProductModel.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
                .sort({ stock: 1 })
                .limit(5)
                .lean(),
        ])

        const pendingOrders: AdminNotificationItem[] = pendingOrdersRaw.map((o: any) => ({
            _id: o._id.toString(),
            title: `سفارش جدید از ${o.user?.name ?? "مشتری"}`,
            type: "order",
            subtitle: `${o.items?.length ?? 0} قلم کالا`,
            createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : undefined,
            read: o.isRead === true,
        }))

        const pendingComments: AdminNotificationItem[] = pendingCommentsRaw.map((c: any) => ({
            _id: c._id.toString(),
            title: `نظر جدید از ${c.author ?? "کاربر"}`,
            type: "comment",
            subtitle: c.product?.name ?? "محصول حذف‌شده",
            createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : undefined,
            read: c.isRead === true,
        }))

        const lowStockProducts: AdminNotificationItem[] = lowStockRaw.map((p: any) => ({
            _id: p._id.toString(),
            title: p.name,
            type: "product",
            subtitle: `${p.stock} عدد باقی‌مانده`,
            read: false,
        }))

        return JSON.parse(
            JSON.stringify({
                pendingOrders,
                pendingComments,
                lowStockProducts,
                totalCount: pendingOrders.length + pendingComments.length + lowStockProducts.length,
            })
        )
    } catch (error) {
        console.error("Error fetching admin notifications:", error)
        return { pendingOrders: [], pendingComments: [], lowStockProducts: [], totalCount: 0 }
    }
}