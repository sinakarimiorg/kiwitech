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
    tags: string[]
    img: string
    images?: string[]
}

// export interface AdminProductsState {
//     items: AdminProduct[]
//     loading: boolean
//     isSubmitting: boolean
//     error: string | null
// }