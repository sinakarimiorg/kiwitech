export type CategoryIconKey = "smartphone" | "computer" | "kitchen" | "package"
 

export interface AdminCategoryItem {
    _id: string
    title: string
}


export interface AdminCategory {
    _id: string
    title: string
    icon: CategoryIconKey
    active: boolean
    order: number
    items: AdminCategoryItem[]
}
