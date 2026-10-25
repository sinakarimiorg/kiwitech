"use client"

import { useState } from 'react'
import { PiXBold } from 'react-icons/pi'

type CategoryItemModalProps = {
    initialTitle?: string
    onClose: () => void
    onSave: (title: string) => void
    isSaving?: boolean
}

export default function CategoryItemModal({ initialTitle, onClose, onSave, isSaving }: CategoryItemModalProps) {
    const [title, setTitle] = useState(initialTitle ?? '')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('عنوان زیرمجموعه الزامی است.')
            return
        }
        onSave(title.trim())
    }

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 sm:p-6">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base text-zinc-800">
                        {initialTitle !== undefined ? 'ویرایش زیرمجموعه' : 'افزودن زیرمجموعه'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <label className="block mb-1.5 text-xs text-zinc-500">عنوان زیرمجموعه</label>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="مثال: قاب و کاور گوشی"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                />

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="md:flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        onClick={onClose}
                        className="md:flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
