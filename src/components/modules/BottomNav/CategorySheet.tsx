"use client"

import { useState } from 'react'
import Link from 'next/link'
import { HiMiniChevronDown, HiMiniChevronLeft } from 'react-icons/hi2'
import { PiStorefrontLight } from 'react-icons/pi'
import { categoryIconMap } from '@root/src/components/templates/P-admin/Categories/categoryIcons'
import { getCategoryHref } from '@root/src/types/menuType'
import { useMenuCategories } from '@root/src/components/modules/Navbar/useMenuCategories'
import { logoutAction } from '@root/src/components/templates/Auth/action'
import PanelModal from '@root/src/components/templates/P-user/PanelModal/PanelModal'

type SessionUser = { name: string; phone: string; role: string } | null

const extraLinks = [
    { href: '/amazing-offers/1', label: 'شگفت‌انگیزها' },
    { href: '/articles/1', label: 'موبولند بلاگ' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'ارتباط با ما' },
]

type CategorySheetProps = {
    currentUser: SessionUser
    onClose: () => void
}

export default function CategorySheet({ currentUser, onClose }: CategorySheetProps) {
    const { categories, isLoading } = useMenuCategories()
    const [openId, setOpenId] = useState<string | null>(null)

    const handleLogout = async () => {
        await logoutAction()
        window.location.reload()
    }

    return (
        <PanelModal
            title='دسته‌بندی‌ها'
            icon={<PiStorefrontLight className='w-5 h-5 shrink-0 text-primary-500' />}
            size='md'
            onClose={onClose}
        >
            {/* Categories */}
            {categories.length === 0 ? (
                <p className='py-6 text-sm text-center text-zinc-400'>
                    {isLoading ? 'در حال بارگذاری...' : 'دسته‌بندی‌ای ثبت نشده است.'}
                </p>
            ) : (
                <div className='flex flex-col divide-y divide-gray-100'>
                    {categories.map(category => {
                        const Icon = categoryIconMap[category.icon] ?? categoryIconMap.package
                        const isOpen = openId === category._id

                        return (
                            <div key={category._id}>
                                <div className='flex items-center gap-3 py-3'>
                                    <Link
                                        href={getCategoryHref(category.title)}
                                        onClick={onClose}
                                        className='flex items-center gap-3 flex-1 min-w-0'
                                    >
                                        <span className='flex-center w-9 h-9 shrink-0 text-primary-600 bg-primary-50 rounded-lg'>
                                            <Icon className='w-5 h-5' />
                                        </span>
                                        <span className='text-sm text-zinc-700 line-clamp-1'>{category.title}</span>
                                    </Link>

                                    {category.items.length > 0 &&
                                        <button
                                            type='button'
                                            onClick={() => setOpenId(isOpen ? null : category._id)}
                                            aria-expanded={isOpen}
                                            aria-label={`زیرمجموعه‌های ${category.title}`}
                                            className='flex-center w-9 h-9 shrink-0 text-zinc-400 hover:bg-gray-50 rounded-lg cursor-pointer'
                                        >
                                            <HiMiniChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    }
                                </div>

                                {isOpen &&
                                    <div className='flex flex-col gap-1 pb-3 pr-12 text-sm'>
                                        <Link
                                            href={getCategoryHref(category.title)}
                                            onClick={onClose}
                                            className='flex items-center gap-1 py-1.5 text-primary-600'
                                        >
                                            همه {category.title}
                                            <HiMiniChevronLeft className='w-4 h-4' />
                                        </Link>
                                        {category.items.map(item => (
                                            <Link
                                                key={item._id}
                                                href={getCategoryHref(category.title, item.title)}
                                                onClick={onClose}
                                                className='py-1.5 text-zinc-500 hover:text-primary-600 transition-colors'
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
            )}

            {/* Extra Links */}
            <div className='grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-gray-100'>
                {extraLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className='flex-center py-2.5 text-xs text-zinc-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors'
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* User Account */}
            <div className='flex flex-col gap-2 mt-3'>
                {currentUser ? (
                    <>
                        {currentUser.role === 'ادمین' &&
                            <Link href='/p-admin' onClick={onClose} className='flex-center py-2.5 text-xs text-primary-700 bg-primary-50 rounded-xl'>
                                ورود به ادمین پنل
                            </Link>
                        }
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='flex-center py-2.5 text-xs text-danger bg-danger/10 rounded-xl cursor-pointer'
                        >
                            خروج از حساب
                        </button>
                    </>
                ) : (
                    <Link href='/login-register' onClick={onClose} className='flex-center py-2.5 text-sm text-text linear_btn'>
                        ورود | ثبت‌نام
                    </Link>
                )}
            </div>
        </PanelModal>
    )
}
