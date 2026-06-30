import React from 'react'

import Link from 'next/link';
import { HiMiniChevronUp } from "react-icons/hi2";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineWhatsapp } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

import './Footer.css'

export default function Footer({ marginClasses }) {
    return (
        <div className={`footer bg-linear-to-b from-gray-500/5 to-gray-600 ${marginClasses}`}>
            <div className='px-5 xs:px-7 sm:px-8 xl:px-10 2xl:px-16 py-7'>
                {/* Footer Header  */}
                <div className='pb-4 border-b border-zinc-400'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <Link href={'/'} className='flex items-center gap-1 cursor-pointer'>
                                <img src='/images/logo/logo.png' className='w-8 md:w-12 h-8 md:h-12 lg:w-14 xl:h-12' />
                                <h5 className='text-shadow-topbar font-MorabbaBold text-xl md:text-2xl xl:text-3xl'>
                                    کیـــوی تــــک
                                </h5>
                            </Link>
                        </div>
                        <a href='#' className='flex-center gap-0.5 md:gap-2 px-1 md:px-3 pb-0.5 md:pb-1.5 pt-1 md:pt-2 text-zinc-600 tracking-tight border border-zinc-500/70 rounded-lg cursor-pointer hover:bg-gray-500 hover:text-white'>
                            <span className='text-xs md:text-base md:leading-5'>بازگشت به بالا</span>
                            <span><HiMiniChevronUp className='w-3 md:w-5 h-3 md:h-5' /></span>
                        </a>
                    </div>

                    <div className='flex flex-col custom-sc:flex-row custom-sc:items-center gap-x-8 gap-y-2  mt-7 text-xs md:text-sm'>
                        <div className='flex items-center gap-x-2 md:gap-x-4 h-4'>
                            <p className='flex items-center gap-x-1 md:gap-x-2'>
                                <span>تلفن پشتیبانی :</span>
                                <a href='tel:1111000 - 021'>1111000 - 021</a>
                            </p>
                            <div className='w-px h-full bg-gray-400'></div>
                            <p className='flex items-center gap-x-1 md:gap-x-2'>
                                <span>آدرس ایمیل :</span>
                                <a href="mailto:info@kiwitech.ir">info@kiwitech.ir</a>
                            </p>
                            <div className='hidden custom-sc:block w-px h-full bg-gray-400'></div>
                        </div>
                        <p className='flex items-center gap-x-2'>
                            شنبه الی پنجشنبه، از 8 صبح الی 18 عصر پاسخگوی شما هستیم.
                        </p>
                    </div>
                </div>

                {/* Footer Content  */}
                <div className='flex flex-wrap items-start 2xl:justify-between gap-y-7 gap-x-16 sm:gap-x-28 custom-sc:gap-x-24 lg:gap-x-28 xl:gap-x-44 2xl:gap-x-0 pt-6 md:pt-10'>
                    {/* <!-- First Col & About Us section -->  */}
                    <div className='footer-col 2xl:max-w-80'>
                        <h2 className='footer-title'>درباره ما</h2>
                        <p className='text-xs md:text-sm md:leading-7'>
                            فروشگاه کیوی تک، بزرگترین وارد کننده لوازم جانبی موبایل در پایتخت کشور
                            فروشگاه لوازم جانبی موبایل مودب به عنوان بزرگترین وارد کننده و پخش کننده لوازم جانبی موبایل با سابقه ی بیش از 7 سال می باشد که
                            در طی این سالها توانسته است نیاز بیش از 3000 همکار در سراسر ایران را بر طرف نماید. در این فروشگاه محصولات با تنوع بالا به صورت عمده و تکی عرضه می شود.
                        </p>
                    </div>

                    {/* <!-- Second Col & Customer Services section -->  */}
                    <div className='footer-col'>
                        <h2 className='footer-title'>خدمات مشتریان</h2>
                        <div className='footer-col__list'>
                            <a href='#'>حساب کاربری من</a>
                            <Link href={'/articles/1'}>بلاگ</Link>
                            <a href='#'>خرید عمده لوازم جانبی موبایل</a>
                            <Link href={'/contact'}>ارتباط با ما</Link>
                        </div>
                    </div>

                    {/* <!-- Third Col & Quick access section -->  */}
                    <div className='footer-col'>
                        <h2 className='footer-title'>دسترسی سریع</h2>
                        <div className='footer-col__list'>
                            <Link href={'/contact'}>ثبت شکایت</Link>
                            <a href='#'>قوانین و مقررات</a>
                            <a href='#'>روش های ارسال</a>
                            <a href='#'>روش های پرداخت</a>
                            <a href='#'>رویه بازگشت کالا</a>
                        </div>
                    </div>

                    {/* <!-- fourth Col & Licenses section -->  */}
                    <div className='footer-col  w-full items-center xs:items-start xs:w-auto'>
                        <h2 className='footer-title'>مجــوزها</h2>
                        <div className='w-20 xs:w-24 md:w-25 h-30 overflow-hidden'>
                            <Swiper
                                spaceBetween={7}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                speed={1200}
                                modules={[Autoplay]}
                                className='mySwiper overflow-visible'
                            >
                                <SwiperSlide>
                                    <img className='w-full h-25 xs:h-28 md:h-30 cursor-pointer' src='/images/licenses/enemad.png' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img className='w-full h-25 xs:h-28 md:h-30 cursor-pointer' src='/images/licenses/rezi.jpg' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img className='w-full h-25 xs:h-28 md:h-30 cursor-pointer' src='/images/licenses/white.png' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img className='w-full h-25 xs:h-28 md:h-30 cursor-pointer' src='/images/licenses/zarin.png' />
                                </SwiperSlide>

                            </Swiper>
                        </div>
                    </div>
                    {/* <!-- fifth Col & Social Medias section -->  */}
                    <div className='footer-col w-full items-center xs:items-start xs:w-auto'>
                        {/* Social Media Links */}
                        <div>
                            <h2 className='footer-title'>شبکه های اجتماعی</h2>
                            <div className='flex-center gap-x-2 pt-1 text-center text-text'>
                                <a className='social-button bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black' href='https://twitter.com/'><RiTwitterXFill className='social-button__icon' /></a>
                                <a className='social-button bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600' href='https://web.whatsapp.com/'><MdOutlineWhatsapp className='social-button__icon' /></a>
                                <a className='social-button bg-red-600 hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600' href='https://www.youtube.com/'><FaYoutube className='social-button__icon' /></a>
                                <a className='social-button bg-pink-600 hover:bg-white hover:text-pink-600 hover:border-2 hover:border-pink-600' href='https://www.instagram.com/'><IoLogoInstagram className='social-button__icon' /></a>
                            </div>
                        </div>

                        <div className='mt-4 md:mt-10'>
                            <h2 className='footer-title'>با ثبت ایمیل، از اخبار کیوی تک باخبر شوید.</h2>
                            <div>
                                <input className='px-1 md:px-3 py-1 xs:py-1.5 md:py-2.5 ml-0.5 xs:ml-1 md:ml-2 text-xs md:text-sm bg-gray-300 border border-gray-700/70 shadow-lg focus:border-none focus:outline-none focus:shadow-white/30 rounded-lg placeholder:text-xs md:placeholder:text-sm' type='email' name='email' placeholder='ایمیل شما' />
                                <button className='px-2 md:px-4 py-0.5 xs:py-1 md:py-2 md:font-DanaMedium text-xs md:text-base bg-gray-300/85 border border-gray-700/70 shadow-lg sm:tracking-wide rounded-lg'>ثبت</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='relative'>
                <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 2900 9000 800"
                    style={{ enableBackground: "new 0 0 9000 4000" }}
                    xmlSpace="preserve"
                >
                    <g>
                        <defs>
                            <path
                                id="SVGID_1_"
                                d="M2642.407,4000H9000v-889.795L2642.407,4000z M0,4000h2642.407L0,2000.007V4000z"
                            />
                        </defs>

                        <clipPath id="clip_1">
                            <use href="#SVGID_1_" style={{ overflow: "visible" }} />
                        </clipPath>

                        <linearGradient
                            id="grad_1"
                            gradientUnits="userSpaceOnUse"
                            x1="4491.1309"
                            y1="3996.7524"
                            x2="4504.8872"
                            y2="2450.7473"
                        >
                            <stop offset="0" stopColor="#2F5A1F" />
                            <stop offset="0.55" stopColor="#6F8618" />
                            <stop offset="1" stopColor="#A3C43A" />
                        </linearGradient>

                        <rect
                            y="3000"
                            width="9000"
                            height="1999.993"
                            style={{
                                clipPath: "url(#clip_1)",
                                fill: "url(#grad_1)",
                            }}
                        />
                    </g>

                    <g>
                        <defs>
                            <polygon
                                id="SVGID_2_"
                                points="8488.95,4000 5999.007,2958.885 0,3729.25 0,4000"
                            />
                        </defs>

                        <clipPath id="clip_2">
                            <use href="#SVGID_2_" style={{ overflow: "visible" }} />
                        </clipPath>

                        <linearGradient
                            id="grad_2"
                            gradientUnits="userSpaceOnUse"
                            x1="4238.5625"
                            y1="4568.7031"
                            x2="4246.5869"
                            y2="3090.3269"
                        >
                            <stop offset="0" stopColor="#243F19" />
                            <stop offset="0.6" stopColor="#4F6F1C" />
                            <stop offset="1" stopColor="#8FBF2A" />
                        </linearGradient>

                        <rect
                            y="2958.885"
                            width="8488.95"
                            height="1041.115"
                            style={{
                                clipPath: "url(#clip_2)",
                                fill: "url(#grad_2)",
                            }}
                        />
                    </g>
                </svg>
                <p className='w-full absolute bottom-0.5 md:bottom-3 xl:bottom-5 2xl:bottom-7 text-center text-[8px] md:text-sm text-zinc-300'>
                    © 1405 تمامی حقوق مادی و معنوی این سایت متعلق به <Link className='md:font-IranYekanBold text-[10px] md:text-base text-white' href='https://github.com/sinakarimiorg'>کـــیـوی تـــک</Link> می‌باشد.
                </p>
            </div>
        </div>
    )
}
