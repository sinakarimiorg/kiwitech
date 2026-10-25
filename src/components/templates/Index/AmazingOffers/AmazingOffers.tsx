import Link from 'next/link'
import { PiLightningFill, PiArrowLeftLight } from 'react-icons/pi'
import { getOfferProducts } from '@root/src/lib/home/homeData'
import { getEndOfIranDay } from '@root/src/utils/date'
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'
import AmazingOffersSlider from './AmazingOffersSlider'
import OfferCountdown from './OfferCountdown'

export default async function AmazingOffers({ config }: { config: HomeSectionConfig }) {
    const products = await getOfferProducts(config.limit)

    if (products.length === 0) return null

    // Make Last Word Neon Color 
    const words = config.title.trim().split(/\s+/)
    const highlight = words.length > 1 ? words.pop() : null

        return (
        <section id='amazing-offers' className='container px-3 sm:px-0 my-14 sm:my-20 md:my-24 scroll-mt-44'>
            <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-dark via-dark-secondary to-dark p-4 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(15,17,21,0.25)]'>

                <div className='pointer-events-none absolute -top-24 -left-16 w-72 h-72 bg-neon/20 rounded-full blur-3xl' />
                <div className='pointer-events-none absolute -bottom-28 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl' />

                <div className='relative z-10 flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8'>

                    <div className='lg:w-60 xl:w-64 shrink-0 flex flex-col items-center lg:items-start justify-between gap-6 text-center lg:text-right'>
                        <div>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs text-neon bg-white/5 border border-neon/25 rounded-full'>
                                <PiLightningFill className='w-4 h-4' />
                                پیشنهاد لحظه‌ای
                            </span>
                            <h2 className='font-MorabbaBold text-2xl sm:text-3xl leading-relaxed text-text'>
                                {words.join(' ')}
                                {highlight && <span className='block text-neon neon-text-glow'>{highlight}</span>}
                            </h2>
                            {config.subtitle &&
                                <p className='mt-2 text-xs sm:text-sm leading-7 text-text-muted'>{config.subtitle}</p>
                            }
                        </div>

                        <div>
                            <p className='mb-2 text-xs text-text-muted'>زمان باقی‌مانده تا پایان امروز</p>
                            <OfferCountdown endsAt={getEndOfIranDay()} />
                        </div>

                        <Link
                            href='/amazing-offers/1'
                            className='group flex items-center justify-center gap-2 px-5 py-2.5 text-sm bg-neon text-surface rounded-xl shadow-[0_0_24px_rgba(215,255,92,0.3)] hover:shadow-[0_0_36px_rgba(215,255,92,0.5)] transition-shadow'
                        >
                            مشاهده همه
                            <PiArrowLeftLight className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                        </Link>
                    </div>

                    <AmazingOffersSlider products={products} />
                </div>
            </div>
        </section>
    )
}
