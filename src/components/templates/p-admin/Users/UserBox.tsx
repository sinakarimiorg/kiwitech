import { UserType, UserStatus } from "@root/src/types/userType"
import {
    PiUserCircleLight,
    PiProhibitLight,
    PiCheckCircleLight,
    PiPencilSimpleLight,
    PiTrashLight,
} from "react-icons/pi"

const statusStyle: Record<UserStatus, string> = {
    "فعال": "bg-primary-50 text-primary-600",
    "مسدود": "bg-danger/10 text-danger",
}

type UserBoxProps = {
    user: UserType
    openEditModal: (user: UserType) => void
    toggleStatus: (id: string, currentStatus: UserStatus) => void
    removeUser: (id: string) => void
    isPending: boolean
}

function UserBox({ user, openEditModal, toggleStatus, removeUser, isPending }: UserBoxProps) {
    
    return (
        <>
            {/* ردیف جدول - از md به بالا */}
            <tr key={user._id} className='hidden md:table-row hover:bg-primary-50/30 transition-colors text-center'>
                <td className='px-5 sm:px-6 py-3.5 text-right'>
                    <div className='flex items-center gap-3'>
                        <span className='flex-center w-10 h-10 shrink-0 bg-primary-50 text-primary-500 rounded-full'>
                            <PiUserCircleLight className='w-6 h-6' />
                        </span>
                        <div>
                            <p className='font-IranYekanMedium text-zinc-700 line-clamp-1'>{user.name}</p>
                            <p className='text-xs text-zinc-400'>{user.email || '—'}</p>
                        </div>
                    </div>
                </td>
                <td className='px-3 py-3.5 text-zinc-500 tracking-wide'>{user.role}</td>
                <td className='px-3 py-3.5 text-zinc-500 tracking-wide'>{user.phone}</td>
                <td className='px-3 py-3.5 text-zinc-600'>{user.ordersCount.toLocaleString('fa-IR')}</td>
                <td className='px-3 py-3.5 text-zinc-700 font-IranYekanMedium'>{user.totalSpent.toLocaleString()} تومان</td>
                <td className='px-3 py-3.5 text-zinc-400'>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '—'}
                </td>
                <td className='px-3 py-3.5'>
                    <span className={`px-2.5 py-1 text-xs rounded-lg ${statusStyle[user.status]}`}>
                        {user.status}
                    </span>
                </td>
                <td className='px-3 py-3.5'>
                    <div className='flex items-center justify-center gap-2'>
                        <button
                            onClick={() => openEditModal(user)}
                            className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                            <PiPencilSimpleLight className='w-4 h-4' />
                        </button>

                        <button
                            onClick={() => toggleStatus(user._id, user.status)}
                            disabled={isPending}
                            title={user.status === "فعال" ? "مسدود کردن" : "فعال کردن"}
                            className='flex-center w-8 h-8 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer'>
                            {user.status === "فعال" ? <PiProhibitLight className='w-4 h-4' /> : <PiCheckCircleLight className='w-4 h-4' />}
                        </button>
                        <button
                            onClick={() => removeUser(user._id)}
                            className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                            <PiTrashLight className='w-4 h-4' />
                        </button>
                    </div>
                </td>
            </tr>

            {/* کارت - زیر md */}
            <tr className='md:hidden'>
                <td colSpan={8} className='p-0'>
                    <div className='flex flex-col gap-3 px-4 py-4 border-b border-gray-50'>
                        <div className='flex items-center gap-3'>
                            <span className='flex-center w-11 h-11 shrink-0 bg-primary-50 text-primary-500 rounded-full'>
                                <PiUserCircleLight className='w-6 h-6' />
                            </span>
                            <div className='flex-1 min-w-0'>
                                <p className='font-IranYekanMedium text-sm text-zinc-700 line-clamp-1'>{user.name}</p>
                                <p className='text-xs text-zinc-400 tracking-wide'>{user.phone}</p>
                            </div>
                            <span className={`px-2 py-1 text-[11px] rounded-lg shrink-0 ${statusStyle[user.status]}`}>
                                {user.status}
                            </span>
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-xs text-zinc-500'>
                            <div className='flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg'>
                                <span>نقش</span>
                                <span className='text-zinc-700'>{user.role}</span>
                            </div>
                            <div className='flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg'>
                                <span>سفارش‌ها</span>
                                <span className='text-zinc-700'>{user.ordersCount.toLocaleString('fa-IR')}</span>
                            </div>
                            <div className='col-span-2 flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg'>
                                <span>مجموع خرید</span>
                                <span className='font-IranYekanMedium text-zinc-700'>{user.totalSpent.toLocaleString()} تومان</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => openEditModal(user)}
                                className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-primary-600 bg-primary-50 rounded-lg cursor-pointer'>
                                <PiPencilSimpleLight className='w-3.5 h-3.5' />
                                ویرایش
                            </button>
                            <button
                                onClick={() => toggleStatus(user._id, user.status)}
                                disabled={isPending}
                                className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg cursor-pointer'>
                                {user.status === "فعال" ? <PiProhibitLight className='w-3.5 h-3.5' /> : <PiCheckCircleLight className='w-3.5 h-3.5' />}
                                {user.status === "فعال" ? "مسدود" : "فعال"}
                            </button>
                            <button
                                onClick={() => removeUser(user._id)}
                                className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-danger bg-danger/10 rounded-lg cursor-pointer'>
                                <PiTrashLight className='w-3.5 h-3.5' />
                                حذف
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}

export default UserBox;