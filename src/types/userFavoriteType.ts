export interface FavoriteProduct {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    img: string
    stock?: number
    colorOptions?: { name: string; hex: string; stock?: number; price?: number; exPrice?: number }[]
}
