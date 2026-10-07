import Link from 'next/link'
import type { IconType } from 'react-icons'
import { HiMiniChevronLeft } from 'react-icons/hi2'

type StatCardProps = {
    label: string
    value: string
    icon: IconType
    accent: 'primary' | 'neon' | 'danger'
    unit?: string
    hint?: string
    href?: string
}

const accentMap: Record<StatCardProps['accent'], string> = {
    primary: 'bg-primary-50 text-primary-600',
    neon: 'bg-neon-soft text-primary-700',
    danger: 'bg-danger/10 text-danger',
}

export default function StatCard({ label, value, icon: Icon, accent, unit, hint, href }: StatCardProps) {
    const cardClasses = `group block h-full min-w-0 bg-white shadow-lg rounded-2xl p-4 sm:p-5 transition-all duration-300 ease-out
        ${href ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60 cursor-pointer' : ''}`

    const content = (
        <>
            <div className='flex items-start justify-between'>
                <span className={`flex-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${accentMap[accent]}`}>
                    <Icon className='w-5 h-5 sm:w-6 sm:h-6' />
                </span>
                {href &&
                    <HiMiniChevronLeft className='w-5 h-5 text-zinc-300 group-hover:text-primary-500 group-hover:-translate-x-0.5 transition-all' />
                }
            </div>

            <p className='mt-3 sm:mt-4 font-IranYekanBold text-lg sm:text-2xl text-zinc-800 break-words leading-tight'>
                {value}
                {unit && <span className='block sm:inline sm:mr-1.5 mt-0.5 sm:mt-0 font-IranYekan text-[11px] sm:text-xs text-zinc-400'>{unit}</span>}
            </p>
            <p className='mt-1 text-xs sm:text-sm text-zinc-500'>{label}</p>
            {hint && <p className='mt-1.5 text-[11px] sm:text-xs text-zinc-400 leading-5'>{hint}</p>}
        </>
    )


    return href
        ? <Link href={href} className={cardClasses}>{content}</Link>
        : <div className={cardClasses}>{content}</div>
}
