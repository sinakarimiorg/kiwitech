import type { MetadataRoute } from "next"
import { connectDB } from "@root/src/lib/mongodb"
import ProductModel from "@models/Product"
import ArticleModel from "@models/Article"
import { articlePath, getSiteUrl, productPath } from "@root/src/lib/seo"

export const dynamic = "force-dynamic" // از MongoDB در زمان درخواست می‌خواند

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl()
    if (!siteUrl) return [] // env داخل تابع چک می‌شود، نه سطح ماژول

    await connectDB()
    const [products, articles] = await Promise.all([
        ProductModel.find({}, "linkName updatedAt").lean(),
        ArticleModel.find({ status: "منتشر شده" }, "linkName updatedAt").lean(),
    ])

    const staticPages = ["", "/products/1", "/articles/1", "/amazing-offers/1", "/about", "/contact", "/rules"].map(path => ({
        url: `${siteUrl}${path}`,
    }))

    return [
        ...staticPages,
        ...products.map((p: any) => ({ url: `${siteUrl}${productPath(p.linkName)}`, lastModified: p.updatedAt })),
        ...articles.map((a: any) => ({ url: `${siteUrl}${articlePath(a.linkName)}`, lastModified: a.updatedAt })),
    ]
}
