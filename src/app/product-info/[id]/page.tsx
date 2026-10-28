import { connectDB } from "@root/src/lib/mongodb"
import ProductModel from "@models/Product"
import CommentModel from "@models/Comment"
import FavoriteModel from "@models/Favorite"
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@root/src/components/modules/JsonLd/JsonLd";
import { abs, plainText, productPath, getSiteUrl, toRial } from "@root/src/lib/seo";
import { AdminProduct } from "@root/src/types/adminProductType";
import ProductInfoClient from "@root/src/components/templates/Product/ProductInfoClient/ProductInfoClient";
import { PublicComment } from "@root/src/types/commentType";
import { getCurrentUser } from "@root/src/lib/auth/session";

export const dynamic = 'force-dynamic'

// generateMetadata و صفحه از یک کوئری مشترک استفاده می‌کنند (Mongoose خودش dedupe نمی‌کند)
const getProduct = cache(async (linkName: string) => {
    await connectDB()
    return ProductModel.findOne({ linkName }).lean()
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await getProduct(id) as AdminProduct | null
    if (!product) return { title: "محصول یافت نشد", robots: { index: false } }

    const description = plainText(product.description) || `خرید ${product.name} از کیوی‌تک با ضمانت اصالت و ارسال سریع`
    const canonical = productPath(product.linkName)
    const image = abs(product.img)

    return {
        title: product.name,
        description,
        alternates: { canonical },
        openGraph: {
            type: "website", // نوع "product" در Next پشتیبانی نمی‌شود
            title: product.name,
            description,
            url: canonical,
            images: image ? [{ url: image, alt: product.name }] : undefined,
        },
    }
}

export default async function ProductInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await connectDB()

    const productDoc = await getProduct(id)
    if (!productDoc) {
        notFound()
    }
    const product: AdminProduct = JSON.parse(JSON.stringify(productDoc))

    const user = await getCurrentUser()
    let isUserFavorite = false;

    if (user) {
        const favCheck = await FavoriteModel.findOne({ user: user._id, product: productDoc._id });
        isUserFavorite = !!favCheck;
    }

    const approvedCommentsRaw = await CommentModel.find({ product: product._id, status: "تایید شده" })
        .sort({ _id: -1 })
        .lean()

    const comments: PublicComment[] = JSON.parse(JSON.stringify(approvedCommentsRaw)).map((c: any) => ({
        _id: c._id,
        author: c.author,
        text: c.text,
        rating: c.rating,
        createdAt: c.createdAt,
    }))

    const ratingCount = comments.length

    const ratingAverage = ratingCount > 0
        ? comments.reduce((sum, c) => sum + c.rating, 0) / ratingCount
        : 0

    const siteUrl = getSiteUrl()
    const images = [product.img, ...(product.images ?? [])].map(abs).filter(Boolean)

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                image: images,
                description: plainText(product.description, 500) || undefined,
                sku: String(product._id),
                category: product.category,
                offers: {
                    "@type": "Offer",
                    url: `${siteUrl}${productPath(product.linkName)}`,
                    priceCurrency: "IRR",
                    price: String(toRial(product.price)),
                    availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    itemCondition: "https://schema.org/NewCondition",
                },
                // فقط از نظرات تاییدشده‌ی واقعی؛ بدون نظر، aggregateRating منتشر نمی‌شود
                ...(ratingCount > 0 ? {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: Number(ratingAverage.toFixed(1)),
                        reviewCount: ratingCount,
                    },
                } : {}),
            }} />
            <ProductInfoClient
                product={product}
                comments={comments}
                ratingAverage={ratingAverage}
                ratingCount={ratingCount}
                initialIsFavorite={isUserFavorite}
            />
        </>
    )
}
