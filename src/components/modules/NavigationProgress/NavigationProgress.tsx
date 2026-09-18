"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [visible, setVisible] = useState(false)
    const [width, setWidth] = useState(0)

    const growTimer = useRef<ReturnType<typeof setInterval> | null>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const startProgress = () => {
        if (growTimer.current) clearInterval(growTimer.current)
        if (hideTimer.current) clearTimeout(hideTimer.current)

        setVisible(true)
        setWidth(15)

        growTimer.current = setInterval(() => {
            setWidth(prev => (prev < 85 ? prev + Math.random() * 8 : prev))
        }, 250)
    }

    const finishProgress = () => {
        if (growTimer.current) {
            clearInterval(growTimer.current)
            growTimer.current = null
        }
        setWidth(100)
        hideTimer.current = setTimeout(() => {
            setVisible(false)
            setWidth(0)
        }, 300)
    }

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.button !== 0) return
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

            const target = event.target as HTMLElement
            const anchor = target.closest('a')
            if (!anchor) return

            const href = anchor.getAttribute('href')
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
            if (anchor.target === '_blank') return

            const url = new URL(anchor.href, window.location.href)
            const isSameOrigin = url.origin === window.location.origin
            const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search

            if (isSameOrigin && !isSamePage) {
                startProgress()
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    useEffect(() => {
        finishProgress()
        return () => {
            if (growTimer.current) clearInterval(growTimer.current)
            if (hideTimer.current) clearTimeout(hideTimer.current)
        }
    }, [pathname, searchParams])

    return (
        <div
            className="fixed top-0 inset-x-0 z-999 h-0.75 pointer-events-none"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
            <div
                className="h-full bg-linear-to-l from-primary-600 to-neon"
                style={{
                    width: `${width}%`,
                    transition: 'width 0.25s ease-out',
                    boxShadow: '0 0 8px rgba(215, 255, 92, 0.7)',
                }}
            />
        </div>
    )
}
