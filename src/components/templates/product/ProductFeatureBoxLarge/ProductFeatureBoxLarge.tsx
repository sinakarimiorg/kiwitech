import React from 'react'

export default function ProductFeatureBoxLarge({ name, status }: { name: string, status: string }) {
    return (
        <div className='mt-3 sm:mt-4'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-3.5 px-4 bg-white shadow-md rounded-lg'>
                <p className='sm:w-40 lg:w-48 shrink-0 text-zinc-500 text-sm'>{name}</p>
                <p className='flex-1 min-w-0 font-IranYekan text-sm text-zinc-800 leading-7 wrap-break-word'>{status}</p>
            </div>
        </div>
    )
}
