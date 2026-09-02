"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
    PiBellLight,
    PiCheckCircleLight,
    PiPackageLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
} from "react-icons/pi"
import { AdminNotificationsData, AdminNotificationItem } from "@root/src/lib/admin/notifications"
import NotifictionBox from "./NotifictionBox"

type NotificationsDropdownProps = {
    notifications: AdminNotificationsData
}

export default function NotificationsDropdown({ notifications: initialData }: NotificationsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notificationsData, setNotificationsData] = useState<AdminNotificationsData>(initialData)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setNotificationsData(initialData)
    }, [initialData])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const allItems = [
        ...notificationsData.pendingOrders,
        ...notificationsData.pendingComments,
        ...notificationsData.lowStockProducts,
    ]
    const unreadCount = allItems.filter(item => !item.read).length

    const markAsRead = (id: string) => {
        const updateList = (list: AdminNotificationItem[]) =>
            list.map(item => (item._id === id ? { ...item, read: true } : item))

        setNotificationsData(prev => ({
            ...prev,
            pendingOrders: updateList(prev.pendingOrders),
            pendingComments: updateList(prev.pendingComments),
            lowStockProducts: updateList(prev.lowStockProducts),
        }))
    }

    const markAllAsRead = () => {
        const markList = (list: AdminNotificationItem[]) =>
            list.map(item => ({ ...item, read: true }))

        setNotificationsData(prev => ({
            ...prev,
            pendingOrders: markList(prev.pendingOrders),
            pendingComments: markList(prev.pendingComments),
            lowStockProducts: markList(prev.lowStockProducts),
        }))
    }

    return (
        <div ref={wrapperRef} className="relative">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 text-zinc-500 hover:text-primary-600 transition-colors cursor-pointer"
                aria-label="اعلان‌ها"
            >
                <PiBellLight className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="flex-center absolute top-1 left-1.5 min-w-4.5 h-4.5 px-1 text-[10px] font-IranYekanBold text-white bg-danger rounded-full">
                        {unreadCount > 9 ? "۹+" : unreadCount.toLocaleString("fa-IR")}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-3 w-80 sm:w-96 max-h-112 overflow-y-auto bg-white border border-gray-100 shadow-2xl rounded-2xl z-30">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100">
                        <h3 className="font-IranYekanBold text-sm text-zinc-800 flex items-center gap-1.5">
                            اعلان‌ها
                            {unreadCount > 0 && (
                                <span className="text-xs font-IranYekan text-zinc-400">
                                    ({unreadCount.toLocaleString("fa-IR")} خوانده‌نشده)
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                            >
                                <PiCheckCircleLight className="w-3.5 h-3.5" />
                                خواندن همه
                            </button>
                        )}
                    </div>

                    {allItems.length === 0 ? (
                        <div className="py-10 text-center text-sm text-zinc-400">اعلان جدیدی وجود ندارد.</div>
                    ) : (
                        <div className="flex flex-col">
                            {/* Pending Orders Section---------------------------------------- */}
                            {notificationsData.pendingOrders.length > 0 && (
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="flex items-center gap-1.5 mb-2 text-xs font-IranYekanMedium text-zinc-400">
                                        <PiPackageLight className="w-4 h-4 text-primary-500" />
                                        سفارش‌های در حال پردازش
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {notificationsData.pendingOrders.map(item => (
                                            <NotifictionBox key={item._id} item={item} markAsRead={markAsRead} setIsOpen={setIsOpen} href="/p-admin/orders"/>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Comments Section---------------------------------------- */}
                            {notificationsData.pendingComments.length > 0 && (
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="flex items-center gap-1.5 mb-2 text-xs font-IranYekanMedium text-zinc-400">
                                        <PiChatCircleTextLight className="w-4 h-4 text-amber-500" />
                                        نظرات در انتظار بررسی
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {notificationsData.pendingComments.map(item => (
                                            <NotifictionBox key={item._id} item={item} markAsRead={markAsRead} setIsOpen={setIsOpen} href="/p-admin/comments"/>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Low Stock Products Section---------------------------------------- */}
                            {notificationsData.lowStockProducts.length > 0 && (
                                <div className="px-4 py-3">
                                    <p className="flex items-center gap-1.5 mb-2 text-xs font-IranYekanMedium text-zinc-400">
                                        <PiWarningCircleLight className="w-4 h-4 text-danger" />
                                        موجودی رو به اتمام
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {notificationsData.lowStockProducts.map(item => (
                                            <NotifictionBox key={item._id} item={item} markAsRead={markAsRead} setIsOpen={setIsOpen} href="/p-admin/products"/>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}