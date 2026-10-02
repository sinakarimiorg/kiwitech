import Link from 'next/link'
import Header from '../components/modules/Header/Header'
import Footer from '../components/modules/Footer/Footer'
import SearchBox from '../components/modules/SearchBox/SearchBox'
import BackButton from '../components/modules/BackButton/BackButton'
import {
  PiLightningFill,
  PiLightningLight,
  PiStorefrontLight,
  PiArticleLight,
  PiHeadsetLight,
  PiHouseLight,
} from 'react-icons/pi'

const quickLinks = [
  { href: '/products/1', label: 'همه محصولات', icon: PiStorefrontLight },
  { href: '/amazing-offers/1', label: 'شگفت‌انگیزها', icon: PiLightningLight },
  { href: '/articles/1', label: 'مطالب خواندنی', icon: PiArticleLight },
  { href: '/contact', label: 'تماس با ما', icon: PiHeadsetLight },
]

export default function NotFound() {
  return (
    <>
        <Header />

      <main className='container px-3 sm:px-0 pt-6 sm:pt-44 pb-4'>
        <section className='relative overflow-hidden rounded-3xl bg-linear-to-br from-dark via-dark-secondary to-dark px-5 sm:px-10 py-10 sm:py-14 text-center text-text shadow-[0_20px_50px_rgba(15,17,21,0.25)]'>

          <div className='pointer-events-none absolute -top-24 -right-20 w-72 h-72 bg-neon/20 rounded-full blur-3xl' />
          <div className='pointer-events-none absolute -bottom-28 -left-16 w-72 h-72 bg-primary-500/25 rounded-full blur-3xl' />

          <div className='relative z-10 max-w-2xl mx-auto'>

            <div
              aria-hidden='true'
              className='flex items-center justify-center gap-[0.04em] font-gotham font-bold leading-none text-[clamp(5rem,26vw,11rem)] select-none'
            >
              <span className='text-neon neon-text-glow'>4</span>
              <span className='flex items-center justify-center w-[0.66em] h-[0.66em] rounded-full border-[0.075em] border-white/90 text-neon'>
                <PiLightningFill className='w-[0.3em] h-[0.3em]' />
              </span>
              <span className='text-neon neon-text-glow'>4</span>
            </div>

            <h1 className='mt-6 font-MorabbaBold text-2xl sm:text-4xl leading-relaxed'>
              صفحه‌ای که دنبالش بودی پیدا نشد!
            </h1>
            <p className='mt-3 text-sm sm:text-base text-text-muted leading-8'>
              ممکن است آدرس اشتباه وارد شده باشد، یا صفحه منتقل یا حذف شده باشد.
              می‌توانی جستجو کنی یا از لینک‌های زیر ادامه بدهی.
            </p>

            <div className='mt-7 max-w-md mx-auto'>
              <SearchBox placeholder='دنبال چی می‌گردی؟' />
            </div>

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6'>
              <Link
                href='/'
                className='group flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base bg-neon text-surface rounded-2xl shadow-[0_0_30px_rgba(215,255,92,0.35)] hover:shadow-[0_0_45px_rgba(215,255,92,0.55)] transition-shadow'
              >
                <PiHouseLight className='w-5 h-5' />
                بازگشت به صفحه اصلی
              </Link>
              <BackButton
                className='px-6 py-3 text-sm sm:text-base text-text border border-white/15 hover:border-neon/50 rounded-2xl transition-colors'
              />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8'>
              {quickLinks.map(link => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='flex flex-col items-center gap-2 px-2 py-4 text-xs sm:text-sm text-text-muted bg-white/5 border border-white/10 hover:border-neon/40 hover:text-neon rounded-2xl transition-colors'
                  >
                    <Icon className='w-6 h-6' />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer marginClasses={'mt-16 sm:mt-24'} />
    </>
  )
}
