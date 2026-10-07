import Layout from '@root/src/components/layouts/UserPanelLayout'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import { redirect } from 'next/navigation'
import { PiHeartLight } from 'react-icons/pi'
import FavoriteModel from '@models/Favorite'
import '@models/Product'
import { FavoriteProduct } from '@root/src/types/userFavoriteType'
import FavoriteProductCard from '@root/src/components/templates/P-user/Favorites/FavoriteProductCard'
import Link from 'next/link'

export const dynamic = "force-dynamic"

async function page() {
    const user = await getCurrentUser()
    if (!user) redirect('/login-register')

    await connectDB()

    const favorites = await FavoriteModel.find({ user: user._id })
        .populate('product', 'name linkName price exPrice discount img stock')
        .sort({ _id: -1 })
        .lean()

    const products: FavoriteProduct[] = JSON.parse(JSON.stringify(favorites.map((f: any) => f.product).filter(Boolean)))

    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-3 mb-4 sm:mb-5'>
                    <h1 className='flex items-center gap-2 font-IranYekanBold text-lg text-zinc-800'>
                        <PiHeartLight className='w-5 h-5 text-primary-500' />
                        کالاهای مورد علاقه
                    </h1>
                    {products.length > 0 &&
                        <span className='px-3 py-1 text-xs text-primary-700 bg-primary-50 rounded-lg'>
                            {products.length.toLocaleString('fa-IR')} کالا
                        </span>
                    }
                </div>

                {products.length === 0 ? (
                    <div className='bg-white shadow-lg rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center gap-4'>
                        <span className='flex-center w-16 h-16 bg-primary-50 text-primary-400 rounded-full'>
                            <PiHeartLight className='w-8 h-8' />
                        </span>
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>لیست علاقه‌مندی‌های شما خالی است</h2>
                            <p className='mt-1.5 text-sm text-zinc-400 leading-7'>محصولاتی که به‌عنوان علاقه‌مندی ثبت کنید، اینجا نمایش داده می‌شوند.</p>
                        </div>
                        <Link href='/products/1' className='px-6 py-2.5 text-sm text-text linear_btn'>مشاهده محصولات</Link>
                    </div>
                ) : (
                    // پنل کنار سایدبار جا کم داره؛ پس ستون‌ها محافظه‌کارانه‌ان: ۱ ستون موبایل، ۲ ستون از ۴۸۰ پیکسل، ۳ ستون در xl، ۴ ستون در 2xl
                    <div className='grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4'>
                        {products.map(product => (
                            <FavoriteProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    )
}

export default page