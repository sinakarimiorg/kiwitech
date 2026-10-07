"use client"

import { useState, useTransition } from "react"
import Swal from "sweetalert2"
import type { UserProfile } from "@root/src/types/userType"
import { updateProfileAction } from "./actions"
import PanelModal, { panelFieldClasses, panelPrimaryButton, panelSecondaryButton } from "../PanelModal/PanelModal"

type EditProfileModalProps = {
    user: UserProfile
    onClose: () => void
}

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
    const [name, setName] = useState(user.name ?? '')
    const [email, setEmail] = useState(user.email ?? '')
    const [nationalCode, setNationalCode] = useState(user.nationalCode ?? '')
    const [birthDate, setBirthDate] = useState(user.birthDate ?? '')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()


    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        let year = value.slice(0, 4);
        let month = value.slice(4, 6);
        let day = value.slice(6, 8);

        if (year.length === 4) {
            const yearNum = parseInt(year, 10);
            const currentPersianYear = 1405;
            const maxBirthYear = currentPersianYear - 7;

            if (yearNum > maxBirthYear) {
                year = maxBirthYear.toString();
            } else if (yearNum < 1300) {
                year = "1300";
            }
        }

        if (month.length === 2) {
            const monthNum = parseInt(month, 10);
            if (monthNum > 12) {
                month = "12";
            } else if (monthNum === 0) {
                month = "01";
            }
        }

        if (day.length === 2) {
            const monthNum = parseInt(month, 10);
            const dayNum = parseInt(day, 10);

            let maxDays = 31;
            if (monthNum > 6 && monthNum < 12) {
                maxDays = 30;
            } else if (monthNum === 12) {
                maxDays = 29;
            }

            if (dayNum > maxDays) {
                day = maxDays.toString();
            } else if (dayNum === 0) {
                day = "01";
            }
        }

        let formattedValue = year;
        if (month.length > 0) {
            formattedValue += `/${month}`;
        }
        if (day.length > 0) {
            formattedValue += `/${day}`;
        }

        setBirthDate(formattedValue);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('نام و نام خانوادگی الزامی است.')
            return
        }

        startTransition(async () => {
            const result = await updateProfileAction({
                name: name.trim(),
                email: email.trim() || undefined,
                nationalCode: nationalCode.trim() || undefined,
                birthDate,
            })

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: "اطلاعات شما با موفقیت بروزرسانی شد",
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
            title='ویرایش مشخصات فردی'
            size='md'
            busy={isPending}
            onClose={onClose}
            footer={
                <div className='flex items-center gap-3'>
                    <button onClick={handleSubmit} disabled={isPending} className={panelPrimaryButton}>
                        {isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button onClick={onClose} disabled={isPending} className={panelSecondaryButton}>
                        انصراف
                    </button>
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">نام و نام خانوادگی</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoComplete="name"
                        className={panelFieldClasses}
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">شماره موبایل</label>
                    <input
                        value={user.phone}
                        disabled
                        dir="ltr"
                        className={`${panelFieldClasses} text-left bg-gray-100! text-zinc-400 cursor-not-allowed`}
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">پست الکترونیکی</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        dir="ltr"
                        placeholder="example@mail.com"
                        className={`${panelFieldClasses} text-left`}
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">کد ملی</label>
                    <input
                        value={nationalCode}
                        onChange={e => setNationalCode(e.target.value)}
                        inputMode="numeric"
                        maxLength={10}
                        dir="ltr"
                        className={`${panelFieldClasses} text-left`}
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-xs text-zinc-500">تاریخ تولد</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        placeholder="YYYY/MM/DD"
                        maxLength={10}
                        dir="ltr"
                        className={`${panelFieldClasses} text-left`}
                    />
                </div>
            </div>

            {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        </PanelModal>
    )
}