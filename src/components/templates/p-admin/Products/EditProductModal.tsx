"use client"

import { useRef, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import {
    PiPackageLight,
    PiTextAlignRightLight,
    PiTagLight,
    PiStackLight,
    PiImageLight,
    PiXCircleFill,
    PiFloppyDiskLight,
    PiXBold,
} from "react-icons/pi"
import Swal from "sweetalert2"

const categories = [
    "لوازم جانبی موبایل",
    "لوازم جانبی کامپیوتر",
    "لوازم خانگی",
    "لوازم جانبی متفرقه",
]

const subCategories = [
    "شارژر و کابل",
    "هندزفری و هدفون",
    "کیس و کاور",
    "پایه نگهدارنده",
]

type Product = {
    _id: string
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    stock: number
    category: string
    subCategory: string
    description?: string
    colors: string
    tags: string[]
    img: string
    images?: string[]
}

type EditProductModalProps = {
    product: Product
    onClose: () => void
    onSaved: (updatedProduct: Product) => void
}

interface FormValues {
    name: string
    linkName: string
    price: string
    exPrice: string
    discount: string
    stock: string
    category: string
    subCategory: string
    description: string
    colors: string
    tags: string
}

const validationSchema = Yup.object({
    name: Yup.string().required("نام محصول الزامی است"),
    linkName: Yup.string().required("نام لینک الزامی است"),
    price: Yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue === "string") {
                return Number(originalValue.replace(/,/g, ""));
            }
            return value;
        })
        .typeError("قیمت باید عدد باشد").positive("قیمت باید معتبر باشد").required("قیمت الزامی است"),
    exPrice: Yup.number().typeError("قیمت قبل تخفیف باید عدد باشد").nullable(),
    discount: Yup.number().typeError("تخفیف باید عدد باشد").min(0, "حداقل 0").max(100, "حداکثر 100"),
    stock: Yup.number().typeError("موجودی باید عدد باشد").required("موجودی الزامی است"),
    category: Yup.string().required("انتخاب دسته‌بندی الزامی است"),
    subCategory: Yup.string().required("انتخاب زیرمجموعه الزامی است"),
    description: Yup.string(),
    colors: Yup.string(),
    tags: Yup.string(),
})

