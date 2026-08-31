import { Schema, models, model } from "mongoose";
import { AdminTransaction } from "../types/adminTransactionType";

type ITransaction = Omit<AdminTransaction, "_id" | "createdAt">

const TransactionSchema = new Schema<ITransaction>(
    {
        user: { type: String, required: true },
        type: { type: String, enum: ["واریز", "برداشت", "خرید", "بازگشت وجه"], required: true },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["کیف پول", "درگاه بانکی", "کارت به کارت"], required: true },
        status: { type: String, enum: ["موفق", "در انتظار", "ناموفق"], default: "موفق" },

    },
    {
        timestamps: true
    }
);

export default models.Transaction || model<ITransaction>("Transaction", TransactionSchema);