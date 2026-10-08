import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import ArticleCard from '@root/src/components/templates/Articles/ArticleCard/ArticleCard'
import { AdminArticle } from "@/types/adminArticleType"
import ArticleModel from "@models/Article"
import { notFound } from 'next/navigation'
import { connectDB } from '@root/src/lib/mongodb'
import { cookies } from "next/headers";

import { PiCalendarBlankLight, PiEyeLight } from 'react-icons/pi'
import { IoLogoInstagram } from 'react-icons/io'
import { MdOutlineWhatsapp } from 'react-icons/md'
import { RiTwitterXFill } from 'react-icons/ri'
import { HiMiniChevronLeft } from 'react-icons/hi2'

export const dynamic = 'force-dynamic'

function getPersianDateParts(dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date()
    return {
        day: date.toLocaleDateString('fa-IR', { day: 'numeric' }),
        month: date.toLocaleDateString('fa-IR', { month: 'long' }),
        year: date.toLocaleDateString('fa-IR', { year: 'numeric' }),
    }
}

export default async function ArticleInfoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const id = decodeURIComponent(resolvedParams.id)

    await connectDB()

    //for increase article view count
    // NOTE: I used cookies for handle the fake view counts when user refresh the page frequently
    const cookieStore = await cookies();
    const cookieName = `viewed_article_${id}`;
    const hasViewed = cookieStore.get(cookieName);

    let articleDoc = null;

    if (!hasViewed) {
        articleDoc = await ArticleModel.findOneAndUpdate(
            { linkName: id, status: "منتشر شده" },
            { $inc: { views: 1 } },
            { returnDocument: 'after' }
        )
    } else {
        articleDoc = await ArticleModel.findOne({ linkName: id, status: "منتشر شده" }).lean();
    }

    if (!articleDoc) {
        notFound()
    }

    const article: AdminArticle = JSON.parse(JSON.stringify(articleDoc))

    const relatedRaw = await ArticleModel.find({
        _id: { $ne: article._id },
        status: "منتشر شده",
        category: article.category,
    }).sort({ _id: -1 }).limit(3).lean()

    let related: AdminArticle[] = JSON.parse(JSON.stringify(relatedRaw))

    if (related.length === 0) {
        const fallbackRaw = await ArticleModel.find({
            _id: { $ne: article._id },
            status: "منتشر شده",
        }).sort({ _id: -1 }).limit(3).lean()
        related = JSON.parse(JSON.stringify(fallbackRaw))
    }

    const { day, month, year } = getPersianDateParts(article.createdAt)

    const paragraphs = (article.content || article.excerpt || 'محتوایی برای این مقاله ثبت نشده است.')
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean)

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'مطالب خواندنی', to: '/articles/1' },
                    { id: 3, title: article.title, to: `/article-info/${article.linkName}` },
                ]}
            />

            <div className='container px-3 sm:px-6 pb-12 sm:pb-16'>
                <article className='max-w-4xl mx-auto'>

                    <div className='w-full h-48 sm:h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-100'>
                        <img src={article.img} alt={article.title} className='w-full h-full object-cover' />
                    </div>

                    <div className='mt-5 sm:mt-6'>
                        <span className='inline-block px-3 py-1 text-xs font-IranYekanMedium text-primary-600 bg-primary-50 rounded-lg'>
                            {article.category}
                        </span>

                        <h1 className='mt-3 sm:mt-4 font-MorabbaBold text-xl sm:text-2xl md:text-3xl text-zinc-800 leading-9 sm:leading-10 wrap-break-word'>
                            {article.title}
                        </h1>

                        <div className='flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pb-5 sm:pb-6 border-b border-gray-100 text-xs sm:text-sm text-zinc-400'>
                            <span className='flex items-center gap-1.5'>
                                <PiCalendarBlankLight className='w-4 h-4' />
                                {day} {month} {year}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <PiEyeLight className='w-4 h-4' />
                                {article.views.toLocaleString('fa-IR')} بازدید
                            </span>
                        </div>

                        <div className='mt-6 sm:mt-7 flex flex-col gap-4 sm:gap-5'>
                            {paragraphs.map((paragraph, index) => (
                                <p key={index} className='text-[15px] sm:text-base text-zinc-600 leading-8 sm:leading-9 wrap-break-word'>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {article.tags && article.tags?.length > 0 && (
                            <div className='flex flex-wrap items-center gap-2 mt-6 sm:mt-7'>
                                {article.tags.map(tag => (
                                    <span key={tag} className='px-3 py-1 text-xs text-zinc-500 bg-gray-50 border border-gray-100 rounded-full'>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className='flex flex-wrap items-center gap-3 mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100'>
                            <span className='text-sm text-zinc-500 ml-1'>اشتراک‌گذاری:</span>
                            <a className='social-button bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black' href='#' aria-label='اشتراک در X'>
                                <RiTwitterXFill className='social-button__icon' />
                            </a>
                            <a className='social-button bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600' href='#' aria-label='اشتراک در واتساپ'>
                                <MdOutlineWhatsapp className='social-button__icon' />
                            </a>
                            <a className='social-button bg-pink-600 hover:bg-white hover:text-pink-600 hover:border-2 hover:border-pink-600' href='#' aria-label='اشتراک در اینستاگرام'>
                                <IoLogoInstagram className='social-button__icon' />
                            </a>
                        </div>
                    </div>
                </article>

                {related.length > 0 && (
                    <section className='max-w-6xl mx-auto mt-12 sm:mt-16'>
                        <div className='flex items-center justify-between gap-3 pb-5 sm:pb-6'>
                            <h2 className='font-MorabbaBold text-lg sm:text-xl text-zinc-800'>مطالب مرتبط</h2>
                            <Link href='/articles/1' className='flex items-center gap-1 shrink-0 text-sm text-primary-600 hover:text-primary-700 transition-colors'>
                                همه مطالب
                                <HiMiniChevronLeft className='w-4 h-4' />
                            </Link>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
                            {related.map(item => {
                                const parts = getPersianDateParts(item.createdAt)
                                return (
                                    <ArticleCard
                                        key={item._id}
                                        shortName={item.linkName}
                                        img={item.img}
                                        title={item.title}
                                        date={[parts]}
                                        category={item.category}
                                    />
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}