export default function EditProductModal({ product, onClose, onSaved }: EditProductModalProps) {
    const [existingImages, setExistingImages] = useState<string[]>(
        [product.img, ...(product.images ?? [])].filter(Boolean)
    )
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const initialValues: FormValues = {
        name: product.name ?? "",
        linkName: product.linkName ?? "",
        price: product.price ? String(product.price) : "",
        exPrice: product.exPrice ? String(product.exPrice) : "",
        discount: product.discount ? String(product.discount) : "",
        stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : "",
        category: product.category ?? "",
        subCategory: product.subCategory ?? "",
        description: product.description ?? "",
        colors: product.colors ?? "",
        tags: product.tags?.length ? product.tags.join("، ") : "",
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (!files.length) return
        setNewImageFiles(prev => [...prev, ...files])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => setNewImagePreviews(prev => [...prev, reader.result as string])
            reader.readAsDataURL(file)
        })
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
        setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleFormSubmit = async (values: FormValues, { setSubmitting }: any) => {
        if (!existingImages.length && !newImageFiles.length) {
            Swal.fire({ icon: "error", title: "خطا", text: "حداقل یک تصویر محصول الزامی است" })
            setSubmitting(false)
            return
        }

        try {
            const payload = new FormData()
            newImageFiles.forEach(file => payload.append("newImages", file))
            payload.append("existingImages", JSON.stringify(existingImages))
            Object.entries(values).forEach(([key, val]) => payload.append(key, val))

            const res = await fetch(`/api/products/${product._id}`, {
                method: "PUT",
                body: payload,
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.error || "خطا در ویرایش محصول")
            }

            Swal.fire({
                icon: "success",
                title: "موفقیت‌آمیز",
                text: "محصول با موفقیت ویرایش شد",
                timer: 1500,
                showConfirmButton: false,
            })

            onSaved(data.data)
            onClose()
        } catch (error) {
            console.error(error)
            Swal.fire({ icon: "error", title: "خطا", text: "مشکلی در ویرایش محصول پیش آمد" })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4 py-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        <PiPackageLight className="w-5 h-5 text-primary-500" />
                        ویرایش محصول
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='flex flex-col lg:flex-row gap-6'>
                                {/* Image Uploader */}
                                <div className='w-full lg:w-56 shrink-0'>
                                    <label className='block mb-2 text-xs text-zinc-500'>تصاویر محصول</label>
                                    <div className='grid grid-cols-3 lg:grid-cols-2 gap-2'>
                                        {existingImages.map((src, index) => (
                                            <div key={`existing-${index}`} className='relative aspect-square rounded-xl overflow-hidden border border-gray-200'>
                                                <img src={src} className='w-full h-full object-cover' alt={`تصویر ${index + 1}`} />
                                                <button
                                                    onClick={() => removeExistingImage(index)}
                                                    type='button'
                                                    className='absolute top-1 left-1 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer'>
                                                    <PiXCircleFill className='w-5 h-5' />
                                                </button>
                                            </div>
                                        ))}

                                        {newImagePreviews.map((src, index) => (
                                            <div key={`new-${index}`} className='relative aspect-square rounded-xl overflow-hidden border-2 border-primary-300'>
                                                <img src={src} className='w-full h-full object-cover' alt={`تصویر جدید ${index + 1}`} />
                                                <button
                                                    onClick={() => removeNewImage(index)}
                                                    type='button'
                                                    className='absolute top-1 left-1 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer'>
                                                    <PiXCircleFill className='w-5 h-5' />
                                                </button>
                                            </div>
                                        ))}

                                        <label className='flex flex-col items-center justify-center gap-1 aspect-square border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl cursor-pointer text-zinc-400 hover:text-primary-500 transition-colors'>
                                            <PiImageLight className='w-7 h-7' />
                                            <span className='text-[10px]'>افزودن عکس</span>
                                            <input
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                type='file'
                                                accept='image/*'
                                                multiple
                                                className='hidden'
                                            />
                                        </label>
                                    </div>
                                    <p className='mt-1.5 text-[11px] text-zinc-400'>اولین عکس، تصویر اصلی محصول در نظر گرفته می‌شود.</p>
                                </div>

                                {/* Fields */}
                                <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>نام محصول *</label>
                                        <Field
                                            name="name"
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                        <ErrorMessage name="name" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>نام لینک *</label>
                                        <Field
                                            name="linkName"
                                            dir='ltr'
                                            className='w-full px-3.5 py-2.5 text-sm text-left border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                        <ErrorMessage name="linkName" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>قیمت (تومان) *</label>
                                        <Field name="price">
                                            {({ field, form }: any) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                                    value={field.value ? Number(field.value.toString().replace(/\D/g, '')).toLocaleString('en-US') : ''}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                        form.setFieldValue('price', rawValue);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="price" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>درصد تخفیف (اختیاری)</label>
                                        <Field
                                            name="discount"
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                        <ErrorMessage name="discount" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>قیمت قبل از تخفیف (اختیاری)</label>
                                        <Field name="exPrice">
                                            {({ field, form }: any) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                                    value={field.value ? Number(field.value.toString().replace(/\D/g, '')).toLocaleString('en-US') : ''}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                        form.setFieldValue('exPrice', rawValue);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="exPrice" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                            <PiStackLight className='w-3.5 h-3.5' />
                                            موجودی انبار *
                                        </label>
                                        <Field
                                            name="stock"
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                        <ErrorMessage name="stock" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                            <PiTagLight className='w-3.5 h-3.5' />
                                            دسته‌بندی *
                                        </label>
                                        <Field
                                            as="select"
                                            name="category"
                                            className='w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        >
                                            <option value="">انتخاب کنید</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="category" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                            <PiTagLight className='w-3.5 h-3.5' />
                                            زیر مجموعه *
                                        </label>
                                        <Field
                                            as="select"
                                            name="subCategory"
                                            className='w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        >
                                            <option value="">انتخاب کنید</option>
                                            {subCategories.map(subCat => (
                                                <option key={subCat} value={subCat}>{subCat}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="subCategory" component="span" className="text-red-500 text-[11px] mt-1 block" />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>رنگ‌ها (اختیاری)</label>
                                        <Field
                                            name="colors"
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                    </div>

                                    <div>
                                        <label className='block mb-1.5 text-xs text-zinc-500'>تگ‌ها (با کاما جدا کنید)</label>
                                        <Field
                                            name="tags"
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                        />
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <label className='flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500'>
                                            <PiTextAlignRightLight className='w-3.5 h-3.5' />
                                            توضیحات (اختیاری)
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            rows={5}
                                            className='w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors resize-none'
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex items-center justify-end gap-3 mt-7 pt-5 border-t border-gray-100'>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className='px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer'>
                                    انصراف
                                </button>
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='flex-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                                    <PiFloppyDiskLight className='w-4 h-4' />
                                    {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
