// User Session schema storing secure token hashes.
// Automatically deletes expired sessions via MongoDB TTL index.

import { Schema, model, models, Types } from "mongoose"

export interface ISession {
    user: Types.ObjectId
    tokenHash: string
    expiresAt: Date
    userAgent?: string
}

const SessionSchema = new Schema<ISession>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        tokenHash: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        userAgent: { type: String },
    },
    { timestamps: true }
)

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.Session || model<ISession>("Session", SessionSchema)