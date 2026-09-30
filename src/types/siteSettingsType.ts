export type HomeSectionKey =
    | 'landing'
    | 'popularCategories'
    | 'amazingOffers'
    | 'categoriesByPhone'
    | 'latestProducts'
    | 'services'
    | 'popularProducts'
    | 'popularBrands'
    | 'latestArticles'

export type HomeSectionConfig = {
    key: HomeSectionKey
    enabled: boolean
    order: number
    title: string
    subtitle: string
    limit: number
}

type HomeSectionMeta = {
    label: string
    description: string
    source: string
    manageHref?: string
    hasTitle: boolean
    hasSubtitle: boolean
    hasLimit: boolean
    minLimit: number
    maxLimit: number
}

export const homeSectionMeta: Record<HomeSectionKey, HomeSectionMeta> = {
    landing: {
        label: 'اسلایدر اصلی و محصولات ویژه',
        description: 'بنرهای بالای صفحه به‌همراه اسلایدر محصولات ویژه',
        source: 'بنرها (موقعیت «اسلایدر اصلی») و محصولاتی که «ویژه» علامت خورده‌اند',
        manageHref: '/p-admin/banners',
        hasTitle: true, hasSubtitle: false, hasLimit: true, minLimit: 1, maxLimit: 12,
    },
    popularCategories: {
        label: 'دسته‌بندی‌های محبوب',
        description: 'کارت‌های دسته‌بندی به‌همراه آیکون و زیرمجموعه‌ها',
        source: 'دسته‌بندی‌های فعال',
        manageHref: '/p-admin/categories',
        hasTitle: true, hasSubtitle: true, hasLimit: true, minLimit: 2, maxLimit: 12,
    },
    amazingOffers: {
        label: 'تخفیفات شگفت‌انگیز',
        description: 'اسلایدر محصولات تخفیف‌دار با تایمر',
        source: 'محصولاتی که قیمت قبل از تخفیف دارند',
        manageHref: '/p-admin/products',
        hasTitle: true, hasSubtitle: true, hasLimit: true, minLimit: 3, maxLimit: 20,
    },
    categoriesByPhone: {
        label: 'دسته‌بندی بر اساس مدل گوشی',
        description: 'تصاویر لینک‌دار مدل‌ها و برندهای گوشی',
        source: 'بنرها (موقعیت «دسته‌بندی بر اساس گوشی»)',
        manageHref: '/p-admin/banners',
        hasTitle: true, hasSubtitle: false, hasLimit: true, minLimit: 2, maxLimit: 8,
    },
    latestProducts: {
        label: 'جدیدترین محصولات',
        description: 'اسلایدر تازه‌ترین محصولات موجود',
        source: 'جدیدترین محصولات دارای موجودی',
        manageHref: '/p-admin/products',
        hasTitle: true, hasSubtitle: true, hasLimit: true, minLimit: 3, maxLimit: 20,
    },
    services: {
        label: 'خدمات فروشگاه',
        description: 'چهار کارت بازگشت کالا، مشاوره، پرداخت و ضمانت اصالت',
        source: 'محتوای ثابت (فقط فعال یا غیرفعال می‌شود)',
        hasTitle: false, hasSubtitle: false, hasLimit: false, minLimit: 1, maxLimit: 1,
    },
    popularProducts: {
        label: 'محصولات منتخب',
        description: 'محصولات با بیشترین امتیاز از نظر کاربران',
        source: 'میانگین امتیاز نظرات تاییدشده',
        manageHref: '/p-admin/comments',
        hasTitle: true, hasSubtitle: true, hasLimit: true, minLimit: 3, maxLimit: 20,
    },
    popularBrands: {
        label: 'برندهای محبوب',
        description: 'نوار لوگوی برندها',
        source: 'بنرها (موقعیت «برندهای محبوب»)',
        manageHref: '/p-admin/banners',
        hasTitle: true, hasSubtitle: false, hasLimit: true, minLimit: 3, maxLimit: 24,
    },
    latestArticles: {
        label: 'مطالب خواندنی',
        description: 'جدیدترین مقالات کیوی‌تک مگ',
        source: 'جدیدترین مقالات منتشرشده',
        manageHref: '/p-admin/articles',
        hasTitle: true, hasSubtitle: true, hasLimit: true, minLimit: 2, maxLimit: 8,
    },
}

