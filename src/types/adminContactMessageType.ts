export type ContactMessageStatus = "خوانده نشده" | "خوانده شده"

export interface AdminContactMessage {
    _id: string
    name: string
    phone: string
    email?: string
    subject: string
    message: string
    status: ContactMessageStatus
    createdAt?: string
}