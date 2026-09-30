export type BannerPosition = "landing" | "amazingOffers" | "categoriesByPhone" | "brands"
export type BannerStatus = "active" | "disabled"

export interface AdminBanner {
    _id: string
    title: string
    position: BannerPosition
    image: string
    linkUrl: string
    order: number
    status: BannerStatus
}
