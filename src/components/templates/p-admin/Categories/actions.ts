"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@root/src/lib/mongodb"
import CategoryModel from "@root/src/models/Category"

type ActionResult = { success: true } | { success: false; error: string }

type CategoryInput = {
    title: string
    icon: string
    active: boolean
}

// ────────────────────────────────
// main category actions
// ────────────────────────────────
export async function addCategoryAction(data: CategoryInput): Promise<ActionResult> {
    await connectDB()

    try {
        const count = await CategoryModel.countDocuments()
        await CategoryModel.create({ ...data, order: count + 1, items: [] })

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error creating category:", error)
        return { success: false, error: "خطا در ثبت دسته‌بندی" }
    }
}

export async function updateCategoryAction(id: string, data: CategoryInput): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!updated) return { success: false, error: "دسته‌بندی یافت نشد" }

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error updating category:", error)
        return { success: false, error: "خطا در ویرایش دسته‌بندی" }
    }
}

export async function toggleCategoryActiveAction(id: string, active: boolean): Promise<ActionResult> {
    await connectDB()

    try {
        const updated = await CategoryModel.findByIdAndUpdate(id, { active }, { returnDocument: 'after' })
        if (!updated) return { success: false, error: "دسته‌بندی یافت نشد" }

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error toggling category:", error)
        return { success: false, error: "خطا در تغییر وضعیت دسته‌بندی" }
    }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
    await connectDB()

    try {
        const deleted = await CategoryModel.findByIdAndDelete(id)
        if (!deleted) return { success: false, error: "دسته‌بندی یافت نشد" }

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error deleting category:", error)
        return { success: false, error: "خطا در حذف دسته‌بندی" }
    }
}

// ────────────────────────────────
// subCategory (item) actions
// ────────────────────────────────
export async function addCategoryItemAction(categoryId: string, title: string): Promise<ActionResult> {
    await connectDB()

    try {
        const category = await CategoryModel.findById(categoryId)
        if (!category) return { success: false, error: "دسته‌بندی یافت نشد" }

        category.items.push({ title } as any)
        await category.save()

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error adding category item:", error)
        return { success: false, error: "خطا در افزودن زیرمجموعه" }
    }
}

export async function updateCategoryItemAction(categoryId: string, itemId: string, title: string): Promise<ActionResult> {
    await connectDB()

    try {
        const category = await CategoryModel.findById(categoryId)
        if (!category) return { success: false, error: "دسته‌بندی یافت نشد" }

        const item = (category.items as any).id(itemId)
        if (!item) return { success: false, error: "زیرمجموعه یافت نشد" }

        item.title = title
        await category.save()

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error updating category item:", error)
        return { success: false, error: "خطا در ویرایش زیرمجموعه" }
    }
}

export async function deleteCategoryItemAction(categoryId: string, itemId: string): Promise<ActionResult> {
    await connectDB()

    try {
        const category = await CategoryModel.findById(categoryId)
        if (!category) return { success: false, error: "دسته‌بندی یافت نشد" }

        ;(category.items as any).pull({ _id: itemId })
        await category.save()

        revalidatePath("/p-admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error deleting category item:", error)
        return { success: false, error: "خطا در حذف زیرمجموعه" }
    }
}
