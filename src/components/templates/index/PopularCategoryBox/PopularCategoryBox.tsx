import Link from "next/link"
import { IconType } from "react-icons"
import { HiMiniChevronLeft } from "react-icons/hi2"

type PopularCategoryBoxProps = {
    icon: IconType
    title: string
    subtitle?: string
    href: string
}

export default function PopularCategoryBox({ icon: Icon, title, subtitle, href }: PopularCategoryBoxProps) {
    return (
        <Link
            href={href}
            className='group relative flex items-center gap-4 p-4 sm:p-5 bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-200/50'
        >
            <span className='pointer-events-none absolute -top-10 -left-10 w-28 h-28 rounded-full bg-neon/0 group-hover:bg-neon/30 blur-2xl transition-all duration-500' />

            <span className='relative flex-center w-14 h-14 shrink-0 text-primary-600 bg-primary-50 group-hover:bg-primary-100 rounded-2xl transition-colors'>
                <Icon className='w-7 h-7 group-hover:scale-110 transition-transform duration-300' />
            </span>

            <span className='relative flex-1 min-w-0'>
                <span className='block font-IranYekanBold text-sm sm:text-base text-zinc-800 group-hover:text-primary-600 transition-colors line-clamp-1'>
                    {title}
                </span>
                {subtitle &&
                    <span className='block mt-1 text-xs text-zinc-400 line-clamp-1'>{subtitle}</span>
                }
            </span>

            <HiMiniChevronLeft className='relative w-5 h-5 shrink-0 text-zinc-300 group-hover:text-primary-500 group-hover:-translate-x-1 transition-all' />
        </Link>
    )
}
