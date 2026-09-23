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
    const cardClasses = `group block h-full bg-white shadow-lg rounded-2xl p-5 transition-all duration-300 ease-out
        ${href ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60 cursor-pointer' : ''}`

    const content = (
        <>
            <div className='flex items-start justify-between'>
                <span className={`flex-center w-11 h-11 rounded-xl ${accentMap[accent]}`}>
                    <Icon className='w-6 h-6' />
                </span>
                {href &&
                    <HiMiniChevronLeft className='w-5 h-5 text-zinc-300 group-hover:text-primary-500 group-hover:-translate-x-0.5 transition-all' />
                }
            </div>

            <p className='mt-4 font-IranYekanBold text-xl sm:text-2xl text-zinc-800 wrap-break-word'>
                {value}
                {unit && <span className='mr-1.5 font-IranYekan text-xs text-zinc-400'>{unit}</span>}
            </p>
            <p className='mt-1 text-sm text-zinc-500'>{label}</p>
            {hint && <p className='mt-1.5 text-xs text-zinc-400 leading-5'>{hint}</p>}
        </>
    )


    return href
        ? <Link href={href} className={cardClasses}>{content}</Link>
        : <div className={cardClasses}>{content}</div>
}
