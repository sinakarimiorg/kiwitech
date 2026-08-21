import mongoose, { Schema, models, model } from 'mongoose';

export interface IArticle {
    title: string
    linkName: string
    category: string
    excerpt?: string
    content?: string
    tags: string[]
    img: string
    views: number
    status: "منتشر شده" | "پیش‌نویس"
}

const ArticleSchema = new Schema<IArticle>(
    {
        title: { type: String, required: true },
        linkName: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        excerpt: { type: String, required: false },
        content: { type: String, required: false },
        tags: { type: [String], default: [] },
        img: { type: String, required: true },
        views: { type: Number, default: 0 },
        status: { type: String, enum: ["منتشر شده", "پیش‌نویس"], default: "پیش‌نویس" },
    },
    { timestamps: true }
)

export default models.Article || model<IArticle>('Article', ArticleSchema)