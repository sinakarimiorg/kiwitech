import { Schema, model, models, Types } from "mongoose"

export type PaymentPurpose = "order" | "wallet"
export type PaymentStatus = "pending" | "verifying" | "paid" | "failed" | "expired" | "review"

export interface IPayment {
    user: Types.ObjectId
    purpose: PaymentPurpose
    /** مبلغ به تومان */
    amount: number
    authority?: string
    status: PaymentStatus
    refId?: string
    cardPan?: string
    expiresAt: Date
    verifyingAt?: Date
    order?: Types.ObjectId
    orderSnapshot?: {
        items: unknown[]
        address: string
        phone: string
        shippingCost: number
    }
}

const PaymentSchema = new Schema<IPayment>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        purpose: { type: String, enum: ["order", "wallet"], required: true },
        amount: { type: Number, required: true, min: 1 },
        authority: { type: String, unique: true, sparse: true },
        status: { type: String, enum: ["pending", "verifying", "paid", "failed", "expired", "review"], default: "pending", index: true },
        refId: { type: String },
        cardPan: { type: String },
        expiresAt: { type: Date, required: true },
        verifyingAt: { type: Date },
        order: { type: Schema.Types.ObjectId, ref: "Order" },
        orderSnapshot: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
)

export default models.Payment || model<IPayment>("Payment", PaymentSchema)
