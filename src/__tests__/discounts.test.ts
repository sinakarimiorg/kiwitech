import { describe, expect, it } from "vitest"
import { computeDiscountAmount, normalizeDiscountCode } from "@root/src/lib/discounts"
import { todayJalali } from "@root/src/lib/jalali"

describe("computeDiscountAmount", () => {
    it("درصدی را گرد به پایین حساب می‌کند", () => {
        expect(computeDiscountAmount("percent", 10, 1_000_001)).toBe(100_000)
    })
    it("مبلغ ثابت را برمی‌گرداند", () => {
        expect(computeDiscountAmount("fixed", 50_000, 500_000)).toBe(50_000)
    })
    it("هرگز مبلغ سفارش را صفر نمی‌کند", () => {
        expect(computeDiscountAmount("percent", 100, 200_000)).toBe(199_999)
        expect(computeDiscountAmount("fixed", 900_000, 200_000)).toBe(199_999)
    })
    it("مقدار منفی تخفیف نمی‌دهد", () => {
        expect(computeDiscountAmount("fixed", -5000, 200_000)).toBe(0)
    })
})

describe("normalizeDiscountCode", () => {
    it("ارقام فارسی، فاصله و حروف کوچک را نرمال می‌کند", () => {
        expect(normalizeDiscountCode("  kiwi۲۰  ")).toBe("KIWI20")
    })
    it("طول را محدود می‌کند و ورودی نامعتبر را خالی می‌کند", () => {
        expect(normalizeDiscountCode("a".repeat(100))).toHaveLength(40)
        expect(normalizeDiscountCode(null)).toBe("")
    })
})

describe("todayJalali", () => {
    it("قالب YYYY/MM/DD با سال شمسی دارد", () => {
        const today = todayJalali()
        expect(today).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
        expect(Number(today.slice(0, 4))).toBeGreaterThan(1400)
    })
})
