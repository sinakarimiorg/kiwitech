"use client"

import { useState } from "react"
import Layout from "@root/src/components/layouts/AdminPanelLayout"
import StatCard from "@root/src/components/templates/P-admin/Index/StatCard"
import OrdersList, { seedOrders } from "@root/src/components/templates/P-admin/Orders/OrdersList"
import type { Order, OrderStatus } from "@root/src/components/templates/P-admin/Orders/OrdersList"
import OrderDetailModal from "@root/src/components/templates/P-admin/Orders/OrderDetailModal"

import {
    PiShoppingBagOpenLight,
    PiHourglassLight,
    PiTruckLight,
    PiCheckCircleLight,
} from "react-icons/pi"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(seedOrders)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const processingCount = orders.filter(o => o.status === "در حال پردازش").length
    const shippedCount = orders.filter(o => o.status === "ارسال شده").length
    const deliveredCount = orders.filter(o => o.status === "تحویل شده").length

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
        setSelectedOrder(prev => (prev && prev.id === id ? { ...prev, status } : prev))
    }

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">سفارش‌ها</h1>
                        <p className="text-sm text-zinc-400 mt-1">مدیریت و پیگیری سفارش‌های ثبت‌شده در فروشگاه کیوی‌تک</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <StatCard label="کل سفارش‌ها" value={orders.length.toLocaleString('fa-IR')} icon={PiShoppingBagOpenLight} accent="primary" />
                        <StatCard label="در حال پردازش" value={processingCount.toLocaleString('fa-IR')} icon={PiHourglassLight} accent="danger" />
                        <StatCard label="ارسال شده" value={shippedCount.toLocaleString('fa-IR')} icon={PiTruckLight} accent="neon" />
                        <StatCard label="تحویل شده" value={deliveredCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" trend={{ value: '۶٪', positive: true }} />
                    </div>

                    <OrdersList orders={orders} onView={setSelectedOrder} onStatusChange={updateStatus} />
                </div>
            </main>

            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </Layout>
    )
}
