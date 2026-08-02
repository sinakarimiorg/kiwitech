import Link from 'next/link'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'

type ProductCardProps = {
    shortName: string
    img: string
    img2?: string
    title: string
    price: number
    exPrice?: number
    discount?: number
}

export default function ProductCard({ shortName, img, img2, title, price, exPrice, discount }: ProductCardProps) {
    return (
        <Link
            href={`/product-info/${shortName}`}
            className='group flex flex-col w-full h-full bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1'>

            {/* تصویر محصول */}
            <div className='relative w-full aspect-square bg-gray-50 shrink-0'>
                {discount &&
                    <span className='absolute top-2.5 right-2.5 z-10 px-2 xs:px-2.5 pt-0.5 font-DanaMedium xs:font-DanaDemiBold text-xs text-white bg-primary-600 rounded-lg'>
                        {discount}%
                    </span>
                }

                <div className={`absolute inset-0 p-4 sm:p-6 ${img2 ? 'group-hover:opacity-0 group-hover:invisible' : ''} transition-all duration-500`}>
                    <LazyLoadImage
                        src={img}
                        alt={title}
                        height={'100%'}
                        width={'100%'}
                        effect='blur'
                        wrapperClassName='!w-full !h-full'
                    />
                </div>

                {img2 &&
                    <div className='absolute inset-0 p-4 sm:p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500'>
                        <LazyLoadImage
                            src={img2}
                            alt={title}
                            height={'100%'}
                            width={'100%'}
                            effect='blur'
                            wrapperClassName='!w-full !h-full'
                        />
                    </div>
                }
            </div>

            {/* بدنه کارت */}
            <div className='flex flex-col flex-1 p-3 sm:p-4'>
                <p className='flex-1 text-xs sm:text-sm leading-6 text-zinc-700 line-clamp-2 min-h-11 sm:min-h-12 group-hover:text-primary-500 transition-colors'>
                    {title}
                </p>

                <div className='mt-2.5 sm:mt-3'>
                    {exPrice && exPrice > price &&
                        <div className='relative inline-flex mb-1 text-xs text-gray-400 ex-price'>
                            {exPrice.toLocaleString()}
                        </div>
                    }
                    <div className='flex items-center justify-between'>
                        <div className='inline-flex items-center gap-1 text-zinc-800'>
                            <span className='font-DanaDemiBold text-sm sm:text-base md:text-lg'>{price.toLocaleString()}</span>
                            <TomanIcon className='w-3 sm:w-3.5 h-3 sm:h-3.5' />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}