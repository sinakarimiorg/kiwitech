"use client"

import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import { usePathname } from 'next/navigation'

const USER_PANEL_BASE = '/p-user'

const sectionTitles: Record<string, string> = {
    userOrders: 'سفارش‌های من',
    favorites: 'کالاهای مورد علاقه',
    addresses: 'نشانی‌ها',
    messages: 'پیام‌ها',
    profile: 'مشخصات فردی',
    wallet: 'کیف پول',
}

export default function UserBreadCrumb() {
    const pathname = usePathname()

    // find the page title
    // "/p-user/favorites" -> ["favorites"]
    const segments = pathname
        .replace(USER_PANEL_BASE, '')
        .split('/')
        .filter(Boolean)

    const links = [
        { title: 'فروشگاه کیوی‌تک', to: '/' },
        { title: 'پروفایل من', to: USER_PANEL_BASE },
    ]

    let currentPath = USER_PANEL_BASE

    segments.forEach(segment => {
        currentPath += `/${segment}`
        const title = sectionTitles[segment]
        if(title) links.push({ title, to: currentPath })
    })


    return (
        <BreadCrumb
            links={links.map((link, index) => ({ id: index + 1, ...link }))}
        />
    )
}
