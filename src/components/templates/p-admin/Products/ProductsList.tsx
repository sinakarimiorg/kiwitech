"use client"

import { useState, useTransition } from "react"
import {
    PiMagnifyingGlassLight,
    PiListMagnifyingGlassLight,
} from "react-icons/pi"
import Swal from "sweetalert2"
import ProductBox from "./ProductBox"
import EditProductModal from "./EditProductModal"
import { AdminProduct } from "@root/src/types/adminProductType"
import { deleteProductAction } from "./actions"

type ProductsListProps = {
    initialProducts: AdminProduct[]
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
    const [search, setSearch] = useState<string>("")
    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
    const [isDeleting, startDeleteTransition] = useTransition()




    ////////handle delete product
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف محصول",
            text: "آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })

        if (!result.isConfirmed) return

        startDeleteTransition(async () => {
            const res = await deleteProductAction(id)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "حذف شد",
                    text: "محصول با موفقیت حذف شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "خطا",
                    text: res.error || "مشکلی در حذف محصول پیش آمد",
                })
            }
        })
    }


    const filtered = initialProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiListMagnifyingGlassLight className='w-5 h-5 text-primary-500' />
                    لیست محصولات
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='hidden sm:flex items-center gap-2 px-3.5 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                    <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type='text'
                        placeholder='جستجوی محصول...'
                        className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                    />
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>محصول</th>
                            <th className='font-IranYekanMedium px-3 py-3'>دسته‌بندی</th>
                            <th className='font-IranYekanMedium px-3 py-3'>قیمت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>موجودی</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.length > 0 ? (
                            <tr>
                                <td colSpan={5} className='py-10 text-center text-zinc-400'>
                                    در حال دریافت داده‌ها...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map(product => (
                                <ProductBox
                                    key={product._id}
                                    product={product}
                                    onDelete={handleDelete}
                                    onEdit={setEditingProduct}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='py-10 text-center text-zinc-400'>
                                    محصولی یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    )
}