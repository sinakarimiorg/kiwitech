"use client"

import { useState } from 'react'
import { PiXBold } from 'react-icons/pi'
import type { UserType, UserRole, UserStatus } from '@root/src/types/UserType'

type UserModalProps = {
    initialData: UserType | null
    onClose: () => void
    onSave: (data: { name: string; phone: string; email?: string; status: UserStatus; role?: UserRole }) => void
    isSaving?: boolean
    isEdit: UserType | null
}

export default function UserModal({ initialData, onClose, onSave, isSaving, isEdit }: UserModalProps) {
    const [name, setName] = useState(initialData?.name ?? '')
    const [phone, setPhone] = useState(initialData?.phone ?? '')
    const [email, setEmail] = useState(initialData?.email ?? '')
    const [status, setStatus] = useState<UserStatus>(initialData?.status ?? 'فعال')
    const [role, setRole] = useState<UserRole>(initialData?.role ?? 'کاربر')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!name.trim() || !phone.trim()) {
            setError('نام و شماره موبایل الزامی است.')
            return
        }
        onSave({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined, status, role })
    }

    return (
        <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        {initialData ? 'ویرایش مشتری' : 'افزودن مشتری جدید'}
                    </h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">نام و نام خانوادگی</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="مثال: سینا کریمی"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">شماره موبایل</label>
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            dir="ltr"
                            className="w-full px-3.5 py-2.5 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">ایمیل (اختیاری)</label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            dir="ltr"
                            className="w-full px-3.5 py-2.5 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        />
                    </div>
                    {
                        isEdit
                        &&
                        <div>
                            <label className="block mb-1.5 text-xs text-zinc-500">وضعیت</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value as UserRole)}
                                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                            >
                                <option value="کاربر">کاربر</option>
                                <option value="ادمین">ادمین</option>
                            </select>
                        </div>
                    }
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">وضعیت</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as UserStatus)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                        >
                            <option value="فعال">فعال</option>
                            <option value="مسدود">مسدود</option>
                        </select>
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="md:flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'افزودن مشتری'}
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
