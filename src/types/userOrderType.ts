export type OrderStatus = "در حال پردازش" | "ارسال شده" | "تحویل شده" | "لغو شده"

export interface UserOrderItemProduct {
    _id: string
    linkName: string
}
export interface UserOrderItem {
    _id: string
    title: string
    img: string
    price: number
    count: number
    product?: UserOrderItemProduct | null
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