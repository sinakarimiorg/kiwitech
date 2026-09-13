import BreadCrumb from '../modules/BreadCrumb/BreadCrumb'
import Header from '../modules/Header/Header'
import Footer from '../modules/Footer/Footer'
import ProfileSidebar from '../templates/P-user/ProfileSidebar/ProfileSidebar'
import { ReactNode } from 'react'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { redirect } from 'next/navigation'

type LayoutProps = {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {

    const user = await getCurrentUser()
    if (!user) return redirect("/login-register")

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'پروفایل من', to: '/profile' },
                ]}
            />

            <div className='container pb-11'>
                <div className='flex flex-col lg:flex-row gap-6'>

                    <ProfileSidebar userName={user.name} />
                    {children}
                </div>
            </div>


            <Footer marginClasses={''} />

        </div>
    )
}

export default Layout;