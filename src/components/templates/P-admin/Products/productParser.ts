// Validation & Parsing Helper For Add Product Form
import type { ProductColor, ProductSpec } from "@root/src/types/adminProductType"

export const MAX_SPECS = 30
export const MAX_COLORS = 20
export const MAX_TAGS = 20

const LINK_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const HEX_REGEX = /^#[0-9a-f]{6}$/i

const clean = (value: unknown, max: number) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : ""

function parseJsonArray(raw: FormDataEntryValue | null): unknown[] {
    try {
        const parsed = JSON.parse(typeof raw === "string" ? raw : "[]")
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const toInt = (value: unknown) => {
    const number = Math.round(Number(value))
    return Number.isFinite(number) ? number : NaN
}

export type ParsedProduct = {
    name: string
    linkName: string
    price: number
    exPrice: number | null
    discount: number
    stock: number
    category: string
    subCategory: string
    description: string | null
    isFeatured: boolean
    specs: ProductSpec[]
    colorOptions: ProductColor[]
    colors: string
    tags: string[]
}

type ParseResult = { ok: true; data: ParsedProduct } | { ok: false; error: string }

export function parseProductFormData(formData: FormData): ParseResult {
    const name = clean(formData.get("name"), 150)
    const linkName = clean(formData.get("linkName"), 100).toLowerCase()
    const category = clean(formData.get("category"), 80)
    const subCategory = clean(formData.get("subCategory"), 80)

    const price = Math.round(Number(formData.get("price")))
    const basePrice = Math.round(Number(formData.get("exPrice")) || 0)
    const stock = Math.round(Number(formData.get("stock")))

    if (!name) return { ok: false, error: "نام محصول الزامی است" }
    if (!LINK_REGEX.test(linkName)) return { ok: false, error: "نام لینک فقط می‌تواند شامل حروف انگلیسی، عدد و خط تیره باشد" }
    if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "قیمت محصول معتبر نیست" }
    const hasColorOptions = (() => {
        try {
            const parsed = JSON.parse(String(formData.get("colorOptions") ?? "[]"))
            return Array.isArray(parsed) && parsed.length > 0
        } catch {
            return false
        }
    })()
    if (!hasColorOptions && (!Number.isFinite(stock) || stock < 0)) return { ok: false, error: "موجودی انبار معتبر نیست" }
    if (!category || !subCategory) return { ok: false, error: "دسته‌بندی و زیرمجموعه الزامی است" }

    const hasDiscount = basePrice > price
    const exPrice = hasDiscount ? basePrice : null
    const discount = hasDiscount ? Math.round(((basePrice - price) / basePrice) * 100) : 0

    const specs: ProductSpec[] = parseJsonArray(formData.get("specs"))
        .map((item: any) => ({ label: clean(item?.label, 40), value: clean(item?.value, 200) }))
        .filter(spec => spec.label && spec.value)
        .slice(0, MAX_SPECS)

    const seenColors = new Set<string>()
    const colorOptions: ProductColor[] = []
    for (const item of parseJsonArray(formData.get("colorOptions")) as any[]) {
        const colorName = clean(item?.name, 30)
        if (!colorName || seenColors.has(colorName)) continue
        if (colorOptions.length >= MAX_COLORS) break
        seenColors.add(colorName)

        const colorStock = toInt(item?.stock)
        if (!Number.isFinite(colorStock) || colorStock < 0) {
            return { ok: false, error: `موجودی رنگ «${colorName}» معتبر نیست` }
        }

        const color: ProductColor = {
            name: colorName,
            hex: typeof item?.hex === "string" && HEX_REGEX.test(item.hex) ? item.hex.toLowerCase() : "#9ca3af",
            stock: colorStock,
        }

        // product's specific color
        const hasCustomPrice = item?.price !== undefined && item?.price !== null && item?.price !== ""
        if (hasCustomPrice) {
            const colorPrice = toInt(item.price)
            if (!Number.isFinite(colorPrice) || colorPrice <= 0) {
                return { ok: false, error: `قیمت رنگ «${colorName}» معتبر نیست` }
            }
            color.price = colorPrice

            const colorBase = toInt(item?.exPrice) || 0
            if (colorBase > colorPrice) color.exPrice = colorBase
        }
        colorOptions.push(color)
    }

    const totalStock = colorOptions.length
        ? colorOptions.reduce((sum, color) => sum + (color.stock ?? 0), 0)
        : stock

    const tags = Array.from(
        new Set(
            String(formData.get("tags") ?? "")
                .split(/[,،]/)
                .map(tag => tag.trim())
                .filter(Boolean)
        )
    ).slice(0, MAX_TAGS)

    const description = String(formData.get("description") ?? "").trim().slice(0, 5000)

    return {
        ok: true,
        data: {
            name,
            linkName,
            price,
            exPrice,
            discount,
            stock: totalStock,
            category,
            subCategory,
            description: description || null,
            isFeatured: formData.get("isFeatured") === "true",
            specs,
            colorOptions,
            colors: colorOptions.map(color => color.name).join("، "),
            tags,
        },
    }
}