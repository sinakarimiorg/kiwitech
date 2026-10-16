// این فایل باعث می‌شود مدیریت داده‌های سایت شما (محصولات و مقالات) سریع،
//  استاندارد، ایمن و کاملاً ماولار باشد تا هر زمان بخش فرانت‌اند
//  به لیست محصولاتِ فیلترشده نیاز داشت، به راحتی به این توابع وصل شود.
//  این فایل در واقع یک لایه‌ی میانی بین بخش فرانت‌اند و دیتابیس است

import { connectDB } from '../mongodb'
import ProductModel from '@root/src/models/Product'
import CategoryModel from '@root/src/models/Category'
import ArticleModel from '@root/src/models/Article'
import { escapeRegex } from '@root/src/utils/query'
import type { HomeProduct, HomeArticle } from '@root/src/types/homeType'
import type { MenuCategory } from '@root/src/types/menuType'

const serialize = <T,>(value: unknown): T => JSON.parse(JSON.stringify(value))

/* ───────── Products ───────── */
export type ProductSort = 'newest' | 'cheap' | 'expensive' | 'discount'

export const PRODUCT_SORTS: { key: ProductSort; label: string }[] = [
    { key: 'newest', label: 'جدیدترین' },
    { key: 'cheap', label: 'ارزان‌ترین' },
    { key: 'expensive', label: 'گران‌ترین' },
    { key: 'discount', label: 'بیشترین تخفیف' },
]

export const isProductSort = (value: string): value is ProductSort => PRODUCT_SORTS.some(sort => sort.key === value)

const SORT_STAGES: Record<ProductSort, Record<string, 1 | -1>> = {
    newest: { _id: -1 },
    cheap: { price: 1, _id: -1 },
    expensive: { price: -1, _id: -1 },
    discount: { discountPct: -1, _id: -1 },
}

export type ProductFilters = {
    q?: string
    category?: string
    subCategory?: string
    sort: ProductSort
    page: number
    perPage: number
}

export async function getProductListing({ q, category, subCategory, sort, page, perPage }: ProductFilters) {
    await connectDB()

    const match: Record<string, unknown> = {}
    if (category) match.category = category
    if (subCategory) match.subCategory = subCategory
    if (q) match.name = { $regex: escapeRegex(q), $options: 'i' }

    const total = await ProductModel.countDocuments(match)
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const items = await ProductModel.aggregate([
        { $match: match },
        {
            $addFields: {
                discountPct: {
                    $cond: [
                        { $and: [{ $gt: ['$exPrice', '$price'] }, { $gt: ['$exPrice', 0] }] },
                        { $multiply: [{ $divide: [{ $subtract: ['$exPrice', '$price'] }, '$exPrice'] }, 100] },
                        0,
                    ],
                },
            },
        },
        { $sort: SORT_STAGES[sort] },
        { $skip: (safePage - 1) * perPage },
        { $limit: perPage },
        { $project: { name: 1, linkName: 1, price: 1, exPrice: 1, discount: 1, img: 1, stock: 1, category: 1 } },
    ])

    return { items: serialize<HomeProduct[]>(items), total, totalPages, page: safePage }
}

export async function getFilterCategories(): Promise<MenuCategory[]> {
    await connectDB()
    const categories = await CategoryModel.find({ active: true }).sort({ order: 1 }).select('title icon items').lean()
    return serialize<MenuCategory[]>(categories)
}

/* ───────── Articles ───────── */
export type ArticleFilters = { q?: string; category?: string; page: number; perPage: number }

export async function getArticleListing({ q, category, page, perPage }: ArticleFilters) {
    await connectDB()

    const match: Record<string, unknown> = { status: 'منتشر شده' }
    if (category) match.category = category
    if (q) match.title = { $regex: escapeRegex(q), $options: 'i' }

    const total = await ArticleModel.countDocuments(match)
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const items = await ArticleModel.find(match)
        .sort({ _id: -1 })
        .skip((safePage - 1) * perPage)
        .limit(perPage)
        .select('title linkName img category createdAt')
        .lean()

    return { items: serialize<(HomeArticle & { category: string })[]>(items), total, totalPages, page: safePage }
}

export async function getArticleCategories(): Promise<string[]> {
    await connectDB()
    const categories: string[] = await ArticleModel.distinct('category', { status: 'منتشر شده' })
    return categories.filter(Boolean).sort((a, b) => a.localeCompare(b, 'fa'))
}
