"use client"
import Link from "next/link";
import { AdminNotificationItem } from "@root/src/lib/admin/notifications";

type NotificationBoxProps = {
    item: AdminNotificationItem
    markAsRead: (id: string) => void
    setIsOpen: (isOpen: boolean) => void
    href?: string
}

const NotifictionBox = ({
    item,
    markAsRead,
    setIsOpen,
    href,
}: NotificationBoxProps) => {

    return (
        <Link
            href= {href ?? "#"}
            onClick={() => {
                markAsRead(item._id)
                setIsOpen(false)
            }}
            className={`flex-col items-center justify-between gap-2 mt-1 px-2.5 py-2 rounded-lg transition-colors ${item.read ? "hover:bg-gray-50/20" : "bg-primary-50/90 hover:bg-primary-50"
                }`}
        >
            <span className="text-xs sm:text-sm text-zinc-700 line-clamp-1">{item.title}</span>
            <span className="text-[11px] text-zinc-400 shrink-0">{item.subtitle}</span>
        </Link>
    )
}

export default NotifictionBox;