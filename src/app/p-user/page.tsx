import Layout from '@root/src/components/layouts/UserPanelLayout'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import OrderModel from '@root/src/models/Order'
import MessageModel from '@root/src/models/Message'
import FavoriteModel from '@root/src/models/Favorite'
import StatCard from '@root/src/components/templates/P-user/Index/StatCard'
import RecentOrders from '@root/src/components/templates/P-user/RecentOrders/RecentOrders'
import type { AdminOrder } from '@root/src/types/adminOrderType'

import {
  PiWalletLight,
  PiShoppingBagOpenLight,
  PiEnvelopeSimpleLight,
  PiHeartLight,
} from 'react-icons/pi'

export const dynamic = 'force-dynamic'

export default async function UserDashboardPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login-register')

  await connectDB()

  const [ordersRaw, pendingOrdersCount, unreadMessagesCount, favoritesCount] = await Promise.all([
    OrderModel.find({ user: currentUser._id }).sort({ _id: -1 }).limit(3).lean(),
    OrderModel.countDocuments({ user: currentUser._id, status: 'در حال پردازش' }),
    MessageModel.countDocuments({ user: currentUser._id, isRead: false }),
    FavoriteModel.countDocuments({ user: currentUser._id }),
  ])

  const recentOrders: AdminOrder[] = JSON.parse(JSON.stringify(ordersRaw))

  return (
    <Layout>
      <main className='flex-1 min-w-0 flex flex-col gap-6'>

        <div>
          <h1 className='font-IranYekanBold text-xl text-zinc-800'>سلام {currentUser.name} 👋</h1>
          <p className='text-sm text-zinc-400 mt-1'>خلاصه‌ای از فعالیت‌های حساب کاربری شما</p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
          <StatCard
            label="موجودی کیف پول"
            value={`${(currentUser.walletBalance ?? 0).toLocaleString()} تومان`}
            icon={PiWalletLight}
            accent="primary"
          />
          <StatCard
            label="سفارش‌های در حال پردازش"
            value={pendingOrdersCount.toLocaleString('fa-IR')}
            icon={PiShoppingBagOpenLight}
            accent="neon"
          />
          <StatCard
            label="پیام‌های نخوانده"
            value={unreadMessagesCount.toLocaleString('fa-IR')}
            icon={PiEnvelopeSimpleLight}
            accent={unreadMessagesCount > 0 ? 'danger' : 'primary'}
          />
          <StatCard
            label="کالاهای مورد علاقه"
            value={favoritesCount.toLocaleString('fa-IR')}
            icon={PiHeartLight}
            accent="primary"
          />
        </div>

        <RecentOrders orders={recentOrders} />
      </main>
    </Layout>
  )
}
