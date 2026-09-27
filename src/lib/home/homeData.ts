import { getDiscountPercent, HomeBanner, HomeProduct } from "@root/src/types/homeType"
import { connectDB } from "../mongodb"
import ProductModel from '@root/src/models/Product'
import BannerModel from '@root/src/models/Banner'

const PRODUCT_FIELDS = 'name linkName price exPrice discount img stock'

const serialize = <T,>(value: unknown): T => JSON.parse(JSON.stringify(value))


export async function getFeaturedProducts(limit = 6): Promise<HomeProduct[]> {
    await connectDB()

    const featured = await ProductModel.find({ isFeatured: true, stock: { $gt: 0 } })
        .sort({ _id: -1 })
        .limit(limit)
        .select(PRODUCT_FIELDS)
        .lean()

    if (featured.length > 0) return serialize<HomeProduct[]>(featured)

    const latest = await ProductModel.find({ stock: { $gt: 0 } })
        .sort({ _id: -1 })
        .limit(limit)
        .select(PRODUCT_FIELDS)
        .lean()

    return serialize<HomeProduct[]>(latest)
}

export async function getOfferProducts(limit = 10): Promise<HomeProduct[]> {
    await connectDB()

    const docs = await ProductModel.find({ stock: { $gt: 0 }, exPrice: { $gt: 0 } })
        .select(PRODUCT_FIELDS)
        .limit(60)
        .lean()

    return serialize<HomeProduct[]>(docs)
        .filter(product => getDiscountPercent(product) > 0)
        .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
        .slice(0, limit)
}

export async function getLandingBanners(): Promise<HomeBanner[]> {
    await connectDB()

    const banners = await BannerModel.find({ position: 'landing', status: 'active' })
        .sort({ order: 1 })
        .select('title image linkUrl')
        .lean()

    return serialize<HomeBanner[]>(banners)
}