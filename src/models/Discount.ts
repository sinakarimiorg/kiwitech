import { Schema, models, model } from "mongoose"
import { AdminDiscount } from "../types/adminDiscountType"

type IDiscount = Omit<AdminDiscount, "_id">

const DiscountSchema = new Schema<IDiscount>(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        type: { type: String, enum: ["percent", "fixed"], required: true },
        value: { type: Number, required: true },
        minOrderAmount: { type: Number, default: 0 },
        usageLimit: { type: Number, required: true },
        usedCount: { type: Number, default: 0 },
        expiresAt: { type: String, required: true },
        status: { type: String, enum: ["active", "disabled", "expired"], default: "active" },
    },
    { timestamps: true }
)

export default models.Discount || model<IDiscount>("Discount", DiscountSchema)