"use client"

import { useState, useTransition } from "react"
import { PiFloppyDiskLight, PiTruckLight } from "react-icons/pi"
import Swal from "sweetalert2"
import { updateShippingSettingsAction } from "./actions"
import type { ShippingSettings } from "@root/src/types/siteSettingsType"

export default function ShippingSettingsForm({ initialSettings }: { initialSettings: ShippingSettings }) {
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(initialSettings.freeShippingThreshold))
    const [standardShippingCost, setStandardShippingCost] = useState(String(initialSettings.standardShippingCost))
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleSubmit = () => {
        const thresholdValue = Number(freeShippingThreshold)
        const costValue = Number(standardShippingCost)

        if (!freeShippingThreshold || !standardShippingCost || thresholdValue < 0 || costValue < 0) {
            setError("لطفاً مقادیر معتبری وارد کنید.")
            return
        }
        setError("")

        startTransition(async () => {
            const res = await updateShippingSettingsAction({
                freeShippingThreshold: thresholdValue,
                standardShippingCost: costValue,
            })

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "تنظیمات ارسال با موفقیت ذخیره شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }

    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 max-w-xl">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <PiTruckLight className="w-5 h-5 text-primary-500" />
                <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">تنظیمات هزینه ارسال</h2>
            </div>

            <div className="flex flex-col gap-5">
                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">حداقل مبلغ خرید برای ارسال رایگان (تومان)</label>
                    <input
                        value={freeShippingThreshold ? Number(freeShippingThreshold).toLocaleString("en-US") : ""}
                        onChange={e => setFreeShippingThreshold(e.target.value.replace(/\D/g, ""))}
                        type="text"
                        placeholder="مثال: 2,000,000"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors"
                    />
                    <p className="mt-1.5 text-[11px] text-zinc-400">سفارش‌های بالاتر از این مبلغ، هزینه ارسال ندارند.</p>
                </div>

                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">هزینه ارسال استاندارد (تومان)</label>
                    <input
                        value={standardShippingCost ? Number(standardShippingCost).toLocaleString("en-US") : ""}
                        onChange={e => setStandardShippingCost(e.target.value.replace(/\D/g, ""))}
                        type="text"
                        placeholder="مثال: 45,000"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors"
                    />
                    <p className="mt-1.5 text-[11px] text-zinc-400">این مبلغ برای سفارش‌های زیر سقف بالا از مشتری دریافت می‌شود.</p>
                </div>
            </div>

            {error && <p className="mt-3 text-xs text-danger">{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-center gap-1.5 mt-6 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <PiFloppyDiskLight className="w-4 h-4" />
                {isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
        </div>
    )
}
