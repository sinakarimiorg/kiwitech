// ابزارهای مشترک SEO. آدرس سایت فقط از NEXT_PUBLIC_SITE_URL (بدون / آخر) خوانده می‌شود.

export const SITE_NAME = "کیوی‌تک"
export const DEFAULT_OG_IMAGE = "/images/logo/logo.png"

export function getSiteUrl(): string {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "")
}

/** مسیر نسبی ذخیره‌شده (مثل /uploads/x.jpg) را به URL مطلق تبدیل می‌کند. */
export function abs(path?: string | null): string | undefined {
    if (!path) return undefined
    if (/^https?:\/\//.test(path)) return path
    return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`
}

/** HTML و فاصله‌های اضافه را حذف و متن را کوتاه می‌کند. */
export function plainText(value?: string | null, max = 155): string {
    const text = (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

// قیمت‌ها در دیتابیس تومان هستند؛ schema.org کد ISO 4217 می‌خواهد (IRR = ریال)
export const toRial = (toman: number) => Math.round(toman) * 10

/** لینک محصول/مقاله؛ slug فارسی هم درست encode می‌شود. */
export const productPath = (linkName: string) => `/product-info/${encodeURIComponent(linkName)}`
export const articlePath = (linkName: string) => `/article-info/${encodeURIComponent(linkName)}`
