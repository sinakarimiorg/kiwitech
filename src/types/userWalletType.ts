export type WalletTransactionType = "واریز" | "برداشت" | "خرید" | "بازگشت وجه"

export interface UserWalletTransaction {
    _id: string
    type: WalletTransactionType
    amount: number
    description: string
    createdAt: string
}
