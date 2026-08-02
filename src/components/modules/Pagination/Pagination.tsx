import Link from 'next/link'
import { HiMiniChevronRight, HiMiniChevronLeft } from 'react-icons/hi2'

export default function Pagination({
    currentPage,
    totalPages,
    basePath,
}: {
    currentPage: number
    totalPages: number
    basePath: string
}) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className='flex items-center justify-center gap-1.5 sm:gap-2 mt-10'>
            <Link
                href={`${basePath}/${Math.max(1, currentPage - 1)}`}
                className={`flex-center gap-1 h-9 px-3 rounded-lg border text-sm transition-colors
                    ${currentPage === 1
                        ? 'pointer-events-none opacity-40 border-gray-200 text-zinc-300'
                        : 'border-gray-200 text-zinc-500 hover:border-primary-400 hover:text-primary-600'}`}>
                <HiMiniChevronRight className='w-4 h-4' />
                <span className='hidden sm:inline'>قبلی</span>
            </Link>

            <div className='flex items-center gap-1.5'>
                {pages.map(p => (
                    <Link
                        key={p}
                        href={`${basePath}/${p}`}
                        className={`flex-center w-9 h-9 rounded-lg text-sm font-IranYekanMedium transition-colors
                            ${p === currentPage
                                ? 'bg-primary-500 text-white'
                                : 'text-zinc-500 border border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>
                        {p.toLocaleString('fa-IR')}
                    </Link>
                ))}
            </div>

            <Link
                href={`${basePath}/${Math.min(totalPages, currentPage + 1)}`}
                className={`flex-center gap-1 h-9 px-3 rounded-lg border text-sm transition-colors
                    ${currentPage === totalPages
                        ? 'pointer-events-none opacity-40 border-gray-200 text-zinc-300'
                        : 'border-gray-200 text-zinc-500 hover:border-primary-400 hover:text-primary-600'}`}>
                <span className='hidden sm:inline'>بعدی</span>
                <HiMiniChevronLeft className='w-4 h-4' />
            </Link>
        </div>
    )
}