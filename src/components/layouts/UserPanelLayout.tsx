import BreadCrumb from '../modules/BreadCrumb/BreadCrumb'
import Header from '../modules/Header/Header'
import Footer from '../modules/Footer/Footer'
import ProfileSidebar from '../templates/P-user/ProfileSidebar/ProfileSidebar'
import { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {

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

                    <ProfileSidebar/>
                        {children}
                </div>
            </div>


            <Footer marginClasses={''} />

        </div>
    )
}

export default Layout;