"use client"

import { useState } from 'react'
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

import StatCard from '@root/src/components/templates/P-admin/Index/StatCard'
import BannerModal from './BannerModal'

export type BannerPosition = 'landing' | 'amazingOffers' | 'categoriesByPhone'
export type BannerStatus = 'active' | 'disabled'

export type Banner = {
    id: number
    title: string
    position: BannerPosition
    image: string
    linkUrl: string
    order: number
    status: BannerStatus
}

const positionMeta: Record<BannerPosition, string> = {
    landing: 'اسلایدر اصلی (Landing)',
    amazingOffers: 'تخفیفات شگفت‌انگیز',
    categoriesByPhone: 'دسته‌بندی بر اساس گوشی',
}

const seedBanners: Banner[] = [
    { id: 1, title: 'پرفروش‌ترین ساعت‌های هوشمند', position: 'landing', image: '/images/banners/banner-smart watch.png', linkUrl: '/products/1', order: 1, status: 'active' },
    { id: 2, title: 'حلقه هوشمند سلامتی', position: 'landing', image: '/images/banners/banner-smartRing.png', linkUrl: '/products/2', order: 2, status: 'active' },
    { id: 3, title: 'هندزفری‌های پرطرفدار', position: 'landing', image: '/images/banners/banner-headphones.png', linkUrl: '/products/3', order: 3, status: 'active' },
    { id: 4, title: 'اسپیکرهای اقتصادی', position: 'landing', image: '/images/banners/banner-speaker.jpg', linkUrl: '/products/4', order: 4, status: 'disabled' },
    { id: 5, title: 'بنر تخفیف ویژه پاوربانک', position: 'amazingOffers', image: '/images/banners/services-banner3.jpg', linkUrl: '/products/5', order: 1, status: 'active' },
]

const statusMeta: Record<BannerStatus, { label: string; classes: string }> = {
    active: { label: 'فعال', classes: 'bg-primary-50 text-primary-600' },
    disabled: { label: 'غیرفعال', classes: 'bg-gray-100 text-zinc-500' },
}

export default function BannersManager() {
    const [banners, setBanners] = useState<Banner[]>(seedBanners)
    const [filterPosition, setFilterPosition] = useState<BannerPosition | 'all'>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

    const activeCount = banners.filter(b => b.status === 'active').length
    const disabledCount = banners.filter(b => b.status === 'disabled').length
    const positionsCount = new Set(banners.map(b => b.position)).size

    const filteredBanners = (filterPosition === 'all'
        ? banners
        : banners.filter(b => b.position === filterPosition)
    ).sort((a, b) => a.position.localeCompare(b.position) || a.order - b.order)

    const openAddModal = () => {
        setEditingBanner(null)
        setIsModalOpen(true)
    }

    const openEditModal = (banner: Banner) => {
        setEditingBanner(banner)
        setIsModalOpen(true)
    }

    const removeBanner = (id: number) => {
        setBanners(prev => prev.filter(b => b.id !== id))
    }

    const toggleStatus = (id: number) => {
        setBanners(prev => prev.map(b =>
            b.id === id ? { ...b, status: b.status === 'active' ? 'disabled' : 'active' } : b
        ))
    }

    const moveBanner = (id: number, direction: 'up' | 'down') => {
        setBanners(prev => {
            const target = prev.find(b => b.id === id)
            if (!target) return prev

            const siblings = prev.filter(b => b.position === target.position).sort((a, b) => a.order - b.order)
            const index = siblings.findIndex(b => b.id === id)
            const swapWith = direction === 'up' ? siblings[index - 1] : siblings[index + 1]
            if (!swapWith) return prev

            return prev.map(b => {
                if (b.id === target.id) return { ...b, order: swapWith.order }
                if (b.id === swapWith.id) return { ...b, order: target.order }
                return b
            })
        })
    }

    const saveBanner = (data: Omit<Banner, 'id'>) => {
        if (editingBanner) {
            setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...data } : b))
        } else {
            const siblingsCount = banners.filter(b => b.position === data.position).length
            setBanners(prev => [
                { ...data, id: Date.now(), order: siblingsCount + 1 },
                ...prev,
            ])
        }
        setIsModalOpen(false)
    }

    return (
        <div className="p-5 sm:p-6 flex flex-col gap-6">

            {/* Page Header */}
            <div className="flex items-center justify-between">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard label="بنرهای فعال" value={activeCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" />
                <StatCard label="بنرهای غیرفعال" value={disabledCount.toLocaleString('fa-IR')} icon={PiEyeSlashLight} accent="danger" />
                <StatCard label="مجموع بنرها" value={banners.length.toLocaleString('fa-IR')} icon={PiImagesLight} accent="neon" />
                <StatCard label="موقعیت‌های فعال" value={positionsCount.toLocaleString('fa-IR')} icon={PiStackLight} accent="primary" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setFilterPosition('all')}
                    className={`px-4 py-2 text-xs sm:text-sm rounded-xl transition-colors cursor-pointer
                        ${filterPosition === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-zinc-500 hover:bg-primary-50 shadow-sm'}`}
                >
                    همه
                </button>
                {(Object.keys(positionMeta) as BannerPosition[]).map(pos => (
                    <button
                        key={pos}
                        onClick={() => setFilterPosition(pos)}
                        className={`px-4 py-2 text-xs sm:text-sm rounded-xl transition-colors cursor-pointer
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
                    {filteredBanners.map(banner => (
                        <div key={banner.id} className="bg-white shadow-lg rounded-2xl overflow-hidden">

                            <div className="relative h-36 bg-gray-100">
                                <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                                <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 text-xs rounded-lg ${statusMeta[banner.status].classes}`}>
                                    {statusMeta[banner.status].label}
                                </span>
                            </div>

                            <div className="p-4">
                                <p className="text-xs text-primary-600 font-IranYekanMedium mb-1">{positionMeta[banner.position]}</p>
                                <h3 className="font-IranYekanBold text-sm text-zinc-800 line-clamp-1">{banner.title}</h3>
                                <p className="mt-1 text-xs text-zinc-400 ltr-dir line-clamp-1">{banner.linkUrl}</p>

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => moveBanner(banner.id, 'up')}
                                            className="flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <PiArrowUpLight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveBanner(banner.id, 'down')}
                                            className="flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <PiArrowDownLight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => toggleStatus(banner.id)}
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
                                            onClick={() => removeBanner(banner.id)}
                                            className="flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <PiTrashLight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <BannerModal
                    initialData={editingBanner}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveBanner}
                />
            )}
        </div>
    )
}