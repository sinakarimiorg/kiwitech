"use server"

import { cachedQuery } from "@root/src/lib/cache";
import { connectDB } from "@root/src/lib/mongodb";
import { MenuCategory } from "@root/src/types/menuType";
import CategoryModel from "@root/src/models/Category"

const loadMenuCategories = cachedQuery("menu:categories", ["categories"], async (): Promise<MenuCategory[]> => {
    await connectDB()

    const categories = await CategoryModel.find({ active: true })
        .sort({ order: 1 })
        .select("title icon items")
        .lean()

    return JSON.parse(JSON.stringify(categories))
}, [])

export async function getMenuCategoriesAction(): Promise<MenuCategory[]> {
    return loadMenuCategories()
}