import Link from 'next/link'
import { PiArrowLeftLight, PiNewspaperLight } from 'react-icons/pi'
import { getLatestArticles } from '@root/src/lib/home/homeData'
import { getPersianDateParts } from '@root/src/utils/date'
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'
import ArticleFeatured from './ArticleFeatured'
import ArticleRow from './ArticleRow'

export default async function LatestArticles({ config }: { config: HomeSectionConfig }) {
    const articles = await getLatestArticles(config.limit)
    if (articles.length === 0) return null

    const [featured, ...rest] = articles

    return (
        <section className='mt-20 sm:mt-28'>
            <div className='container px-3 sm:px-0'>
                <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-50 via-white to-primary-100 border border-primary-100 p-4 sm:p-7 lg:p-9'>

                    <div className='pointer-events-none absolute -top-24 -right-16 w-72 h-72 bg-neon/25 rounded-full blur-3xl' />
                    <div className='pointer-events-none absolute -bottom-28 -left-20 w-72 h-72 bg-primary-300/25 rounded-full blur-3xl' />

                    {/* Header */}
                    <div className='relative z-10 flex items-end justify-between gap-4 pb-5 sm:pb-7 mb-5 sm:mb-7 border-b border-dashed border-primary-300'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <span className='flex-center w-11 h-11 sm:w-14 sm:h-14 shrink-0 text-primary-700 bg-white shadow-md rounded-2xl rotate-3'>
                                <PiNewspaperLight className='w-6 h-6 sm:w-8 sm:h-8' />
                            </span>
                            <div>
                                <h2 className='font-MorabbaBold text-xl sm:text-2xl lg:text-3xl text-zinc-800'>{config.title}</h2>
                                {config.subtitle &&
                                    <p className='mt-1 text-xs sm:text-sm text-primary-700'>{config.subtitle}</p>
                                }
                            </div>
                        </div>

                        <Link
                            href='/articles/1'
                            className='group flex items-center gap-1.5 shrink-0 px-3.5 sm:px-5 py-2 text-xs sm:text-sm text-zinc-700 bg-white hover:bg-primary-500 hover:text-white border border-primary-200 rounded-full transition-colors'
                        >
                            همه مطالب
                            <PiArrowLeftLight className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                        </Link>
                    </div>

                    {/* Content */}
                    <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8'>
                        <div className={rest.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
                            <ArticleFeatured
                                shortName={featured.linkName}
                                img={featured.img}
                                title={featured.title}
                                date={getPersianDateParts(featured.createdAt)}
                            />
                        </div>

                        {rest.length > 0 &&
                            <div className='lg:col-span-5 flex flex-col divide-y divide-primary-200/70'>
                                {rest.map((article, index) => (
                                    <ArticleRow
                                        key={article._id}
                                        index={index + 2}
                                        shortName={article.linkName}
                                        img={article.img}
                                        title={article.title}
                                        date={getPersianDateParts(article.createdAt)}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
