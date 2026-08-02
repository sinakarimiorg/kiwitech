"use client"

import { useState } from 'react'
import {
    PiTicketLight,
    PiPercentLight,
    PiCheckCircleLight,
    PiHourglassMediumLight,
    PiPlusCircleLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiMagnifyingGlassLight,
} from 'react-icons/pi'

import StatCard from '@root/src/components/templates/P-admin/Index/StatCard'
import DiscountModal from './DiscountModal'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'

export type DiscountType = 'percent' | 'fixed'
export type DiscountStatus = 'active' | 'disabled' | 'expired'

export type Discount = {
    id: number
    code: string
    type: DiscountType
    value: number
    minOrderAmount: number
    usageLimit: number
    usedCount: number
    expiresAt: string
    status: DiscountStatus
}

const seedDiscounts: Discount[] = [
    { id: 1, code: 'SUMMER40', type: 'percent', value: 40, minOrderAmount: 500000, usageLimit: 200, usedCount: 184, expiresAt: '۱۴۰۴/۰۶/۱۵', status: 'active' },
    { id: 2, code: 'WELCOME10', type: 'percent', value: 10, minOrderAmount: 0, usageLimit: 1000, usedCount: 312, expiresAt: '۱۴۰۴/۰۹/۰۱', status: 'active' },
    { id: 3, code: 'FREESHIP', type: 'fixed', value: 45000, minOrderAmount: 300000, usageLimit: 150, usedCount: 150, expiresAt: '۱۴۰۴/۰۴/۲۰', status: 'expired' },
    { id: 4, code: 'VIP100K', type: 'fixed', value: 100000, minOrderAmount: 1000000, usageLimit: 50, usedCount: 12, expiresAt: '۱۴۰۴/۰۷/۱۰', status: 'active' },
    { id: 5, code: 'TEST20', type: 'percent', value: 20, minOrderAmount: 0, usageLimit: 100, usedCount: 3, expiresAt: '۱۴۰۴/۰۵/۰۱', status: 'disabled' },
]

const statusMeta: Record<DiscountStatus, { label: string; classes: string }> = {
    active: { label: 'فعال', classes: 'bg-primary-50 text-primary-600' },
    disabled: { label: 'غیرفعال', classes: 'bg-gray-100 text-zinc-500' },
    expired: { label: 'منقضی شده', classes: 'bg-danger/10 text-danger' },
}

export default function DiscountsManager() {
    const [discounts, setDiscounts] = useState<Discount[]>(seedDiscounts)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)

    const activeCount = discounts.filter(d => d.status === 'active').length
    const totalUsed = discounts.reduce((sum, d) => sum + d.usedCount, 0)
    const almostFinished = discounts.filter(d => d.status === 'active' && d.usageLimit - d.usedCount <= 20).length
    const expiredCount = discounts.filter(d => d.status === 'expired').length

    const filteredDiscounts = discounts.filter(d =>
        d.code.toLowerCase().includes(search.toLowerCase())
    )

    const openAddModal = () => {
        setEditingDiscount(null)
        setIsModalOpen(true)
    }

    const openEditModal = (discount: Discount) => {
        setEditingDiscount(discount)
        setIsModalOpen(true)
    }

    const removeDiscount = (id: number) => {
        setDiscounts(prev => prev.filter(d => d.id !== id))
    }

    const saveDiscount = (data: Omit<Discount, 'id' | 'usedCount'>) => {
        if (editingDiscount) {
            setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? { ...d, ...data } : d))
        } else {
            setDiscounts(prev => [
                { ...data, id: Date.now(), usedCount: 0 },
                ...prev,
            ])
        }
        setIsModalOpen(false)
    }

    return (
        <div className="p-5 sm:p-6 flex flex-col gap-6">

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="font-IranYekanBold text-xl sm:text-2xl text-zinc-800">کدهای تخفیف</h1>
                <button
                    onClick={openAddModal}
                    className="flex-center gap-2 px-4 sm:px-5 py-2.5 text-sm text-text linear_btn"
                >
                    <PiPlusCircleLight className="w-5 h-5" />
                    کد تخفیف جدید
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard label="کدهای فعال" value={activeCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" />
                <StatCard label="مجموع استفاده‌ها" value={totalUsed.toLocaleString('fa-IR')} icon={PiTicketLight} accent="neon" />
                <StatCard label="نزدیک به اتمام سقف" value={almostFinished.toLocaleString('fa-IR')} icon={PiHourglassMediumLight} accent="danger" />
                <StatCard label="کدهای منقضی شده" value={expiredCount.toLocaleString('fa-IR')} icon={PiPercentLight} accent="primary" />
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

                {/* Search */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">لیست کدهای تخفیف</h2>
                    <div className="flex items-center gap-2 px-3.5 py-2 w-52 sm:w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors">
                        <PiMagnifyingGlassLight className="w-4 h-4 shrink-0" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="جستجوی کد تخفیف..."
                            className="w-full bg-transparent outline-none placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {filteredDiscounts.length === 0 ? (
                    <div className="py-16 text-center text-sm text-zinc-400">کد تخفیفی یافت نشد.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-right text-xs text-zinc-400 border-b border-gray-100">
                                    <th className="font-IranYekanMedium px-5 sm:px-6 py-3">کد تخفیف</th>
                                    <th className="font-IranYekanMedium px-3 py-3">نوع و مقدار</th>
                                    <th className="font-IranYekanMedium px-3 py-3">حداقل خرید</th>
                                    <th className="font-IranYekanMedium px-3 py-3">میزان استفاده</th>
                                    <th className="font-IranYekanMedium px-3 py-3">تاریخ انقضا</th>
                                    <th className="font-IranYekanMedium px-3 py-3">وضعیت</th>
                                    <th className="font-IranYekanMedium px-3 py-3">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDiscounts.map(discount => (
                                    <tr key={discount.id} className="hover:bg-primary-50/30 transition-colors">
                                        <td className="px-5 sm:px-6 py-3.5">
                                            <span className="inline-flex px-2.5 py-1 font-IranYekanBold text-xs tracking-wider text-primary-700 bg-primary-50 rounded-lg">
                                                {discount.code}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3.5 text-zinc-700">
                                            {discount.type === 'percent'
                                                ? `${discount.value.toLocaleString('fa-IR')}٪`
                                                : (
                                                    <span className="inline-flex items-center gap-1">
                                                        {discount.value.toLocaleString()}
                                                        <TomanIcon className="w-3 h-3" />
                                                    </span>
                                                )}
                                        </td>
                                        <td className="px-3 py-3.5 text-zinc-500">
                                            {discount.minOrderAmount > 0
                                                ? <span className="inline-flex items-center gap-1">{discount.minOrderAmount.toLocaleString()}<TomanIcon className="w-3 h-3" /></span>
                                                : 'ندارد'}
                                        </td>
                                        <td className="px-3 py-3.5 text-zinc-600">
                                            {discount.usedCount.toLocaleString('fa-IR')} از {discount.usageLimit.toLocaleString('fa-IR')}
                                        </td>
                                        <td className="px-3 py-3.5 text-zinc-400">{discount.expiresAt}</td>
                                        <td className="px-3 py-3.5">
                                            <span className={`px-2.5 py-1 text-xs rounded-lg ${statusMeta[discount.status].classes}`}>
                                                {statusMeta[discount.status].label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(discount)}
                                                    className="flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <PiPencilSimpleLight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeDiscount(discount.id)}
                                                    className="flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <PiTrashLight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <DiscountModal
                    initialData={editingDiscount}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveDiscount}
                />
            )}
        </div>
    )
}