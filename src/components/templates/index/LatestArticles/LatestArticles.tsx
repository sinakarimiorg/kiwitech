import ArticleBox from '../ArticleBox/ArticleBox'
import SectionHeader from '@root/src/components/modules/SectionHeader/SectionHeader'
import { getLatestArticles } from '@root/src/lib/home/homeData'
import { getPersianDateParts } from '@root/src/utils/date'
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'

export default async function LatestArticles({ config }: { config: HomeSectionConfig }) {
    const articles = await getLatestArticles(config.limit)
    if (articles.length === 0) return null
    return (
        <section>
            <div className='container px-3 sm:px-0'>
                <SectionHeader
                    title={config.title}
                    desc={config.subtitle || null}
                    btnTitle={'همه مطالب'}
                    btnHref={'/articles/1'} />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-5 gap-y-3.5 sm:gap-y-4'>
                    {articles.map(article => (
                        <ArticleBox
                            key={article._id}
                            shortName={article.linkName}
                            img={article.img}
                            title={article.title}
                            date={[getPersianDateParts(article.createdAt)]}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
