"use client"

import { useState } from "react"
import {
    PiMagnifyingGlassLight,
    PiEyeLight,
    PiShoppingBagOpenLight,
    PiUserCircleLight,
} from "react-icons/pi"

export type OrderStatus = "در حال پردازش" | "ارسال شده" | "تحویل شده" | "لغو شده"

export type OrderItem = {
    id: number
    title: string
    img: string
    price: number
    count: number
}

export type Order = {
    id: string
    customer: string
    phone: string
    address: string
    items: OrderItem[]
    paymentMethod: "آنلاین" | "در محل"
    shippingCost: number
    status: OrderStatus
    date: string
    time: string
}

// نمونه دیتای اولیه - در آینده با فچ از API جایگزین می‌شود
export const seedOrders: Order[] = [
    {
        id: "۱۴۰۴۰۹۲۳۱۸",
        customer: "سینا کریمی",
        phone: "۰۹۳۰۰۵۲۵۲۶۲",
        address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، واحد ۳",
        items: [
            { id: 1, title: "هندزفری بلوتوثی کربی مدل CR-T107", img: "/images/products/airpods.png", price: 765000, count: 1 },
            { id: 2, title: "کابل شارژ مولتی رابط مدل ایکس", img: "/images/products/charge-cable.png", price: 490000, count: 2 },
        ],
        paymentMethod: "آنلاین",
        shippingCost: 0,
        status: "در حال پردازش",
        date: "۱۴۰۴/۰۴/۰۸",
        time: "۱۴:۲۲",
    },
    {
        id: "۱۴۰۴۰۹۲۳۱۷",
        customer: "علی رضایی",
        phone: "۰۹۱۲۳۴۵۶۷۸۹",
        address: "تهران، خیابان آزادی، برج نگین، طبقه ۵، واحد ۹",
        items: [
            { id: 3, title: "قاب و کاور گوشی مدل پترن", img: "/images/products/cover.png", price: 149000, count: 1 },
        ],
        paymentMethod: "در محل",
        shippingCost: 45000,
        status: "ارسال شده",
        date: "۱۴۰۴/۰۴/۰۸",
        time: "۱۳:۵۰",
    },
    {
        id: "۱۴۰۴۰۹۲۳۱۶",
        customer: "مریم احمدی",
        phone: "۰۹۳۵۱۱۲۲۳۳۴",
        address: "اصفهان، خیابان چهارباغ، کوچه ۱۴، پلاک ۷",
        items: [
            { id: 4, title: "پاوربانک انکر مدل PowerCore 10000", img: "/images/products/power-bank1.png", price: 2200000, count: 1 },
        ],
        paymentMethod: "آنلاین",
        shippingCost: 0,
        status: "تحویل شده",
        date: "۱۴۰۴/۰۴/۰۷",
        time: "۱۱:۰۵",
    },
    {
        id: "۱۴۰۴۰۹۲۳۱۵",
        customer: "حسین نوری",
        phone: "۰۹۱۹۸۸۷۷۶۶۵",
        address: "شیراز، بلوار زند، نبش کوچه ۹",
        items: [
            { id: 5, title: "شارژر فندکی 35 وات مدل QC 3", img: "/images/products/car-charger.png", price: 320000, count: 1 },
            { id: 6, title: "کابل شارژ مولتی رابط مدل ایکس", img: "/images/products/charge-cable.png", price: 490000, count: 1 },
        ],
        paymentMethod: "در محل",
        shippingCost: 45000,
        status: "لغو شده",
        date: "۱۴۰۴/۰۴/۰۷",
        time: "۲۲:۱۸",
    },
    {
        id: "۱۴۰۴۰۹۲۳۱۴",
        customer: "زهرا محمدی",
        phone: "۰۹۳۶۴۴۵۵۶۶۷",
        address: "مشهد، بلوار وکیل‌آباد، پلاک ۲۲",
        items: [
            { id: 7, title: "هندزفری بلوتوثی کربی مدل CR-T107", img: "/images/products/airpods.png", price: 765000, count: 1 },
        ],
        paymentMethod: "آنلاین",
        shippingCost: 0,
        status: "تحویل شده",
        date: "۱۴۰۴/۰۴/۰۶",
        time: "۰۹:۱۲",
    },
]

export const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

const statusOptions: OrderStatus[] = ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"]
const filters: ("همه" | OrderStatus)[] = ["همه", "در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"]

export function getOrderTotal(order: Order) {
    return order.items.reduce((sum, item) => sum + item.price * item.count, 0) + order.shippingCost
}

type OrdersListProps = {
    orders: Order[]
    onView: (order: Order) => void
    onStatusChange: (id: string, status: OrderStatus) => void
}

export default function OrdersList({ orders, onView, onStatusChange }: OrdersListProps) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | OrderStatus>("همه")

    const filtered = orders.filter(o => {
        const matchesSearch = o.customer.includes(search) || o.id.includes(search) || o.phone.includes(search)
        const matchesFilter = activeFilter === "همه" || o.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiShoppingBagOpenLight className='w-5 h-5 text-primary-500' />
                    لیست سفارش‌ها
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs overflow-x-auto'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 whitespace-nowrap rounded-lg transition-colors cursor-pointer
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className='hidden lg:flex items-center gap-2 px-3.5 py-2 w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='مشتری یا شماره سفارش...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-right text-xs text-zinc-400 border-b border-gray-100'>
                            <th className='font-IranYekanMedium px-5 sm:px-6 py-3'>شماره سفارش</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مشتری</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تعداد اقلام</th>
                            <th className='font-IranYekanMedium px-3 py-3'>مبلغ</th>
                            <th className='font-IranYekanMedium px-3 py-3'>پرداخت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>وضعیت</th>
                            <th className='font-IranYekanMedium px-3 py-3'>تاریخ</th>
                            <th className='font-IranYekanMedium px-3 py-3'>عملیات</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filtered.map(order => (
                            <tr key={order.id} className='hover:bg-primary-50/30 transition-colors'>
                                <td className='px-5 sm:px-6 py-3.5 font-IranYekanMedium text-zinc-700 tracking-wide'>
                                    {order.id}
                                </td>
                                <td className='px-3 py-3.5'>
                                    <div className='flex items-center gap-2'>
                                        <PiUserCircleLight className='w-5 h-5 text-zinc-400' />
                                        <span className='text-zinc-600'>{order.customer}</span>
                                    </div>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-500'>
                                    {order.items.reduce((s, i) => s + i.count, 0)} عدد
                                </td>
                                <td className='px-3 py-3.5 font-IranYekanMedium text-zinc-700'>
                                    {getOrderTotal(order).toLocaleString()} تومان
                                </td>
                                <td className='px-3 py-3.5 text-zinc-500'>{order.paymentMethod}</td>
                                <td className='px-3 py-3.5'>
                                    <select
                                        value={order.status}
                                        onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
                                        className={`px-2.5 py-1 text-xs rounded-lg outline-none cursor-pointer border-0 ${statusStyle[order.status]}`}>
                                        {statusOptions.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className='px-3 py-3.5 text-zinc-400 whitespace-nowrap'>
                                    {order.date} <span className='text-zinc-300'>|</span> {order.time}
                                </td>
                                <td className='px-3 py-3.5'>
                                    <button
                                        onClick={() => onView(order)}
                                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                                        <PiEyeLight className='w-4 h-4' />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 &&
                            <tr>
                                <td colSpan={8} className='py-10 text-center text-zinc-400'>سفارشی یافت نشد.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
