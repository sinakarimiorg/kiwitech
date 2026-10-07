"use client"

import { useState, useTransition } from "react"
import { PiPaperPlaneRightLight, PiChatCircleDotsLight } from "react-icons/pi"
import Swal from "sweetalert2"
import { sendMessageAction } from "./actions"
import type { MessageType } from "@root/src/types/userMessageType"
import PanelModal, { panelFieldClasses, panelPrimaryButton, panelSecondaryButton } from "../PanelModal/PanelModal"

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
        <PanelModal
            title='ارسال پیام به پشتیبانی'
            icon={<PiChatCircleDotsLight className="w-5 h-5 shrink-0 text-primary-500" />}
            size='lg'
            busy={isPending}
            onClose={onClose}
            footer={
                <div className="flex items-center gap-3">
                    <button onClick={handleSubmit} disabled={isPending} className={`${panelPrimaryButton} gap-1.5`}>
                        <PiPaperPlaneRightLight className="w-4 h-4" />
                        {isPending ? "در حال ارسال..." : "ارسال پیام"}
                    </button>
                    <button onClick={onClose} disabled={isPending} className={panelSecondaryButton}>
                        انصراف
                    </button>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">موضوع پیام</label>
                    <select
                        value={subject}
                        onChange={e => setSubject(e.target.value as MessageType)}
                        className={`${panelFieldClasses} cursor-pointer`}
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
                        className={`${panelFieldClasses} resize-none`}
                    />
                </div>
            </div>

            {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        </PanelModal>
    )
}
