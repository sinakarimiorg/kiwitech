"use client"

import { useState } from 'react'
import { PiXBold } from 'react-icons/pi'
import type { Discount, DiscountType, DiscountStatus } from './DiscountsManager'

type DiscountModalProps = {
    initialData: Discount | null
    onClose: () => void
    onSave: (data: Omit<Discount, 'id' | 'usedCount'>) => void
}

export default function DiscountModal({ initialData, onClose, onSave }: DiscountModalProps) {
    const [code, setCode] = useState(initialData?.code ?? '')
    const [type, setType] = useState<DiscountType>(initialData?.type ?? 'percent')
    const [value, setValue] = useState(initialData ? String(initialData.value) : '')
    const [minOrderAmount, setMinOrderAmount] = useState(initialData ? String(initialData.minOrderAmount) : '0')
    const [usageLimit, setUsageLimit] = useState(initialData ? String(initialData.usageLimit) : '')
    const [expiresAt, setExpiresAt] = useState(initialData?.expiresAt ?? '')
    const [status, setStatus] = useState<DiscountStatus>(initialData?.status ?? 'active')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!code.trim() || !value || !usageLimit || !expiresAt) {
            setError('لطفاً همه‌ی فیلدهای ضروری را پر کنید.')
            return
        }
        onSave({
            code: code.trim().toUpperCase(),
            type,
            value: Number(value),
            minOrderAmount: Number(minOrderAmount) || 0,
            usageLimit: Number(usageLimit),
            expiresAt,
            status,
        })
    }

    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        {initialData ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block mb-1.5 text-xs text-zinc-500">کد تخفیف</label>
                        <input
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="مثال: SUMMER40"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors ltr-dir"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">نوع تخفیف</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as DiscountType)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            <option value="percent">درصدی</option>
                            <option value="fixed">مبلغ ثابت (تومان)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">
                            مقدار تخفیف {type === 'percent' ? '(٪)' : '(تومان)'}
                        </label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            type="number"
                            placeholder={type === 'percent' ? 'مثال: 20' : 'مثال: 50000'}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">حداقل مبلغ خرید (تومان)</label>
                        <input
                            value={minOrderAmount}
                            onChange={e => setMinOrderAmount(e.target.value)}
                            type="number"
                            placeholder="۰ برای بدون محدودیت"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">سقف تعداد استفاده</label>
                        <input
                            value={usageLimit}
                            onChange={e => setUsageLimit(e.target.value)}
                            type="number"
                            placeholder="مثال: 100"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">تاریخ انقضا</label>
                        <input
                            value={expiresAt}
                            onChange={e => setExpiresAt(e.target.value)}
                            placeholder="۱۴۰۴/۰۶/۱۵"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">وضعیت</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as DiscountStatus)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            <option value="active">فعال</option>
                            <option value="disabled">غیرفعال</option>
                            <option value="expired">منقضی شده</option>
                        </select>
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex-center h-11 text-sm text-text linear_btn"
                    >
                        {initialData ? 'ذخیره تغییرات' : 'افزودن کد تخفیف'}
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