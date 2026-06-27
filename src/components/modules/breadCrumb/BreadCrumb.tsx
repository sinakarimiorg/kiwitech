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

        <section className='pt-4 sm:pt-48 pb-3'>
            <div className='container'>
                <div className='flex items-center gap-2 text-sm sm:text-base'>
                    {
                        links.map((link) => (
                            <Link key={link.id} href={link.to} className='flex-center hover:text-primary-500'>
                                {link.title}
                                {
                                    link.id !== links.length &&
                                    <HiOutlineChevronLeft />
                                }
                            </Link>

                        ))
                    }
                </div>
            </div>
        </section>
    )
}
