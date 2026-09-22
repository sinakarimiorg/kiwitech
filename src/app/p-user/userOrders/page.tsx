import Layout from '@root/src/components/layouts/UserPanelLayout'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import { redirect } from 'next/navigation'
import OrderModel from '@models/Order'
import { UserOrder } from '@root/src/types/userOrderType'
import UserOrdersList from '@root/src/components/templates/P-user/Orders/UserOrdersList'

export const dynamic = 'force-dynamic'

async function page() {
  const user = await getCurrentUser()
  if (!user) redirect('/login-register')

  await connectDB()
    const orders = await OrderModel.find({ user: user._id }).sort({ _id: -1 }).lean()
  const userOrders: UserOrder[] = JSON.parse(JSON.stringify(orders))


  return (
    <Layout>
      <main className='flex-1 min-w-0'>
        <UserOrdersList orders={userOrders} />
      </main>
    </Layout>
  )
}

export default page