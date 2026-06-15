import React, { useEffect, useState } from 'react'
import { TbCategory } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import { FaBlog } from "react-icons/fa";
import { BiStoreAlt } from "react-icons/bi";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { FiSmartphone } from "react-icons/fi";
import { FaComputer } from "react-icons/fa6";
import { FaKitchenSet } from "react-icons/fa6";
import { VscPackage } from "react-icons/vsc";

import './NavBar.css'
import Link from 'next/link';

export default function NavBar() {

    // const openCategoryFunc = () => {
    //   const menuElem = document.querySelector('.navbar-menu')
    //   menuElem.classList.add('visible--elem')
    // }
    // const closeCategoryFunc = () => {
    //   const menuElem = document.querySelector('.navbar-menu')
    //   menuElem.classList.remove('visible--elem')
    // }

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

    const [menuNavbarList, setMenuNavbarList] = useState('mobile')

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll)
    })


    return (
        <>
            <div className={`Navbar hidden sm:block fixed ${visible ? 'top-22 xl:top-24' : 'top-0'} w-full bg-navbar text-text border-t border-border shadow-lg shadow-black/20 transition-all z-40`}>
                <div className='flex gap-x-5 md:gap-x-8 py-3 pr-5 lg:pr-24 text-xs md:text-sm lg:text-base'>
                    {/* onMouseOver={() => openCategoryFunc()} onMouseOut={() => closeCategoryFunc()} */}
                    <div className='relative group flex-center'>

                        <span className='flex-center gap-x-1.5 md:gap-x-2 transition-colors cursor-pointer hover:text-neon'>
                            <TbCategory />
                            دسته بندی ها
                        </span>
                        {/* <!-- Main Menu --> */}
                        <div
                            className="inline-flex flex-col absolute opacity-0 invisible top-full right-0 group-hover:opacity-100 group-hover:visible w-xl md:w-205 h-72 px-6 py-8 space-y-6 border-t-[3px] 
                                shadow-custom border-t-primary-500 bg-navbar-menu text-sm md:text-base tracking-tight text-text border border-navbar-border rounded-2xl transition-all delay-75
                                *:inline-flex [&>*:hover]:text-neon *:transition-colors *:w-36"
                            onMouseLeave={e => { setMenuNavbarList('mobile') }}>

                            <div>
                                <Link href={'/'} className='flex-center gap-1.5 text-sm' onMouseEnter={e => { setMenuNavbarList('mobile') }}>
                                    <FiSmartphone />
                                    لوازم جانبی موبایل
                                </Link>
                                <div
                                    className={`navbar-submenu space-y-6 md:text-sm transition-all *:transition-colors ${menuNavbarList === 'mobile' ? 'flex' : 'hidden'}`}>
                                    <Link href={'/'} className='submenu-category-all-btn md:text-sm'>
                                        همه لوازم جانبی موبایل
                                        <HiMiniChevronLeft />
                                    </Link>
                                    <div className='flex flex-wrap gap-y-1.5 gap-x-8 *:inline-flex *:h-8 *:w-30 [&>*:hover]:text-neon transition-all'>
                                        <Link href={'/'}>شارژر گوشی</Link>
                                        <Link href={'/'}>قاب و کاور گوشی</Link>
                                        <Link href={'/'}>گلس گوشی</Link>
                                        <Link href={'/'}>هولدر گوشی موبایل</Link>
                                        <Link href={'/'}>کابل شارژ و مبدل</Link>
                                        <Link href={'/'}>پاوربانک</Link>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Link href={'/'} className='flex-center gap-1.5 text-sm' onMouseEnter={e => { setMenuNavbarList('computer') }}>
                                    <FaComputer />
                                    لوازم جانبی کامپیوتر
                                </Link>
                                <div className={`navbar-submenu space-y-6 md:text-sm transition-all *:transition-colors ${menuNavbarList === 'computer'  ? 'flex' : 'hidden'}`}>
                                    <Link href={'/'} className='submenu-category-all-btn md:text-sm'>
                                        همه لوازم جانبی کامپیوتر
                                        <HiMiniChevronLeft />
                                    </Link>
                                    <div className='flex flex-wrap gap-y-1.5 gap-x-8 *:inline-flex *:h-8 *:w-30 [&>*:hover]:text-neon'>
                                        <Link href={'/'}>رم</Link>
                                        <Link href={'/'}>مانیتور</Link>
                                        <Link href={'/'}>کیبوورد</Link>
                                        <Link href={'/'}>هولدر لپ تاپ</Link>
                                        <Link href={'/'}>کابل شارژ و مبدل</Link>
                                        <Link href={'/'}>موس و موس پد</Link>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Link href={'/'} className='flex-center gap-1.5 text-sm' onMouseEnter={e => { setMenuNavbarList('appliances') }}>
                                    <FaKitchenSet />
                                    لوازم خانگی
                                </Link>
                                <div className={`navbar-submenu space-y-6 md:text-sm transition-all *:transition-colors ${menuNavbarList === 'appliances'  ? 'flex' : 'hidden'}`}>
                                    <Link href={'/'} className='submenu-category-all-btn md:text-sm'>
                                        همه لوازم خانگی
                                        <HiMiniChevronLeft />
                                    </Link>
                                    <div className='flex flex-wrap gap-y-1.5 gap-x-8 *:inline-flex *:h-8 *:w-30 [&>*:hover]:text-neon'>
                                        <Link href={'/'}>جارو هوشمند</Link>
                                        <Link href={'/'}>استریو باند</Link>
                                        <Link href={'/'}>تلوزیون هوشمند</Link>
                                        <Link href={'/'}>بخارپز و هواپز</Link>
                                        <Link href={'/'}>بلندر و میکسر</Link>
                                        <Link href={'/'}>ترازو دیجیتال</Link>
                                        <Link href={'/'}>اسپرسوساز و آسیاب</Link>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Link href={'/'} className='flex-center gap-1.5 text-sm' onMouseEnter={e => { setMenuNavbarList('stuff') }}>
                                    <VscPackage />
                                    لوازم جانبی متفرقه
                                </Link>
                                <div className={`navbar-submenu space-y-6 md:text-sm transition-all *:transition-colors ${menuNavbarList === 'stuff'  ? 'flex' : 'hidden'}`}>
                                    <Link href={'/'} className='submenu-category-all-btn md:text-sm'>
                                        همه لوازم جانبی متفرقه
                                        <HiMiniChevronLeft />
                                    </Link>
                                    <div className='flex flex-wrap gap-y-1.5 gap-x-8 *:inline-flex *:h-8 *:w-30 [&>*:hover]:text-neon'>
                                        <Link href={'/'}>شارژر گوشی</Link>
                                        <Link href={'/'}>قاب و کاور گوشی</Link>
                                        <Link href={'/'}>گلس گوشی</Link>
                                        <Link href={'/'}>هولدر گوشی موبایل</Link>
                                        <Link href={'/'}>کابل شارژ و مبدل</Link>
                                        <Link href={'/'}>پاوربانک</Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Link className='hover:text-neon md:gap-x-2' href={'/'}>
                        <CiDiscount1 />
                        شگفت انگیزها
                    </Link>
                    <Link className='hover:text-neon md:gap-x-2' href={'/'}>
                        <FaBlog />
                        موبولـند بلاگ
                    </Link>
                    <Link className='hover:text-neon md:gap-x-2' href={'/'}>
                        <BiStoreAlt />
                        شعب حضوری
                    </Link>

                    <Link className='hover:text-neon md:gap-x-2' href={'/'}>
                        <span className="block w-px h-10 bg-border ml-2"></span>
                        همکاری با ما
                    </Link>
                    <Link className='hover:text-neon md:gap-x-2' href={'/contact'}>
                        ارتباط با ما
                    </Link>
                </div>
            </div>
        </>
    )
}
