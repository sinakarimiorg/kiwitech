import Layout from "@root/src/components/layouts/AdminPanelLayout";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";
import TransactionsChart from "@root/src/components/templates/P-admin/Wallet/TransactionsChart";
import TransactionsList from "@root/src/components/templates/P-admin/Wallet/TransactionsList";
import WalletOverview from "@root/src/components/templates/P-admin/Wallet/WalletOverview";
import { connectDB } from "@root/src/lib/mongodb";
import { AdminTransaction } from "@/types/adminTransactionType"
import PaymentModel from "@models/Payment"
import UserModel from "@models/User"

import {
    PiWalletLight,
    PiArrowLineDownLight,
    PiArrowLineUpLight,
    PiHourglassLight,
} from "react-icons/pi";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const payments = await PaymentModel.find({}).populate("user", "name phone").sort({ _id: -1 }).limit(500).lean()
    const initialTransactions: AdminTransaction[] = (JSON.parse(JSON.stringify(payments)) as any[]).map(payment => ({
        _id: payment._id,
        user: payment.user?.name || payment.user?.phone || "کاربر حذف‌شده",
        type: payment.purpose === "wallet" ? "واریز" : "خرید",
        amount: payment.amount,
        method: "درگاه بانکی",
        status: payment.status === "paid" ? "موفق"
            : payment.status === "pending" || payment.status === "verifying" ? "در انتظار"
            : "ناموفق",
        createdAt: payment.createdAt,
    }))

    const balances = await UserModel.aggregate([{ $group: { _id: null, total: { $sum: "$walletBalance" } } }])
    const totalBalance: number = balances[0]?.total ?? 0

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const todaysTx = initialTransactions.filter(tx => tx.createdAt && new Date(tx.createdAt) >= startOfToday)
    const depositToday = todaysTx.filter(tx => tx.type === "واریز" && tx.status === "موفق").reduce((s, t) => s + t.amount, 0)
    const withdrawToday = todaysTx.filter(tx => tx.type === "برداشت" && tx.status === "موفق").reduce((s, t) => s + t.amount, 0)
    const pendingCount = initialTransactions.filter(tx => tx.status === "در انتظار").length

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-4 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-900">کیف پول و تراکنش‌ها</h1>
                        <p className="text-[10px] md:text-sm text-zinc-400 mt-1">مدیریت شارژ، برداشت و تراکنش‌های مالی مشتریان کیوی‌تک</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
