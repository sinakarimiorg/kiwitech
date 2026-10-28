import { connectDB } from '@root/src/lib/mongodb'
import ContactMessageModel from "@models/ContactMessage"
import { AdminContactMessage } from '@root/src/types/adminContactMessageType'
import Layout from '@root/src/components/layouts/AdminPanelLayout'
import StatCard from '@root/src/components/templates/P-admin/Index/StatCard'
import MessagesList from "@root/src/components/templates/P-admin/Messages/MessagesList"

import { PiEnvelopeSimpleLight, PiEnvelopeSimpleOpenLight } from "react-icons/pi"
export const dynamic = "force-dynamic"
const page = async () => {
    await connectDB()
    const raw = await ContactMessageModel.find({}).sort({ _id: -1 }).limit(500).lean()
    const messages: AdminContactMessage[] = JSON.parse(JSON.stringify(raw))

    const unreadCount = messages.filter(m => m.status === "خوانده نشده").length

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-4 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-lg sm:text-xl font-semibold text-zinc-900">صندوق پیام‌ها</h1>

                    <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-xl">
                        <StatCard label="کل پیام‌ها" value={messages.length.toLocaleString("fa-IR")} icon={PiEnvelopeSimpleLight} accent="primary" />
                        <StatCard label="خوانده‌نشده" value={unreadCount.toLocaleString("fa-IR")} icon={PiEnvelopeSimpleOpenLight} accent="danger" />
                    </div>

                    <MessagesList initialMessages={messages} />
                </div>
            </main>
        </Layout>
    )
}

export default page