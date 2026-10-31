import { describe, expect, it } from "vitest"
import { detectImageKind, isUploadPath } from "@root/src/lib/uploads"

const pad = (bytes: number[]) => Buffer.from([...bytes, ...new Array(16).fill(0)])
const ascii = (s: string) => [...s].map(c => c.charCodeAt(0))

describe("detectImageKind", () => {
    it("فرمت‌های مجاز را از روی بایت‌ها تشخیص می‌دهد", () => {
        expect(detectImageKind(pad([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpg")
        expect(detectImageKind(pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe("png")
        expect(detectImageKind(pad(ascii("GIF89a")))).toBe("gif")
        expect(detectImageKind(pad([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")]))).toBe("webp")
        expect(detectImageKind(pad([0, 0, 0, 0, ...ascii("ftypavif")]))).toBe("avif")
    })
    it("فایل‌های غیرتصویری (حتی با پسوند عکس) را رد می‌کند", () => {
        expect(detectImageKind(pad(ascii("<svg xmlns=")))).toBeNull()
        expect(detectImageKind(pad(ascii("<?php echo 1;")))).toBeNull()
        expect(detectImageKind(pad(ascii("<script>alert(1)</script>")))).toBeNull()
        expect(detectImageKind(Buffer.from([1, 2, 3]))).toBeNull()
    })
})

describe("isUploadPath", () => {
    it("فقط مسیرهای /uploads/ ساده را می‌پذیرد", () => {
        expect(isUploadPath("/uploads/1700000000-0-ab12cd34.png")).toBe(true)
        expect(isUploadPath("/uploads/../.env")).toBe(false)
        expect(isUploadPath("https://evil.com/x.png")).toBe(false)
        expect(isUploadPath("/uploads/a/b.png")).toBe(false)
        expect(isUploadPath(undefined)).toBe(false)
    })
})
