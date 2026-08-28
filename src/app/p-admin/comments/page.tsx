import Layout from "@root/src/components/layouts/AdminPanelLayout";
import CommentsList from "@root/src/components/templates/P-admin/Comments/CommentsList";
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard";
import { connectDB } from "@root/src/lib/mongodb";
import CommentModel from "@models/Comment"
import "@/models/Product"
import { AdminComment } from "@root/src/types/adminCommentType";

import {
    PiChatCircleTextLight,
    PiHourglassLight,
    PiCheckCircleLight,
    PiXCircleLight,
} from "react-icons/pi";



export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const comments = await CommentModel.find({})
        .populate("product", "name")
        .sort({ _id: -1 })
        .lean()
    const initialComments: AdminComment[] = JSON.parse(JSON.stringify(comments))

    const totalCount = initialComments.length
    const pendingCount = initialComments.filter(c => c.status === "در انتظار بررسی").length
    const approvedCount = initialComments.filter(c => c.status === "تایید شده").length
    const rejectedCount = initialComments.filter(c => c.status === "رد شده").length

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">نظرات کاربران</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="کل نظرات" value={totalCount.toLocaleString('fa-IR')} icon={PiChatCircleTextLight} accent="primary" />
                        <StatCard label="در انتظار بررسی" value={pendingCount.toLocaleString('fa-IR')} icon={PiHourglassLight} accent="danger" />
                        <StatCard label="تایید شده" value={approvedCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="neon" />
                        <StatCard label="رد شده" value={rejectedCount.toLocaleString('fa-IR')} icon={PiXCircleLight} accent="danger" />
                    </div>

                    <CommentsList initialComments={initialComments} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
