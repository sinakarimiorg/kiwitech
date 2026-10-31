import { describe, expect, it } from "vitest"
import { getOrderTotal, type AdminOrder } from "@root/src/types/adminOrderType"

const order = (extra: Partial<AdminOrder>) =>
    ({
        items: [{ price: 100_000, count: 2 }, { price: 50_000, count: 1 }],
        shippingCost: 45_000,
        ...extra,
    }) as AdminOrder

describe("getOrderTotal", () => {
    it("اقلام + ارسال", () => {
        expect(getOrderTotal(order({}))).toBe(295_000)
    })
    it("تخفیف کد را کم می‌کند", () => {
        expect(getOrderTotal(order({ discountAmount: 25_000 }))).toBe(270_000)
    })
    it("سفارش‌های قدیمی بدون discountAmount درست حساب می‌شوند", () => {
        expect(getOrderTotal(order({ discountAmount: undefined }))).toBe(295_000)
    })
})
