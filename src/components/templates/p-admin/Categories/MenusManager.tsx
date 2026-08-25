"use client"

import { useState, useTransition } from "react"
import {
    PiCaretDownLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiPlusCircleLight,
    PiDotsSixVerticalLight,
    PiListBulletsLight,
} from "react-icons/pi"
import Swal from "sweetalert2"
import { categoryIconMap } from "./categoryIcons"
import CategoryModal from "./CategoryModal"
import CategoryItemModal from "./CategoryItemModal"
import type { AdminCategory } from "@root/src/types/adminCategoryType"
import {
    addCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
    toggleCategoryActiveAction,
    addCategoryItemAction,
    updateCategoryItemAction,
    deleteCategoryItemAction,
} from "./actions"


type MenusManagerProps = {
    initialCategories: AdminCategory[]
}

export default function MenusManager({ initialCategories }: MenusManagerProps) {
    const [openGroup, setOpenGroup] = useState<string | null>(initialCategories[0]?._id ?? null)
    const [isPending, startTransition] = useTransition()

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)

    const [itemModalState, setItemModalState] = useState<
        { categoryId: string; itemId?: string; title?: string } | null
    >(null)

    const toggleGroup = (id: string) => {
        setOpenGroup(prev => (prev === id ? null : id))
    }

    const toggleActive = (id: string, active: boolean) => {
        startTransition(async () => {
            const res = await toggleCategoryActiveAction(id, !active)
            if (!res.success) {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }

    const openAddCategory = () => {
        setEditingCategory(null)
        setIsCategoryModalOpen(true)
    }

    const openEditCategory = (category: AdminCategory) => {
        setEditingCategory(category)
        setIsCategoryModalOpen(true)
    }

    const saveCategory = (data: { title: string; icon: string; active: boolean }) => {
        startTransition(async () => {
            const res = editingCategory
                ? await updateCategoryAction(editingCategory._id, data)
                : await addCategoryAction(data)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: editingCategory ? "دسته با موفقیت ویرایش شد" : "دسته با موفقیت افزوده شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                setIsCategoryModalOpen(false)
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی پیش آمد" })
            }
        })
    }

    const removeCategory = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف دسته اصلی",
            text: "با حذف این دسته، تمام زیرمجموعه‌های آن نیز حذف می‌شوند. ادامه می‌دهید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteCategoryAction(id)
            if (res.success) {
                Swal.fire({ icon: "success", title: "حذف شد", text: "دسته با موفقیت حذف شد", timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف دسته پیش آمد" })
            }
        })
    }


    ///subCategory(Item) actions
    const saveItem = (title: string) => {
        if (!itemModalState) return
        const { categoryId, itemId } = itemModalState

        startTransition(async () => {
            const res = itemId
                ? await updateCategoryItemAction(categoryId, itemId, title)
                : await addCategoryItemAction(categoryId, title)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: itemId ? "زیرمجموعه ویرایش شد" : "زیرمجموعه افزوده شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                setItemModalState(null)
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی پیش آمد" })
            }
        })
    }

    const removeItem = async (categoryId: string, itemId: string) => {
        const result = await Swal.fire({
            title: "حذف زیرمجموعه",
            text: "آیا از حذف این زیرمجموعه مطمئن هستید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteCategoryItemAction(categoryId, itemId)
            if (res.success) {
                Swal.fire({ icon: "success", title: "حذف شد", text: "زیرمجموعه حذف شد", timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف زیرمجموعه پیش آمد" })
            }
        })
    }

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiListBulletsLight className='w-5 h-5 text-primary-500' />
                    منوی دسته‌بندی‌ها
                    <span className='text-xs font-IranYekan text-zinc-400'>({initialCategories.length} دسته اصلی)</span>
                </h2>

                <button onClick={openAddCategory} className='flex-center gap-1.5 px-4 py-2 text-sm text-text linear_btn'>
                    <PiPlusCircleLight className='w-4 h-4' />
                    <span className='hidden sm:inline'>دسته اصلی جدید</span>
                </button>
            </div>

            {/* Groups */}
            <div className='divide-y divide-gray-50'>
                {initialCategories.map(category => {
                    const Icon = categoryIconMap[category.icon] ?? categoryIconMap.package
                    const isOpen = openGroup === category._id
                    return (
                        <div key={category._id}>
                            {/* Group Row */}
                            <div className='flex items-center gap-3 px-5 sm:px-6 py-4'>
                                <PiDotsSixVerticalLight className='w-5 h-5 text-zinc-300 cursor-grab shrink-0' />

                                <button
                                    onClick={() => toggleGroup(category._id)}
                                    className='flex items-center gap-2.5 flex-1 min-w-0 text-right cursor-pointer'>
                                    <span className='flex-center w-9 h-9 shrink-0 bg-primary-50 text-primary-600 rounded-lg'>
                                        <Icon className='w-4.5 h-4.5' />
                                    </span>
                                    <span className='font-IranYekanMedium text-sm text-zinc-700 line-clamp-1'>{category.title}</span>
                                    <span className='text-xs text-zinc-400 shrink-0'>({category.items.length} زیرمجموعه)</span>
                                    <PiCaretDownLight className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                <div className='flex items-center gap-3 shrink-0'>
                                    <button
                                        onClick={() => toggleActive(category._id, category.active)}
                                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer
                                            ${category.active ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-zinc-400"}`}>
                                        {category.active ? "فعال" : "غیرفعال"}
                                    </button>
                                    <button
                                        onClick={() => openEditCategory(category)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                        <PiPencilSimpleLight className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => removeCategory(category._id)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                        <PiTrashLight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>


                            {/* Sub Items */}
                            {isOpen && (
                                <div className='bg-gray-50/60 px-5 sm:px-6 py-4 pr-16 sm:pr-20'>
                                    <div className='flex flex-col gap-2'>
                                        {category.items.map(item => (
                                            <div key={item._id} className='flex items-center gap-3 bg-white px-4 py-2.5 border border-gray-100 rounded-lg'>
                                                <PiDotsSixVerticalLight className='w-4 h-4 text-zinc-300 cursor-grab shrink-0' />
                                                <span className='flex-1 text-sm text-zinc-600'>{item.title}</span>
                                                <button
                                                    onClick={() => setItemModalState({ categoryId: category._id, itemId: item._id, title: item.title })}
                                                    className='flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer'>
                                                    <PiPencilSimpleLight className='w-3.5 h-3.5' />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(category._id, item._id)}
                                                    className='flex-center w-7 h-7 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer'>
                                                    <PiTrashLight className='w-3.5 h-3.5' />
                                                </button>
                                            </div>
                                        ))}

                                        {category.items.length === 0 &&
                                            <p className='py-2 text-xs text-zinc-400 text-center'>زیرمجموعه‌ای ثبت نشده است.</p>
                                        }
                                    </div>

                                    <button
                                        onClick={() => setItemModalState({ categoryId: category._id })}
                                        className='flex-center gap-1.5 w-full mt-3 py-2.5 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 hover:border-primary-400 rounded-lg transition-colors cursor-pointer'>
                                        <PiPlusCircleLight className='w-4 h-4' />
                                        افزودن زیرمجموعه
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}

                {initialCategories.length === 0 &&
                    <div className='py-10 text-center text-zinc-400'>دسته‌بندی‌ای یافت نشد.</div>
                }
            </div>
            {isCategoryModalOpen && (
                <CategoryModal
                    initialData={editingCategory}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSave={saveCategory}
                    isSaving={isPending}
                />
            )}

            {itemModalState && (
                <CategoryItemModal
                    initialTitle={itemModalState.title}
                    onClose={() => setItemModalState(null)}
                    onSave={saveItem}
                    isSaving={isPending}
                />
            )}
        </div>
    )
}
