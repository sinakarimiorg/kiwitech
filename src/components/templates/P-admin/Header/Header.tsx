import {
    PiMagnifyingGlassLight,
    PiBellLight,
    PiUserCircleLight,
    PiShoppingBagOpenLight,
    PiChatCircleTextLight,
    PiWarningCircleLight,
} from 'react-icons/pi'
import { getAdminNotifications } from '@root/src/lib/admin/notifications'
import NotificationsDropdown from './NotificationsDropdown'

const AdminTopbar = async () => {
    const notifications = await getAdminNotifications()

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 pl-3 sm:pl-6 pr-16 lg:pr-6 py-3.5 sm:py-4 mb-4 bg-white shadow-sm">
            <h1 className="font-MorabbaBold text-base sm:text-lg lg:text-xl text-zinc-800 truncate">پـنل مـدیـریـت</h1>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
                {/* Search Box - فقط از md به بالا */}
                <div className="hidden md:flex items-center gap-2 px-3.5 py-2 w-52 lg:w-64 bg-gray-50 border border-gray-200 rounded-xl text-xs lg:text-sm text-zinc-400 focus-within:border-primary-400 transition-colors">
                    <PiMagnifyingGlassLight className="w-4 h-4 shrink-0" />
                    <input
                        type="text"
                        placeholder="جستجو در سفارش‌ها، محصولات..."
                        className="w-full bg-transparent outline-none placeholder:text-zinc-400"
                    />
                </div>

                {/* Notifications Dropdown */}
                <NotificationsDropdown notifications={notifications} />

                {/* Admin Profile */}
                <div className="flex items-center gap-2.5 pr-0 sm:pr-3 sm:border-r border-gray-200">
                    <span className="flex-center w-9 h-9 bg-primary-50 text-primary-600 rounded-full shrink-0">
                        <PiUserCircleLight className="w-6 h-6" />
                    </span>
                    <div className="hidden sm:block">
                        <p className="font-IranYekanMedium text-sm text-zinc-800">سینا کریمی</p>
                        <p className="text-xs text-zinc-400">مدیر فروشگاه</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTopbar