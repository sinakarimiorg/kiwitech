export interface AdminArticle {
    _id: string
    title: string
    linkName: string
    img: string
    category: string
    excerpt?: string
    content?: string
    tags?: string[]
    views: number
    status: "منتشر شده" | "پیش‌نویس"
    createdAt?: string
}