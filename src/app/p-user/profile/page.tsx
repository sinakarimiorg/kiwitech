import Layout from '@root/src/components/layouts/UserPanelLayout'
import WalletBar from '@root/src/components/templates/P-user/WalletBar/WalletBar'
import PersonalInfoCard from '@root/src/components/templates/P-user/PersonalInfoCard/PersonalInfoCard'
import RecentOrders from '@root/src/components/templates/P-user/RecentOrders/RecentOrders'

export default function ProfilePage() {
    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <WalletBar balance={0} />
                <PersonalInfoCard />
                <RecentOrders />
            </main>
        </Layout>
    )
}
