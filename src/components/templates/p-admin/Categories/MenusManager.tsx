"use client"

import { useState } from "react"
import {
    PiCaretDownLight,
    PiPencilSimpleLight,
    PiTrashLight,
    PiPlusCircleLight,
    PiDotsSixVerticalLight,
    PiListBulletsLight,
} from "react-icons/pi"
import { FiSmartphone } from "react-icons/fi"
import { FaComputer, FaKitchenSet } from "react-icons/fa6"
import { VscPackage } from "react-icons/vsc"
import type { IconType } from "react-icons"

type MenuItem = {
    id: number
    title: string
}

type MenuGroup = {
    id: number
    title: string
    icon: IconType
    active: boolean
    items: MenuItem[]
}

// نمونه دیتای اولیه - منطبق با ساختار منوی سایت (Navbar) - در آینده با API جایگزین می‌شود
const initialGroups: MenuGroup[] = [
    {
        id: 1,
        title: "لوازم جانبی موبایل",
        icon: FiSmartphone,
        active: true,
        items: [
            { id: 1, title: "شارژر گوشی" },
            { id: 2, title: "قاب و کاور گوشی" },
            { id: 3, title: "گلس گوشی" },
            { id: 4, title: "هولدر گوشی موبایل" },
            { id: 5, title: "کابل شارژ و مبدل" },
            { id: 6, title: "پاوربانک" },
        ],
    },
    {
        id: 2,
        title: "لوازم جانبی کامپیوتر",
        icon: FaComputer,
        active: true,
        items: [
            { id: 1, title: "رم" },
            { id: 2, title: "مانیتور" },
            { id: 3, title: "کیبورد" },
            { id: 4, title: "هولدر لپ‌تاپ" },
            { id: 5, title: "موس و موس‌پد" },
        ],
    },
    {
        id: 3,
        title: "لوازم خانگی",
        icon: FaKitchenSet,
        active: true,
        items: [
            { id: 1, title: "جارو هوشمند" },
            { id: 2, title: "استریو باند" },
            { id: 3, title: "تلویزیون هوشمند" },
            { id: 4, title: "بخارپز و هواپز" },
        ],
    },
    {
        id: 4,
        title: "لوازم جانبی متفرقه",
        icon: VscPackage,
        active: false,
        items: [
            { id: 1, title: "شارژر گوشی" },
            { id: 2, title: "قاب و کاور گوشی" },
        ],
    },
]

export default function MenusManager() {
    const [groups, setGroups] = useState<MenuGroup[]>(initialGroups)
    const [openGroup, setOpenGroup] = useState<number | null>(1)

    const toggleGroup = (id: number) => {
        setOpenGroup(prev => (prev === id ? null : id))
    }

    const toggleActive = (id: number) => {
        setGroups(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g))
    }

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiListBulletsLight className='w-5 h-5 text-primary-500' />
                    منوی دسته‌بندی‌ها
                    <span className='text-xs font-IranYekan text-zinc-400'>({groups.length} دسته اصلی)</span>
                </h2>

                <button className='flex-center gap-1.5 px-4 py-2 text-sm text-text linear_btn'>
                    <PiPlusCircleLight className='w-4 h-4' />
                    <span className='hidden sm:inline'>دسته اصلی جدید</span>
                </button>
            </div>

            {/* Groups */}
            <div className='divide-y divide-gray-50'>
                {groups.map(group => {
                    const Icon = group.icon
                    const isOpen = openGroup === group.id
                    return (
                        <div key={group.id}>
                            {/* Group Row */}
                            <div className='flex items-center gap-3 px-5 sm:px-6 py-4'>
                                <PiDotsSixVerticalLight className='w-5 h-5 text-zinc-300 cursor-grab shrink-0' />

                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className='flex items-center gap-2.5 flex-1 min-w-0 text-right cursor-pointer'>
                                    <span className='flex-center w-9 h-9 shrink-0 bg-primary-50 text-primary-600 rounded-lg'>
                                        <Icon className='w-4.5 h-4.5' />
                                    </span>
                                    <span className='font-IranYekanMedium text-sm text-zinc-700 line-clamp-1'>{group.title}</span>
                                    <span className='text-xs text-zinc-400 shrink-0'>({group.items.length} زیرمجموعه)</span>
                                    <PiCaretDownLight className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                <div className='flex items-center gap-3 shrink-0'>
                                    <button
                                        onClick={() => toggleActive(group.id)}
                                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer
                                            ${group.active ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-zinc-400"}`}>
                                        {group.active ? "فعال" : "غیرفعال"}
                                    </button>
                                    <button className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                        <PiPencilSimpleLight className='w-4 h-4' />
                                    </button>
                                    <button className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                        <PiTrashLight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>

                            {/* Sub Items */}
                            {isOpen && (
                                <div className='bg-gray-50/60 px-5 sm:px-6 py-4 pr-16 sm:pr-20'>
                                    <div className='flex flex-col gap-2'>
                                        {group.items.map(item => (
                                            <div key={item.id} className='flex items-center gap-3 bg-white px-4 py-2.5 border border-gray-100 rounded-lg'>
                                                <PiDotsSixVerticalLight className='w-4 h-4 text-zinc-300 cursor-grab shrink-0' />
                                                <span className='flex-1 text-sm text-zinc-600'>{item.title}</span>
                                                <button className='flex-center w-7 h-7 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors cursor-pointer'>
                                                    <PiPencilSimpleLight className='w-3.5 h-3.5' />
                                                </button>
                                                <button className='flex-center w-7 h-7 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer'>
                                                    <PiTrashLight className='w-3.5 h-3.5' />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button className='flex-center gap-1.5 w-full mt-3 py-2.5 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 hover:border-primary-400 rounded-lg transition-colors cursor-pointer'>
                                        <PiPlusCircleLight className='w-4 h-4' />
                                        افزودن زیرمجموعه
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
