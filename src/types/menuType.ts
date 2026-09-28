import { CategoryIconKey } from "./adminCategoryType"


export type MenuCategoryItem = {
    _id: string
    title: string
}

export type MenuCategory = {
    _id: string
    title: string
    icon: CategoryIconKey
    items: MenuCategoryItem[]
}

export function getCategoryHref(category: string, subCategory?: string): string {
    const params = new URLSearchParams({ category })
    if (subCategory) params.set('subCategory', subCategory)
    return `/products/1?${params.toString()}`
}