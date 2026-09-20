"use client"

import { useState, useTransition } from 'react'
import {
    PiImagesLight,
    PiCheckCircleLight,
    PiEyeSlashLight,
    PiStackLight,
    PiPlusCircleLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiArrowUpLight,
    PiArrowDownLight,
} from 'react-icons/pi'
import Swal from 'sweetalert2'

import StatCard from '@root/src/components/templates/P-admin/Index/StatCard'
import BannerModal from './BannerModal'
import type { AdminBanner, BannerPosition } from '@root/src/types/adminBannerType'
import {
    addBannerAction,
    updateBannerAction,
    deleteBannerAction,
    toggleBannerStatusAction,
    moveBannerAction,
} from './actions'

const positionMeta: Record<BannerPosition, string> = {
    landing: 'اسلایدر اصلی (Landing)',
    amazingOffers: 'تخفیفات شگفت‌انگیز',
    categoriesByPhone: 'دسته‌بندی بر اساس گوشی',
}

type BannersManagerProps = {
    initialBanners: AdminBanner[]
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
    const [filterPosition, setFilterPosition] = useState<BannerPosition | 'all'>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null)
    const [isPending, startTransition] = useTransition()

    const activeCount = initialBanners.filter(b => b.status === 'active').length
    const disabledCount = initialBanners.filter(b => b.status === 'disabled').length
    const positionsCount = new Set(initialBanners.map(b => b.position)).size

    const filteredBanners = (filterPosition === 'all'
        ? initialBanners
        : initialBanners.filter(b => b.position === filterPosition)
    ).sort((a, b) => a.position.localeCompare(b.position) || a.order - b.order)

    const openAddModal = () => {
        setEditingBanner(null)
        setIsModalOpen(true)
    }

    const openEditModal = (banner: AdminBanner) => {
        setEditingBanner(banner)
        setIsModalOpen(true)
    }

    const removeBanner = async (id: string) => {
        const result = await Swal.fire({
            title: 'حذف بنر',
            text: 'آیا از حذف این بنر مطمئن هستید؟ این عملیات قابل بازگشت نیست.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#EF4444',
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteBannerAction(id)
            if (res.success) {
                Swal.fire({ icon: 'success', title: 'حذف شد', text: 'بنر با موفقیت حذف شد', timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error || 'مشکلی در حذف بنر پیش آمد' })
            }
        })
    }

    const toggleStatus = (id: string, currentStatus: AdminBanner['status']) => {
        startTransition(async () => {
            const res = await toggleBannerStatusAction(id, currentStatus === 'active' ? 'disabled' : 'active')
            if (!res.success) {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error })
            }
        })
    }

    const moveBanner = (id: string, direction: 'up' | 'down') => {
        startTransition(async () => {
            const res = await moveBannerAction(id, direction)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error })
            }
        })
    }

    const saveBanner = (formData: FormData) => {
        startTransition(async () => {
            const res = editingBanner
                ? await updateBannerAction(editingBanner._id, formData)
                : await addBannerAction(formData)

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'موفقیت‌آمیز',
                    text: editingBanner ? 'بنر با موفقیت ویرایش شد' : 'بنر با موفقیت افزوده شد',
                    timer: 1500,
                    showConfirmButton: false,
                })
                setIsModalOpen(false)
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error || 'مشکلی در ذخیره بنر پیش آمد' })
            }
        })
    }

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="font-IranYekanBold text-xl sm:text-2xl text-zinc-800">بنرها و اسلایدر</h1>
                <button
                    onClick={openAddModal}
                    className="flex-center gap-2 px-4 sm:px-5 py-2.5 text-sm text-text linear_btn"
                >
                    <PiPlusCircleLight className="w-5 h-5" />
                    بنر جدید
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <StatCard label="بنرهای فعال" value={activeCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" />
                <StatCard label="بنرهای غیرفعال" value={disabledCount.toLocaleString('fa-IR')} icon={PiEyeSlashLight} accent="danger" />
                <StatCard label="مجموع بنرها" value={initialBanners.length.toLocaleString('fa-IR')} icon={PiImagesLight} accent="neon" />
                <StatCard label="موقعیت‌های فعال" value={positionsCount.toLocaleString('fa-IR')} icon={PiStackLight} accent="primary" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap overflow-x-auto scrollbar-none">
                <button
                    onClick={() => setFilterPosition('all')}
                    className={`px-4 py-2 text-xs sm:text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap
                        ${filterPosition === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-zinc-500 hover:bg-primary-50 shadow-sm'}`}
                >
                    همه
                </button>
                {(Object.keys(positionMeta) as BannerPosition[]).map(pos => (
                    <button
                        key={pos}
                        onClick={() => setFilterPosition(pos)}
                        className={`px-4 py-2 text-xs sm:text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap
                            ${filterPosition === pos ? 'bg-primary-600 text-white' : 'bg-white text-zinc-500 hover:bg-primary-50 shadow-sm'}`}
                    >
                        {positionMeta[pos]}
                    </button>
                ))}
            </div>

            {/* Banners Grid */}
            {filteredBanners.length === 0 ? (
                <div className="bg-white shadow-lg rounded-2xl py-16 text-center text-sm text-zinc-400">
                    بنری در این موقعیت یافت نشد.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredBanners.map(banner => {
                        const statusMeta = banner.status === 'active'
                            ? { label: 'فعال', classes: 'bg-primary-50 text-primary-600' }
                            : { label: 'غیرفعال', classes: 'bg-gray-100 text-zinc-500' }

                        return (
                            <div key={banner._id} className="bg-white shadow-lg rounded-2xl overflow-hidden">

                                <div className="relative h-36 bg-gray-100">
                                    <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 text-xs rounded-lg ${statusMeta.classes}`}>
                                        {statusMeta.label}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs text-primary-600 font-IranYekanMedium mb-1">{positionMeta[banner.position]}</p>
                                    <h3 className="font-IranYekanBold text-sm text-zinc-800 line-clamp-1">{banner.title}</h3>
                                    <p className="mt-1 text-xs text-zinc-400 ltr-dir line-clamp-1">{banner.linkUrl}</p>

                                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => moveBanner(banner._id, 'up')}
                                                disabled={isPending}
                                                className="flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <PiArrowUpLight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveBanner(banner._id, 'down')}
                                                disabled={isPending}
                                                className="flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <PiArrowDownLight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => toggleStatus(banner._id, banner.status)}
                                                disabled={isPending}
                                                className="flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                                title={banner.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
                                            >
                                                {banner.status === 'active' ? <PiEyeSlashLight className="w-4 h-4" /> : <PiCheckCircleLight className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(banner)}
                                                className="flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <PiPencilSimpleLight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeBanner(banner._id)}
                                                className="flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <PiTrashLight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {isModalOpen && (
                <BannerModal
                    initialData={editingBanner}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveBanner}
                    isSaving={isPending}
                />
            )}
        </div>
    )
}