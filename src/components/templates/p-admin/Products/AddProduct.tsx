import { PiPackageLight } from "react-icons/pi"
import ProductForm, { CategoryData } from "./ProductForm"
import CategoriesModel from "@root/src/models/Category"

export default async function AddProduct() {
    const categoriesFromDB = await CategoriesModel.find({ active: true })
        .sort({ order: 1 })
        .select('title items')
        .lean()

    const categories: CategoryData[] = categoriesFromDB.map(cat => ({
        title: cat.title,
        items: (cat.items || []).map((item: any) => ({
            _id: item._id.toString(),
            title: item.title,
        }))
    }))

    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6" >
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <PiPackageLight className="w-5 h-5 text-primary-500" />
                <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">افزودن محصول جدید</h2>
            </div>

            <ProductForm mode="add" categories={categories} />
        </div >
    )
}
