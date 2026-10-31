import { afterEach, describe, expect, it, vi } from "vitest"
import { abs, articlePath, plainText, productPath, toRial } from "@root/src/lib/seo"

afterEach(() => vi.unstubAllEnvs())

describe("seo helpers", () => {
    it("تومان را به ریال تبدیل می‌کند", () => {
        expect(toRial(150_000)).toBe(1_500_000)
    })
    it("HTML را حذف و متن را کوتاه می‌کند", () => {
        expect(plainText("<p>سلام   <b>دنیا</b></p>")).toBe("سلام دنیا")
        expect(plainText("a".repeat(300), 100)).toHaveLength(100)
        expect(plainText(undefined)).toBe("")
    })
    it("آدرس مطلق از env ساخته می‌شود (بدون / تکراری)", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kiwitech.ir/")
        expect(abs("/uploads/a.png")).toBe("https://kiwitech.ir/uploads/a.png")
        expect(abs("https://cdn.x/a.png")).toBe("https://cdn.x/a.png")
        expect(abs(undefined)).toBeUndefined()
    })
    it("slug فارسی encode می‌شود", () => {
        expect(productPath("کاور-گوشی")).toBe(`/product-info/${encodeURIComponent("کاور-گوشی")}`)
        expect(articlePath("a b")).toBe("/article-info/a%20b")
    })
})
