export interface CartItem {
    id: string
    productId?: string
    title: string
    img: string
    price: number
    exPrice?: number
    count: number
    stock?: number
    linkName: string
    color?: string
    colorHex?: string
}
