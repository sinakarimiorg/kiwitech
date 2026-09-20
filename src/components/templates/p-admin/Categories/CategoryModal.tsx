"use client"

import { useState } from 'react'
import { PiXBold } from 'react-icons/pi'
import { categoryIconOptions } from './categoryIcons'
import type { AdminCategory } from '@root/src/types/adminCategoryType'

type CategoryModalProps = {
    initialData: AdminCategory | null
    onClose: () => void
    onSave: (data: { title: string; icon: string; active: boolean }) => void
    isSaving?: boolean
}

export default function CategoryModal({ initialData, onClose, onSave, isSaving }: CategoryModalProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [icon, setIcon] = useState<string>(initialData?.icon ?? categoryIconOptions[0].key)
    const [active, setActive] = useState(initialData?.active ?? true)
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('عنوان دسته اصلی الزامی است.')
            return
        }
        onSave({ title: title.trim(), icon, active })
    }

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        {initialData ? 'ویرایش دسته اصلی' : 'افزودن دسته اصلی جدید'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">عنوان دسته</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="مثال: لوازم جانبی موبایل"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">آیکون</label>
                        <div className="grid grid-cols-4 gap-2">
                            {categoryIconOptions.map(opt => {
                                const Icon = opt.icon
                                const isActive = icon === opt.key
                                return (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => setIcon(opt.key)}
                                        className={`flex-center flex-col gap-1.5 py-3 rounded-xl border transition-colors cursor-pointer
                                            ${isActive ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-zinc-500 hover:border-primary-300'}`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="text-[11px]">{opt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-xs text-zinc-500">وضعیت</span>
                        <button
                            type="button"
                            onClick={() => setActive(!active)}
                            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0
                                ${active ? "bg-primary-500" : "bg-gray-300"}`}>
                            <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all
                                ${active ? "right-0.5" : "right-4.5"}`} />
                        </button>
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="  flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'افزودن دسته'}
                    </button>
                    <button
                        onClick={onClose}
                        className="  flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
