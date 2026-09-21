"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import {
    PiBellLight,
    PiCheckCircleLight,
    PiPackageLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
    PiEnvelopeSimpleLight,
} from "react-icons/pi"
import type { IconType } from "react-icons"
import { AdminNotificationsData, AdminNotificationItem, NotificationType } from "@root/src/lib/admin/notifications"
import {
    markOrderNotificationReadAction,
    markCommentNotificationReadAction,
    markAllNotificationsReadAction,
} from "./actions"
import NotifictionBox from "./NotifictionBox"

type NotificationsDropdownProps = {
    notifications: AdminNotificationsData
}

const sectionMeta: Record<NotificationType, { label: string; icon: IconType; color: string }> = {
    order: { label: "سفارش‌های در حال پردازش", icon: PiPackageLight, color: "text-primary-500" },
    comment: { label: "نظرات در انتظار بررسی", icon: PiChatCircleTextLight, color: "text-amber-500" },
    product: { label: "موجودی رو به اتمام", icon: PiWarningCircleLight, color: "text-danger" },
    message: { label: "پیام‌های تماس با ما", icon: PiEnvelopeSimpleLight, color: "text-sky-500" },
}

export default function NotificationsDropdown({ notifications: initialData }: NotificationsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<AdminNotificationsData>(initialData)
    const [isPending, startTransition] = useTransition()
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setData(initialData)
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
        ...data.pendingOrders,
        ...data.pendingComments,
        ...data.lowStockProducts,
    ]
    const unreadCount = allItems.filter(item => !item.read).length

    const updateItemInState = (id: string, patch: Partial<AdminNotificationItem>) => {
        setData(prev => ({
            ...prev,
            pendingOrders: prev.pendingOrders.map(i => (i._id === id ? { ...i, ...patch } : i)),
            pendingComments: prev.pendingComments.map(i => (i._id === id ? { ...i, ...patch } : i)),
        }))
    }

    const handleItemClick = (item: AdminNotificationItem) => {
        setIsOpen(false)
        if (item.read || item.type === "product") return

        updateItemInState(item._id, { read: true })

        startTransition(async () => {
            const action = item.type === "order" ? markOrderNotificationReadAction : markCommentNotificationReadAction
            const res = await action(item._id)
            if (!res.success) updateItemInState(item._id, { read: false })
        })
    }

    const markAllAsRead = () => {
        const orderIds = data.pendingOrders.filter(o => !o.read).map(o => o._id)
        const commentIds = data.pendingComments.filter(c => !c.read).map(c => c._id)
        if (!orderIds.length && !commentIds.length) return

        const snapshot = data
        setData(prev => ({
            ...prev,
            pendingOrders: prev.pendingOrders.map(i => ({ ...i, read: true })),
            pendingComments: prev.pendingComments.map(i => ({ ...i, read: true })),
        }))

        startTransition(async () => {
            const res = await markAllNotificationsReadAction(orderIds, commentIds)
            if (!res.success) setData(snapshot)
        })
    }

    const sections: { type: NotificationType; items: AdminNotificationItem[]; href: string }[] = [
        { type: "order", items: data.pendingOrders, href: "/p-admin/orders" },
        { type: "comment", items: data.pendingComments, href: "/p-admin/comments" },
        { type: "product", items: data.lowStockProducts, href: "/p-admin/products" },
    ]

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
                        {(data.pendingOrders.some(i => !i.read) || data.pendingComments.some(i => !i.read)) && (
                            <button
                                onClick={markAllAsRead}
                                disabled={isPending}
                                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer disabled:opacity-50"
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
                            {sections.map(
                                section =>
                                    section.items.length > 0 && (
                                        <div key={section.type} className="px-4 py-3 border-b border-gray-50 last:border-b-0">
                                            <p className="flex items-center gap-1.5 mb-2 text-xs font-IranYekanMedium text-zinc-400">
                                                {(() => {
                                                    const Icon = sectionMeta[section.type].icon
                                                    return <Icon className={`w-4 h-4 ${sectionMeta[section.type].color}`} />
                                                })()}
                                                {sectionMeta[section.type].label}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                {section.items.map(item => (
                                                    <NotifictionBox
                                                        key={item._id}
                                                        item={item}
                                                        href={section.href}
                                                        onClick={() => handleItemClick(item)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}