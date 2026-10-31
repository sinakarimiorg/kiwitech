import { connectDB } from "./mongodb"
import DiscountModel from "@models/Discount"
import { toEnglishDigits } from "@root/src/utils/profileValidation"
import { todayJalali } from "./jalali"

export type DiscountEvaluation =
    | { ok: true; code: string; amount: number }
    | { ok: false; error: string }

type DiscountDoc = {
    code: string
    type: "percent" | "fixed"
    value: number
    minOrderAmount?: number
    usageLimit: number
    usedCount: number
    expiresAt: string
    status: "active" | "disabled" | "expired"
}

/** مبلغ تخفیف؛ هرگز بیشتر از (جمع کالاها - ۱) نمی‌شود تا مبلغ سفارش صفر نشود. */
export function computeDiscountAmount(type: "percent" | "fixed", value: number, itemsTotal: number): number {
    const raw = type === "percent" ? Math.floor((itemsTotal * value) / 100) : value
    return Math.max(0, Math.min(raw, itemsTotal - 1))
}

export const normalizeDiscountCode = (raw: unknown) =>
    toEnglishDigits(String(raw ?? "")).trim().toUpperCase().slice(0, 40)

/** کد تخفیف را روی مجموع قیمت کالاها اعتبارسنجی و مبلغ تخفیف را حساب می‌کند. */
export async function evaluateDiscount(rawCode: unknown, itemsTotal: number): Promise<DiscountEvaluation> {
    const code = normalizeDiscountCode(rawCode)
    if (!code) return { ok: false, error: "کد تخفیف را وارد کنید" }

    await connectDB()
    const discount = (await DiscountModel.findOne({ code }).lean()) as DiscountDoc | null

    // پیام یکسان برای «وجود ندارد» و «غیرفعال» تا کدها حدس‌زدنی نباشند
    if (!discount || discount.status !== "active") return { ok: false, error: "کد تخفیف معتبر نیست" }

    const expiry = toEnglishDigits(discount.expiresAt ?? "")
    if (expiry && expiry < todayJalali()) return { ok: false, error: "مهلت استفاده از این کد تمام شده است" }
    if (discount.usedCount >= discount.usageLimit) return { ok: false, error: "ظرفیت استفاده از این کد تمام شده است" }

    const min = discount.minOrderAmount ?? 0
    if (itemsTotal < min) {
        return { ok: false, error: `حداقل مبلغ سفارش برای این کد ${min.toLocaleString("fa-IR")} تومان است` }
    }

    const amount = computeDiscountAmount(discount.type, discount.value, itemsTotal)
    if (amount <= 0) return { ok: false, error: "این کد برای سفارش شما قابل اعمال نیست" }

    return { ok: true, code: discount.code, amount }
}

/** بعد از پرداخت موفق؛ فقط اگر هنوز ظرفیت باقی است. */
export async function consumeDiscount(code: string): Promise<void> {
    await connectDB()
    await DiscountModel.updateOne(
        { code, $expr: { $lt: ["$usedCount", "$usageLimit"] } },
        { $inc: { usedCount: 1 } }
    )
}
