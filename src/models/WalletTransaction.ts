import {Schema, model, models, Types} from 'mongoose'
import { WalletTransactionType } from '../types/userWalletType'

export interface IWalletTransaction {
    user: Types.ObjectId
    type: WalletTransactionType
    amount: number
    description: string
}

const WalletTransactionSchema = new Schema <IWalletTransaction> (
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["واریز", "برداشت", "خرید", "بازگشت وجه"], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

export default models.WalletTransaction || model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema)