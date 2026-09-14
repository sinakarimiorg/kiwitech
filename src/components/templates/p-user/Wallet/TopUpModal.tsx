"use client"

import { useState, useTransition } from "react"
import { PiXBold } from "react-icons/pi"
import Swal from "sweetalert2"
import { topUpWalletAction } from "./actions"

type TopUpModalProps = {
    onClose: () => void
}

const quickAmounts = [100000, 200000, 500000, 1000000]

export default function TopUpModal({ onClose }: TopUpModalProps) {
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()

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
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 sm:p-6">

                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">افزایش موجودی کیف پول</h2>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <label className="block mb-1.5 text-xs text-zinc-500">مبلغ (تومان)</label>
                <input
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="مثال: 500000"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 text-zinc-600 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map(qa => (
                        <button
                            key={qa}
                            type="button"
                            onClick={() => setAmount(String(qa))}
                            className="px-3 py-1.5 text-xs text-zinc-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                            {qa.toLocaleString()} تومان
                        </button>
                    ))}
                </div>

                <p className="mt-3 text-[11px] text-zinc-400 leading-5">
                    ⚠️ در حال حاضر درگاه پرداخت واقعی متصل نیست؛ این افزایش موجودی صرفاً برای تست است.
                </p>

                {error && <p className="mt-3 text-xs text-danger">{error}</p>}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'در حال پردازش...' : 'افزایش موجودی'}
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
