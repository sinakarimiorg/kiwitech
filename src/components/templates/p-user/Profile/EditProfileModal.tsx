"use client"

import { useEffect, useState, useTransition } from "react"
import type { FormEvent, ReactNode } from "react"
import { PiXBold } from "react-icons/pi"
import Swal from "sweetalert2"
import type { UserProfile } from "@root/src/types/userType"
import { updateProfileAction } from "./actions"
import {
    DEFAULT_USER_NAME,
    formatJalaliDateInput,
    toEnglishDigits,
    validateProfile,
    type ProfileErrors,
} from "@root/src/utils/profileValidation"

type EditProfileModalProps = {
    user: UserProfile
    onClose: () => void
}

type FormValues = {
    name: string
    email: string
    nationalCode: string
    birthDate: string
}

const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none transition-colors
    ${hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-primary-400"}`

function FieldBox({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div>
            <label className="block mb-1.5 text-xs text-zinc-500">{label}</label>
            {children}
            {error
                ? <p className="mt-1.5 text-[11px] text-danger">{error}</p>
                : hint && <p className="mt-1.5 text-[11px] text-zinc-400">{hint}</p>}
        </div>
    )
}

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
    const initialValues: FormValues = {
        name: user.name && user.name !== DEFAULT_USER_NAME ? user.name : "",
        email: user.email ?? "",
        nationalCode: user.nationalCode ?? "",
        birthDate: user.birthDate ?? "",
    }

    const [values, setValues] = useState<FormValues>(initialValues)
    const [errors, setErrors] = useState<ProfileErrors>({})
    const [formError, setFormError] = useState("")
    const [isPending, startTransition] = useTransition()

    const isDirty = (Object.keys(initialValues) as (keyof FormValues)[]).some(
        key => values[key].trim() !== initialValues[key].trim()
    )

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isPending) onClose()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isPending, onClose])

    const setField = (field: keyof FormValues, raw: string) => {
        let value = raw
        if (field === "nationalCode") value = toEnglishDigits(raw).replace(/\D/g, "").slice(0, 10)
        if (field === "birthDate") value = formatJalaliDateInput(raw)

        setValues(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
        setFormError("")
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (isPending || !isDirty) return

        const { values: cleanValues, errors: clientErrors } = validateProfile(values)
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors)
            return
        }

        startTransition(async () => {
            const result = await updateProfileAction(cleanValues)

            if (result.success) {
                await Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "اطلاعات شما با موفقیت بروزرسانی شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                onClose()
            } else {
                if (result.fieldErrors) setErrors(result.fieldErrors)
                setFormError(result.error)
            }
        })
    }

    return (
        <div
            onMouseDown={e => { if (e.target === e.currentTarget && !isPending) onClose() }}
            className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/40 z-50 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto"
        >
            <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">ویرایش مشخصات فردی</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        aria-label="بستن"
                        className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <FieldBox label="نام و نام خانوادگی *" error={errors.name}>
                        <input
                            value={values.name}
                            onChange={e => setField("name", e.target.value)}
                            autoFocus
                            maxLength={60}
                            placeholder="مثال: سینا کریمی"
                            className={inputClass(!!errors.name)}
                        />
                    </FieldBox>

                    <FieldBox label="شماره موبایل" hint="شماره موبایل با کد تایید ثبت شده و قابل تغییر نیست.">
                        <input
                            value={user.phone}
                            disabled
                            dir="ltr"
                            className="w-full px-3.5 py-2.5 text-sm text-left bg-gray-100 border border-gray-200 rounded-xl outline-none text-zinc-400 cursor-not-allowed"
                        />
                    </FieldBox>

                    <FieldBox label="پست الکترونیکی" error={errors.email}>
                        <input
                            value={values.email}
                            onChange={e => setField("email", e.target.value)}
                            type="email"
                            dir="ltr"
                            placeholder="example@mail.com"
                            className={`${inputClass(!!errors.email)} text-left`}
                        />
                    </FieldBox>

                    <FieldBox label="کد ملی" error={errors.nationalCode}>
                        <input
                            value={values.nationalCode}
                            onChange={e => setField("nationalCode", e.target.value)}
                            inputMode="numeric"
                            dir="ltr"
                            maxLength={10}
                            placeholder="۱۰ رقم"
                            className={`${inputClass(!!errors.nationalCode)} text-left`}
                        />
                    </FieldBox>

                    <FieldBox label="تاریخ تولد (شمسی)" error={errors.birthDate}>
                        <input
                            value={values.birthDate}
                            onChange={e => setField("birthDate", e.target.value)}
                            inputMode="numeric"
                            dir="ltr"
                            maxLength={10}
                            placeholder="YYYY/MM/DD"
                            className={`${inputClass(!!errors.birthDate)} text-left`}
                        />
                    </FieldBox>
                </div>

                {formError && !Object.keys(errors).length && (
                    <p className="mt-3 text-xs text-danger">{formError}</p>
                )}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={isPending || !isDirty}
                        className="flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    )
}
