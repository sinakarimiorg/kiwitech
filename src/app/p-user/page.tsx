import Header from '@root/src/components/modules/header/header'
import BreadCrumb from '@root/src/components/modules/breadCrumb/breadCrumb'
import Footer from '@root/src/components/modules/footer/footer'
import ProfileSidebar from '@root/src/components/templates/p-user/ProfileSidebar/ProfileSidebar'
import WalletBar from '@root/src/components/templates/p-user/WalletBar/WalletBar'
import PersonalInfoCard from '@root/src/components/templates/p-user/PersonalInfoCard/PersonalInfoCard'
import RecentOrders from '@root/src/components/templates/p-user/RecentOrders/RecentOrders'

export default function ProfilePage() {
    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'پروفایل من', to: '/profile' },
                ]}
            />

            <div className='container pb-10'>
                <div className='flex flex-col lg:flex-row gap-6'>

                    <ProfileSidebar active='personal-info' />

                    <main className='flex-1 min-w-0'>
                        <WalletBar balance={0} />
                        <PersonalInfoCard />
                        <RecentOrders />
                    </main>

                </div>
            </div>

            <Footer marginClasses={''} />
        </div>
    )
}
