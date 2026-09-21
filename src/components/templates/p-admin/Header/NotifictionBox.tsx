"use client"

import Link from "next/link";
import { AdminNotificationItem } from "@root/src/lib/admin/notifications";

type NotificationBoxProps = {
    item: AdminNotificationItem
    href: string
    onClick: () => void
}

const NotifictionBox = ({ item, href, onClick }: NotificationBoxProps) => {

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex flex-col gap-0.5 px-2.5 py-2 rounded-lg transition-colors
                ${item.read ? "hover:bg-gray-50" : "bg-primary-50/80 hover:bg-primary-50"}`}
        >
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-700 line-clamp-1">
                {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />}
                {item.title}
            </span>
            <span className="text-[11px] text-zinc-400 pr-3">{item.subtitle}</span>
        </Link>
    )
}

export default NotifictionBox;