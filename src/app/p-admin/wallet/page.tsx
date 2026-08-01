import Layout from "@root/src/components/layouts/AdminPanelLayout";
import StatCard from "@root/src/components/templates/p-admin/Index/StatCard";
import TransactionsChart from "@root/src/components/templates/p-admin/Wallet/TransactionsChart";
import TransactionsList from "@root/src/components/templates/p-admin/Wallet/TransactionsList";
import WalletOverview from "@root/src/components/templates/p-admin/Wallet/WalletOverview";

import {
    PiWalletLight,
    PiArrowLineDownLight,
    PiArrowLineUpLight,
    PiHourglassLight,
} from "react-icons/pi";

const page = async () => {
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
                        <StatCard label="موجودی کل کیف پول‌ها" value="۴۱۸,۲۰۰,۰۰۰" icon={PiWalletLight} accent="primary" />
                        <StatCard label="واریزی امروز" value="۵۲,۵۰۰,۰۰۰" icon={PiArrowLineDownLight} accent="neon" trend={{ value: "۱۴٪", positive: true }} />
                        <StatCard label="برداشت امروز" value="۱۸,۲۰۰,۰۰۰" icon={PiArrowLineUpLight} accent="danger" trend={{ value: "۳٪", positive: false }} />
                        <StatCard label="تراکنش‌های در انتظار" value="۷" icon={PiHourglassLight} accent="danger" />
                    </div>

                    {/* Overview + Chart */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-2">
                            <WalletOverview />
                        </div>
                        <div className="xl:col-span-3">
                            <TransactionsChart />
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <TransactionsList />
                </div>
            </main>
        </Layout>
    );
}

export default page;
