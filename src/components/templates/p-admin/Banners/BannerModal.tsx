"use client"

import { useState } from 'react'
import { PiXBold, PiUploadSimpleLight } from 'react-icons/pi'
import type { Banner, BannerPosition, BannerStatus } from './BannersManager'

type BannerModalProps = {
    initialData: Banner | null
    onClose: () => void
    onSave: (data: Omit<Banner, 'id'>) => void
}

const positionOptions: { value: BannerPosition; label: string }[] = [
    { value: 'landing', label: 'اسلایدر اصلی (Landing)' },
    { value: 'amazingOffers', label: 'تخفیفات شگفت‌انگیز' },
    { value: 'categoriesByPhone', label: 'دسته‌بندی بر اساس گوشی' },
]

export default function BannerModal({ initialData, onClose, onSave }: BannerModalProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [position, setPosition] = useState<BannerPosition>(initialData?.position ?? 'landing')
    const [image, setImage] = useState(initialData?.image ?? '')
    const [imagePreview, setImagePreview] = useState(initialData?.image ?? '')
    const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl ?? '')
    const [status, setStatus] = useState<BannerStatus>(initialData?.status ?? 'active')
    const [error, setError] = useState('')

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setImagePreview(url)
        setImage(url) // در پروژه‌ی واقعی: آپلود فایل به سرور و ذخیره‌ی مسیر برگشتی
    }

    const handleSubmit = () => {
        if (!title.trim() || !image) {
            setError('لطفاً عنوان و تصویر بنر را مشخص کنید.')
            return
        }
        onSave({
            title: title.trim(),
            position,
            image,
            linkUrl: linkUrl.trim() || '#',
            order: initialData?.order ?? 1,
            status,
        })
    }

    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        {initialData ? 'ویرایش بنر' : 'افزودن بنر جدید'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">تصویر بنر</label>
                        <label className="flex-center flex-col gap-2 h-36 border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl cursor-pointer transition-colors overflow-hidden relative">
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" alt="پیش‌نمایش بنر" />
                            ) : (
                                <>
                                    <PiUploadSimpleLight className="w-6 h-6 text-zinc-400" />
                                    <span className="text-xs text-zinc-400">آپلود تصویر بنر</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">عنوان بنر</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="مثال: پرفروش‌ترین ساعت‌های هوشمند"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">موقعیت نمایش</label>
                        <select
                            value={position}
                            onChange={e => setPosition(e.target.value as BannerPosition)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            {positionOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">لینک مقصد</label>
                        <input
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            placeholder="/products/1"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors ltr-dir"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">وضعیت</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as BannerStatus)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            <option value="active">فعال</option>
                            <option value="disabled">غیرفعال</option>
                        </select>
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex-center h-11 text-sm text-text linear_btn"
                    >
                        {initialData ? 'ذخیره تغییرات' : 'افزودن بنر'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}