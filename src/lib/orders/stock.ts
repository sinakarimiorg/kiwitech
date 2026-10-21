import { Types } from "mongoose"
import ProductModel from "@root/src/models/Product"

export type StockItem = {
    product?: Types.ObjectId | string | null
    color?: string | null
    count: number
    title?: string
}

type ProductStockDoc = {
    stock: number
    colorOptions?: { name: string; stock?: number }[]
}

async function applyDelta(item: StockItem, direction: 1 | -1): Promise<boolean> {
    if (!item.product) return true // سفارش قدیمی بدون رفرنس محصول
    const amount = direction * item.count

    const doc = (await ProductModel.findById(item.product).select("stock colorOptions").lean()) as ProductStockDoc | null
    if (!doc) return direction === 1 // محصول حذف شده؛ برگرداندن موجودی بی‌معنی است ولی خطا هم نیست

    const colorEntry = item.color ? doc.colorOptions?.find(color => color.name === item.color) : undefined
    const usesColorStock = !!colorEntry && typeof colorEntry.stock === "number"

    // فقط برای کم کردن شرط کافی بودن موجودی را اعمال می‌کنیم
    const guard = direction === -1 ? { $gte: item.count } : undefined

    if (usesColorStock) {
        const result = await ProductModel.updateOne(
            {
                _id: item.product,
                colorOptions: { $elemMatch: { name: item.color, ...(guard ? { stock: guard } : {}) } },
            },
            { $inc: { "colorOptions.$.stock": amount, stock: amount } }
        )
        return result.matchedCount === 1
    }

    const result = await ProductModel.updateOne(
        { _id: item.product, ...(guard ? { stock: guard } : {}) },
        { $inc: { stock: amount } }
    )
    return result.matchedCount === 1
}

/** موجودی همه‌ی اقلام را کم می‌کند؛ در صورت کمبود هر قلم، همه را به حالت قبل برمی‌گرداند. */
export async function reserveStock(items: StockItem[]): Promise<{ ok: true } | { ok: false; title?: string }> {
    const done: StockItem[] = []

    for (const item of items) {
        const ok = await applyDelta(item, -1)
        if (!ok) {
            await releaseStock(done)
            return { ok: false, title: item.title }
        }
        done.push(item)
    }
    return { ok: true }
}

/** موجودی اقلام را برمی‌گرداند (لغو یا حذف سفارش). */
export async function releaseStock(items: StockItem[]): Promise<void> {
    for (const item of items) {
        try {
            await applyDelta(item, 1)
        } catch (error) {
            console.error("[stock] release failed for", item.product?.toString(), error)
        }
    }
}
