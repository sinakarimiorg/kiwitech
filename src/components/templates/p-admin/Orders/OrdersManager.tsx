"use client"

import { useState, useTransition } from "react"
import Swal from "sweetalert2"
import { AdminOrder, OrderStatus } from "@root/src/types/adminOrderType"
import StatCard from "../Index/StatCard"
import OrderDetailModal from "./OrderDetailModal"
import OrdersList from "./OrdersList"

import {
    PiShoppingBagOpenLight,
    PiHourglassLight,
    PiTruckLight,
    PiCheckCircleLight,
} from "react-icons/pi"
import { UpdateOrderStatusAction } from "./actions"

type OrdersManagerProps = {
    initialOrders: AdminOrder[]
}

export default function OrdersManager({ initialOrders }: OrdersManagerProps) {
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
    const [, startTransition] = useTransition()


    const processingCount = initialOrders.filter(o => o.status === "در حال پردازش").length
    const shippedCount = initialOrders.filter(o => o.status === "ارسال شده").length
    const deliveredCount = initialOrders.filter(o => o.status === "تحویل شده").length

    const handleStatusChange = (id: string, status: OrderStatus) => {
        setSelectedOrder(prev => (prev && prev._id === id ? { ...prev, status } : prev))
        startTransition(async () => {
            const res = await UpdateOrderStatusAction(id, status)
            if (!res.success) {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }
    return (
        <div className="p-5 sm:p-6 flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900">سفارش‌ها</h1>
                <p className="text-sm text-zinc-400 mt-1">مدیریت و پیگیری سفارش‌های ثبت‌شده در فروشگاه کیوی‌تک</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard label="کل سفارش‌ها" value={initialOrders.length.toLocaleString('fa-IR')} icon={PiShoppingBagOpenLight} accent="primary" />
                <StatCard label="در حال پردازش" value={processingCount.toLocaleString('fa-IR')} icon={PiHourglassLight} accent="danger" />
                <StatCard label="ارسال شده" value={shippedCount.toLocaleString('fa-IR')} icon={PiTruckLight} accent="neon" />
                <StatCard label="تحویل شده" value={deliveredCount.toLocaleString('fa-IR')} icon={PiCheckCircleLight} accent="primary" />
            </div>

            <OrdersList orders={initialOrders} onView={setSelectedOrder} onStatusChange={handleStatusChange} />

            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    )
}