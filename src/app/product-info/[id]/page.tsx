import { connectDB } from "@root/src/lib/mongodb"
import ProductModel from "@models/Product"
import CommentModel from "@models/Comment"
import FavoriteModel from "@models/Favorite"
import { notFound } from "next/navigation";
import { AdminProduct } from "@root/src/types/adminProductType";
import ProductInfoClient from "@root/src/components/templates/Product/ProductInfoClient/ProductInfoClient";
import { PublicComment } from "@root/src/types/commentType";
import { getCurrentUser } from "@root/src/lib/auth/session";

export const dynamic = 'force-dynamic'

export default async function ProductInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await connectDB()

    const productDoc = await ProductModel.findOne({ linkName: id }).lean()
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

    return (
        <ProductInfoClient
            product={product}
            comments={comments}
            ratingAverage={ratingAverage}
            ratingCount={ratingCount}
            initialIsFavorite={isUserFavorite}
        />
    )
}
