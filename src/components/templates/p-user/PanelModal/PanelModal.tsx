"use client"

import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PiXBold } from 'react-icons/pi'

export const panelFieldClasses =
    'w-full px-3.5 py-2.5 text-base sm:text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors'

export const panelPrimaryButton =
    'flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'

export const panelSecondaryButton =
    'flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer disabled:opacity-60'

const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
}

type PanelModalProps = {
    title: ReactNode
    icon?: ReactNode
    size?: keyof typeof sizeClasses
    busy?: boolean           
    onClose: () => void
    children: ReactNode
    footer?: ReactNode
}

export default function PanelModal({ title, icon, size = 'md', busy = false, onClose, children, footer }: PanelModalProps) {
    const titleId = useId()

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !busy) onClose()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose, busy])

    return createPortal(
        <div
            className='fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 sm:px-4'
            onMouseDown={event => {
                if (event.target === event.currentTarget && !busy) onClose()
            }}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                className={`flex flex-col w-full ${sizeClasses[size]} max-h-[92dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl`}
            >
                <div className='flex items-center justify-between gap-3 shrink-0 px-5 sm:px-6 py-4 border-b border-gray-100'>
                    <h2 id={titleId} className='flex items-center gap-2 min-w-0 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                        {icon}
                        {title}
                    </h2>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={busy}
                        aria-label='بستن'
                        className='flex-center w-9 h-9 shrink-0 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
                    >
                        <PiXBold className='w-4 h-4' />
                    </button>
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5'>
                    {children}
                </div>

                {footer &&
                    <div className='shrink-0 px-5 sm:px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-gray-100'>
                        {footer}
                    </div>
                }
            </div>
        </div>,
        document.body
    )
}
