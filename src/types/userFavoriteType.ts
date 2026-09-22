export interface FavoriteProduct {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    img: string
    stock?: number
}
