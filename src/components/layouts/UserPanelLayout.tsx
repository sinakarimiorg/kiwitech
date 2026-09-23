import Header from '../modules/Header/Header'
import Footer from '../modules/Footer/Footer'
import ProfileSidebar from '../templates/P-user/ProfileSidebar/ProfileSidebar'
import { ReactNode } from 'react'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { redirect } from 'next/navigation'
import { connectDB } from '@root/src/lib/mongodb'
import MessageModel from '../../models/Message'
import UserBreadCrumb from '../templates/P-user/UserBreadCrumb/UserBreadCrumb'

type LayoutProps = {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {

    const user = await getCurrentUser()
    if (!user) return redirect("/login-register")

    let unreadMessagesCount = 0
    await connectDB()
    unreadMessagesCount = await MessageModel.countDocuments({ user: user._id, isRead: false })



    return (
        <div>
            <Header />

            <UserBreadCrumb />

            <div className='container pb-11'>
                <div className='flex flex-col lg:flex-row gap-6'>

                    <ProfileSidebar userName={user.name} unreadMessagesCount={unreadMessagesCount} />
                    {children}
                </div>
            </div>


            <Footer marginClasses={''} />

        </div>
    )
}

export default Layout;