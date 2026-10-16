import Link from 'next/link'
import { HiMiniChevronRight, HiMiniChevronLeft } from 'react-icons/hi2'

//shows only pages around the current page to avoid overflow on mobile
function getVisiblePages(current: number, total: number): (number | 'gap')[] {
    const pages = new Set<number>([1, total, current - 1, current, current + 1])
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)

    const result: (number | 'gap')[] = []
    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) result.push('gap')
        result.push(page)
    })
    return result
}

export default function Pagination({
    currentPage,
    totalPages,
    basePath,
    query = '',
}: {
    currentPage: number
    totalPages: number
    basePath: string
    query?: string
}) {
    if (totalPages <= 1) return null

    const pages = getVisiblePages(currentPage, totalPages)

    return (
        <nav aria-label='صفحه‌بندی' className='flex items-center justify-center gap-1.5 sm:gap-2 mt-10'>
            <Link
                href={`${basePath}/${Math.max(1, currentPage - 1)}${query}`}
                aria-label='صفحه قبل'
                className={`flex-center gap-1 h-9 px-2.5 sm:px-3 rounded-lg border text-sm transition-colors
                    ${currentPage === 1
                        ? 'pointer-events-none opacity-40 border-gray-200 text-zinc-300'
                        : 'border-gray-200 text-zinc-500 hover:border-primary-400 hover:text-primary-600'}`}>
                <HiMiniChevronRight className='w-4 h-4' />
                <span className='hidden sm:inline'>قبلی</span>
            </Link>

            <div className='flex items-center gap-1 sm:gap-1.5'>
                {pages.map((p, index) =>
                    p === 'gap' ? (
                        <span key={`gap-${index}`} className='px-1 text-zinc-400'>…</span>
                    ) : (
                        <Link
                            key={p}
                            href={`${basePath}/${p}${query}`}
                            aria-current={p === currentPage ? 'page' : undefined}
                            className={`flex-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-IranYekanMedium transition-colors
                                ${p === currentPage
                                    ? 'bg-primary-500 text-white'
                                    : 'text-zinc-500 border border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>
                            {p.toLocaleString('fa-IR')}
                        </Link>
                    )
                )}
            </div>

            <Link
                href={`${basePath}/${Math.min(totalPages, currentPage + 1)}${query}`}
                aria-label='صفحه بعد'
                className={`flex-center gap-1 h-9 px-2.5 sm:px-3 rounded-lg border text-sm transition-colors
                    ${currentPage === totalPages
                        ? 'pointer-events-none opacity-40 border-gray-200 text-zinc-300'
                        : 'border-gray-200 text-zinc-500 hover:border-primary-400 hover:text-primary-600'}`}>
                <span className='hidden sm:inline'>بعدی</span>
                <HiMiniChevronLeft className='w-4 h-4' />
            </Link>
        </nav>
    )
}