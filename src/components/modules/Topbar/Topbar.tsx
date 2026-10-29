"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { RiSearch2Line } from "react-icons/ri";
import { HiArrowRightEndOnRectangle, HiMiniChevronDown } from "react-icons/hi2";
import Overlay from '../Overlay/Overlay';
import SearchSuggestions from './SearchSuggestions/SearchSuggestions'
import { getSessionUserAction, logoutAction } from '@root/src/components/templates/Auth/action'
import CartDropdown from './CartDropdown'
import BottomNav from '../BottomNav/BottomNav'

type SessionUser = { name: string; phone: string; role: string } | null

const Topbar = () => {
    const [searchedValue, setSearchedValue] = useState('')
    const [visibleOverlay, setVisibleOverlay] = useState(false)

    const [currentUser, setCurrentUser] = useState<SessionUser>(null)
    useEffect(() => {
        getSessionUserAction().then(setCurrentUser)
    }, [])

    ////////// Handle Search Suggestions Box
    const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false)
    const desktopSearchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
                setShowDesktopSuggestions(false)
                setVisibleOverlay(false)
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

    const closeOverlayFunc = () => {
        setShowDesktopSuggestions(false)
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
        setVisibleOverlay(false)
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
                    <Image src='/images/logo/logo1.png' alt='کیوی‌تک' width={64} height={64} preload className='w-10 md:w-14 h-10 md:h-14 lg:w-16 xl:h-16' />
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
                        <SearchSuggestions query={searchedValue} onNavigate={() => closeOverlayFunc()} />
                    }
                </div>

                {/* Cart & Login  */}
                <div className="flex text-xl gap-x-2 md:gap-x-4 lg:gap-5 xl:gap-x-8 text-text-muted">

                    {/* <!-- Cart --> */}
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
            <div className='w-full block sm:hidden'>
                <div className='w-full flex items-center justify-center px-4 h-16 bg-dark text-text'>
                    <Link href={'/'} className='flex items-center gap-1 cursor-pointer'>
                        <Image src='/images/logo/logo1.png' alt='کیوی‌تک' width={48} height={48} className='w-12 h-12' />
                        <h5 className='text-neon font-MorabbaBold text-xl'>
                            کیـــوی  تِــــک
                        </h5>
                    </Link>
                </div>
            </div>

            {/* Mobile Bottom Navigation (sm:hidden) */}
            <BottomNav currentUser={currentUser} />

            <Overlay isOpen={visibleOverlay} onClose={() => closeOverlayFunc()} />
        </>
    )
}

export default Topbar