"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiSearch2Line } from 'react-icons/ri'
import { PiXCircleLight } from 'react-icons/pi'

type SearchBoxProps = {
    initialValue?: string
    placeholder?: string
}

// فونت ۱۶ پیکسلی در موبایل جلوی زوم خودکار iOS موقع فوکوس رو می‌گیره
export default function SearchBox({ initialValue = '', placeholder = 'جستجو در محصولات و مقالات...' }: SearchBoxProps) {
    const router = useRouter()
    const [value, setValue] = useState(initialValue)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const query = value.trim()
        if (query) router.push(`/search/${encodeURIComponent(query)}`)
    }

    return (
        <form
            onSubmit={handleSubmit}
            role='search'
            className='flex items-center gap-2 pl-2 pr-3 sm:pr-4 py-2 bg-white shadow-lg border border-gray-200 rounded-2xl focus-within:border-primary-400 transition-colors'
        >
            <input
                value={value}
                onChange={event => setValue(event.target.value)}
                type='search'
                enterKeyHint='search'
                placeholder={placeholder}
                aria-label='جستجو'
                className='flex-1 min-w-0 py-1.5 bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-base sm:text-sm'
            />

            {value &&
                <button
                    type='button'
                    onClick={() => setValue('')}
                    aria-label='پاک کردن'
                    className='shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer'
                >
                    <PiXCircleLight className='w-5 h-5' />
                </button>
            }

            <button
                type='submit'
                aria-label='جستجو'
                className='flex-center w-10 h-10 shrink-0 text-black bg-primary-500 hover:bg-primary-400 rounded-xl transition-colors cursor-pointer'
            >
                <RiSearch2Line className='w-5 h-5' />
            </button>
        </form>
    )
}