export const defaultHomeSections: HomeSectionConfig[] = [
    { key: 'landing', enabled: true, order: 1, title: 'محصولات ویژه', subtitle: '', limit: 6 },
    { key: 'popularCategories', enabled: true, order: 2, title: 'دسته بندی های محبوب', subtitle: 'بهترین ها را از ما بخواهید', limit: 8 },
    { key: 'amazingOffers', enabled: true, order: 3, title: 'تخفیفات شگفت‌انگیز', subtitle: 'بهترین تخفیف‌های امروز، تا وقتی موجود است', limit: 10 },
    { key: 'categoriesByPhone', enabled: true, order: 4, title: 'دسته بندی بر اساس مدل گوشی', subtitle: '', limit: 4 },
    { key: 'latestProducts', enabled: true, order: 5, title: 'جدیدترین محصولات', subtitle: 'از تازه ها شروع کن!', limit: 10 },
    { key: 'services', enabled: true, order: 6, title: '', subtitle: '', limit: 1 },
    { key: 'popularProducts', enabled: true, order: 7, title: 'محصولات منتخب', subtitle: 'براساس نظرات شما', limit: 10 },
    { key: 'popularBrands', enabled: true, order: 8, title: 'برندهای محبوب', subtitle: '', limit: 12 },
    { key: 'latestArticles', enabled: true, order: 9, title: 'مطالب خواندنی', subtitle: 'کــــــیـوی مــگ', limit: 4 },
]
//Validator for limit determination
function clampLimit(value: unknown, key: HomeSectionKey): number {
    const meta = homeSectionMeta[key]
    const defaultLimit = defaultHomeSections.find(section => section.key === key)!.limit
    const number = Math.round(Number(value))
    if (!Number.isFinite(number) || number <= 0) return defaultLimit
    return Math.min(Math.max(number, meta.minLimit), meta.maxLimit)
}

export function mergeHomeSections(saved: Partial<HomeSectionConfig>[] = []): HomeSectionConfig[] {
    const merged = defaultHomeSections.map(defaults => {
        const item = saved.find(section => section?.key === defaults.key)
        if (!item) return defaults
        return {
            ...defaults,
            enabled: typeof item.enabled === 'boolean' ? item.enabled : defaults.enabled,
            order: typeof item.order === "number" ? item.order : defaults.order,
            title: typeof item.title === 'string' && item.title.trim() ? item.title : defaults.title,
            subtitle: typeof item.subtitle === 'string' ? item.subtitle : defaults.subtitle,
            limit: clampLimit(item.limit, defaults.key)
        }
    })
    return merged.sort((a, b) => a.order - b.order)
}

const cleanText = (value: unknown, max: number) =>
    typeof value === 'string' ? value.trim().slice(0, max) : ''

export function validateAndCleanSections(input: unknown): HomeSectionConfig[] {
    const list = Array.isArray(input) ? input : []
    const result: HomeSectionConfig[] = []
    const seen = new Set<string>()

    for (const item of list) {
        const key = item?.key
        if (typeof key !== 'string' || !Object.prototype.hasOwnProperty.call(homeSectionMeta, key) || seen.has(key)) continue
        const defaults = defaultHomeSections.find(section => section.key === key)!
        seen.add(key)
        result.push({
            key: key as HomeSectionKey,
            enabled: item.enabled === true,
            order: result.length + 1,
            title: cleanText(item.title, 60) || defaults.title,
            subtitle: cleanText(item.subtitle, 120),
            limit: clampLimit(item.limit, key as HomeSectionKey),
        })
    }

    for (const defaults of defaultHomeSections) {
        if (!seen.has(defaults.key)) result.push({ ...defaults, order: result.length + 1 })
    }

    return result
}