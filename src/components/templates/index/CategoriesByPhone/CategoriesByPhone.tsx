
const brands = [
    { key: 'apple', src: '/images/categoriesByPhone/apple.jpg' },
    { key: 'samsung', src: '/images/categoriesByPhone/samsung.jpg' },
    { key: 'xiaomi', src: '/images/categoriesByPhone/xiaomi.jpg' },
    { key: 'huawei', src: '/images/categoriesByPhone/huawei.jpg' },
]

export default function categoriesByPhone() {
    return (
        <div>
            <div className='container'>
                <h4 className='mb-7 sm:mb-10 font-MorabbaBold text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide text-center'>دسته بندی بر اساس مدل گوشی</h4>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
                    {brands.map(brand => (
                        <div key={brand.key} className='group relative rounded-2xl overflow-hidden cursor-pointer'>
                            <img
                                className='w-full 2xl:h-72 transition-transform duration-500 group-hover:scale-105'
                                src={brand.src}
                            />
                            <span className='absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-neon/70 transition-all duration-500' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
