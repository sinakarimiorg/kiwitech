// Rate-limiting schema using Mongoose. 
// Automatically deletes expired records via MongoDB TTL index.

import { Schema, model, models } from "mongoose"

export interface IRateLimit {
    key: string
    count: number
    expiresAt: Date
}

const RateLimitSchema = new Schema<IRateLimit>({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
})

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.RateLimit || model<IRateLimit>("RateLimit", RateLimitSchema)