"use client"

import { useState, useTransition } from "react"
import {
    PiMagnifyingGlassLight,
    PiUsersLight,
    PiPlusCircleLight,
} from "react-icons/pi"
import { UserType, UserRole, UserStatus } from "@root/src/types/UserType"
import { addUserAction, deleteUserAction, toggleUserStatusAction, updateUserAction } from "./actions"
import Swal from "sweetalert2"
import UserModal from "./UserModal"
import UserBox from "./UserBox"

const filters: ("همه" | UserStatus)[] = ["همه", "فعال", "مسدود"]

type UsersListProps = {
    initialUsers: UserType[]
}

export default function UsersList({ initialUsers }: UsersListProps) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | UserStatus>("همه")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserType | null>(null)
    const [isPending, startTransition] = useTransition()

    const filtered = initialUsers.filter(u => {
        const matchesSearch = u.name.includes(search) || u.phone.includes(search)
        const matchesFilter = activeFilter === "همه" || u.status === activeFilter
        return matchesSearch && matchesFilter
    })

    const openAddModal = () => {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    const openEditModal = (user: UserType) => {
        setEditingUser(user)
        setIsModalOpen(true)
    }

    const saveUser = async (data: { name: string; phone: string; email?: string; status: UserStatus; role?: UserRole }) => {
        startTransition(async () => {
            const res = editingUser
                ? await updateUserAction(editingUser._id, data)
                : await addUserAction(data)

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: editingUser ? "مشتری با موفقیت ویرایش شد" : "مشتری با موفقیت افزوده شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                setIsModalOpen(false)
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در ذخیره مشتری پیش آمد" })
            }
        })
    }

    const toggleStatus = async (id: string, currentStatus: UserStatus) => {
        startTransition(async () => {
            const res = await toggleUserStatusAction(id, currentStatus === "فعال" ? "مسدود" : "فعال")
            if (!res.success) {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }

    const removeUser = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف مشتری",
            text: "آیا از حذف این مشتری مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteUserAction(id)
            if (res.success) {
                Swal.fire({ icon: "success", title: "حذف شد", text: "مشتری با موفقیت حذف شد", timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف مشتری پیش آمد" })
            }
        })
    }

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col gap-3 px-4 sm:px-6 py-4 border-b border-gray-100'>
                <div className='flex items-center justify-between gap-3'>
                    <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                        <PiUsersLight className='w-5 h-5 text-primary-500' />
                        لیست مشتریان
                        <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                    </h2>
                    <button onClick={openAddModal} className='flex sm:hidden flex-center w-9 h-9 text-text bg-primary-500 rounded-lg shrink-0'>
                        <PiPlusCircleLight className='w-5 h-5' />
                    </button>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    {/* Status Filter */}
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs w-fit'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className='flex items-center gap-2 px-3.5 py-2 w-full sm:w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='نام یا شماره موبایل...'
                            className='w-full bg-transparent outline-none text-xs md:text-sm placeholder:text-zinc-400'
                        />
                    </div>

                    <button onClick={openAddModal} className='hidden sm:flex flex-center gap-1.5 px-4 py-2 text-sm text-text linear_btn shrink-0'>
                        <PiPlusCircleLight className='w-4 h-4' />
                        <span>مشتری جدید</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='hidden md:table-row text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-10 py-3 text-right'>مشتری</th>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>نقش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>شماره تماس</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تعداد سفارش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مجموع خرید</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ عضویت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(user => (
                            <UserBox
                                key={user._id}
                                user={user}
                                openEditModal={openEditModal}
                                toggleStatus={toggleStatus}
                                removeUser={removeUser}
                                isPending={isPending}
                            />
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={8} className='py-10 text-center text-zinc-400'>مشتری‌ای یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <UserModal
                    initialData={editingUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveUser}
                    isSaving={isPending}
                    isEdit={editingUser}
                />
            )}
        </div>
    )
}
