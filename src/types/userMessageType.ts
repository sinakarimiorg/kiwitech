export type MessageType =
    | "سفارش"
    | "سیستمی"
    | "تخفیف"
    | "مشکل فنی"
    | "پیشنهاد و انتقاد"
    | "سایر"

export type MessageSender = "user" | "admin"

export interface UserMessage {
    _id: string
    title: string
    body: string
    type: MessageType
    sender: MessageSender
    isRead: boolean
    createdAt: string
}