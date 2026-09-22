export type OrderStatus = "در حال پردازش" | "ارسال شده" | "تحویل شده" | "لغو شده"

export interface UserOrderItem {
    _id: string
    title: string
    img: string
    price: number
    count: number
}

export interface UserOrder {
    _id: string
    items: UserOrderItem[]
    address: string
    phone: string
    shippingCost: number
    status: OrderStatus
    createdAt: string
    isRead: Boolean
}