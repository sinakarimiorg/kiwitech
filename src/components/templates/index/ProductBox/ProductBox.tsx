import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon';

import './ProductBox.css'


type ProductCardProps = {
    shortName: string
    img: string
    img2?: string
    title: string
    classes: string
    price: number
    exPrice?: number
    discount?: number
}

export default function ProductBox({ shortName, img, img2, title, classes, price, exPrice, discount }: ProductCardProps) {

    // const MyImage = ({ image }) => {
    //     <div id='product-box__img' className={`${props.img2 && 'group'}`}>
    //         <LazyLoadImage
    //             alt='عکس محصول'
    //             src={props.img}
    //             effect="blur"
    //             wrapperProps={{
    //                 style: { transitionDelay: "1s" },
    //             }}
    //         />
    //         {props.img2 &&
    //             <img className='absolute opacity-0 invisible group-hover:block group-hover:opacity-100 group-hover:visible w-full h-full inset-0 cursor-pointer transition-all duration-500' src={props.img2} />}
    //     </div>
    // }
    return (
        <>
            {/* Icons */}

            <Link href={`/product-info/${shortName}`}>
                <div className={classes}>
                    <div id='product-box__img' className={`${img2 && 'group'}`}>
                        <div className='absolute group-hover:opacity-0 group-hover:invisible w-full h-full inset-0 cursor-pointer transition-all duration-500'>
                            <LazyLoadImage
                                src={img}
                                height={'100%'}
                                width={'100%'}
                                effect='blur'
                            />
                        </div>
                        {/* <img className='absolute group-hover:opacity-0 group-hover:invisible w-full h-full inset-0 cursor-pointer transition-all duration-500' src={img} /> */}
                        {img2 &&
                            <div className='absolute opacity-0 invisible group-hover:block group-hover:opacity-100 group-hover:visible w-full h-full inset-0 cursor-pointer transition-all duration-500'>
                                <LazyLoadImage
                                    src={img2}
                                    height={'100%'}
                                    width={'100%'}
                                    effect='blur'
                                />
                            </div>
                        }
                    </div>
                    {/* Box Body */}
                    <div>
                        <p className='text-sm leading-6 hover:text-primary-500 cursor-pointer'>{title}</p>
                        <div className='flex justify-between items-center px-2 pt-2 pb-1'>
                            {discount && <span className='px-2 xs:px-2.5 pt-0.5 font-DanaMedium xs:font-DanaDemiBold text-xs text-white bg-primary-600  rounded-lg'>{discount}%</span>}
                            <p className='flex justify-end items-center xs:gap-1 w-full text-zinc-800'>
                                <span className='font-DanaDemiBold text-sm sm:text-base md:text-lg'>{price.toLocaleString()}</span>
                                <span><TomanIcon/></span>
                            </p>
                        </div>
                        {
                            exPrice &&
                            <div className='flex justify-end items-center w-full'>
                                <span className='relative inline-flex ml-2 pl-5 xs:pl-7 pr-2 xs:font-medium text-xs xs:text-sm text-gray-500 overflow-hidden'>{exPrice.toLocaleString()}</span>
                            </div>
                        }
                    </div>
                </div>
            </Link>
        </>
    )
}
