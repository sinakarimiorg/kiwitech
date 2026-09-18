import React from 'react'
import { HiMiniChevronLeft } from "react-icons/hi2";
import { PiShieldCheckLight, PiLightningLight, PiSparkleLight } from "react-icons/pi";
import Link from 'next/link'

import './Landing.css'
import TiltCard from './TiltCard';

export default function Landing() {
    return (
        <div className='landing-hero relative overflow-hidden sm:mt-40 sm:pt-20 bg-linear-to-br from-dark via-dark-secondary to-dark'>

            {/* Ambient neon blobs */}
            <div className='pointer-events-none absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-neon/25 rounded-full blur-3xl animate-float-blob' />
            <div className='pointer-events-none absolute -bottom-32 -left-16 w-72 h-72 md:w-96 md:h-96 bg-primary-500/25 rounded-full blur-3xl animate-float-blob' style={{ animationDelay: '3s' }} />

            {/* Subtle tech-grid texture */}
            <div className='landing-grid pointer-events-none absolute inset-0 opacity-[0.07]' />

            <div className='container relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-6 py-16 sm:py-20 md:py-28'>

                {/* Text Column */}
                <div className='flex-1 text-center md:text-right animate-fade-up'>
                    <span className='inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 text-xs sm:text-sm text-neon bg-white/5 border border-neon/25 rounded-full'>
                        <PiSparkleLight className='w-4 h-4' />
                        نسل جدید لوازم جانبی موبایل
                    </span>

                    <h1 className='font-MorabbaBold text-3xl sm:text-4xl md:text-5xl xl:text-6xl leading-tight text-text'>
                        تکنولوژی رو
                        <span className='block text-neon neon-text-glow mt-1'>یه‌جور دیگه تجربه کن</span>
                    </h1>

                    <p className='mt-5 max-w-md mx-auto md:mx-0 text-sm sm:text-base text-text-muted leading-8'>
                        از هندزفری‌های بی‌سیم تا پاوربانک‌های پرقدرت؛ کیوی‌تک هرچی که برای گوشیت لازم داری رو با اصالت کامل و ارسال سریع میاره جلوی درت.
                    </p>

                    <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8'>
                        <Link href='/products/1' className='group flex-center gap-2 px-6 py-3 text-sm sm:text-base font-DanaMedium bg-neon text-surface rounded-2xl shadow-[0_0_30px_rgba(215,255,92,0.35)] hover:shadow-[0_0_45px_rgba(215,255,92,0.55)] transition-shadow'>
                            شروع خرید
                            <HiMiniChevronLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                        </Link>
                        <Link href='/articles/1' className='px-6 py-3 text-sm sm:text-base text-text border border-white/15 hover:border-neon/50 rounded-2xl transition-colors'>
                            بلاگ موبولند
                        </Link>
                    </div>

                    <div className='flex items-center justify-center md:justify-start gap-6 mt-10 text-text-muted text-xs sm:text-sm'>
                        <span className='flex items-center gap-1.5'>
                            <PiShieldCheckLight className='w-5 h-5 text-neon' />
                            ضمانت اصالت کالا
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <PiLightningLight className='w-5 h-5 text-neon' />
                            ارسال فوری تهران
                        </span>
                    </div>
                </div>

                {/* Tilt Spotlight Card */}
                <div className='flex-1 flex-center w-full max-w-xs sm:max-w-sm'>
                    <TiltCard />
                </div>
            </div>
        </div>
    )
}
