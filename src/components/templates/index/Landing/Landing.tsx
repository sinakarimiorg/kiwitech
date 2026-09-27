import { PiShieldCheckLight, PiLightningLight, PiArrowsCounterClockwiseLight, PiCreditCardLight } from 'react-icons/pi'
import { getFeaturedProducts, getLandingBanners } from '@root/src/lib/home/homeData'
import LandingBannerSlider from './LandingBannerSlider'
import FeaturedProductsSwiper from './FeaturedProductsSwiper'

import './Landing.css'

const trustItems = [
    { icon: PiShieldCheckLight, label: 'ضمانت اصالت کالا' },
    { icon: PiLightningLight, label: 'ارسال فوری تهران' },
    { icon: PiArrowsCounterClockwiseLight, label: '۷ روز ضمانت بازگشت' },
    { icon: PiCreditCardLight, label: 'پرداخت امن' },
]

export default async function Landing() {
    const [banners, featuredProducts] = await Promise.all([
        getLandingBanners(),
        getFeaturedProducts(6),
    ])

    return (
        <div className='landing-hero relative overflow-hidden sm:mt-40 bg-linear-to-br from-dark via-dark-secondary to-dark'>

            {/* Ambient neon blobs */}
            <div className='pointer-events-none absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-neon/25 rounded-full blur-3xl animate-float-blob' />
            <div className='pointer-events-none absolute -bottom-32 -left-16 w-72 h-72 md:w-96 md:h-96 bg-primary-500/25 rounded-full blur-3xl animate-float-blob' style={{ animationDelay: '3s' }} />

            {/* Subtle tech-grid texture */}
            <div className='landing-grid pointer-events-none absolute inset-0 opacity-[0.07]' />

            <div className='container relative z-10 px-3 sm:px-0 py-6 sm:py-10'>

                <h1 className='sr-only'>کیوی‌تک؛ فروشگاه لوازم جانبی موبایل</h1>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6'>
                    <div className={`min-w-0 ${featuredProducts.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                        <LandingBannerSlider banners={banners} />
                    </div>

                    {featuredProducts.length > 0 &&
                        <div className='min-w-0 lg:col-span-4'>
                            <FeaturedProductsSwiper products={featuredProducts} />
                        </div>
                    }
                </div>

                {/* Trust Line*/}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 lg:mt-6'>
                    {trustItems.map(item => {
                        const Icon = item.icon
                        return (
                            <div key={item.label} className='flex items-center justify-center gap-2 py-3 px-2 text-xs sm:text-sm text-text-muted bg-white/5 border border-white/10 rounded-2xl'>
                                <Icon className='w-5 h-5 text-neon shrink-0' />
                                {item.label}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
