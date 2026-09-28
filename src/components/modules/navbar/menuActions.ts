"use server"

import { connectDB } from "@root/src/lib/mongodb";
import { MenuCategory } from "@root/src/types/menuType";
import CategoryModel from "@root/src/models/Category"

export async function getMenuCategoriesAction(): Promise<MenuCategory[]> {
    await connectDB()

    const categories = await CategoryModel.find({ active: true })
        .sort({ order: 1 })
        .select("title icon items")
        .lean()

    return JSON.parse(JSON.stringify(categories))
}