import Link from 'next/link';
import React from 'react'
import { HiOutlineChevronLeft } from "react-icons/hi2";


type BreadCrumbLink = {
    id: number
    to: string
    title: string
}

export default function BreadCrumb({ links }: { links: BreadCrumbLink[] }) {
    return (
        <section className='pt-4 sm:pt-54 pb-4'>
            <div className='container px-3'>
                <nav
                    aria-label='مسیر صفحه'
                    className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden'
                >
                    {links.map((link, index) => {
                        const isLast = index === links.length - 1

                        return (
                            <React.Fragment key={link.id}>
                                <Link
                                    href={link.to}
                                    aria-current={isLast ? 'page' : undefined}
                                    className={`hover:text-primary-500 transition-colors ${isLast ? 'min-w-0 text-zinc-500' : 'shrink-0'}`}
                                >
                                    <span className={isLast ? 'block max-w-[55vw] sm:max-w-md md:max-w-xl truncate' : 'whitespace-nowrap'}>
                                        {link.title}
                                    </span>
                                </Link>
                                {!isLast && <HiOutlineChevronLeft className='shrink-0' />}
                            </React.Fragment>
                        )
                    })}
                </nav>
            </div>
        </section>
    )
}
