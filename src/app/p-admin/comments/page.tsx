import Layout from "@root/src/components/layouts/AdminPanelLayout";
import CommentsList from "@root/src/components/templates/P-admin/Comments/CommentsList";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";

import {
    PiChatCircleTextLight,
    PiHourglassLight,
    PiCheckCircleLight,
    PiXCircleLight,
} from "react-icons/pi";

const page = async () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">نظرات کاربران</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="کل نظرات" value="۳۴۲" icon={PiChatCircleTextLight} accent="primary" />
                        <StatCard label="در انتظار بررسی" value="۵" icon={PiHourglassLight} accent="danger" />
                        <StatCard label="تایید شده" value="۳۱۰" icon={PiCheckCircleLight} accent="neon" trend={{ value: "۶٪", positive: true }} />
                        <StatCard label="رد شده" value="۲۷" icon={PiXCircleLight} accent="danger" />
                    </div>

                    <CommentsList />
                </div>
            </main>
        </Layout>
    );
}

export default page;
