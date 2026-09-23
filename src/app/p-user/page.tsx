import Layout from '@root/src/components/layouts/UserPanelLayout'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import OrderModel from '@root/src/models/Order'
import MessageModel from '@root/src/models/Message'
import FavoriteModel from '@root/src/models/Favorite'
import StatCard from '@root/src/components/templates/P-user/Index/StatCard'
import RecentOrders from '@root/src/components/templates/P-user/RecentOrders/RecentOrders'
import { getOrderTotal, type AdminOrder } from "@/types/adminOrderType"
import DashboardHero from '@root/src/components/templates/P-user/Index/DashboardHero'
import OrdersOverview from '@root/src/components/templates/P-user/Index/OrdersOverview'

import {
  PiWalletLight,
  PiShoppingBagOpenLight,
  PiEnvelopeSimpleLight,
  PiHeartLight,
  PiTruckLight,
  PiReceiptLight,
} from 'react-icons/pi'

export const dynamic = 'force-dynamic'

export default async function UserDashboardPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/login-register')

  await connectDB()

  const [ordersRaw, unreadMessagesCount, favoritesCount] = await Promise.all([
    OrderModel.find({ $or: [{ user: currentUser._id }, { phone: currentUser.phone }] })
      .sort({ _id: -1 })
      .lean(),
    MessageModel.countDocuments({ user: currentUser._id, isRead: false }),
    FavoriteModel.countDocuments({ user: currentUser._id }),
  ])

  const orders: AdminOrder[] = JSON.parse(JSON.stringify(ordersRaw))

  // ___________ Filter Orders By Status ______________
  const processing = orders.filter(o => o.status === 'در حال پردازش')
  const shipped = orders.filter(o => o.status === 'ارسال شده')
  const delivered = orders.filter(o => o.status === 'تحویل شده')
  const cancelled = orders.filter(o => o.status === 'لغو شده')

  const activeOrders = [...processing, ...shipped].sort((a, b) => (a._id < b._id ? 1 : -1))
  const historyOrders = [...delivered, ...cancelled].sort((a, b) => (a._id < b._id ? 1 : -1))

  // ___________ All Purchases History ______________
  const purchases = orders.filter(o => o.status !== 'لغو شده')
  const totalSpent = purchases.reduce((sum, o) => sum + getOrderTotal(o), 0)

  const activeHint = activeOrders.length > 0
    ? `${processing.length.toLocaleString('fa-IR')} در حال پردازش و ${shipped.length.toLocaleString('fa-IR')} ارسال‌شده`
    : 'سفارش جاری‌ای ندارید'

  return (
    <Layout>
      <main className='flex-1 min-w-0 flex flex-col gap-6'>

        <DashboardHero user={currentUser} />

        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
          <StatCard
            label='سفارش‌های جاری'
            value={activeOrders.length.toLocaleString('fa-IR')}
            hint={activeHint}
            icon={PiTruckLight}
            accent='neon'
            href='/p-user/userOrders'
          />
          <StatCard
            label='تعداد خرید'
            value={purchases.length.toLocaleString('fa-IR')}
            hint={`${delivered.length.toLocaleString('fa-IR')} سفارش تحویل‌شده`}
            icon={PiShoppingBagOpenLight}
            accent='primary'
            href='/p-user/userOrders'
          />
          <StatCard
            label='مجموع خرید'
            value={totalSpent.toLocaleString()}
            unit='تومان'
            icon={PiReceiptLight}
            accent='primary'
          />
          <StatCard
            label='موجودی کیف پول'
            value={(currentUser.walletBalance ?? 0).toLocaleString()}
            unit='تومان'
            icon={PiWalletLight}
            accent='primary'
            href='/p-user/wallet'
          />
          <StatCard
            label='کالاهای مورد علاقه'
            value={favoritesCount.toLocaleString('fa-IR')}
            icon={PiHeartLight}
            accent='primary'
            href='/p-user/favorites'
          />
          <StatCard
            label='پیام‌های نخوانده'
            value={unreadMessagesCount.toLocaleString('fa-IR')}
            icon={PiEnvelopeSimpleLight}
            accent={unreadMessagesCount > 0 ? 'danger' : 'primary'}
            href='/p-user/messages'
          />
        </div>

        <OrdersOverview
          counts={{
            processing: processing.length,
            shipped: shipped.length,
            delivered: delivered.length,
            cancelled: cancelled.length,
          }}
          activeOrders={activeOrders}
        />

        <RecentOrders orders={historyOrders.slice(0, 3)} />
      </main>
    </Layout>
  )
}
