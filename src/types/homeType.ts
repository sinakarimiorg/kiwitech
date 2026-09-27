export type HomeProduct = {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    img: string
    stock: number
}

export type HomeBanner = {
    _id: string
    title: string
    image: string
    linkUrl: string
}

export function getDiscountPercent(product: Pick<HomeProduct, 'price' | 'exPrice'>): number {
    if (!product.exPrice || product.exPrice <= product.price) return 0
    return Math.round(((product.exPrice - product.price) / product.exPrice) * 100)
}
