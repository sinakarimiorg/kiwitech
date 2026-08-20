export interface AdminArticle {
    _id: string
    title: string
    linkName: string
    img: string
    category: string
    date: string
    views: number
    status: "منتشر شده" | "پیش‌نویس"
}