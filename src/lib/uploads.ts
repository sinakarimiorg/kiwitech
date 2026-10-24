// Secure image upload utility. 
// Validates file size, detects real MIME type via magic bytes, and saves with
//  a random safe filename.

import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomBytes } from "crypto"

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

type ImageKind = "jpg" | "png" | "gif" | "webp" | "avif"

function detectImageKind(buf: Buffer): ImageKind | null {
    if (buf.length < 12) return null
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg"
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png"
    if (buf.subarray(0, 4).toString("ascii") === "GIF8") return "gif"
    if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp"
    if (buf.subarray(4, 8).toString("ascii") === "ftyp" && buf.subarray(8, 12).toString("ascii") === "avif") return "avif"
    return null
}

export type SaveImageResult = { path: string } | { error: string }

export async function saveImageFile(file: File, index = 0): Promise<SaveImageResult> {
    if (!file || typeof file === "string" || !file.size) return { error: "فایل تصویر نامعتبر است" }
    if (file.size > MAX_IMAGE_SIZE) return { error: "حجم هر تصویر حداکثر ۵ مگابایت است" }

    const buffer = Buffer.from(await file.arrayBuffer())
    const kind = detectImageKind(buffer)
    if (!kind) return { error: "فقط تصاویر JPG، PNG، WEBP، GIF و AVIF مجاز است" }

    const uploadDir = path.join(process.cwd(), "public/uploads")
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${index}-${randomBytes(4).toString("hex")}.${kind}`
    await writeFile(path.join(uploadDir, filename), buffer)
    return { path: `/uploads/${filename}` }
}

export const isUploadPath = (value: unknown): value is string =>
    typeof value === "string" && /^\/uploads\/[A-Za-z0-9._-]+$/.test(value)
