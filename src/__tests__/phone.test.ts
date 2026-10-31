import { describe, expect, it } from "vitest"
import { isValidMobile, normalizePhone } from "@root/src/utils/phone"

describe("normalizePhone", () => {
    it.each([
        ["09123456789", "09123456789"],
        ["9123456789", "09123456789"],
        ["۰۹۱۲۳۴۵۶۷۸۹", "09123456789"],
        ["+989123456789", "09123456789"],
        ["00989123456789", "09123456789"],
        [" 0912 345 6789 ", "09123456789"],
    ])("%s → %s", (input, expected) => {
        expect(normalizePhone(input)).toBe(expected)
    })
})

describe("isValidMobile", () => {
    it("شماره‌های معتبر را می‌پذیرد", () => {
        expect(isValidMobile("09123456789")).toBe(true)
        expect(isValidMobile("۹۱۲۳۴۵۶۷۸۹")).toBe(true)
    })
    it("شماره‌های نامعتبر را رد می‌کند", () => {
        expect(isValidMobile("")).toBe(false)
        expect(isValidMobile("0912345")).toBe(false)
        expect(isValidMobile("02112345678")).toBe(false)
        expect(isValidMobile("abc")).toBe(false)
        expect(isValidMobile(undefined)).toBe(false)
    })
})
