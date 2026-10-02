"use client"

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { PiArrowRightLight } from 'react-icons/pi'

type BackButtonProps = {
    className?: string
    fallbackHref?: string
    children?: ReactNode
}

export default function BackButton({ className = '', fallbackHref = '/', children = 'صفحه‌ی قبل' }: BackButtonProps) {
    const router = useRouter()

    const goBack = () => {
        if (window.history.length > 1) router.back()
        else router.push(fallbackHref)
    }

    return (
        <button type='button' onClick={goBack} className={`inline-flex items-center justify-center gap-2 cursor-pointer ${className}`}>
            <PiArrowRightLight className='w-4 h-4' />
            {children}
        </button>
    )
}
