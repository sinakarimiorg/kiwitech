"use client"

import { useState } from 'react'
import Link from 'next/link'
import { HiMiniChevronDown } from 'react-icons/hi2'
import { getCategoryHref } from '@root/src/types/menuType'
import { useMenuCategories } from '../Navbar/useMenuCategories' 

// جایگزین لیست ثابت زیرمنوی «فروشگاه» در منوی موبایل Topbar
export default function MobileMenuCategories() {
    const { categories, isLoading } = useMenuCategories()
    const [openId, setOpenId] = useState<string | null>(null)

    if (categories.length === 0) {
        return (
            <p className='mt-3 pr-7 text-xs text-text-muted'>
                {isLoading ? 'در حال بارگذاری...' : 'دسته‌بندی‌ای ثبت نشده است.'}
            </p>
        )
    }

    return (
        <div className='flex flex-col mt-3 pr-7 gap-y-3.5 text-sm text-text-muted'>
            {categories.map(category => {
                const isOpen = openId === category._id

                return (
                    <div key={category._id}>
                        <div className='flex items-center justify-between gap-2'>
                            <Link href={getCategoryHref(category.title)} className='hover:text-neon transition-colors'>
                                {category.title}
                            </Link>

                            {category.items.length > 0 &&
                                <button
                                    type='button'
                                    onClick={() => setOpenId(isOpen ? null : category._id)}
                                    aria-expanded={isOpen}
                                    aria-label={`زیرمجموعه‌های ${category.title}`}
                                    className='p-1 hover:text-neon transition-colors cursor-pointer'
                                >
                                    <HiMiniChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                            }
                        </div>

                        {isOpen &&
                            <div className='flex flex-col gap-y-2.5 mt-2.5 pr-3 text-xs border-r border-border-light'>
                                <Link href={getCategoryHref(category.title)} className='text-primary-500 hover:text-neon transition-colors'>
                                    همه {category.title}
                                </Link>
                                {category.items.map(item => (
                                    <Link
                                        key={item._id}
                                        href={getCategoryHref(category.title, item.title)}
                                        className='hover:text-neon transition-colors'
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    )
}
