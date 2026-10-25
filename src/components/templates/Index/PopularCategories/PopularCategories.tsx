import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'
import PopularCategoryBox from '../PopularCategoryBox/PopularCategoryBox'
import { categoryIconMap } from '@root/src/components/templates/P-admin/Categories/categoryIcons'
import { getPopularCategories } from '@root/src/lib/home/homeData'
import { getCategoryHref } from '@root/src/types/menuType'
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'

export default async function PopularCategories({ config }: { config: HomeSectionConfig }) {
    const categories = await getPopularCategories(config.limit)
    if (categories.length === 0) return null
    return (
        <section>
            <div className='container px-3 sm:px-0'>
                <SectionHeader
                    title={config.title}
                    desc={config.subtitle || null}
                    btnTitle={'مشاهده همه'}
                    btnHref={'/products/1'}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
                    {categories.map(category => (
                        <PopularCategoryBox
                            key={category._id}
                            icon={categoryIconMap[category.icon] ?? categoryIconMap.package}
                            title={category.title}
                            subtitle={category.items.slice(0, 3).map(item => item.title).join('، ')}
                            href={getCategoryHref(category.title)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
