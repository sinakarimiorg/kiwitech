"use client"

import { MessageType, UserMessage } from '@root/src/types/UserMessageType'
import { PiEnvelopeSimpleLight, PiEnvelopeOpenLight, PiTrashLight, PiCheckCircleLight } from "react-icons/pi"
import { useTransition } from 'react'
import { deleteMessageAction, markAllMessagesAsReadAction, markMessageAsReadAction } from './actions'
import Swal from 'sweetalert2'


const typeStyle: Record<MessageType, string> = {
    "سفارش": "bg-primary-50 text-primary-600",
    "سیستمی": "bg-sky-50 text-sky-600",
    "تخفیف": "bg-amber-50 text-amber-600",
}

export default function MessagesList({ messages }: { messages: UserMessage[] }) {
    const [isPending, startTransition] = useTransition()
    const unreadCount = messages.filter(m => !m.isRead).length

    const handleOpen = (message: UserMessage) => {
        if (message.isRead) return
        startTransition(async () => {
            await markMessageAsReadAction(message._id)
        })
    }

    const handleMarkAll = () => {
        startTransition(async () => {
            await markAllMessagesAsReadAction()
        })
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف پیام",
            text: "آیا از حذف این پیام مطمئن هستید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteMessageAction(id)
            if (!res.success) {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            <div className='flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiEnvelopeSimpleLight className='w-5 h-5 text-primary-500' />
                    پیام‌های من
                    {unreadCount > 0 &&
                        <span className='px-2 py-0.5 text-xs font-IranYekanMedium text-white bg-primary-500 rounded-full'>{unreadCount}</span>
                    }
                </h2>
                {unreadCount > 0 &&
                    <button
                        onClick={handleMarkAll}
                        disabled={isPending}
                        className='flex items-center gap-1.5 text-xs sm:text-sm text-primary-600 hover:text-primary-700 transition-colors cursor-pointer'>
                        <PiCheckCircleLight className='w-4 h-4' />
                        علامت‌گذاری همه به‌عنوان خوانده‌شده
                    </button>
                }
            </div>

            <div className='divide-y divide-gray-50'>
                {messages.map(message => (
                    <div
                        key={message._id}
                        onClick={() => handleOpen(message)}
                        className={`flex items-start gap-3 px-5 sm:px-6 py-4 cursor-pointer transition-colors
                            ${message.isRead ? 'hover:bg-gray-50/60' : 'bg-primary-50/40 hover:bg-primary-50/60'}`}>
                        <span className={`flex-center w-9 h-9 shrink-0 rounded-full mt-0.5 ${message.isRead ? 'bg-gray-100 text-zinc-400' : 'bg-primary-100 text-primary-600'}`}>
                            {message.isRead ? <PiEnvelopeOpenLight className='w-4.5 h-4.5' /> : <PiEnvelopeSimpleLight className='w-4.5 h-4.5' />}
                        </span>

                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <p className={`text-sm ${message.isRead ? 'text-zinc-600' : 'font-IranYekanBold text-zinc-800'}`}>{message.title}</p>
                                <span className={`px-2 py-0.5 text-[11px] rounded-md ${typeStyle[message.type]}`}>{message.type}</span>
                            </div>
                            <p className='text-xs sm:text-sm text-zinc-500 mt-1.5 leading-6'>{message.body}</p>
                            <p className='text-[11px] text-zinc-400 mt-2'>{new Date(message.createdAt).toLocaleDateString('fa-IR')}</p>
                        </div>

                        <button
                            onClick={e => { e.stopPropagation(); handleDelete(message._id) }}
                            className='flex-center w-8 h-8 shrink-0 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                            <PiTrashLight className='w-4 h-4' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
