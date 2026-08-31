import Layout from "@root/src/components/layouts/AdminPanelLayout";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";
import TransactionsChart from "@root/src/components/templates/P-admin/Wallet/TransactionsChart";
import TransactionsList from "@root/src/components/templates/P-admin/Wallet/TransactionsList";
import WalletOverview from "@root/src/components/templates/P-admin/Wallet/WalletOverview";
import { connectDB } from "@root/src/lib/mongodb";
import { AdminTransaction } from "@/types/adminTransactionType"
import TransationModel from "@models/Transaction"

import {
    PiWalletLight,
    PiArrowLineDownLight,
    PiArrowLineUpLight,
    PiHourglassLight,
} from "react-icons/pi";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const transactions = await TransationModel.find({}).sort({ _id: -1 }).lean()
    const initialTransactions: AdminTransaction[] = JSON.parse(JSON.stringify(transactions))

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const todaysTx = initialTransactions.filter(tx => tx.createdAt && new Date(tx.createdAt) >= startOfToday)
    const depositToday = todaysTx.filter(tx => tx.type === "واریز" && tx.status === "موفق").reduce((s, t) => s + t.amount, 0)
    const withdrawToday = todaysTx.filter(tx => tx.type === "برداشت" && tx.status === "موفق").reduce((s, t) => s + t.amount, 0)
    const pendingCount = initialTransactions.filter(tx => tx.status === "در انتظار").length

    const totalBalance = initialTransactions
        .filter(tx => tx.status === "موفق")
        .reduce((sum, tx) => {
            if (tx.type === "واریز" || tx.type === "بازگشت وجه") return sum + tx.amount
            if (tx.type === "برداشت" || tx.type === "خرید") return sum - tx.amount
            return sum
        }, 0)

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">کیف پول و تراکنش‌ها</h1>
                        <p className="text-sm text-zinc-400 mt-1">مدیریت شارژ، برداشت و تراکنش‌های مالی مشتریان کیوی‌تک</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="موجودی خالص کیف پول‌ها" value={totalBalance.toLocaleString()} icon={PiWalletLight} accent="primary" />
                        <StatCard label="واریزی امروز" value={depositToday.toLocaleString()} icon={PiArrowLineDownLight} accent="neon" />
                        <StatCard label="برداشت امروز" value={withdrawToday.toLocaleString()} icon={PiArrowLineUpLight} accent="danger" />
                        <StatCard label="تراکنش‌های در انتظار" value={pendingCount.toLocaleString('fa-IR')} icon={PiHourglassLight} accent="danger" />
                    </div>

                    {/* Overview + Chart */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-2">
                            <WalletOverview transactions={initialTransactions} />
                        </div>
                        <div className="xl:col-span-3">
                            <TransactionsChart transactions={initialTransactions} />
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <TransactionsList transactions={initialTransactions} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
