"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { RiSearch2Line } from "react-icons/ri";
import { HiArrowRightEndOnRectangle } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiBars3 } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import { HiMiniChevronDown } from "react-icons/hi2";
import { HiMiniChevronUp } from "react-icons/hi2";
import { MdOutlineAdminPanelSettings, MdOutlineShoppingBag } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiPhone } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import Overlay from '../overlay/Overlay';
import { useEffect } from "react";
import SearchSuggestions from './SearchSuggestions/SearchSuggestions'
import { getSessionUserAction, logoutAction } from '@root/src/components/templates/Auth/action'
import CartDropdown from './CartDropdown'
import { CartBadge, CartMiniList, CartMiniFooter } from './CartMiniPanel'
import { PiUserCircleLight } from 'react-icons/pi';

type SessionUser = { name: string; phone: string; role: string } | null

const Topbar = () => {
    const [searchedValue, setSearchedValue] = useState('')
    const [visibleOverlay, setVisibleOverlay] = useState(false)
    const [navClass, setNavClass] = useState('-right-64')
    const [cartClass, setCartClass] = useState('-left-80')
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

    const [currentUser, setCurrentUser] = useState<SessionUser>(null)
    useEffect(() => {
        getSessionUserAction().then(setCurrentUser)
    }, [])

    ////////// Handle Search Suggestions Box
    const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false)
    const [showMobileSuggestions, setShowMobileSuggestions] = useState(false)
    const desktopSearchRef = useRef<HTMLDivElement>(null)
    const mobileSearchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
                setShowDesktopSuggestions(false)
            }
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
                setShowMobileSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    ////////////////////////////

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
        setCartClass('-left-80')
        setVisibleOverlay(!visibleOverlay)
    }

    const closeOverlayFunc = () => {
        setNavClass('-right-64')
        setCartClass('-left-80')
        setVisibleOverlay(false)
    }

    ///////////// For Search Section 
    const router = useRouter()

    const openSearchBox = () => {
        setShowDesktopSuggestions(true)
        setVisibleOverlay(true)
    }

    const goToSearch = (value: string) => {
        if (!value.trim()) return
        setShowDesktopSuggestions(false)
        setShowMobileSuggestions(false)
        router.push(`/search/${encodeURIComponent(value.trim())}`)
    }

    const enterInInput = (event: any) => {
        if (event.keyCode === 13) {
            goToSearch(searchedValue)
        }
    }

    const exitUser = async () => {
        await logoutAction()
        window.location.reload()
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
                <div ref={desktopSearchRef} className='relative w-75 md:w-87.5 lg:w-125 xl:w-175 2xl:mr-24'>
                    <div className='flex items-center bg-dark-secondary border border-border rounded-2xl overflow-hidden'>
                        <button onClick={() => goToSearch(searchedValue)} className='flex-center p-2 md:p-3 text-black bg-primary-500 hover:bg-primary-400 cursor-pointer'>
                            <RiSearch2Line className='w-5 md:w-6 h-5 md:h-6' />
                        </button>
                        <input
                            value={searchedValue}
                            onChange={event => { setSearchedValue(event.target.value) }}
                            onKeyDown={event => enterInInput(event)}
                            onFocus={() => openSearchBox()}
                            type='text'
                            className='w-full text-sm md:text-base text-text text-center bg-transparent focus:outline-none placeholder-text-muted'
                            placeholder='جستجو در مـوبـولـــند' />
                    </div>

                    {showDesktopSuggestions &&
                        <SearchSuggestions query={searchedValue} onNavigate={() => setShowDesktopSuggestions(false)} />
                    }
                </div>

                {/* Cart & Login  */}
                <div className="flex text-xl gap-x-2 md:gap-x-4 lg:gap-5 xl:gap-x-8 text-text-muted">

                    {/* <!-- Cart & Theme Toggle --> */}
                    <div className="flex items-center gap-x-2 md:gap-x-4 lg:gap-x-5">

                        <CartDropdown />
                    </div>

                    {/* <!-- Divide Border --> */}
                    <span className="block w-px h-14 bg-border"></span>

                    {/* <!-- Login Link --> */}

                    {currentUser ? (
                        <span className='group relative flex-center gap-1 text-sm custom-sc:text-base tracking-tighter cursor-pointer hover:text-neon transition-colors'>
                            {currentUser.name}
                            <HiMiniChevronDown />
                            <div className='invisible opacity-0 group-hover:visible absolute -left-4 top-full group-hover:opacity-100 w-32 custom-sc:w-40 bg-dark-secondary border border-border text-text rounded-lg transition-all overflow-hidden z-30'>
                                <Link href={'/p-user'} className='block w-full text-center hover:bg-navbar-hover py-2 px-4 border-b border-border'>
                                    پروفایل من
                                </Link>
                                {currentUser.role === 'ادمین' &&
                                    <Link href={'/p-admin'} className='block w-full text-center hover:bg-navbar-hover py-2 px-4 border-b border-border'>
                                        ورود به ادمین پنل
                                    </Link>
                                }
                                <button onClick={exitUser} className='w-full text-center hover:bg-navbar-hover py-2 px-4 cursor-pointer'>
                                    خروج
                                </button>
                            </div>
                        </span>
                    ) : (
                        <Link href={'/login-register'} className="flex items-center gap-x-2.5 tracking-tightest hover:text-neon transition-colors">
                            <HiArrowRightEndOnRectangle className='w-6 md:w-8 h-6 md:h-8' />
                            <span className="hidden xl:inline-block">ورود | ثبت‌‌نام</span>
                        </Link>
                    )}
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

                    <button className='relative text-white' onClick={() => openCartBar()}>
                        <IoCartOutline className='w-6 h-6' />
                        <CartBadge className='-top-1.5 -right-2' />
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
                            <button onClick={() => closeNavBar()} aria-label='بستن' className='flex-center w-8 h-8 text-text hover:text-neon transition-colors cursor-pointer'>
                                <HiMiniXMark className="w-5 h-5" />
                            </button>
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
                                    <Link href={'/about'} className="inline-flex gap-2">
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
<div className="flex flex-col gap-y-6 w-full pr-2.5 py-8 border-t border-t-border-light text-primary-500 [&>*:hover]:text-neon">
    {currentUser ? (
        <>
            <Link href='/p-user' className="flex items-center gap-x-2">
                <PiUserCircleLight className="w-5 h-5" />
                <span className='line-clamp-1'>{currentUser.name}</span>
            </Link>

            {currentUser.role === 'ادمین' &&
                <Link href='/p-admin' className="flex items-center gap-x-2">
                    <MdOutlineAdminPanelSettings className="w-5 h-5" />
                    <span>ورود به ادمین پنل</span>
                </Link>
            }
        </>
    ) : (
        <Link href='/login-register' className="flex items-center gap-x-2">
            <HiArrowRightEndOnRectangle className="w-5 h-5" />
            <span>ورود | ثبت‌نام</span>
        </Link>
    )}

    <Link href='/checkout/cart' className="flex items-center gap-x-2">
        <HiOutlineShoppingCart className="w-5 h-5" />
        <span>سبد خرید</span>
    </Link>

    {currentUser &&
        <button onClick={exitUser} className="flex items-center gap-x-2 text-danger hover:text-danger! cursor-pointer">
            <HiArrowRightEndOnRectangle className="w-5 h-5 rotate-180" />
            <span>خروج</span>
        </button>
    }
</div>
                    </div>

                    {/* <!-- Mobile Cart --> */}
                    <div className={`mobile-cart fixed ${cartClass} top-0 bottom-0 flex flex-col w-80 max-w-[85vw] bg-white shadow-2xl z-20 text-zinc-700 font-IranYekan transition-all`}>

                        {/* <!-- Cart Header --> */}
                        <div className="flex items-center justify-between px-4 py-4 bg-dark-secondary text-white">
                            <span className='font-IranYekanMedium'>سبد خرید</span>
                            <button onClick={() => closeCartBar()} aria-label='بستن' className='flex-center w-8 h-8 rounded-lg hover:bg-white/10 cursor-pointer'>
                                <HiMiniXMark className="w-5 h-5" />
                            </button>
                        </div>

                        {/* <!-- Cart Body --> */}
                        <div className='flex-1 overflow-y-auto px-4 py-4'>
                            <CartMiniList />
                        </div>

                        {/* <!-- Cart Footer --> */}
                        <div className='px-4 pb-6 bg-white shadow-[0_-8px_20px_rgba(0,0,0,0.06)]'>
                            <CartMiniFooter />
                        </div>

                    </div>
                </div >
                {/* Search Input For Mobile*/}
                < div ref={mobileSearchRef} className='relative m-6' >
                    <div className='flex items-center bg-transparent rounded-xl border border-custom-dark/80 overflow-hidden'>
                        <button onClick={() => goToSearch(searchedValue)} className='flex-center p-3 bg-primary-500 cursor-pointer'>
                            <RiSearch2Line className='w-5 h-5 text-white' />
                        </button>
                        <input
                            value={searchedValue}
                            onChange={event => { setSearchedValue(event.target.value) }}
                            onKeyDown={event => enterInInput(event)}
                            onFocus={() => setShowMobileSuggestions(true)}
                            type='text'
                            placeholder='جستجو در مـوبـولـــند'
                            className='w-full text-neutral-600 text-center text-sm bg-transparent focus:outline-none' />
                    </div>

                    {showMobileSuggestions &&
                        <SearchSuggestions query={searchedValue} onNavigate={() => setShowMobileSuggestions(false)} />
                    }
                </div >
            </div >
            <Overlay isOpen={visibleOverlay} isClose={() => closeOverlayFunc()} />
        </>
    )
}

export default Topbar