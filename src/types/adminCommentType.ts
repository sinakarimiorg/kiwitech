export type CommentStatus = "تایید شده" | "در انتظار بررسی" | "رد شده"

export interface AdminCommentProduct {
    _id: string
    name: string
}

export interface AdminComment {
    _id: string
    author: string
    product: AdminCommentProduct | null
    text: string
    rating: number
    status: CommentStatus
    isRead?: boolean
    createdAt?: string
}