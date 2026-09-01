import { AdminUser, UserStatus } from "@root/src/types/adminUserType"
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
    user: AdminUser
    openEditModal: (user: AdminUser) => void
    toggleStatus: (id: string, currentStatus: UserStatus) => void
    removeUser: (id: string) => void
    isPending: boolean
}

function UserBox({ user, openEditModal, toggleStatus, removeUser, isPending }: UserBoxProps) {
    
    return (
        <tr key={user._id} className='hover:bg-primary-50/30 transition-colors text-center'>
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
    )
}

export default UserBox;