import type { ProductColor } from "@root/src/types/adminProductType"

export type VariantSource = {
    price: number
    exPrice?: number | null
    stock: number
    colorOptions?: ProductColor[] | null
}

export type ResolvedVariant = {
    color: ProductColor | null
    price: number
    exPrice: number | null
    discountPercent: number
    stock: number
    available: boolean
    hasCustomPrice: boolean
}

export const calcDiscountPercent = (price: number, exPrice?: number | null) =>
    exPrice && exPrice > price ? Math.round(((exPrice - price) / exPrice) * 100) : 0

export const hasColors = (product: Pick<VariantSource, "colorOptions">) =>
    (product.colorOptions?.length ?? 0) > 0

/** موجودی یک رنگ (با fallback برای داده‌ی قدیمی) */
export function getColorStock(product: Pick<VariantSource, "stock">, color: ProductColor): number {
    return typeof color.stock === "number" ? Math.max(0, color.stock) : Math.max(0, product.stock)
}

/** موجودی کل: مجموع رنگ‌ها یا stock خود محصول */
export function getTotalStock(product: VariantSource): number {
    if (!hasColors(product)) return Math.max(0, product.stock)
    return product.colorOptions!.reduce((sum, color) => sum + getColorStock(product, color), 0)
}

/** آیا موجودی رنگ‌ها جداگانه ثبت شده؟ (false = محصول قدیمی که فقط stock کل دارد) */
export const hasPerColorStock = (product: VariantSource) =>
    hasColors(product) && product.colorOptions!.every(color => typeof color.stock === "number")

export function findColor(product: Pick<VariantSource, "colorOptions">, colorName?: string | null): ProductColor | null {
    if (!colorName) return null
    return product.colorOptions?.find(color => color.name === colorName) ?? null
}

/** قیمت / تخفیف / موجودی مؤثر برای انتخاب فعلی */
export function resolveVariant(product: VariantSource, colorName?: string | null): ResolvedVariant {
    const color = findColor(product, colorName)

    if (!color) {
        const price = product.price
        const exPrice = product.exPrice && product.exPrice > price ? product.exPrice : null
        const stock = getTotalStock(product)
        return { color: null, price, exPrice, discountPercent: calcDiscountPercent(price, exPrice), stock, available: stock > 0, hasCustomPrice: false }
    }

    const hasCustomPrice = typeof color.price === "number" && color.price > 0
    const price = hasCustomPrice ? color.price! : product.price
    const rawEx = hasCustomPrice ? color.exPrice : product.exPrice
    const exPrice = rawEx && rawEx > price ? rawEx : null
    const stock = getColorStock(product, color)

    return { color, price, exPrice, discountPercent: calcDiscountPercent(price, exPrice), stock, available: stock > 0, hasCustomPrice }
}

/** اولین رنگ موجود (برای انتخاب پیش‌فرض در صفحه‌ی محصول) */
export function getFirstAvailableColor(product: VariantSource): ProductColor | null {
    return product.colorOptions?.find(color => getColorStock(product, color) > 0) ?? null
}

/** کم‌ترین قیمت بین رنگ‌ها (برای نمایش «از …» در صورت نیاز) */
export function getMinPrice(product: VariantSource): number {
    if (!hasColors(product)) return product.price
    return Math.min(...product.colorOptions!.map(color => resolveVariant(product, color.name).price))
}

/** کلید یکتای خط سبد خرید: محصول ساده = productId ، محصول رنگی = productId:رنگ */
export const getCartLineId = (productId: string, colorName?: string | null) =>
    colorName ? `${productId}:${colorName}` : productId

/** استخراج productId از کلید خط سبد (سازگار با آیتم‌های قدیمی localStorage) */
export const getProductIdFromLine = (lineId: string, productId?: string) =>
    productId ?? lineId.split(":")[0]

/** نمایش مناسب رنگ روشن (مثلاً سفید) روی پس‌زمینه‌ی روشن؛ برای رنگ تیک/متن روی swatch */
export function isLightColor(hex: string): boolean {
    const clean = hex.replace("#", "")
    if (clean.length !== 6) return false
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 160
}
