"use client"

import { useEffect, useState } from 'react'
import { TbCategory } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import { FaBlog } from "react-icons/fa";
import { HiMiniChevronLeft } from "react-icons/hi2";
import Link from 'next/link';
import { RiGroupLine } from 'react-icons/ri';
import { categoryIconMap } from '@root/src/components/templates/P-admin/Categories/categoryIcons'
import { getCategoryHref } from '@root/src/types/menuType'
import { useMenuCategories } from './useMenuCategories'

import './NavBar.css'

export default function NavBar() {

    ////////// Handle NavBar visiblity 
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true)

    const handleScroll = () => {
        const currentScrollPos = window.scrollY

        if (currentScrollPos > prevScrollPos) {
            setVisible(false)
        } else {
            setVisible(true)
        }

        setPrevScrollPos(currentScrollPos)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll)
    })

    ////////// Dynamic categories menu
    const { categories, isLoading } = useMenuCategories()
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const activeId = hoveredId ?? categories[0]?._id

    return (
        <>
            <div className={`Navbar hidden sm:block fixed ${visible ? 'top-22 xl:top-24' : 'top-0'} w-full bg-navbar text-text border-t border-border shadow-lg shadow-black/20 transition-all z-40`}>
                <div className='flex gap-x-5 md:gap-x-8 py-3 pr-5 lg:pr-24 text-xs md:text-sm lg:text-base'>

                    <div className='relative group flex-center'>

                        <span className='flex-center gap-x-1.5 md:gap-x-2 transition-colors cursor-pointer hover:text-neon'>
                            <TbCategory />
                            دسته بندی ها
                        </span>

                        {/* <!-- Main Menu --> */}
                        <div
                            className="inline-flex flex-col absolute opacity-0 invisible top-full right-0 group-hover:opacity-100 group-hover:visible w-xl md:w-205 min-h-72 px-6 py-8 space-y-6 border-t-[3px]
                                shadow-custom border-t-primary-500 bg-navbar-menu text-sm md:text-base tracking-tight text-text border border-navbar-border rounded-2xl transition-all delay-75
                                *:inline-flex [&>*:hover]:text-neon *:transition-colors *:w-36"
                            onMouseLeave={() => setHoveredId(null)}>

                            {categories.length === 0 && isLoading &&
                                <div className='flex-col gap-y-6'>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <span key={index} className='block h-4 w-28 rounded bg-white/10 animate-pulse' />
                                    ))}
                                </div>
                            }

                            {categories.length === 0 && !isLoading &&
                                <p className='w-auto! text-xs text-text-muted'>دسته‌بندی‌ای ثبت نشده است.</p>
                            }

                            {categories.map(category => {
                                const Icon = categoryIconMap[category.icon] ?? categoryIconMap.package
                                const isActive = category._id === activeId

                                return (
                                    <div key={category._id}>
                                        <Link
                                            href={getCategoryHref(category.title)}
                                            className={`flex-center gap-1.5 text-sm ${isActive ? 'text-neon' : ''}`}
                                            onMouseEnter={() => setHoveredId(category._id)}>
                                            <Icon />
                                            {category.title}
                                        </Link>

                                        <div
                                            className={`navbar-submenu space-y-6 md:text-sm transition-all *:transition-colors ${isActive ? 'flex' : 'hidden'}`}>
                                            <Link href={getCategoryHref(category.title)} className='submenu-category-all-btn md:text-sm'>
                                                همه {category.title}
                                                <HiMiniChevronLeft />
                                            </Link>

                                            {category.items.length > 0 ? (
                                                <div className='flex flex-wrap gap-y-1.5 gap-x-8 *:inline-flex *:h-8 *:w-30 [&>*:hover]:text-neon'>
                                                    {category.items.map(item => (
                                                        <Link key={item._id} href={getCategoryHref(category.title, item.title)}>
                                                            {item.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className='text-xs text-text-muted'>زیرمجموعه‌ای ثبت نشده است.</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    <Link className='hover:text-neon md:gap-x-2' href={'/'}>
                        <CiDiscount1 />
                        شگفت انگیزها
                    </Link>
                    <Link className='hover:text-neon md:gap-x-2' href={'/articles/1'}>
                        <FaBlog />
                        موبولـند بلاگ
                    </Link>

                    <Link className='hover:text-neon md:gap-x-2' href={'/about'}>
                        <RiGroupLine />
                        درباره ما
                    </Link>
                    <Link className='hover:text-neon md:gap-x-2' href={'/contact'}>
                        <span className="block w-px h-10 bg-border ml-2"></span>
                        ارتباط با ما
                    </Link>
                </div>
            </div>
        </>
    )
}
