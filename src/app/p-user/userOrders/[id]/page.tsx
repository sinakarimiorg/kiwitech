import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Layout from "@root/src/components/layouts/UserPanelLayout"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import OrderModel from "@models/Order"
import "@models/Product"
import TomanIcon from "@root/src/components/modules/Icons/TomanIcon"
import type { UserOrder, OrderStatus } from "@root/src/types/userOrderType"
import { PiMapPinLight, PiPhoneLight, PiCheckBold } from "react-icons/pi"
import { HiMiniChevronRight } from "react-icons/hi2"

export const dynamic = "force-dynamic"

const statusStyle: Record<OrderStatus, string> = {
    "در حال پردازش": "bg-amber-50 text-amber-600",
    "ارسال شده": "bg-sky-50 text-sky-600",
    "تحویل شده": "bg-primary-50 text-primary-600",
    "لغو شده": "bg-danger/10 text-danger",
}

const progressSteps: OrderStatus[] = ["در حال پردازش", "ارسال شده", "تحویل شده"]

function getItemsTotal(order: UserOrder) {
    return order.items.reduce((sum, item) => sum + item.price * item.count, 0)
}

type OrderDetailPageProps = {
    params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) redirect("/login-register")

    await connectDB()

    const orderDoc = await OrderModel.findOne({
        _id: id,
        $or: [{ user: user._id }, { phone: user.phone }],
    })
        .populate("items.product", "linkName")
        .lean()

    if (!orderDoc) notFound()

    const order: UserOrder = JSON.parse(JSON.stringify(orderDoc))
    const currentStepIndex = progressSteps.indexOf(order.status)
    const itemsTotal = getItemsTotal(order)
    const finalTotal = itemsTotal + order.shippingCost

    return (
        <Layout>
            <main className="flex-1 min-w-0 flex flex-col gap-5">

                <Link href="/p-user/userOrders" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary-600 transition-colors w-fit">
                    <HiMiniChevronRight className="w-4 h-4" />
                    بازگشت به سفارش‌های من
                </Link>

                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-gray-100">
                        <div>
                            <p className="font-IranYekanBold text-sm sm:text-base text-zinc-800 tracking-wide" dir="ltr">
                                {order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>
                        <span className={`self-start sm:self-auto px-3 py-1.5 text-xs rounded-lg ${statusStyle[order.status]}`}>
                            {order.status}
                        </span>
                    </div>

                    {/* Progress */}
                    {order.status !== "لغو شده" && (
                        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                            <div className="flex items-start">
                                {progressSteps.map((step, i) => {
                                    const isDone = i < currentStepIndex
                                    const isActive = i === currentStepIndex
                                    const isLast = i === progressSteps.length - 1

                                    return (
                                        <div key={step} className={`flex items-start ${isLast ? "" : "flex-1"}`}>
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`flex-center w-8 h-8 rounded-full border-2 text-xs
                                                    ${isDone
                                                        ? "bg-primary-500 border-primary-500 text-white"
                                                        : isActive
                                                            ? "bg-white border-primary-500 text-primary-600 ring-4 ring-primary-100"
                                                            : "bg-white border-gray-200 text-zinc-300"}`}>
                                                    {isDone ? <PiCheckBold className="w-4 h-4" /> : (i + 1).toLocaleString("fa-IR")}
                                                </span>
                                                <span className={`text-[11px] sm:text-xs whitespace-nowrap
                                                    ${isActive ? "text-primary-600 font-IranYekanBold" : isDone ? "text-zinc-500" : "text-zinc-400"}`}>
                                                    {step}
                                                </span>
                                            </div>
                                            {!isLast &&
                                                <span className={`flex-1 h-0.5 mx-2 mt-4 rounded-full ${isDone ? "bg-primary-500" : "bg-gray-200"}`} />
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Address & phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 sm:px-6 py-5 border-b border-gray-100">
                        <div className="flex items-start gap-2">
                            <PiMapPinLight className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">آدرس تحویل</p>
                                <p className="text-sm text-zinc-700 leading-6">{order.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <PiPhoneLight className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">شماره تماس</p>
                                <p className="text-sm text-zinc-700" dir="ltr">{order.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-50">
                        {order.items.map(item => {
                            const productHref = item.product?.linkName ? `/product-info/${item.product.linkName}` : null

                            return (
                                <div key={item._id} className="flex items-center gap-3 px-5 sm:px-6 py-4">
                                    {productHref ? (
                                        <Link href={productHref} className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                            <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                                        </Link>
                                    ) : (
                                        <span className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                            <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                                        </span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        {productHref ? (
                                            <Link href={productHref} className="text-sm text-zinc-700 line-clamp-2 hover:text-primary-600 transition-colors">
                                                {item.title}
                                            </Link>
                                        ) : (
                                            <p className="text-sm text-zinc-700 line-clamp-2">{item.title}</p>
                                        )}
                                        <p className="text-xs text-zinc-400 mt-1.5">
                                            {item.count.toLocaleString("fa-IR")} عدد × {item.price.toLocaleString()} تومان
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-IranYekanMedium text-zinc-700 shrink-0">
                                        {(item.price * item.count).toLocaleString()}
                                        <TomanIcon className="w-3 h-3" />
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-2.5 px-5 sm:px-6 py-5 bg-gray-50/60 text-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span>جمع اقلام</span>
                            <span className="inline-flex items-center gap-1 text-zinc-700">
                                {itemsTotal.toLocaleString()}
                                <TomanIcon className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-500">
                            <span>هزینه ارسال</span>
                            <span className={order.shippingCost === 0 ? "text-primary-600 font-IranYekanMedium" : "text-zinc-700"}>
                                {order.shippingCost === 0 ? "رایگان" : `${order.shippingCost.toLocaleString()} تومان`}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-dashed border-gray-200">
                            <span className="font-IranYekanMedium text-zinc-700">مبلغ نهایی</span>
                            <span className="inline-flex items-center gap-1 font-IranYekanBold text-base sm:text-lg text-zinc-800">
                                {finalTotal.toLocaleString()}
                                <TomanIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}
