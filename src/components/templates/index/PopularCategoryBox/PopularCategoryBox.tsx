export default function PopularCategoryBox({ src, title }: { src: string, title: string }) {
    return (
        <div className='group rounded-full text-center cursor-pointer'>
            <img className='w-20 h-w-20 md:w-28 md:h-w-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 xl:mb-4 group-hover:scale-110 transition-all' src={src} />
            <span className='text-sm md:text-base lg:text-lg group-hover:text-amber-500 group-hover:font-IranYekanBold transition-all'>{title}</span>
        </div>
    )
}
