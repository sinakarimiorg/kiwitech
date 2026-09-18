import Header from '@root/src/components/modules/Header/Header'
import Footer from '@root/src/components/modules/Footer/Footer'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import ContactForm from '@root/src/components/templates/Contact/ContactForm/ContactForm'
import ContactMap from '@root/src/components/templates/Contact/ContactMap/ContactMap'

import { PiPhoneCallLight, PiEnvelopeSimpleLight, PiMapPinLight, PiClockLight } from 'react-icons/pi'
import { IoLogoInstagram } from 'react-icons/io'
import { MdOutlineWhatsapp } from 'react-icons/md'
import { RiTwitterXFill } from 'react-icons/ri'

export const metadata = {
    title: 'ارتباط با ما | کیوی‌تک',
    description: 'راه‌های تماس با فروشگاه کیوی‌تک و ارسال پیام به تیم پشتیبانی',
}

export default function ContactPage() {
    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'ارتباط با ما', to: '/contact' },
                ]}
            />

            <div className='container pb-16'>

                <div className='max-w-2xl mx-auto text-center mb-10'>
                    <h1 className='font-MorabbaBold text-2xl sm:text-3xl text-zinc-800'>در ارتباط باشیم</h1>
                    <p className='mt-3 text-sm sm:text-base text-zinc-500 leading-7'>
                        سوالی درباره سفارش، محصولات یا همکاری با کیوی‌تک داری؟ فرم زیر را پر کن یا از راه‌های ارتباطی دیگر با ما در تماس باش.
                    </p>
                </div>

                {/* کارت‌های اطلاعات تماس */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10'>
                    <div className='glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3'>
                        <span className='flex-center w-12 h-12 bg-primary-50 text-primary-600 rounded-full'>
                            <PiPhoneCallLight className='w-6 h-6' />
                        </span>
                        <div>
                            <p className='text-sm text-zinc-500'>تماس تلفنی</p>
                            <a href='tel:02111111000' className='block mt-1 font-IranYekanBold text-zinc-800 ltr-dir'>021-1111000</a>
                        </div>
                    </div>
                    <div className='glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3'>
                        <span className='flex-center w-12 h-12 bg-primary-50 text-primary-600 rounded-full'>
                            <PiEnvelopeSimpleLight className='w-6 h-6' />
                        </span>
                        <div>
                            <p className='text-sm text-zinc-500'>ایمیل</p>
                            <a href='mailto:info@kiwitech.ir' className='block mt-1 font-IranYekanBold text-zinc-800 ltr-dir'>info@kiwitech.ir</a>
                        </div>
                    </div>
                    <div className='glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3'>
                        <span className='flex-center w-12 h-12 bg-primary-50 text-primary-600 rounded-full'>
                            <PiClockLight className='w-6 h-6' />
                        </span>
                        <div>
                            <p className='text-sm text-zinc-500'>ساعات پاسخگویی</p>
                            <p className='mt-1 font-IranYekanBold text-zinc-800'>شنبه تا پنجشنبه، ۸ الی ۱۸</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-6 xl:gap-10'>
                    {/* فرم تماس */}
                    <div className='flex-1 min-w-0 bg-white shadow-lg rounded-2xl p-5 sm:p-7'>
                        <h2 className='font-IranYekanBold text-lg text-zinc-800 pb-4 mb-5 border-b border-gray-100'>ارسال پیام</h2>
                        <ContactForm />
                    </div>

                    {/* نقشه + شبکه‌های اجتماعی */}
                    <aside className='w-full lg:w-96 shrink-0 flex flex-col gap-5'>
                        <div className='relative z-0 h-64 lg:h-80 bg-white shadow-lg rounded-2xl overflow-hidden'>
                            <ContactMap />
                        </div>

                        <div className='bg-white shadow-lg rounded-2xl p-5 flex flex-col gap-3'>
                            <div className='flex items-start gap-2 text-sm text-zinc-600'>
                                <PiMapPinLight className='w-5 h-5 text-primary-500 shrink-0 mt-0.5' />
                                <span>تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲</span>
                            </div>
                            <div className='flex items-center gap-2 pt-3 border-t border-gray-100'>
                                <a className='social-button bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black' href='https://twitter.com/'><RiTwitterXFill className='social-button__icon' /></a>
                                <a className='social-button bg-green-600 hover:bg-white hover:text-green-600 hover:border-2 hover:border-green-600' href='https://web.whatsapp.com/'><MdOutlineWhatsapp className='social-button__icon' /></a>
                                <a className='social-button bg-pink-600 hover:bg-white hover:text-pink-600 hover:border-2 hover:border-pink-600' href='https://www.instagram.com/'><IoLogoInstagram className='social-button__icon' /></a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}