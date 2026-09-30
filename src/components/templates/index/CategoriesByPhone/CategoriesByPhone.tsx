import Link from 'next/link'
import { getBannersByPosition } from '@root/src/lib/home/homeData'
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'

export default async function categoriesByPhone({ config }: { config: HomeSectionConfig }) {
    const banners = await getBannersByPosition('categoriesByPhone', config.limit)
    if (banners.length === 0) return null


    return (
        <section className='mt-16 sm:mt-20'>
            <div className='container px-3 sm:px-0'>
                <h2 className='mb-7 sm:mb-10 font-MorabbaBold text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide text-center'>
                    {config.title}
                </h2>

                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full'>
                    {banners.map(banner => (
                        <Link
                            key={banner._id}
                            href={banner.linkUrl || '#'}
                            aria-label={banner.title}
                            className='group relative block rounded-2xl overflow-hidden'
                        >
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className='w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105'
                            />
                            <span className='absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-neon/70 transition-all duration-500' />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
