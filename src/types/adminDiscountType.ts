export type DiscountType = "percent" | "fixed"
export type DiscountStatus = "active" | "disabled" | "expired"

export interface AdminDiscount {
    _id: string
    code: string
    type: DiscountType
    value: number
    minOrderAmount: number
    usageLimit: number
    usedCount: number
    expiresAt: string
    status: DiscountStatus
}