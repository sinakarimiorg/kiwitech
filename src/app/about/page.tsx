import Link from 'next/link'
import Header from '@root/src/components/modules/Header/Header'
import Footer from '@root/src/components/modules/Footer/Footer'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'

import {
    PiCalendarCheckLight,
    PiUsersThreeLight,
    PiPackageLight,
    PiSmileyLight,
    PiTruckLight,
    PiShieldCheckLight,
    PiCreditCardLight,
    PiHeadsetLight,
    PiArrowLeftLight,
} from 'react-icons/pi'

export const metadata = {
    title: 'درباره ما | کیوی‌تک',
    description: 'آشنایی با فروشگاه کیوی‌تک، بزرگترین واردکننده و پخش‌کننده لوازم جانبی موبایل',
}

const stats = [
    { icon: PiCalendarCheckLight, value: '+۷', label: 'سال تجربه در بازار' },
    { icon: PiUsersThreeLight, value: '+۳۰۰۰', label: 'همکار در سراسر ایران' },
    { icon: PiPackageLight, value: '+۵۰۰', label: 'محصول متنوع' },
    { icon: PiSmileyLight, value: '۹۸٪', label: 'رضایت مشتریان' },
]

const whyUs = [
    { icon: PiTruckLight, title: 'ارسال سریع', desc: 'ارسال به سراسر کشور در سریع‌ترین زمان ممکن' },
    { icon: PiShieldCheckLight, title: 'ضمانت اصل بودن کالا', desc: 'تمامی محصولات کیوی‌تک دارای ضمانت اصالت هستند' },
    { icon: PiCreditCardLight, title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق تمامی کارت‌های عضو شتاب' },
    { icon: PiHeadsetLight, title: 'پشتیبانی همیشگی', desc: 'پاسخگویی تیم پشتیبانی از شنبه تا پنجشنبه' },
]

export default function AboutPage() {
    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'درباره ما', to: '/about' },
                ]}
            />

            <div className='container pb-16'>

                {/* Hero */}
                <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-50 via-white to-primary-100 px-6 sm:px-10 py-12 sm:py-16 text-center mb-12'>
                    <div className='absolute -top-16 -right-10 w-52 h-52 bg-primary-300/40 blur-3xl rounded-full' />
                    <div className='absolute -bottom-16 -left-10 w-52 h-52 bg-primary-200/40 blur-3xl rounded-full' />

                    <div className='relative z-10 max-w-2xl mx-auto'>
                        <h1 className='font-MorabbaBold text-2xl sm:text-4xl text-zinc-800 leading-relaxed'>
                            کیوی‌تک، خانه‌ی لوازم جانبی موبایل شما
                        </h1>
                        <p className='mt-4 text-sm sm:text-base text-zinc-500 leading-8'>
                            از سال‌ها پیش، هدف ما رسوندن باکیفیت‌ترین لوازم جانبی موبایل و کامپیوتر
                            با بهترین قیمت به دست شماست؛ با تنوع بالا، ضمانت اصالت کالا و پشتیبانی واقعی.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14'>
                    {stats.map(stat => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.label} className='bg-white shadow-lg rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center gap-2'>
                                <span className='flex-center w-11 h-11 bg-primary-50 text-primary-600 rounded-full'>
                                    <Icon className='w-6 h-6' />
                                </span>
                                <p className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>{stat.value}</p>
                                <p className='text-xs sm:text-sm text-zinc-500'>{stat.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Story */}
                <div className='flex flex-col lg:flex-row items-center gap-8 xl:gap-14 mb-16'>
                    <div className='w-full lg:w-1/2'>
                        <span className='inline-block px-3 py-1 mb-4 text-xs font-IranYekanMedium text-primary-600 bg-primary-50 rounded-lg'>
                            داستان ما
                        </span>
                        <h2 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800 leading-relaxed'>
                            از یک فروشگاه کوچک تا بزرگترین واردکننده‌ی لوازم جانبی موبایل
                        </h2>
                        <p className='mt-4 text-sm sm:text-base text-zinc-500 leading-8'>
                            فروشگاه کیوی‌تک با بیش از هفت سال سابقه، امروز به یکی از بزرگترین وارد‌کننده‌ها
                            و پخش‌کننده‌های لوازم جانبی موبایل در ایران تبدیل شده است. در طول این سال‌ها
                            توانسته‌ایم نیاز بیش از سه‌هزار همکار در سراسر کشور را برطرف کنیم و محصولات
                            متنوعی را هم به‌صورت عمده و هم تکی در اختیار مشتریان قرار دهیم.
                        </p>
                        <p className='mt-4 text-sm sm:text-base text-zinc-500 leading-8'>
                            رسالت ما ساده‌تر کردن دسترسی به تکنولوژی برای همه است؛ با تیمی متخصص، انبار
                            به‌روز و فرآیند سفارش و ارسال سریع، در کنار شما هستیم تا بهترین تجربه‌ی خرید
                            آنلاین را داشته باشید.
                        </p>
                    </div>

                    <div className='w-full lg:w-1/2'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='glass-card rounded-2xl p-6 h-40 flex flex-col justify-center'>
                                <p className='font-MorabbaBold text-lg text-zinc-800'>تیم متخصص</p>
                                <p className='mt-2 text-xs text-zinc-500 leading-6'>کارشناسانی که محصول رو خوب می‌شناسن</p>
                            </div>
                            <div className='glass-card rounded-2xl p-6 h-40 mt-8 flex flex-col justify-center'>
                                <p className='font-MorabbaBold text-lg text-zinc-800'>انبار به‌روز</p>
                                <p className='mt-2 text-xs text-zinc-500 leading-6'>موجودی واقعی و ارسال فوری</p>
                            </div>
                            <div className='glass-card rounded-2xl p-6 h-40 -mt-8 flex flex-col justify-center'>
                                <p className='font-MorabbaBold text-lg text-zinc-800'>قیمت منصفانه</p>
                                <p className='mt-2 text-xs text-zinc-500 leading-6'>رقابتی، هم برای خرید تکی هم عمده</p>
                            </div>
                            <div className='glass-card rounded-2xl p-6 h-40 flex flex-col justify-center'>
                                <p className='font-MorabbaBold text-lg text-zinc-800'>ضمانت اصالت</p>
                                <p className='mt-2 text-xs text-zinc-500 leading-6'>تمامی کالاها دارای ضمانت هستند</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Us */}
                <div className='mb-16'>
                    <div className='text-center max-w-xl mx-auto mb-8'>
                        <h2 className='font-MorabbaBold text-xl sm:text-2xl text-zinc-800'>چرا کیوی‌تک؟</h2>
                        <p className='mt-2 text-sm text-zinc-500'>چیزی که ما رو از بقیه متفاوت می‌کنه</p>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
                        {whyUs.map(item => {
                            const Icon = item.icon
                            return (
                                <div key={item.title} className='bg-white shadow-lg rounded-2xl p-5 flex flex-col gap-3'>
                                    <span className='flex-center w-11 h-11 bg-primary-50 text-primary-600 rounded-xl'>
                                        <Icon className='w-6 h-6' />
                                    </span>
                                    <h3 className='font-IranYekanBold text-sm sm:text-base text-zinc-800'>{item.title}</h3>
                                    <p className='text-xs sm:text-sm text-zinc-500 leading-6'>{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-primary-500 px-6 sm:px-10 py-10 sm:py-12 text-center text-white'>
                    <h2 className='font-MorabbaBold text-xl sm:text-2xl'>می‌خوای با ما همکاری کنی یا سوالی داری؟</h2>
                    <p className='mt-3 text-sm sm:text-base text-white/85'>
                        تیم کیوی‌تک همیشه آماده‌ی شنیدن پیشنهادها و پاسخگویی به سوالات شماست.
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-6'>
                        <Link href='/contact' className='flex-center gap-1.5 px-6 py-3 text-sm sm:text-base text-primary-700 bg-white hover:bg-primary-50 rounded-xl transition-colors'>
                            همکاری با کیوی‌تک
                            <PiArrowLeftLight className='w-4 h-4' />
                        </Link>
                        <Link href='/contact' className='flex-center gap-1.5 px-6 py-3 text-sm sm:text-base text-white border border-white/60 hover:bg-white/10 rounded-xl transition-colors'>
                            ارتباط با ما
                        </Link>
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
