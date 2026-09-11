"use client"

import { useState, useTransition } from "react"
import { PiMapPinLight, PiPencilSimpleLight, PiTrashLight, PiPlusCircleLight, PiCheckCircleFill, PiPhoneLight } from "react-icons/pi"
import Swal from "sweetalert2"
import AddressModal from "./AddressModal"
import { UserAddress } from "@root/src/types/userAddressType"
import { addAddressAction, deleteAddressAction, setDefaultAddressAction, updateAddressAction } from "./actions"

export default function AddressesList({ initialAddresses }: { initialAddresses: UserAddress[] }) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
    const [isPending, startTransition] = useTransition()


    const openAddModal = () => {
        setEditingAddress(null)
        setIsModalOpen(true)
    }

    const openEditModal = (address: UserAddress) => {
        setEditingAddress(address)
        setIsModalOpen(true)
    }

    const saveAddress = (data: Omit<UserAddress, "_id" | "isDefault">) => {
        startTransition(async () => {
            const res = editingAddress
                ? await updateAddressAction(editingAddress._id, data)
                : await addAddressAction(data)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: editingAddress ? "آدرس با موفقیت ویرایش شد" : "آدرس با موفقیت افزوده شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                setIsModalOpen(false)
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در ذخیره آدرس پیش آمد" })
            }
        })
    }

    const removeAddress = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف آدرس",
            text: "آیا از حذف این آدرس مطمئن هستید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteAddressAction(id);
            if (res.success) {
                Swal.fire({ icon: "success", title: "حذف شد", text: "آدرس با موفقیت حذف شد", timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف آدرس پیش آمد" })
            }
        })
    }

    const makeDefault = (id: string) => {
        startTransition(async () => {
            const res = await setDefaultAddressAction(id)
            if (!res.success) {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }


    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <h1 className='font-IranYekanBold text-lg text-zinc-800'>نشانی‌های من</h1>
                <button onClick={openAddModal} className='flex-center gap-1.5 px-4 py-2 text-sm text-text linear_btn'>
                    <PiPlusCircleLight className='w-4 h-4' />
                    افزودن آدرس
                </button>
            </div>

            {initialAddresses.length === 0 ? (
                <div className='bg-white shadow-lg rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4'>
                    <span className='flex-center w-16 h-16 bg-primary-50 text-primary-400 rounded-full'>
                        <PiMapPinLight className='w-8 h-8' />
                    </span>
                    <div>
                        <h2 className='font-IranYekanBold text-zinc-700'>هنوز آدرسی ثبت نکرده‌اید</h2>
                        <p className='mt-1.5 text-sm text-zinc-400'>برای تحویل سریع‌تر سفارش‌ها، یک آدرس اضافه کنید.</p>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {initialAddresses.map(address => (
                        <div key={address._id} className={`relative bg-white shadow-lg rounded-2xl p-5 border-2 transition-colors
                            ${address.isDefault ? 'border-primary-400' : 'border-transparent'}`}>

                            {address.isDefault &&
                                <span className='absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 text-[11px] font-IranYekanMedium text-primary-600 bg-primary-50 rounded-lg'>
                                    <PiCheckCircleFill className='w-3.5 h-3.5' />
                                    پیش‌فرض
                                </span>
                            }

                            <div className='flex items-center gap-2 mb-2'>
                                <PiMapPinLight className='w-4.5 h-4.5 text-primary-500' />
                                <h3 className='font-IranYekanBold text-sm text-zinc-800'>{address.title}</h3>
                            </div>

                            <p className='text-xs text-zinc-400 mb-1'>{address.receiver}</p>
                            <p className='flex items-center gap-1.5 text-xs text-zinc-400 mb-3' dir='ltr'>
                                <PiPhoneLight className='w-3.5 h-3.5' />
                                {address.phone}
                            </p>
                            <p className='text-sm text-zinc-600 leading-6 min-h-12'>{address.fullAddress}</p>

                            <div className='flex items-center gap-2 mt-4 pt-4 border-t border-gray-100'>
                                {!address.isDefault &&
                                    <button
                                        onClick={() => makeDefault(address._id)}
                                        disabled={isPending}
                                        className='text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer'>
                                        تنظیم به‌عنوان پیش‌فرض
                                    </button>
                                }
                                <div className='flex items-center gap-2 mr-auto'>
                                    <button
                                        onClick={() => openEditModal(address)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                        <PiPencilSimpleLight className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => removeAddress(address._id)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                                        <PiTrashLight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <AddressModal
                    initialData={editingAddress}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveAddress}
                    isSaving={isPending}
                />
            )}
        </div>
    )
}
