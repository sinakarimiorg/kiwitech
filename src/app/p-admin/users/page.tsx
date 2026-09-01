import Layout from "@root/src/components/layouts/AdminPanelLayout";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";
import UsersList from "@root/src/components/templates/P-admin/Users/UsersList";
import { connectDB } from "@root/src/lib/mongodb";
import UserModel from "@models/User"

import {
    PiUsersLight,
    PiUserPlusLight,
    PiWalletLight,
    PiProhibitLight,
} from "react-icons/pi";
import { AdminUser } from "@root/src/types/adminUserType";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const users = await UserModel.find({}).sort({ _id: -1 }).lean()
    const initialUsers: AdminUser[] = JSON.parse(JSON.stringify(users))

    const totalCount = initialUsers.length
    const blockedCount = initialUsers.filter(u => u.status === "مسدود").length

    // ----------------------- Calculating avrage of new users in this month and last one------------------------
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const prevYear = prevMonthDate.getFullYear()
    const prevMonth = prevMonthDate.getMonth()

    const newThisMonthCount = initialUsers.filter(u => {
        if (!u.createdAt) return false
        const created = new Date(u.createdAt)
        return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
    }).length

    const newLastMonthCount = initialUsers.filter(u => {
        if (!u.createdAt) return false
        const created = new Date(u.createdAt)
        return created.getFullYear() === prevYear && created.getMonth() === prevMonth
    }).length

    let trendValue = 0
    if (newLastMonthCount > 0) {
        trendValue = Math.round(((newThisMonthCount - newLastMonthCount) / newLastMonthCount) * 100)
    } else if (newThisMonthCount > 0) {
        trendValue = 100
    }

    const isPositive = trendValue >= 0
    // ----------------------------------------------------

    const loyalUsersCount = initialUsers.filter(u => u.ordersCount >= 3 || 0).length
    const loyalUsersPercentage = totalCount > 0
        ? Math.round((loyalUsersCount / totalCount) * 100)
        : 0

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">مشتریان</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="کل مشتریان" value={totalCount.toLocaleString('fa-IR')} icon={PiUsersLight} accent="primary" />
                        <StatCard label="مشتریان جدید این ماه" value={newThisMonthCount.toLocaleString('fa-IR')} icon={PiUserPlusLight} accent="neon" trend={{ value: `${Math.abs(trendValue).toLocaleString('fa-IR')}٪`, positive: true }} />
                        <StatCard label="مشتریان وفادار (با حداقل ۳ خرید)" value={`${loyalUsersCount} نفر`} trend={{ value: `${loyalUsersPercentage} %`, positive: true }} icon={PiUsersLight} accent="neon" />
                        <StatCard label="مشتریان مسدود شده" value={blockedCount.toLocaleString('fa-IR')} icon={PiProhibitLight} accent="danger" />
                    </div>

                    <UsersList initialUsers={initialUsers} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
