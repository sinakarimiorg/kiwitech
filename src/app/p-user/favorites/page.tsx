import Layout from '@root/src/components/layouts/UserPanelLayout'
import ProductCard from '@root/src/components/templates/Product/ProductCard/ProductCard'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import { redirect } from 'next/navigation'
import { PiHeartLight } from 'react-icons/pi'
import FavoriteModel from '@models/Favorite'
import '@models/Product'
import { FavoriteProduct } from '@root/src/types/userFavoriteType'

export const dynamic = "force-dynamic"

function getDiscount(price: number, exPrice?: number) {
    if (!exPrice || exPrice <= price) return undefined
    return Math.round(((exPrice - price) / exPrice) * 100)
}


async function page() {
    const user = await getCurrentUser()
    if(!user) redirect('/login-register')

        await connectDB()

        const favorites = await FavoriteModel.find({user: user._id})
        .populate('product', 'name linkName price exPrice discount img')
        .sort({_id: -1})
        .lean()

        const products: FavoriteProduct[] = JSON.parse(JSON.stringify(favorites.map((f: any)=> f.product).filter(Boolean)))

        return (
        <Layout>
            <main className='flex-1 min-w-0'>
                {products.length === 0 ? (
                    <div className='bg-white shadow-lg rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4'>
                        <span className='flex-center w-16 h-16 bg-primary-50 text-primary-400 rounded-full'>
                            <PiHeartLight className='w-8 h-8' />
                        </span>
                        <div>
                            <h2 className='font-IranYekanBold text-zinc-700'>لیست علاقه‌مندی‌های شما خالی است</h2>
                            <p className='mt-1.5 text-sm text-zinc-400'>محصولاتی که به‌عنوان علاقه‌مندی ثبت کنید، اینجا نمایش داده می‌شوند.</p>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                shortName={product.linkName || product._id}
                                img={product.img}
                                title={product.name}
                                price={product.price}
                                exPrice={product.exPrice}
                                discount={getDiscount(product.price, product.exPrice)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    )
}

export default page