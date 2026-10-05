"use client"

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from "sweetalert2"
import Header from '@root/src/components/modules/Header/Header'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import CheckoutSteps from '@root/src/components/templates/Checkout/CheckoutSteps/CheckoutSteps'
import AsideBox from '@root/src/components/templates/P-user/AsideBox/AsideBox'
import { useAppSelector } from '@root/src/store/hooks'
import type { UserAddress } from "@root/src/types/userAddressType"
import type { ShippingSettings } from "@root/src/types/siteSettingsType"
import { addAddressAction } from '../../P-user/Addresses/actions'
import AddressModal from '../../P-user/Addresses/AddressModal'

import { HiMiniChevronLeft } from 'react-icons/hi2'
import { PiMapPinLight, PiPlusCircleLight, PiCheckCircleFill } from 'react-icons/pi'

type ShippingClientProps = {
    initialAddresses: UserAddress[]
    shippingSettings: ShippingSettings
}

export default function ShippingClient({ initialAddresses, shippingSettings }: ShippingClientProps) {
    const router = useRouter()
    const cart = useAppSelector(state => state.cart.items)

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        initialAddresses.find(a => a.isDefault)?._id ?? initialAddresses[0]?._id ?? null
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const totalCount = cart.reduce((sum, item) => sum + item.count, 0)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.count, 0)
    const originalTotal = cart.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)
    const totalDiscount = originalTotal - subtotal
    const shippingCost = subtotal > 0 && subtotal < 1000000 ? 45000 : 0
    const payable = subtotal + shippingCost

    const saveNewAddress = (data: Omit<UserAddress, "_id" | "isDefault">) => {
        startTransition(async () => {
            const res = await addAddressAction(data)
            if (res.success) {
                setIsModalOpen(false)
                router.refresh()
                Swal.fire({ icon: "success", title: "موفقیت‌آمیز", text: "آدرس با موفقیت افزوده شد", timer: 1500, showConfirmButton: false })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error })
            }
        })
    }

    const continueHref = selectedAddressId ? `payment?addressId=${selectedAddressId}` : "shipping"

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'سبد خرید', to: '/checkout/cart' },
                    { id: 3, title: 'اطلاعات ارسال', to: '/checkout/shipping' },
                ]}
            />

            <div className='container pb-16'>
                <CheckoutSteps current='shipping' />

                <div className='flex flex-col lg:flex-row gap-6 xl:gap-10'>

                    <div className='flex-1 min-w-0 bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                        <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800 pb-4 mb-4 border-b border-gray-100'>
                            <PiMapPinLight className='w-5 h-5 text-primary-500' />
                            آدرس تحویل سفارش
                        </h2>
                        {initialAddresses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                                <span className="flex-center w-16 h-16 bg-primary-50 text-primary-400 rounded-full">
                                    <PiMapPinLight className="w-8 h-8" />
                                </span>
                                <div>
                                    <h3 className="font-IranYekanBold text-zinc-700">هنوز آدرسی ثبت نکرده‌اید</h3>
                                    <p className="mt-1.5 text-sm text-zinc-400">برای ادامه سفارش، یک آدرس اضافه کنید.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {initialAddresses.map(addr => {
                                    const isActive = selectedAddressId === addr._id
                                    return (
                                        <button
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`relative flex flex-col items-start gap-1.5 w-full text-right p-4 rounded-xl border transition-colors cursor-pointer
                                                ${isActive ? "border-primary-500 bg-primary-50/60" : "border-gray-200 hover:border-primary-300"}`}>
                                            <span className="flex items-center gap-2 font-IranYekanMedium text-sm text-zinc-800">
                                                {addr.title}
                                                <span className="text-xs text-zinc-400 font-IranYekan">({addr.receiver} - {addr.phone})</span>
                                            </span>
                                            {(addr.province || addr.city) &&
                                                <span className="text-xs text-primary-600">{addr.province}{addr.province && addr.city ? "، " : ""}{addr.city}</span>
                                            }
                                            <span className="text-xs sm:text-sm text-zinc-500 leading-6">{addr.fullAddress}</span>

                                            {isActive && <PiCheckCircleFill className="absolute top-4 left-4 w-5 h-5 text-primary-500" />}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-center gap-2 w-full mt-3 py-3.5 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 hover:border-primary-400 rounded-xl transition-colors cursor-pointer">
                            <PiPlusCircleLight className="w-5 h-5" />
                            افزودن آدرس جدید
                        </button>

                        <Link href='/checkout/cart' className='inline-flex items-center gap-1.5 mt-6 text-sm text-zinc-500 hover:text-primary-600 transition-colors'>
                            <HiMiniChevronLeft className='w-4 h-4 rotate-180' />
                            بازگشت به سبد خرید
                        </Link>
                    </div>

                    <AsideBox
                        totalCount={totalCount}
                        originalTotal={originalTotal}
                        totalDiscount={totalDiscount}
                        shippingCost={shippingCost}
                        payable={payable}
                        href={continueHref}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddressModal
                    initialData={null}
                    onClose={() => setIsModalOpen(false)}
                    onSave={saveNewAddress}
                    isSaving={isPending}
                />
            )}

            <Footer marginClasses={'mt-20'} />
        </div>
    )
}
