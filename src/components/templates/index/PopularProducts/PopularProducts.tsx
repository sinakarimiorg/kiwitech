import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'
import { getTopRatedProducts } from '@root/src/lib/home/homeData';
import { HomeSectionConfig } from '@root/src/types/siteSettingsType';
import HomeProductsSwiper from '../HomeProductsSwiper/HomeProductsSwiper';

export default async function PopularProducts({ config }: { config: HomeSectionConfig }) {
    const products = await getTopRatedProducts(config.limit)
    if (products.length === 0) return null
    return (
        <section>
            <div className='container px-3 sm:px-0'>
                <SectionHeader
                    title={config.title}
                    desc={config.subtitle || null}
                    btnTitle={'مشاهده همه'}
                    btnHref={'/products/1'}
                />

                <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-50 via-white to-primary-100 border border-primary-100 p-3 sm:p-5'>
                    <div className='pointer-events-none absolute -top-16 -left-10 w-56 h-56 bg-neon/30 rounded-full blur-3xl' />
                    <div className='relative'>
                        <HomeProductsSwiper products={products} navId='popular' />
                    </div>
                </div>
            </div>
        </section>
    )
}
