import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@root/src/lib/auth/session'

export const metadata: Metadata = {
    title: 'پنل مدیریت | کیوی‌تک',
    robots: { index: false, follow: false },
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()

    if (!user) redirect('/login-register')
    if (user.role !== 'ادمین') notFound()

    return <>{children}</>
}
