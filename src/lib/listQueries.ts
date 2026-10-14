import { connectDB } from '@root/src/lib/mongodb'
import ProductModel from '@root/src/models/Product'
import ArticleModel from '@root/src/models/Article'
import CategoryModel from '@root/src/models/Category'
import type { HomeProduct } from '@root/src/types/homeType'
import type { MenuCategory } from '@root/src/types/menuType'

const serialize = <T,>(value: unknown): T => JSON.parse(JSON.stringify(value))

async function safe<T>(label: string, task: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await task()
    } catch (error) {
        console.error(`[lists] ${label}:`, error)
        return fallback
    }
}

/* ───────── Search ───────── */

export function buildSearchPattern(query: string): string {
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return escaped.replace(/[یي]/g, '[یي]').replace(/[کك]/g, '[کك]')
}

const searchRegex = (query: string) => ({ $regex: buildSearchPattern(query), $options: 'i' })

/* ───────── Products ───────── */

export type ProductSort = 'newest' | 'cheap' | 'expensive' | 'discount'

export const productSortOptions: { key: ProductSort; label: string }[] = [
    { key: 'newest', label: 'جدیدترین' },
    { key: 'cheap', label: 'ارزان‌ترین' },
    { key: 'expensive', label: 'گران‌ترین' },
    { key: 'discount', label: 'بیشترین تخفیف' },
]

export const isProductSort = (value: string): value is ProductSort =>
    productSortOptions.some(option => option.key === value)

type ProductsQuery = {
    q?: string
    category?: string
    subCategory?: string
    sort: ProductSort
    page: number
    perPage: number
}

type ProductsResult = {
    products: HomeProduct[]
    total: number
    page: number
    totalPages: number
}

const sortStages: Record<ProductSort, Record<string, 1 | -1>> = {
    newest: { _id: -1 },
    cheap: { price: 1, _id: -1 },
    expensive: { price: -1, _id: -1 },
    discount: { discountPercent: -1, _id: -1 },
}

export function getProductsPage({ q, category, subCategory, sort, page, perPage }: ProductsQuery): Promise<ProductsResult> {
    return safe('products page', async () => {
        await connectDB()

        const match: Record<string, unknown> = {}
        if (category) match.category = category
        if (subCategory) match.subCategory = subCategory
        if (q) match.$or = [{ name: searchRegex(q) }, { tags: searchRegex(q) }]

        const total = await ProductModel.countDocuments(match)
        const totalPages = Math.max(1, Math.ceil(total / perPage))
        const safePage = Math.min(Math.max(page, 1), totalPages)

        const products = await ProductModel.aggregate([
            { $match: match },
            {
                $addFields: {
                    discountPercent: {
                        $cond: [
                            { $and: [{ $gt: ['$exPrice', 0] }, { $gt: ['$exPrice', '$price'] }] },
                            { $multiply: [{ $divide: [{ $subtract: ['$exPrice', '$price'] }, '$exPrice'] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $sort: sortStages[sort] },
            { $skip: (safePage - 1) * perPage },
            { $limit: perPage },
            { $project: { name: 1, linkName: 1, price: 1, exPrice: 1, discount: 1, img: 1, stock: 1, category: 1 } },
        ])

        return { products: serialize<HomeProduct[]>(products), total, page: safePage, totalPages }
    }, { products: [], total: 0, page: 1, totalPages: 1 })
}

export function getFilterCategories(): Promise<MenuCategory[]> {
    return safe('filter categories', async () => {
        await connectDB()
        const categories = await CategoryModel.find({ active: true }).sort({ order: 1 }).select('title icon items').lean()
        return serialize<MenuCategory[]>(categories)
    }, [])
}

/* ───────── Articles ───────── */

export type ArticleListItem = {
    _id: string
    title: string
    linkName: string
    img: string
    category: string
    createdAt?: string
}

const ARTICLE_FIELDS = 'title linkName img category createdAt'

type ArticlesResult = {
    articles: ArticleListItem[]
    total: number
    page: number
    totalPages: number
    categories: string[]
}

export function getArticlesPage({ q, category, page, perPage }: { q?: string; category?: string; page: number; perPage: number }): Promise<ArticlesResult> {
    return safe('articles page', async () => {
        await connectDB()

        const match: Record<string, unknown> = { status: 'منتشر شده' }
        if (category) match.category = category
        if (q) match.$or = [{ title: searchRegex(q) }, { tags: searchRegex(q) }, { excerpt: searchRegex(q) }]

        const [total, categories] = await Promise.all([
            ArticleModel.countDocuments(match),
            ArticleModel.distinct('category', { status: 'منتشر شده' }),
        ])
        const totalPages = Math.max(1, Math.ceil(total / perPage))
        const safePage = Math.min(Math.max(page, 1), totalPages)

        const articles = await ArticleModel.find(match)
            .sort({ _id: -1 })
            .skip((safePage - 1) * perPage)
            .limit(perPage)
            .select(ARTICLE_FIELDS)
            .lean()

        return { articles: serialize<ArticleListItem[]>(articles), total, page: safePage, totalPages, categories }
    }, { articles: [], total: 0, page: 1, totalPages: 1, categories: [] })
}

/* ───────── General Search ───────── */

export function searchAll(q: string, limits = { products: 48, articles: 24 }): Promise<{ products: HomeProduct[]; articles: ArticleListItem[] }> {
    return safe('search', async () => {
        await connectDB()
        const regex = searchRegex(q)

        const [products, articles] = await Promise.all([
            ProductModel.find({ $or: [{ name: regex }, { tags: regex }, { category: regex }, { subCategory: regex }] })
                .sort({ _id: -1 })
                .limit(limits.products)
                .select('name linkName price exPrice discount img stock category')
                .lean(),
            ArticleModel.find({ status: 'منتشر شده', $or: [{ title: regex }, { tags: regex }, { excerpt: regex }] })
                .sort({ _id: -1 })
                .limit(limits.articles)
                .select(ARTICLE_FIELDS)
                .lean(),
        ])

        return { products: serialize<HomeProduct[]>(products), articles: serialize<ArticleListItem[]>(articles) }
    }, { products: [], articles: [] })
}
