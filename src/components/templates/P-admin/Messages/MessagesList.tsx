"use client"

import { useState, useTransition } from "react"
import Swal from "sweetalert2"
import {
    PiEnvelopeSimpleLight,
    PiMagnifyingGlassLight,
    PiPhoneLight,
    PiTrashLight,
    PiEnvelopeSimpleOpenLight,
    PiCaretDownLight,
} from "react-icons/pi"
import type { AdminContactMessage, ContactMessageStatus } from "@root/src/types/adminContactMessageType"
import { deleteContactMessageAction, markAllContactMessagesReadAction, setContactMessageReadAction } from "./actions"

const filters: ("همه" | ContactMessageStatus)[] = ["همه", "خوانده نشده", "خوانده شده"]

const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" }) : ""

export default function MessagesList({ initialMessages }: { initialMessages: AdminContactMessage[] }) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | ContactMessageStatus>("همه")
    const [openId, setOpenId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const unreadCount = initialMessages.filter(m => m.status === "خوانده نشده").length

    const showError = (error: string) => Swal.fire({ icon: "error", title: "خطا", text: error })

    const toggleOpen = (message: AdminContactMessage) => {
        const opening = openId !== message._id
        setOpenId(opening ? message._id : null)
        if (opening && message.status === "خوانده نشده") {
            startTransition(async () => {
                const res = await setContactMessageReadAction(message._id, true)
                if (!res.success) showError(res.error)
            })
        }
    }

    const toggleRead = (message: AdminContactMessage) => {
        startTransition(async () => {
            const res = await setContactMessageReadAction(message._id, message.status === "خوانده نشده")
            if (!res.success) showError(res.error)
        })
    }

    const markAllRead = () => {
        startTransition(async () => {
            const res = await markAllContactMessagesReadAction()
            if (!res.success) showError(res.error)
        })
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف پیام",
            text: "آیا از حذف این پیام مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteContactMessageAction(id)
            if (!res.success) showError(res.error)
        })
    }

    const query = search.trim().toLowerCase()
    const filtered = initialMessages.filter(m => {
        const matchesSearch = !query ||
            [m.name, m.phone, m.email ?? "", m.subject, m.message].some(v => v.toLowerCase().includes(query))
        const matchesFilter = activeFilter === "همه" || m.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            <div className='flex flex-col gap-3 px-4 sm:px-6 py-4 border-b border-gray-100'>
                <div className='flex items-center justify-between gap-3'>
                    <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                        <PiEnvelopeSimpleLight className='w-5 h-5 text-primary-500' />
                        پیام‌های تماس با ما
                        <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                    </h2>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            disabled={isPending}
                            className='text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer disabled:opacity-50'>
                            علامت‌گذاری همه به‌عنوان خوانده‌شده
                        </button>
                    )}
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs overflow-x-auto scrollbar-none'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 whitespace-nowrap rounded-lg transition-colors cursor-pointer text-xs
                                    ${activeFilter === f ? "bg-primary-500 text-white font-IranYekanMedium" : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-2 px-3.5 py-2 w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='نام، شماره، موضوع یا متن...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                        />
                    </div>
                </div>
            </div>

            <div className='divide-y divide-gray-50'>
                {filtered.map(message => {
                    const isOpen = openId === message._id
                    const unread = message.status === "خوانده نشده"

                    return (
                        <div key={message._id} className={unread ? "bg-primary-50/30" : ""}>
                            <div className='flex items-center gap-3 px-4 sm:px-6 py-4'>
                                <button onClick={() => toggleOpen(message)} className='flex-1 min-w-0 flex items-center gap-3 text-right cursor-pointer'>
                                    <span className={`w-2 h-2 shrink-0 rounded-full ${unread ? "bg-primary-500" : "bg-transparent"}`} />
                                    <span className='flex-1 min-w-0'>
                                        <span className={`block text-sm truncate ${unread ? "font-IranYekanBold text-zinc-900" : "text-zinc-700"}`}>
                                            {message.subject}
                                        </span>
                                        <span className='block text-xs text-zinc-400 mt-0.5 truncate'>
                                            {message.name} · {formatDate(message.createdAt)}
                                        </span>
                                    </span>
                                    <PiCaretDownLight className={`w-4 h-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                <div className='flex items-center gap-2 shrink-0'>
                                    <button
                                        onClick={() => toggleRead(message)}
                                        disabled={isPending}
                                        title={unread ? "علامت‌گذاری به‌عنوان خوانده‌شده" : "علامت‌گذاری به‌عنوان خوانده‌نشده"}
                                        className='p-1.5 text-zinc-400 hover:text-primary-600 transition-colors cursor-pointer disabled:opacity-50'>
                                        <PiEnvelopeSimpleOpenLight className='w-5 h-5' />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(message._id)}
                                        disabled={isPending}
                                        title='حذف'
                                        className='p-1.5 text-zinc-400 hover:text-danger transition-colors cursor-pointer disabled:opacity-50'>
                                        <PiTrashLight className='w-5 h-5' />
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className='px-4 sm:px-6 pb-5 sm:pr-11'>
                                    <p className='text-sm text-zinc-800 leading-7 whitespace-pre-wrap wrap-break-word'>{message.message}</p>

                                    <div className='flex flex-wrap items-center gap-3 mt-4 text-xs'>
                                        <a href={`tel:${message.phone}`} className='flex items-center gap-1.5 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors'>
                                            <PiPhoneLight className='w-4 h-4' />
                                            <span dir='ltr'>{message.phone}</span>
                                        </a>
                                        {message.email && (
                                            <a
                                                href={`mailto:${message.email}?subject=${encodeURIComponent(`پاسخ: ${message.subject}`)}`}
                                                className='flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-zinc-600 rounded-lg hover:border-primary-400 transition-colors'>
                                                <PiEnvelopeSimpleLight className='w-4 h-4' />
                                                <span dir='ltr'>{message.email}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}

                {filtered.length === 0 && <div className='py-10 text-center text-zinc-400'>پیامی یافت نشد.</div>}
            </div>
        </div>
    )
}
