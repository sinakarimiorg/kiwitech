export type TransactionType = "واریز" | "برداشت" | "خرید" | "بازگشت وجه"
export type TransactionStatus = "موفق" | "در انتظار" | "ناموفق"
export type TransactionMethod = "کیف پول" | "درگاه بانکی" | "کارت به کارت"

export interface AdminTransaction {
    _id: string
    user: string
    type: TransactionType
    amount: number
    method: TransactionMethod
    status: TransactionStatus
    createdAt?: string
}