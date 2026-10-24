// Rate-limiting utility functions using MongoDB and Next.js headers.
// Tracks request counts per key and handles concurrent race conditions securely.

import { headers } from "next/headers"
import { connectDB } from "./mongodb"
import RateLimitModel from "@models/RateLimit"

function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    await connectDB()
    const now = new Date()

    await RateLimitModel.deleteOne({ key, expiresAt: { $lte: now } })

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const doc = await RateLimitModel.findOneAndUpdate(
                { key },
                { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
                { upsert: true, returnDocument: "after" }
            ).lean()
            return ((doc as { count?: number } | null)?.count ?? 1) <= limit
        } catch (error) {
            if (!isDuplicateKeyError(error)) throw error
        }
    }
    return false
}

export async function resetRateLimit(key: string) {
    await connectDB()
    await RateLimitModel.deleteOne({ key })
}

export async function getClientIp(): Promise<string> {
    const h = await headers()
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
}
