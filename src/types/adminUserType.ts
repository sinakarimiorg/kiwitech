export type UserStatus = "فعال" | "مسدود"
export type UserRole = 'کاربر' | 'ادمین'

export interface AdminAddress {
    _id?: string
    title: string
    receiver: string
    phone: string
    fullAddress: string
    isDefault?: boolean
}

export interface AdminUser {
    _id: string
    name: string
    phone: string
    email?: string
    ordersCount: number
    totalSpent: number
    status: UserStatus
    role: UserRole
    createdAt: string
    addresses: AdminAddress[]
    favorites: string[]
    walletBalance: number
}