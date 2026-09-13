export type UserStatus = "فعال" | "مسدود"
export type UserRole = 'کاربر' | 'ادمین'

export interface UserAddress {
    _id?: string
    title: string
    receiver: string
    phone: string
    fullAddress: string
    isDefault?: boolean
}

export interface UserType {
    _id: string
    name: string
    phone: string
    email?: string
    nationalCode?: string
    birthDate?: string
    ordersCount: number
    totalSpent: number
    status: UserStatus
    role: UserRole
    createdAt: string
    addresses: UserAddress[]
    favorites: string[]
    walletBalance: number
}

export interface UserProfile  {
    _id: string
    name: string
    phone: string
    email ?: string
    nationalCode ?: string
    birthDate ?: string
    walletBalance: number
    status: UserStatus
}