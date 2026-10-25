"use client"

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { RiSearch2Line } from 'react-icons/ri'
import { PiArrowRightLight, PiClockCounterClockwiseLight, PiXCircleLight } from 'react-icons/pi'
import SearchSuggestions from './SearchSuggestions/SearchSuggestions'

const RECENT_KEY = 'kiwitech_recent_searches'
const MAX_RECENT = 5

function readRecent(): string[] {
    if (typeof window === 'undefined') return []
    try {
        const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
        return Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_RECENT)
            : []
    } catch {
        return []
    }
}

function writeRecent(list: string[]) {
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(list))
    } catch { }
}

export default function MobileSearchSheet({ onClose }: { onClose: () => void }) {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState('')
    const [recent, setRecent] = useState<string[]>(readRecent)

    const trimmed = value.trim()

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        inputRef.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose])

    const submit = (term: string) => {
        const clean = term.trim()
        if (!clean) return

        const next = [clean, ...recent.filter(item => item !== clean)].slice(0, MAX_RECENT)
        setRecent(next)
        writeRecent(next)

        onClose()
        router.push(`/search/${encodeURIComponent(clean)}`)
    }

    const clearRecent = () => {
        setRecent([])
        writeRecent([])
    }

    return createPortal(
        <div
            role='dialog'
            aria-modal='true'
            aria-label='جستجو'
            className='sm:hidden fixed inset-0 z-70 flex flex-col h-dvh bg-dark text-text'
        >
            <form
                role='search'
                onSubmit={event => {
                    event.preventDefault()
                    submit(value)
                }}
                className='flex items-center gap-2 shrink-0 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-border'
            >
                <button
                    type='button'
                    onClick={onClose}
                    aria-label='بستن جستجو'
                    className='flex-center w-10 h-10 shrink-0 text-text-muted hover:text-neon transition-colors cursor-pointer'
                >
                    <PiArrowRightLight className='w-6 h-6' />
                </button>

                <div className='flex items-center flex-1 min-w-0 h-11 bg-dark-secondary border border-border focus-within:border-primary-500 rounded-2xl overflow-hidden transition-colors'>
                    <button
                        type='submit'
                        aria-label='جستجو'
                        className='flex-center w-11 h-full shrink-0 text-black bg-primary-500 active:bg-primary-400 cursor-pointer'
                    >
                        <RiSearch2Line className='w-5 h-5' />
                    </button>
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        type='search'
                        enterKeyHint='search'
                        autoComplete='off'
                        placeholder='جستجو در کیوی‌تک'
                        aria-label='جستجو'
                        className='flex-1 min-w-0 h-full px-3 text-base text-text bg-transparent outline-none placeholder:text-text-muted'
                    />
                    {value && (
                        <button
                            type='button'
                            onClick={() => {
                                setValue('')
                                inputRef.current?.focus()
                            }}
                            aria-label='پاک کردن'
                            className='flex-center w-10 h-full shrink-0 text-text-muted cursor-pointer'
                        >
                            <PiXCircleLight className='w-5 h-5' />
                        </button>
                    )}
                </div>
            </form>

            <div className='flex-1 min-h-0 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]'>
                {!trimmed && recent.length > 0 && (
                    <div className='px-4 pt-4'>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='flex items-center gap-1.5 text-xs text-text-muted'>
                                <PiClockCounterClockwiseLight className='w-3.5 h-3.5' />
                                جستجوهای اخیر
                            </p>
                            <button type='button' onClick={clearRecent} className='text-xs text-text-muted hover:text-danger transition-colors cursor-pointer'>
                                پاک کردن
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {recent.map(term => (
                                <button
                                    key={term}
                                    type='button'
                                    onClick={() => submit(term)}
                                    className='px-3 py-1.5 text-xs bg-dark-secondary border border-border-light active:border-primary-500 rounded-full cursor-pointer'
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <SearchSuggestions embedded query={value} onNavigate={onClose} />
            </div>
        </div>,
        document.body
    )
}
