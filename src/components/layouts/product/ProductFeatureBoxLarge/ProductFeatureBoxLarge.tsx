import React from 'react'

export default function ProductFeatureBoxLarge({ name, status }: { name: string, status: string }) {
    return (
        <div className='mt-7'>
            <div className='w-full h-28 py-5 px-2 bg-slate-300/50 shadow-sm rounded-lg'>
                <p className='h-2/4 text-zinc-500 text-sm'>{name}</p>
                <p className='h-2/4 pt-2 font-IranYekan  text-sm'>{status}</p>
            </div>
        </div>
    )
}
