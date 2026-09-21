export type OrderStatus = "در حال پردازش" | "ارسال شده" | "تحویل شده" | "لغو شده"

export interface OrderItem {
    title: string
    img: string
    price: number
    count: number
}

export interface AdminOrder {
    _id: string
    customer: string
    phone: string
    address: string
    items: OrderItem[]
    shippingCost: number
    status: OrderStatus
    isRead?: boolean
    createdAt?: string
}

export const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

export function getOrderTotal(order: AdminOrder) {
    return order.items.reduce((sum, item) => sum + item.price * item.count, 0) + order.shippingCost
}
