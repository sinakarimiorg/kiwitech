export type MessageType = "سفارش" | "سیستمی" | "تخفیف"

export interface UserMessage {
    _id: string
    title: string
    body: string
    type: MessageType
    isRead: boolean
    createdAt: string
}