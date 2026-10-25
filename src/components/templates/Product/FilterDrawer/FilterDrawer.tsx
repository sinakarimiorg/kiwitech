"use client"

import { useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PiSlidersHorizontalLight, PiXBold } from 'react-icons/pi'

type FilterDrawerProps = {
    activeCount?: number
    title?: string
    children: ReactNode
}

export default function FilterDrawer({ activeCount = 0, title = 'فیلترها', children }: FilterDrawerProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen])

    const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('a')) setIsOpen(false)
    }

    return (
        <>
            <button
                type='button'
                onClick={() => setIsOpen(true)}
                className='relative flex items-center gap-1.5 shrink-0 h-11 px-4 text-sm text-zinc-600 bg-white border border-gray-200 hover:border-primary-400 rounded-xl transition-colors cursor-pointer'
            >
                <PiSlidersHorizontalLight className='w-5 h-5 text-primary-500' />
                {title}
                {activeCount > 0 &&
                    <span className='flex-center min-w-4.5 h-4.5 px-1 text-[10px] font-IranYekanBold text-white bg-primary-500 rounded-full'>
                        {activeCount.toLocaleString('fa-IR')}
                    </span>
                }
            </button>

            {isOpen && createPortal(
                <div
                    className='fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 sm:px-4'
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) setIsOpen(false)
                    }}
                >
                    <div
                        role='dialog'
                        aria-modal='true'
                        aria-label={title}
                        className='flex flex-col w-full sm:max-w-md max-h-[85dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl'
                    >
                        <div className='flex items-center justify-between shrink-0 px-5 py-4 border-b border-gray-100'>
                            <h2 className='flex items-center gap-2 font-IranYekanBold text-base text-zinc-800'>
                                <PiSlidersHorizontalLight className='w-5 h-5 text-primary-500' />
                                {title}
                            </h2>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                aria-label='بستن'
                                className='flex-center w-9 h-9 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
                            >
                                <PiXBold className='w-4 h-4' />
                            </button>
                        </div>

                        <div className='flex-1 min-h-0 overflow-y-auto p-4' onClick={handleContentClick}>
                            {children}
                        </div>

                        <div className='shrink-0 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gray-100'>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='flex-center w-full h-11 text-sm text-text linear_btn'
                            >
                                مشاهده نتایج
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
