import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import allArticles from '@root/Articles'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'

import { PiCalendarBlankLight, PiEyeLight } from 'react-icons/pi'
import { IoLogoInstagram } from 'react-icons/io'
import { MdOutlineWhatsapp } from 'react-icons/md'
import { RiTwitterXFill } from 'react-icons/ri'
import { HiMiniChevronLeft } from 'react-icons/hi2'

export default function ArticleInfoPage({ params }: { params: { shortName: string } }) {
    const articles = allArticles as any[]
    const article = articles.find(a => a.shortName === params.shortName) ?? articles[0]

    const relatedArticles = articles
        .filter(a => a.id !== article.id && a.category === article.category)
        .slice(0, 3)

    const fallbackRelated = articles.filter(a => a.id !== article.id).slice(0, 3)
    const related = relatedArticles.length > 0 ? relatedArticles : fallbackRelated

    const { day, month, year } = article.date[0]

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'مطالب خواندنی', to: '/articles/1' },
                    { id: 3, title: article.title, to: `/article-info/${article.shortName}` },
                ]}
            />

            <div className='container pb-16'>
                <div className='max-w-4xl mx-auto'>

                    {/* تصویر اصلی */}
                    <div className='w-full h-52 sm:h-72 md:h-96 rounded-2xl overflow-hidden'>
                        <img src={article.img} alt={article.title} className='w-full h-full object-cover' />
                    </div>

                    {/* عنوان و متادیتا */}
                    <div className='mt-6'>
                        <span className='inline-block px-3 py-1 text-xs font-IranYekanMedium text-primary-600 bg-primary-50 rounded-lg'>
                            {article.category}
                        </span>

                        <h1 className='mt-4 font-MorabbaBold text-xl sm:text-2xl md:text-3xl text-zinc-800 leading-10'>
                            {article.title}
                        </h1>

                        <div className='flex items-center gap-4 mt-4 pb-6 border-b border-gray-100 text-xs sm:text-sm text-zinc-400'>
                            <span className='flex items-center gap-1.5'>
                                <PiCalendarBlankLight className='w-4 h-4' />
                                {day} {month} {year}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <PiEyeLight className='w-4 h-4' />
                                {(article.id * 137 + 240).toLocaleString('fa-IR')} بازدید
                            </span>
                        </div>

                        {/* محتوا */}
                        <div className='mt-7 flex flex-col gap-5'>
                            {article.content.map((paragraph: string, index: number) => (
                                <p key={index} className='text-sm sm:text-base text-zinc-600 leading-8 sm:leading-9'>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* اشتراک‌گذاری */}
                        <div className='flex items-center gap-3 mt-8 pt-6 border-t border-gray-100'>
                            <span className='text-sm text-zinc-500 ml-1'>اشتراک‌گذاری:</span>
                            <a className='social-button bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black' href='#'>
                                <RiTwitterXFill className='social-button__icon' />
                            </a>
                            <a className='social-button bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600' href='#'>
                                <MdOutlineWhatsapp className='social-button__icon' />
                            </a>
                            <a className='social-button bg-pink-600 hover:bg-white hover:text-pink-600 hover:border-2 hover:border-pink-600' href='#'>
                                <IoLogoInstagram className='social-button__icon' />
                            </a>
                        </div>
                    </div>
                </div>

                {/* مطالب مرتبط */}
                {related.length > 0 && (
                    <div className='max-w-6xl mx-auto mt-16'>
                        <div className='flex items-center justify-between pb-6'>
                            <h2 className='font-MorabbaBold text-lg sm:text-xl text-zinc-800'>مطالب مرتبط</h2>
                            <Link href='/articles/1' className='flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                                همه مطالب
                                <HiMiniChevronLeft className='w-4 h-4' />
                            </Link>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-5'>
                            {related.map(item => (
                                <ArticleCard
                                    key={item.id}
                                    shortName={item.shortName}
                                    img={item.img}
                                    title={item.title}
                                    date={item.date}
                                    category={item.category}
                                />
                            ))
                            }
                        </div>
                    </div>
                )}
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}