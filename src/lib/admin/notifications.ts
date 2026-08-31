import { connectDB } from "@root/src/lib/mongodb"
import OrderModel from "@root/src/models/Order"
import CommentModel from "@root/src/models/Comment"
import ProductModel from "@root/src/models/Product"

export type AdminNotificationItem = {
    id: string
    title: string
    subtitle: string
    createdAt?: string
}

export type AdminNotificationsData = {
    pendingOrders: AdminNotificationItem[]
    pendingComments: AdminNotificationItem[]
    lowStockProducts: AdminNotificationItem[]
    totalCount: number
}

export async function getAdminNotifications(): Promise<AdminNotificationsData> {
    try {
        await connectDB()

        const [pendingOrdersRaw, pendingCommentsRaw, lowStockRaw] = await Promise.all([
            OrderModel.find({ status: "در حال پردازش" })
                .sort({ _id: -1 })
                .limit(5)
                .lean(),
            CommentModel.find({ status: "در انتظار بررسی" })
                .populate("product", "name")
                .sort({ _id: -1 })
                .limit(5)
                .lean(),
            ProductModel.find({ stock: { $lte: 3 } })
                .sort({ stock: 1 })
                .limit(5)
                .lean(),
        ]);

        const pendingOrders: AdminNotificationItem[] = pendingOrdersRaw.map((o: any) => ({
            id: o._id.toString(),
            title: `سفارش جدید از ${o.user?.name ?? "مشتری"}`,
            subtitle: `${o.items?.length ?? 0} قلم کالا`,
            createdAt: o.createdAt,
        }))

        const pendingComments: AdminNotificationItem[] = pendingCommentsRaw.map((c: any) => ({
            id: c._id.toString(),
            title: `نظر جدید از ${c.author}`,
            subtitle: c.product?.name ?? "محصول حذف‌شده",
            createdAt: c.createdAt,
        }))

        const lowStockProducts: AdminNotificationItem[] = lowStockRaw.map((p: any) => ({
            id: p._id.toString(),
            title: p.name,
            subtitle: `${p.stock} عدد باقی‌مانده`,
        }))

        return {
            pendingOrders,
            pendingComments,
            lowStockProducts,
            totalCount: pendingOrders.length + pendingComments.length + lowStockProducts.length,
        }

    } catch (error) {
        console.error("Error fetching admin notifications:", error)
        return { pendingOrders: [], pendingComments: [], lowStockProducts: [], totalCount: 0 }
    }
}