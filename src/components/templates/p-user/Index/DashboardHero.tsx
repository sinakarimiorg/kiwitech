import Link from 'next/link'
import { PiArrowLeftLight, PiCheckCircleFill } from 'react-icons/pi'

type DashboardHeroProps = {
    user: {
        name?: string
        email?: string
        nationalCode?: string
        birthDate?: string
        createdAt?: string
    }
}

const DEFAULT_NAME = 'کاربر جدید'

export default function DashboardHero({ user }: DashboardHeroProps) {
    const name = user.name?.trim() || DEFAULT_NAME
    const hasRealName = name !== DEFAULT_NAME

    //Complete Profile
    const fields = [
        { label: 'نام و نام خانوادگی', filled: hasRealName },
        { label: 'ایمیل', filled: !!user.email },
        { label: 'کد ملی', filled: !!user.nationalCode },
        { label: 'تاریخ تولد', filled: !!user.birthDate },
    ]
    const missing = fields.filter(f => !f.filled).map(f => f.label)
    const percent =  Math.round(((fields.length - missing.length) / fields.length) * 100)

    const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })
    : null



    return (
                <section className='relative overflow-hidden rounded-3xl bg-linear-to-br from-dark via-dark-secondary to-dark px-5 sm:px-8 py-6 sm:py-8 text-text'>

            <div className='pointer-events-none absolute -top-20 -left-16 w-64 h-64 bg-neon/20 rounded-full blur-3xl' />
            <div className='pointer-events-none absolute -bottom-24 right-10 w-64 h-64 bg-primary-500/25 rounded-full blur-3xl' />

            <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>

                <div className='flex items-center gap-4 sm:gap-5'>
                    <span className='flex-center w-16 h-16 sm:w-20 sm:h-20 shrink-0 font-MorabbaBold text-2xl sm:text-3xl text-neon bg-surface-3 rounded-full ring-2 ring-neon/60 ring-offset-4 ring-offset-dark-secondary'>
                        {name.charAt(0)}
                    </span>

                    <div>
                        <h1 className='font-MorabbaBold text-xl sm:text-2xl leading-9'>
                            {hasRealName ? `سلام ${name}، خوش اومدی` : 'سلام، خوش اومدی'}
                        </h1>
                        {memberSince &&
                            <p className='mt-1 text-xs sm:text-sm text-text-muted'>عضو کیوی‌تک از {memberSince}</p>
                        }
                        <Link
                            href='/products/1'
                            className='group inline-flex items-center gap-2 mt-4 px-5 py-2.5 text-sm bg-neon text-surface rounded-xl shadow-[0_0_24px_rgba(215,255,92,0.3)] hover:shadow-[0_0_36px_rgba(215,255,92,0.5)] transition-shadow'
                        >
                            ادامه‌ی خرید
                            <PiArrowLeftLight className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                        </Link>
                    </div>
                </div>

                <div className='w-full md:w-72 shrink-0 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-text-muted'>تکمیل پروفایل</span>
                        <span className='font-IranYekanBold text-neon'>{percent.toLocaleString('fa-IR')}٪</span>
                    </div>

                    <div className='mt-3 h-2 rounded-full bg-white/10 overflow-hidden'>
                        <div
                            className='h-full rounded-full bg-linear-to-l from-primary-500 to-neon'
                            style={{ width: `${percent}%` }}
                        />
                    </div>

                    {missing.length > 0 ? (
                        <>
                            <p className='mt-3 text-xs leading-6 text-text-muted'>
                                {missing.join('، ')} هنوز ثبت نشده.
                            </p>
                            <Link href='/p-user/profile' className='inline-flex items-center gap-1 mt-1 text-xs text-neon hover:underline'>
                                تکمیل اطلاعات
                                <PiArrowLeftLight className='w-3.5 h-3.5' />
                            </Link>
                        </>
                    ) : (
                        <p className='flex items-center gap-1.5 mt-3 text-xs text-text-muted'>
                            <PiCheckCircleFill className='w-4 h-4 text-neon' />
                            اطلاعات پروفایل شما کامل است
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
