import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'
import { getLatestProducts } from '@root/src/lib/home/homeData';
import { HomeSectionConfig } from '@root/src/types/siteSettingsType';
import HomeProductsSwiper from '../HomeProductsSwiper/HomeProductsSwiper';

export default async function LatestProducts({ config }: { config: HomeSectionConfig }) {
    const products = await getLatestProducts(config.limit)
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
                <HomeProductsSwiper products={products} navId='latest' />
            </div>
        </section>
    )
}
