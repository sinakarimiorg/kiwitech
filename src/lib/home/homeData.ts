import { connectDB } from "../mongodb"
import { cachedQuery } from "../cache"
import ProductModel from '@root/src/models/Product'
import BannerModel from '@root/src/models/Banner'
import CategoryModel from '@root/src/models/Category'
import CommentModel from '@root/src/models/Comment'
import ArticleModel from '@root/src/models/Article'
import { getDiscountPercent } from "@root/src/types/homeType"
import type { HomeArticle, HomeBanner, HomeProduct } from '@root/src/types/homeType'
import type { MenuCategory } from '@root/src/types/menuType'
import type { BannerPosition } from '@root/src/types/adminBannerType'

const PRODUCT_FIELDS = 'name linkName price exPrice discount img stock category'

const serialize = <T,>(value: unknown): T => JSON.parse(JSON.stringify(value))

/* ───────── Products ───────── */
export const getFeaturedProducts = cachedQuery('home:featured', ['products'], async (limit: number = 6): Promise<HomeProduct[]> => {
        await connectDB()

        const featured = await ProductModel.find({ isFeatured: true, stock: { $gt: 0 } })
            .sort({ _id: -1 }).limit(limit).select(PRODUCT_FIELDS).lean()
        if (featured.length > 0) return serialize<HomeProduct[]>(featured)

        const latest = await ProductModel.find({ stock: { $gt: 0 } })
            .sort({ _id: -1 }).limit(limit).select(PRODUCT_FIELDS).lean()
        return serialize<HomeProduct[]>(latest)
}, [])

export const getLatestProducts = cachedQuery('home:latest', ['products'], async (limit: number = 10): Promise<HomeProduct[]> => {
        await connectDB()
        const docs = await ProductModel.find({ stock: { $gt: 0 } })
            .sort({ _id: -1 }).limit(limit).select(PRODUCT_FIELDS).lean()
        return serialize<HomeProduct[]>(docs)
}, [])

export const getTopRatedProducts = cachedQuery('home:toprated', ['products', 'comments'], async (limit: number = 10): Promise<HomeProduct[]> => {
        await connectDB()

        const rated = await CommentModel.aggregate([
            { $match: { status: 'تایید شده' } },
            { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
            { $sort: { avg: -1, count: -1 } },
            { $limit: limit * 2 },
        ])

        if (rated.length > 0) {
            const ids = rated.map(item => {
                const id = item._id;
                if (id && typeof id === 'object' && '$oid' in id) {
                    return (id as { $oid: string }).$oid;
                }
                return id;
            });
            const docs = await ProductModel.find({ _id: { $in: ids }, stock: { $gt: 0 } })
                .select(PRODUCT_FIELDS).lean()
            const byId = new Map(docs.map(doc => [String(doc._id), doc]))
            const ordered = ids.map(id => byId.get(String(id))).filter(Boolean).slice(0, limit)
            if (ordered.length > 0) return serialize<HomeProduct[]>(ordered)
        }

        const latest = await ProductModel.find({ stock: { $gt: 0 } })
            .sort({ _id: -1 }).limit(limit).select(PRODUCT_FIELDS).lean()
        return serialize<HomeProduct[]>(latest)
}, [])

const loadOfferProducts = cachedQuery('home:offers-all', ['products'], async (): Promise<HomeProduct[]> => {
    await connectDB()
    const docs = await ProductModel.find({ stock: { $gt: 0 }, exPrice: { $gt: 0 } })
        .select(PRODUCT_FIELDS).limit(300).lean()

    return serialize<HomeProduct[]>(docs).filter(product => getDiscountPercent(product) > 0)
}, [])

export async function getOfferProducts(limit = 10): Promise<HomeProduct[]> {
    const products = await loadOfferProducts()
    return [...products].sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a)).slice(0, limit)
}

export const getAllOfferProducts = loadOfferProducts

/* ───────── Banners ───────── */
export const getBannersByPosition = cachedQuery('home:banners', ['banners'], async (position: BannerPosition, limit: number = 10): Promise<HomeBanner[]> => {
        await connectDB()
        const banners = await BannerModel.find({ position, status: 'active' })
            .sort({ order: 1 }).limit(limit).select('title image linkUrl').lean()
        return serialize<HomeBanner[]>(banners)
}, [])

export const getLandingBanners = () => getBannersByPosition('landing', 10)

/* ───────── Categories & Articles ───────── */
export const getPopularCategories = cachedQuery('home:categories', ['categories'], async (limit: number = 8): Promise<MenuCategory[]> => {
        await connectDB()
        const categories = await CategoryModel.find({ active: true })
            .sort({ order: 1 }).limit(limit).select('title icon items').lean()
        return serialize<MenuCategory[]>(categories)
}, [])

export const getLatestArticles = cachedQuery('home:articles', ['articles'], async (limit: number = 4): Promise<HomeArticle[]> => {
        await connectDB()
        const articles = await ArticleModel.find({ status: 'منتشر شده' })
            .sort({ _id: -1 }).limit(limit).select('title linkName img createdAt').lean()
        return serialize<HomeArticle[]>(articles)
}, [])