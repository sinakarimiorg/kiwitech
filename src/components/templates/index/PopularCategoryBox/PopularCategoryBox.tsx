export default function PopularCategoryBox({ src, title }: { src: string, title: string }) {
    return (
        <div className='group text-center cursor-pointer'>
            <div className='relative inline-block'>
                <span className='absolute inset-0 rounded-full bg-neon/0 group-hover:bg-neon/25 blur-xl transition-all duration-500' />
                <img
                    className='relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 xl:mb-4 rounded-full group-hover:scale-110 transition-transform duration-500'
                    src={src}
                />
            </div>
            <span className='block text-sm md:text-base lg:text-lg group-hover:text-primary-600 group-hover:font-IranYekanBold transition-colors'>{title}</span>
        </div>
    )
}
