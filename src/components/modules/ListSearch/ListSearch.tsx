"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PiMagnifyingGlassLight, PiXCircleLight } from 'react-icons/pi'
import { buildQuery } from '@root/src/utils/query'

type ListSearchProps = {
    basePath: string
    initialValue?: string
    placeholder: string
    params?: Record<string, string | undefined>
}

export default function ListSearch({ basePath, initialValue = '', placeholder, params = {} }: ListSearchProps) {
    const router = useRouter()
    const [value, setValue] = useState(initialValue)

    const go = (q: string) => router.push(`${basePath}/1${buildQuery({ ...params, q: q.trim() })}`)

    return (
        <form
            role='search'
            onSubmit={event => {
                event.preventDefault()
                go(value)
            }}
            className='flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-zinc-400 focus-within:border-primary-400 transition-colors'
        >
            <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
            <input
                value={value}
                onChange={event => setValue(event.target.value)}
                type='search'
                enterKeyHint='search'
                placeholder={placeholder}
                aria-label={placeholder}
                className='flex-1 min-w-0 bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-base sm:text-sm'
            />
            {value &&
                <button
                    type='button'
                    aria-label='پاک کردن'
                    onClick={() => {
                        setValue('')
                        go('')
                    }}
                    className='shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer'
                >
                    <PiXCircleLight className='w-5 h-5' />
                </button>
            }
        </form>
    )
}
