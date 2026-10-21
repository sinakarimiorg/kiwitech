export interface ProductSpec {
    label: string
    value: string
}

export interface ProductColor {
    name: string
    hex: string
    stock?: number
    price?: number
    exPrice?: number
}
export interface AdminProduct {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    stock: number
    category: string
    subCategory: string
    description?: string
    colors: string
    colorOptions?: ProductColor[]
    specs?: ProductSpec[]
    tags: string[]
    img: string
    isFeatured?: Boolean
    images?: string[]
}