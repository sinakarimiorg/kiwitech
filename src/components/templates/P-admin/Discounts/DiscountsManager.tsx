"use client"

import { useState, useTransition } from 'react'
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
import { AdminDiscount, DiscountStatus } from '@root/src/types/adminDiscountType'
import Swal from 'sweetalert2'
import { addDiscountAction, deleteDiscountAction, updateDiscountAction } from './actions'


const statusMeta: Record<DiscountStatus, { label: string; classes: string }> = {
    active: { label: 'فعال', classes: 'bg-primary-50 text-primary-600' },
    disabled: { label: 'غیرفعال', classes: 'bg-gray-100 text-zinc-500' },
    expired: { label: 'منقضی شده', classes: 'bg-danger/10 text-danger' },
}

type DiscountsManagerProps = {
    initialDiscounts: AdminDiscount[]
}

export default function DiscountsManager({ initialDiscounts }: DiscountsManagerProps) {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDiscount, setEditingDiscount] = useState<AdminDiscount | null>(null)
    const [isPending, startTransition] = useTransition()

    const activeCount = initialDiscounts.filter(d => d.status === 'active').length
    const totalUsed = initialDiscounts.reduce((sum, d) => sum + d.usedCount, 0)
    const almostFinished = initialDiscounts.filter(d => d.status === 'active' && d.usageLimit - d.usedCount <= 20).length
    const expiredCount = initialDiscounts.filter(d => d.status === 'expired').length

    const filteredDiscounts = initialDiscounts.filter(d =>
        d.code.toLowerCase().includes(search.toLowerCase())
    )

    const openAddModal = () => {
        setEditingDiscount(null)
        setIsModalOpen(true)
    }

    const openEditModal = (discount: AdminDiscount) => {
        setEditingDiscount(discount)
        setIsModalOpen(true)
    }

    const removeDiscount = async (id: string) => {
        const result = await Swal.fire({
            title: 'حذف کد تخفیف',
            text: 'آیا از حذف این کد تخفیف مطمئن هستید؟ این عملیات قابل بازگشت نیست.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#EF4444',
        })

        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteDiscountAction(id)
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'حذف شد',
                    text: 'کد تخفیف با موفقیت حذف شد',
                    timer: 1500,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error || 'مشکلی در حذف کد تخفیف پیش آمد' })
            }
        })
    }

    const saveDiscount = (data: Omit<AdminDiscount, '_id' | 'usedCount'>) => {
        startTransition(async () => {
            const res = editingDiscount
                ? await updateDiscountAction(editingDiscount._id, data)
                : await addDiscountAction(data)


            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'موفقیت‌آمیز',
                    text: editingDiscount ? 'کد تخفیف با موفقیت ویرایش شد' : 'کد تخفیف با موفقیت ثبت شد',
                    timer: 1500,
                    showConfirmButton: false,
                })
                setIsModalOpen(false)
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error || 'مشکلی در ذخیره کد تخفیف پیش آمد' })
            }
        })

    }

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <StatCard label="کدهای فعال" value={activeCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" />
                <StatCard label="مجموع استفاده‌ها" value={totalUsed.toLocaleString('fa-IR')} icon={PiTicketLight} accent="neon" />
                <StatCard label="نزدیک به اتمام سقف" value={almostFinished.toLocaleString('fa-IR')} icon={PiHourglassMediumLight} accent="danger" />
                <StatCard label="کدهای منقضی شده" value={expiredCount.toLocaleString('fa-IR')} icon={PiPercentLight} accent="primary" />
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

                {/* Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">لیست کدهای تخفیف</h2>
                    <div className="flex items-center gap-2 px-3.5 py-2 w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors">
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
                    <>
                        {/* Table - md+ */}
                        <div className="hidden md:block overflow-x-auto">
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
                                        <tr key={discount._id} className="hover:bg-primary-50/30 transition-colors">
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
                                                        onClick={() => removeDiscount(discount._id)}
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

                        {/* Cards - below md */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {filteredDiscounts.map(discount => (
                                <div key={discount._id} className="flex flex-col gap-2.5 px-4 py-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex px-2.5 py-1 font-IranYekanBold text-xs tracking-wider text-primary-700 bg-primary-50 rounded-lg">
                                            {discount.code}
                                        </span>
                                        <span className={`px-2.5 py-1 text-xs rounded-lg ${statusMeta[discount.status].classes}`}>
                                            {statusMeta[discount.status].label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                                        <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg">
                                            <span>مقدار</span>
                                            <span className="text-zinc-700">
                                                {discount.type === 'percent' ? `${discount.value.toLocaleString('fa-IR')}٪` : `${discount.value.toLocaleString()} ت`}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg">
                                            <span>استفاده</span>
                                            <span className="text-zinc-700">{discount.usedCount.toLocaleString('fa-IR')}/{discount.usageLimit.toLocaleString('fa-IR')}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg">
                                            <span>حداقل خرید</span>
                                            <span className="text-zinc-700">{discount.minOrderAmount > 0 ? `${discount.minOrderAmount.toLocaleString()} ت` : 'ندارد'}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg">
                                            <span>انقضا</span>
                                            <span className="text-zinc-700">{discount.expiresAt}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(discount)}
                                            className="flex-center gap-1.5 flex-1 py-1.5 text-xs text-primary-600 bg-primary-50 rounded-lg cursor-pointer">
                                            <PiPencilSimpleLight className="w-3.5 h-3.5" />
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => removeDiscount(discount._id)}
                                            className="flex-center gap-1.5 flex-1 py-1.5 text-xs text-danger bg-danger/10 rounded-lg cursor-pointer">
                                            <PiTrashLight className="w-3.5 h-3.5" />
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {isModalOpen && (
                <DiscountModal
                    initialData={editingDiscount}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveDiscount}
                    isSaving={isPending}
                />
            )}
        </div>
    )
}