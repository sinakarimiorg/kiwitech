export interface CartItem {
    id: string
    title: string
    img: string
    price: number
    exPrice?: number
    count: number
    stock?: number
    linkName: string
}
