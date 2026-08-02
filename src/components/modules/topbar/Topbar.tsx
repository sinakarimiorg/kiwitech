"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RiSearch2Line } from "react-icons/ri";
import { HiArrowRightEndOnRectangle } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiBars3 } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiMiniChevronUp } from "react-icons/hi2";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiPhone } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { HiMiniChevronLeft } from "react-icons/hi2";
// import Overlay from '../overlay/Overlay';
import { useEffect } from "react";


const Topbar = () => {
    const [searchedValue, setSearchedValue] = useState('')
    const [visibleOverlay, setVisibleOverlay] = useState(false)
    const [navClass, setNavClass] = useState('-right-64')
    const [cartClass, setCartClass] = useState('-left-64')
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)


    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
    }, []);
    const openMenuBar = () => {
        setNavClass('right-0')
        setVisibleOverlay(!visibleOverlay)
    }
    const closeNavBar = () => {
        setNavClass('-right-64')
        setVisibleOverlay(!visibleOverlay)
    }

    const openCartBar = () => {
        setCartClass('left-0')
        setVisibleOverlay(!visibleOverlay)
    }
    const closeCartBar = () => {
        setCartClass('-left-64')
        setVisibleOverlay(!visibleOverlay)
    }

    const closeOverlayFunc = () => {
        setNavClass('-right-64')
        setCartClass('-left-64')
        setVisibleOverlay(false)
    }

    ///////////// For Search Section 
    const router = useRouter()
    const enterInInput = (event: any) => {
        if (event.keyCode === 13) {
            router.replace(`/search/${searchedValue}`)
        }
    }

    const exitUser = () => {
        window.location.reload()
        localStorage.removeItem('username')
    }
    return (
        <>
            {/* <!-- TopBar for Laptop --> */}
            <div className='fixed top-0 w-full hidden sm:flex items-center justify-between py-3 md:py-4 px-4 md:px-6 bg-dark z-50'>
                {/* Topbar Logo */}
                <Link href={'/'} className='flex items-center gap-1 cursor-pointer'>
                    <img src='/images/logo/logo1.png' className='w-10 md:w-14 h-10 md:h-14 lg:w-16 xl:h-16' />
                    <h5 className='text-neon font-MorabbaBold text-xl md:text-2xl xl:text-3xl'>
                        کیـــوی تِــــک
                    </h5>
                </Link>

                {/* Search Box */}
                <div className='flex items-center w-75 md:w-87.5 lg:w-125 xl:w-175 2xl:mr-24 bg-dark-secondary border border-border rounded-2xl overflow-hidden'>
                    <Link href={`/search/${searchedValue}`} className='flex-center p-2 md:p-3 text-black bg-primary-500 hover:bg-primary-400  cursor-pointer'>
                        <RiSearch2Line className='w-5 md:w-6 h-5 md:h-6' />
                    </Link>
                    <input value={searchedValue} onChange={event => { setSearchedValue(event.target.value) }} onKeyDown={event => enterInInput(event)} type='text' className='w-full text-sm md:text-base text-text text-center bg-transparent focus:outline-none placeholder-text-muted' placeholder='جستجو در مـوبـولـــند' />
                </div>

                {/* Cart & Login  */}
                <div className="flex text-xl gap-x-2 md:gap-x-4 lg:gap-5 xl:gap-x-8 text-text-muted">

                    {/* <!-- Cart & Theme Toggle --> */}
                    <div className="flex items-center gap-x-2 md:gap-x-4 lg:gap-x-5">

                        <div className="relative group cursor-pointer hover:text-neon transition-colors">
                            <Link href={'/checkout/cart'}>
                                <HiOutlineShoppingCart className='w-5 custom-sc:w-8 h-5 custom-sc:h-8' />
                            </Link>
                            {/* <!-- Cart Box --> */}
                            <div className="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible w-100 p-5 border border-border border-t-[3px] shadow-custom border-t-primary-500 rounded-2xl
                        bg-dark-secondary text-text transition-all delay-75 overflow-hidden z-30">

                                {/* <!-- Cart Box Header --> */}
                                <div className="flex items-center justify-between font-IranYekan text-xs tracking-tighter">
                                    <span className="text-text-muted">1 مورد</span>
                                    <a href="/checkout/cart" className="flex items-center text-primary-500 ">
                                        مشاهده سبد خرید
                                        <HiMiniChevronLeft className='w-5 h-5' />
                                    </a>
                                </div>

                                {/* <!-- Cart Box Body --> */}
                                <div
                                    className="my-2 border-b border-b-gray-300 divide-y divide-gray-100 max-h-82.5 overflow-hidden hover:overflow-y-auto *:flex *:gap-x-2.5 *:py-5 *:pl-1">
                                    {/* <CartProductBox img={'/images/products/airpods.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} off={93500} price={790000} />
                                    <CartProductBox img={'/images/products/cover.png'} title={'کیف کلاسوری کربی مدل Pattern مناسب برای گوشی موبایل سامسونگ Galaxy J5 Pro'} off={35200} price={149000} />
                                    <CartProductBox img={'/images/products/car-charger.png'} title={'شارژر فندکی 35 وات مدل QC 3'} off={10000} price={70000} />
                                    <CartProductBox img={'/images/products/power-bank2.png'} title={'پاوربانک انکر مدل PowerCore Metro A1246 ظرفیت 10000 میلی آمپر ساعت'} off={130000} price={2200000} />
                                    <CartProductBox img={'/images/products/charge-cable.png'} title={'کابل تبدیل USB و USB-C به لایتنینگ و USB-C مدل 2in2-Fast-100W طول 1 متر'} price={490000} />
                                    <CartProductBox img={'/images/products/holder.png'} title={'پایه نگهدارنده گوشی موبایل الدینیو مدل MG01'} off={33000} price={277000} />
                                    <CartProductBox img={'/images/products/glass.png'} title={'محافظ صفحه نمایش حریم شخصی مات مدل m2m مناسب برای گوشی موبایل اپل iPhone 7Plus/ 8Plus'} price={27700} />                  <!-- Cart Box Product --> */}
                                </div>

                                {/* <!-- Cart Box Footer --> */}
                                <div className="flex justify-between mt-5">
                                    <div>
                                        <span className="font-IranYekan text-xs text-text-muted leading-5 tracking-tighter">مبلغ
                                            قابل پرداخت</span>
                                        <div className="font-IranYekanBold text-xl text-text">
                                            350,000
                                            <span className="font-Dana text-sm">تومان</span>
                                        </div>
                                    </div>

                                    <a className="w-26 h-12 flex items-center justify-center font-IranYekan text-base bg-primary-500 hover:bg-primary-400  text-black rounded-xl tracking-tightest"
                                        href="#">ثبت سفارش</a>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* <!-- Divide Border --> */}
                    <span className="block w-px h-14 bg-border"></span>

                    {/* <!-- Login Link --> */}
                    {/* {
                        localStorage.getItem('username') ? <span className='group relative flex-center gap-1 text-sm custom-sc:text-base tracking-tighter cursor-pointer'>
                            {localStorage.getItem('username')}
                            <HiMiniChevronDown />
                            <div className='invisible opacity-0 group-hover:visible absolute -left-4 top-full group-hover:opacity-100 w-32 custom-sc:w-40 bg-purple-800 text-white rounded-lg transition-all'>
                                <div className='w-full text-center hover:bg-sky-800 py-2 px-4 hover:rounded-lg border-b border-gray-400'>سبد خرید</div>
                                <div className={`${localStorage.getItem('role') === 'کاربر' ? 'hidden' : 'block'} w-full text-center hover:bg-sky-800 py-2 px-4 hover:rounded-lg border-b border-gray-400`}><Link href={'/p-admin'}>ورود به ادمین پنل</Link></div>
                                <div className='w-full text-center hover:bg-sky-800 py-2 px-4 hover:rounded-lg border-b border-gray-400' onClick={() => { exitUser() }}>خروج</div>
                            </div>
                        </span>
                            :
                            < Link href={'/login-register'} className="flex items-center gap-x-2.5 tracking-tightest">
                                <HiArrowRightEndOnRectangle className='w-6 md:w-8 h-6 md:h-8 hover:text-neon transition-colors' />
                                <span className="hidden xl:inline-block">ورود | ثبت‌‌نام</span>
                            </Link>
                    } */}
                    < Link href={'/login-register'} className="flex items-center gap-x-2.5 tracking-tightest hover:text-neon transition-colors">
                        <HiArrowRightEndOnRectangle className='w-6 md:w-8 h-6 md:h-8' />
                        <span className="hidden xl:inline-block">ورود | ثبت‌‌نام</span>
                    </Link>
                </div>
            </div >

            {/* <!-- TopBar for Mobile --> */}
            < div className='w-full block sm:hidden' >
                {/* TopBar Content */}
                < div className='w-full flex items-center justify-between px-4 h-16 bg-dark text-text' >
                    <button className='text-white' onClick={() => openMenuBar()}>
                        <HiBars3 className='w-6 h-6 cursor-pointer' />
                    </button>

                    {/* Topbar Logo */}
                    <div className='flex items-center gap-1 cursor-pointer text-white'>
                        <img src='/images/logo/logo1.png' className='w-12 h-12' />
                        <h5 className='text-neon font-MorabbaBold text-xl'>
                            کیـــوی  تِــــک
                        </h5>
                    </div>

                    <button className='text-white' onClick={() => openCartBar()}>
                        <IoCartOutline className='w-6 h-6' />
                    </button>

                    {/* <!-- Mobile Nav(menu) -------> */}
                    <div className={`mobile-nav fixed ${navClass} top-0 bottom-0 w-64 px-4 pt-4 bg-dark-secondary border-l border-border z-20 transition-all overflow-y-auto`}>

                        {/* <!-- Nav Header --> */}
                        <div className="flex items-center justify-between pb-3 mb-6 border-b border-border-light ">

                            {/* Nav Logo */}
                            <Link href={'/'} className='flex items-center gap-1 cursor-pointer'>
                                <img src='/images/logo/logo1.png' className='w-12 h-12' />
                                <h5 className='font-MorabbaBold text-xl text-neon'>
                                    کیـــوی تِــــک
                                </h5>
                            </Link>

                            {/* <!-- Close Nav Icon --> */}
                            <div onClick={() => closeNavBar()}>
                                <HiMiniXMark className="w-5 h-5 cursor-pointer" />
                            </div>
                        </div>

                        {/* <!-- Nav Menu --> */}
                        <div className="flex flex-col mb-8 text-text">
                            <Link href={'/'} className="flex items-center gap-x-2 py-2.5 pr-2.5 bg-neon/5 text-primary-500 rounded-md">
                                <AiOutlineHome className='w-5 h-5' />
                                <span>صفحه اصلی</span>
                            </Link>

                            {/* <!-- menu --> */}
                            <ul className="flex flex-col gap-y-6 mt-4 pr-2.5 [&>*:hover]:text-neon">

                                <li>
                                    <div className={`flex justify-between items-center ${isSubmenuOpen && 'text-primary-500 '}`}>
                                        <div className="flex gap-2">
                                            <MdOutlineShoppingBag className='w-5 h-5' />
                                            <span>فروشگاه</span>
                                        </div>
                                        {/* <!-- Submenu Open/Close Btn --> */}
                                        <div>
                                            {
                                                isSubmenuOpen ? <HiMiniChevronUp className="w-4 h-4 cursor-pointer" onClick={() => setIsSubmenuOpen(false)} /> : <HiMiniChevronDown className="w-4 h-4" onClick={() => setIsSubmenuOpen(true)} />
                                            }
                                        </div>
                                    </div>

                                    {/* <!-- Submenu --> */}
                                    {
                                        isSubmenuOpen &&
                                        <div className="flex flex-col items-start mt-3 pr-7 gap-y-3 text-sm text-text-muted [&>*:hover]:text-neon">
                                            <Link href={'/'}>شارژر گوشی</Link>
                                            <Link href={'/'}>قاب و کاور گوشی</Link>
                                            <Link href={'/'}>گلس گوشی</Link>
                                            <Link href={'/'}>هولدر گوشی موبایل</Link>
                                            <Link href={'/'}>کابل شارژ و مبدل</Link>
                                            <Link href={'/'}>پاوربانک</Link>

                                        </div>
                                    }
                                </li>

                                <li>
                                    <Link href={'/'} className="inline-flex gap-2">
                                        <RiGroupLine className="w-5 h-5" />
                                        <span>درباره ما</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href={'/'} className="inline-flex gap-2">
                                        <IoDocumentTextOutline className="w-5 h-5" />
                                        <span>موبو بلاگ</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href={'/'} className="inline-flex gap-2">
                                        <BiPhone className="w-5 h-5" />
                                        <span>تماس با ما</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* <!-- Nav Footer --> */}
                        <div
                            className="inline-flex flex-col gap-y-6 w-full pr-2.5 py-8 border-t border-t-border-light text-primary-500 [&>*:hover]:text-neon [&>*:hover]:cursor-pointer">
                            {/* <!-- Login Link --> */}
                            {/* {
                                localStorage.getItem('username') ? localStorage.getItem('username') :
                                    <a className="flex gap-x-2">
                                        <HiArrowRightEndOnRectangle className="w-5 h-5" />
                                        ورود | ثبت‌نام
                                    </a>
                            } */}
                            <a className="flex gap-x-2">
                                <HiArrowRightEndOnRectangle className="w-5 h-5" />
                                ورود | ثبت‌نام
                            </a>

                            {/* <!-- Shopping Cart Link --> */}
                            <a className="flex gap-x-2">
                                <HiOutlineShoppingCart className="w-5 h-5" />
                                <span>سبد خرید</span>
                            </a>
                        </div>
                    </div>

                    {/* <!-- Mobile Cart --> */}
                    <div className={`mobile-cart fixed ${cartClass} top-0 bottom-0 flex flex-col w-64 px-4 pt-5 bg-navbar-menu z-20 text-text font-IranYekan transition-all`}>

                        {/* <!-- Cart Header --> */}
                        <div className="flex items-center justify-between pb-5 border-b border-b-gray-300 ">

                            {/* <!-- Close Cart Icon --> */}
                            <div onClick={() => closeCartBar()}>
                                <HiMiniXMark className="w-5 h-5" />
                            </div>

                            <span>سبد خرید</span>
                        </div>

                        {/* <!-- Cart Body --> */}
                        {/* <div
                            className="text-sm divide-y divide-gray-100 overflow-hidden overflow-y-auto *:py-5 *:flex *:gap-x-1">
                            <CartProductBox img={'/images/products/airpods.png'} title={'هندزفری بلوتوثی کربی مدل CR-T107'} off={93500} price={790000} />
                            <CartProductBox img={'/images/products/cover.png'} title={'کیف کلاسوری کربی مدل Pattern مناسب برای گوشی موبایل سامسونگ Galaxy J5 Pro'} off={35200} price={149000} />
                            <CartProductBox img={'/images/products/car-charger.png'} title={'شارژر فندکی 35 وات مدل QC 3'} off={10000} price={70000} />
                            <CartProductBox img={'/images/products/power-bank2.png'} title={'پاوربانک انکر مدل PowerCore Metro A1246 ظرفیت 10000 میلی آمپر ساعت'} off={130000} price={2200000} />
                            <CartProductBox img={'/images/products/charge-cable.png'} title={'کابل تبدیل USB و USB-C به لایتنینگ و USB-C مدل 2in2-Fast-100W طول 1 متر'} price={490000} />
                            <CartProductBox img={'/images/products/holder.png'} title={'پایه نگهدارنده گوشی موبایل الدینیو مدل MG01'} off={33000} price={277000} />
                            <CartProductBox img={'/images/products/glass.png'} title={'محافظ صفحه نمایش حریم شخصی مات مدل m2m مناسب برای گوشی موبایل اپل iPhone 7Plus/ 8Plus'} price={27700} />

                        </div> */}

                        {/* <!-- Cart Box Footer --> */}
                        <div
                            className="flex items-end justify-start gap-x-4 pt-4 pb-8 mt-auto border-t border-t-gray-100 ">

                            <a className="w-28 h-11 flex items-center justify-center font-IranYekan text-base bg-primary-500 hover:bg-primary-400  text-black rounded-xl"
                                href="#">ثبت سفارش</a>

                            <div>
                                <span className="font-IranYekan text-xs text-text-muted leading-6 tracking-tighter">مبلغ
                                    قابل پرداخت</span>
                                <div className="font-IranYekanBold text-base text-text">
                                    350,000
                                    <span className="font-Dana text-xs">تومان</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div >
                {/* Search Input For Mobile*/}
                < div className='flex items-center m-6 bg-transparent rounded-xl border border-custom-dark/80 overflow-hidden' >
                    <Link href={`/search/${searchedValue}`} className='flex-center p-3 bg-primarybg-primary-500 cursor-pointer'>
                        <RiSearch2Line className='w-5 h-5 text-white' />
                    </Link>
                    <input value={searchedValue} onChange={event => { setSearchedValue(event.target.value) }} onKeyDown={event => enterInInput(event)} type='text' placeholder='جستجو در مـوبـولـــند'
                        className='w-full text-neutral-600 text-center text-sm bg-transparent focus:outline-none placeholder:bg-primarybg-primary-500 ' />
                </div >
            </div >
            {/* <Overlay isOpen={visibleOverlay} isClose={() => closeOverlayFunc()} /> */}
        </>
    )
}

export default Topbar