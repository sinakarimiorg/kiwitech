import Layout from "@root/src/components/layouts/AdminPanelLayout";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";
import UsersList from "@root/src/components/templates/P-admin/Users/UsersList";

import {
    PiUsersLight,
    PiUserPlusLight,
    PiWalletLight,
    PiProhibitLight,
} from "react-icons/pi";

const page = async () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">مشتریان</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="کل مشتریان" value="۸۷۶" icon={PiUsersLight} accent="primary" />
                        <StatCard label="مشتریان جدید این ماه" value="۴۲" icon={PiUserPlusLight} accent="neon" trend={{ value: "۸٪", positive: true }} />
                        <StatCard label="میانگین ارزش خرید" value="۱,۸۵۰,۰۰۰ تومان" icon={PiWalletLight} accent="primary" />
                        <StatCard label="مشتریان مسدود شده" value="۵" icon={PiProhibitLight} accent="danger" />
                    </div>

                    <UsersList />
                </div>
            </main>
        </Layout>
    );
}

export default page;
