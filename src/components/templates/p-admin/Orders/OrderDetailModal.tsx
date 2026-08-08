"use client"

import { PiXBold, PiMapPinLight, PiUserCircleLight, PiCreditCardLight, PiPackageLight } from "react-icons/pi"
import TomanIcon from "@root/src/components/modules/Icons/TomanIcon"
import { getOrderTotal, statusStyle } from "./OrdersList"
import type { Order } from "./OrdersList"

type OrderDetailModalProps = {
    order: Order
    onClose: () => void
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.count, 0)

    return (
        <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">جزئیات سفارش</h2>
                        <p className="text-xs text-zinc-400 mt-0.5 tracking-wide">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <PiXBold className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 sm:p-6 flex flex-col gap-5">

                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className={`px-3 py-1.5 text-xs rounded-lg ${statusStyle[order.status]}`}>
                            {order.status}
                        </span>
                        <span className="text-xs text-zinc-400">{order.date} - {order.time}</span>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-2 text-xs text-zinc-400">
                                <PiUserCircleLight className="w-4 h-4" />
                                مشتری
                            </div>
                            <p className="text-sm font-IranYekanMedium text-zinc-800">{order.customer}</p>
                            <p className="text-xs text-zinc-500 mt-1 tracking-wide">{order.phone}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-2 text-xs text-zinc-400">
                                <PiMapPinLight className="w-4 h-4" />
                                آدرس تحویل
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-600 leading-6">{order.address}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-3 text-sm font-IranYekanBold text-zinc-800">
                            <PiPackageLight className="w-4 h-4 text-primary-500" />
                            اقلام سفارش
                        </div>
                        <div className="flex flex-col gap-3">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                    <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                        <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zinc-700 line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-zinc-400 mt-1">{item.count} عدد × {item.price.toLocaleString()} تومان</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-IranYekanMedium text-zinc-700 shrink-0">
                                        {(item.price * item.count).toLocaleString()}
                                        <TomanIcon className="w-3 h-3" />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-4 bg-gray-50 rounded-xl flex flex-col gap-2.5 text-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <PiCreditCardLight className="w-4 h-4" />
                                روش پرداخت
                            </span>
                            <span className="text-zinc-700">{order.paymentMethod}</span>
                        </div>
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
                            <span className="inline-flex items-center gap-1 font-IranYekanBold text-lg text-zinc-800">
                                {getOrderTotal(order).toLocaleString()}
                                <TomanIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
