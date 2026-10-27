import Layout from '@root/src/components/layouts/UserPanelLayout'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import WalletTransactionModel from '@root/src/models/WalletTransaction'
import { UserWalletTransaction } from '@root/src/types/userWalletType'
import { redirect } from 'next/navigation'
import PaymentNotice from '@root/src/components/templates/P-user/Wallet/PaymentNotice'
import WalletOverviewCard from '@root/src/components/templates/P-user/Wallet/WalletOverviewCard'
import WalletTransactionsList from '@root/src/components/templates/P-user/Wallet/WalletTransactionsList'

export const dynamic = "force-dynamic"

export default async function WalletPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
    const { payment } = await searchParams
    const user = await getCurrentUser()
    if (!user) redirect('/login-register')

    await connectDB()
    const transactionsRaw = await WalletTransactionModel.find({ user: user._id }).sort({ _id: -1 }).lean()
    const transactions: UserWalletTransaction[] = JSON.parse(JSON.stringify(transactionsRaw))

    return (
        <Layout>
            <main className='flex-1 min-w-0 flex flex-col gap-6'>
                <PaymentNotice status={payment} />
                <WalletOverviewCard balance={user.walletBalance ?? 0} />
                <WalletTransactionsList transactions={transactions} />
            </main>
        </Layout>
    )
}