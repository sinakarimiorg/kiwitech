"use server"

import { cookies } from "next/headers"
import { connectDB } from "@root/src/lib/mongodb"
import ArticleModel from "@models/Article"

// Each browser counts only one visit per article every 6 hours.
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 6

export async function trackArticleViewAction(linkName: string): Promise<void> {
    if (typeof linkName !== "string" || !linkName || linkName.length > 200) return

    const cookieStore = await cookies()
    const cookieName = `viewed_article_${encodeURIComponent(linkName)}`
    if (cookieStore.get(cookieName)) return

    await connectDB()
    const updated = await ArticleModel.updateOne(
        { linkName, status: "منتشر شده" },
        { $inc: { views: 1 } }
    )
    if (!updated.matchedCount) return

    cookieStore.set(cookieName, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: VIEW_COOKIE_MAX_AGE,
    })
}
