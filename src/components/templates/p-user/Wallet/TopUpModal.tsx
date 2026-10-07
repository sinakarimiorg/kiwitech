"use client"

import { useState, useTransition } from "react"
import Swal from "sweetalert2"
import { topUpWalletAction } from "./actions"
import PanelModal, { panelFieldClasses, panelPrimaryButton, panelSecondaryButton } from "../PanelModal/PanelModal"

type TopUpModalProps = {
    onClose: () => void
}

const quickAmounts = [100000, 200000, 500000, 1000000]

export default function TopUpModal({ onClose }: TopUpModalProps) {
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()
    
    const numericAmount = Number(amount.replace(/,/g, ''))

    const handleSubmit = () => {
        const numericAmount = Number(amount.replace(/,/g, ''))
        if (!numericAmount || numericAmount <= 0) {
            setError('لطفاً مبلغ معتبری وارد کنید.')
            return
        }

        startTransition(async () => {
            const result = await topUpWalletAction(numericAmount)

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "موجودی کیف پول شما با موفقیت افزایش یافت",
                    timer: 1500,
                    showConfirmButton: false,
                })
                onClose()
            } else {
                setError(result.error)
            }
        })
    }

    return (
        <PanelModal
            title='افزایش موجودی کیف پول'
            size='sm'
            busy={isPending}
            onClose={onClose}
            footer={
                <div className="flex items-center gap-3">
                    <button onClick={handleSubmit} disabled={isPending} className={panelPrimaryButton}>
                        {isPending ? 'در حال پردازش...' : 'افزایش موجودی'}
                    </button>
                    <button onClick={onClose} disabled={isPending} className={panelSecondaryButton}>
                        انصراف
                    </button>
                </div>
            }
        >
            <label className="block mb-1.5 text-xs text-zinc-500">مبلغ (تومان)</label>
            <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="مثال: 500000"
                inputMode="numeric"
                dir="ltr"
                className={`${panelFieldClasses} text-zinc-600 text-left`}
            />

            {numericAmount > 0 &&
                <p className="mt-1.5 text-xs text-primary-600">{numericAmount.toLocaleString()} تومان</p>
            }

            <div className="flex flex-wrap gap-2 mt-3">
                {quickAmounts.map(qa => (
                    <button
                        key={qa}
                        type="button"
                        onClick={() => setAmount(String(qa))}
                        className="px-3 py-2 text-xs text-zinc-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                        {qa.toLocaleString()} تومان
                    </button>
                ))}
            </div>

            <p className="mt-3 text-[11px] text-zinc-400 leading-5">
                ⚠️ در حال حاضر درگاه پرداخت واقعی متصل نیست؛ این افزایش موجودی صرفاً برای تست است.
            </p>

            {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        </PanelModal>
    )
}
