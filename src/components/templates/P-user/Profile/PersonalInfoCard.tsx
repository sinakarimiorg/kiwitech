"use client"

import { UserProfile } from "@root/src/types/userType";
import { useState } from "react";
import { PiUserCircleLight, PiPencilSimpleLight } from "react-icons/pi";
import EditProfileModal from "./EditProfileModal"


export default function PersonalInfoCard({ user }: { user: UserProfile }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const infoFields = [
        { id: 'fullname', label: 'نام و نام خانوادگی', value: user.name || '—' },
        { id: 'email', label: 'پست الکترونیکی', value: user.email || '—', isLtr: true },
        { id: 'phone', label: 'شماره موبایل', value: user.phone },
        { id: 'national-code', label: 'کد ملی', value: user.nationalCode || '—' },
        { id: 'birthDate', label: 'تاریخ تولد', value: user.birthDate || '—' },
    ]

    return (
        <div className='bg-white shadow-lg rounded-2xl p-4 sm:p-7'>

            {/* Card Header */}
            <div className='flex items-center justify-between pb-4 mb-5 sm:mb-6 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiUserCircleLight className='w-5 sm:w-6 h-5 sm:h-6 text-primary-500' />
                    مشخصات فردی
                </h2>
            </div>

            <div className='flex flex-col-reverse sm:flex-row items-center sm:items-start gap-y-5 sm:gap-x-10'>

                <div className='grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 flex-1 w-full min-w-0'>
                    {infoFields.map(field => (
                        <div key={field.id} className='min-w-0'>
                            <p className='text-xs text-zinc-400'>{field.label}</p>
                            <p
                                dir={field.isLtr && field.value !== '—' ? 'ltr' : undefined}
                                className={`mt-1.5 font-IranYekanMedium text-sm text-zinc-800 break-all ${field.isLtr && field.value !== '—' ? 'text-right' : ''}`}
                            >
                                {field.value}
                            </p>
                        </div>
                    ))}
                </div>

                <span className='hidden sm:block w-px self-stretch bg-gray-100' />

                <div className='flex-center w-20 h-20 sm:w-24 sm:h-24 bg-primary-50 text-primary-400 rounded-full shrink-0'>
                    <PiUserCircleLight className='w-11 sm:w-13 h-11 sm:h-13' />
                </div>
            </div>

            {/* Edit Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className='flex-center gap-1.5 w-full sm:w-auto mt-6 sm:mt-7 py-3 sm:py-2.5 px-5 text-sm text-text linear_btn'>
                <PiPencilSimpleLight className='w-4 h-4' />
                ویرایش اطلاعات
            </button>

            {isModalOpen && (
                <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    )
}
