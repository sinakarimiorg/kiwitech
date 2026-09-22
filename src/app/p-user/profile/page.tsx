import Layout from '@root/src/components/layouts/UserPanelLayout'
import WalletBar from '@root/src/components/templates/P-user/Profile/WalletBar'
import PersonalInfoCard from '@root/src/components/templates/P-user/Profile/PersonalInfoCard'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { UserProfile } from '@root/src/types/userType'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) redirect('/login-register')

    const user: UserProfile = {
        _id: currentUser._id,
        name: currentUser.name,
        phone: currentUser.phone,
        email: currentUser.email,
        nationalCode: currentUser.nationalCode,
        walletBalance: currentUser.walletBalance ?? 0,
        birthDate: currentUser.birthDate,
        status: currentUser.status,
    }

    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <WalletBar balance={user.walletBalance} />
                <PersonalInfoCard user={user}/>
            </main>
        </Layout>
    )
}
