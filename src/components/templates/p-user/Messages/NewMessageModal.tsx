"use client"

import { useState, useTransition } from "react"
import { PiPaperPlaneRightLight, PiXBold, PiChatCircleDotsLight } from "react-icons/pi"
import Swal from "sweetalert2"
import { sendMessageAction } from "./actions"
import type { MessageType } from "@root/src/types/userMessageType"

const subjectOptions: MessageType[] = [
    "سفارش",
    "مشکل فنی",
    "پیشنهاد و انتقاد",
    "تخفیف",
    "سیستمی",
    "سایر",
]

type NewMessageModalProps = {
    onClose: () => void
}

export default function NewMessageModal({ onClose }: NewMessageModalProps) {
    const [subject, setSubject] = useState<MessageType>(subjectOptions[0])
    const [body, setBody] = useState("")
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleSubmit = () => {
        if (!body.trim()) {
            setError("لطفاً متن پیام خود را بنویسید.")
            return
        }
        setError("")

        startTransition(async () => {
            const res = await sendMessageAction(subject, body)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "ارسال شد",
                    text: "پیام شما با موفقیت برای پشتیبانی کیوی‌تک ارسال شد",
                    timer: 1800,
                    showConfirmButton: false,
                })
                onClose()
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در ارسال پیام پیش آمد" })
            }
        })
    }



    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800">
                        <PiChatCircleDotsLight className="w-5 h-5 text-primary-500" />
                        ارسال پیام به پشتیبانی
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">موضوع پیام</label>
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value as MessageType)}
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors cursor-pointer"
                        >
                            {subjectOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-xs text-zinc-500">متن پیام</label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={5}
                            placeholder="پیام خود را اینجا بنویسید..."
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors resize-none"
                        />
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 flex-center gap-1.5 h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <PiPaperPlaneRightLight className="w-4 h-4" />
                        {isPending ? "در حال ارسال..." : "ارسال پیام"}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    )
}
