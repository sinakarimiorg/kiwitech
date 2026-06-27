import React from 'react'

export default function ProductFeatureBox({ name, status }: { name: string, status: string }) {
  return (
    <div>
      <div className='md:w-44 w-44 h-20 p-2 glass-card rounded-lg'>
        <p className='h-2/4 text-text-muted text-xs md:text-sm'>{name}</p>
        <p className='h-2/4 pt-2 font-IranYekan text-xs 2xl:text-sm border-t border-dotted border-gray-300 line-clamp-1'>{status}</p>
      </div>
    </div>
  )
}
