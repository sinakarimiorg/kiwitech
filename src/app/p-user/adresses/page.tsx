import Layout from '@root/src/components/layouts/UserPanelLayout'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import AddressModel from '@root/src/models/Address'
import AddressesList from '@root/src/components/templates/P-user/Addresses/AddressesList'
import type { UserAddress } from '@root/src/types/userAddressType'

export const dynamic = 'force-dynamic'

export default async function page() {
    const user = await getCurrentUser()
    if (!user) redirect('/login-register')

    await connectDB()
    const addresses = await AddressModel.find({ user: user._id }).sort({ isDefault: -1, _id: -1 }).lean()
    const userAddresses: UserAddress[] = JSON.parse(JSON.stringify(addresses))

    return (
        <Layout>
            <main className='flex-1 min-w-0'>
                <AddressesList initialAddresses={userAddresses} />
            </main>
        </Layout>
    )
}
