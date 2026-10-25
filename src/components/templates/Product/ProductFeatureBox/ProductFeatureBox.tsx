export default function ProductFeatureBox({ name, status }: { name: string, status: string }) {
  return (
    <div className='w-full min-h-20 p-2.5 glass-card rounded-lg'>
      <p className='text-text-muted text-xs md:text-sm'>{name}</p>
      <p className='mt-1.5 pt-1.5 font-IranYekan text-xs 2xl:text-sm border-t border-dotted border-gray-300 line-clamp-2 wrap-break-word'>{status}</p>
    </div>
  )
}
