"use client"

import { PiPackageLight, PiXBold } from "react-icons/pi"
import ProductForm from "./ProductForm"
import type { AdminProduct } from "@root/src/types/adminProductType"
import type { AdminCategory } from "@root/src/types/adminCategoryType"

type EditProductModalProps = {
    product: AdminProduct
    onClose: () => void
    categories: AdminCategory[]
}

export default function EditProductModal({ product, onClose, categories }: EditProductModalProps) {
    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        <PiPackageLight className="w-5 h-5 text-primary-500" />
                        ویرایش محصول
                    </h2>
                    <button onClick={onClose} aria-label="بستن" className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <ProductForm mode="edit" categories={categories} product={product} onSuccess={onClose} onCancel={onClose} />
            </div>
        </div>
    )
}
