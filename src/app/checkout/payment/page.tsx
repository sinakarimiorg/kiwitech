import { redirect } from "next/navigation"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import AddressModel from "@models/Address"
import { getShippingSettingsAction } from "@root/src/components/templates/P-admin/Settings/actions"
import PaymentClient from "@root/src/components/templates/Checkout/Payment/PaymentClient"
import type { UserAddress } from "@root/src/types/userAddressType"

export const dynamic = "force-dynamic"

type PaymentPageProps = {
    searchParams: Promise<{ addressId?: string }>
}

export default async function CheckoutPaymentPage({ searchParams }: PaymentPageProps) {
    const user = await getCurrentUser()
    if (!user) redirect("/login-register")

    const { addressId } = await searchParams
    await connectDB()

    const [addressesRaw, shippingSettings] = await Promise.all([
        AddressModel.find({ user: user._id }).sort({ isDefault: -1, _id: -1 }).lean(),
        getShippingSettingsAction(),
    ])

    const addresses: UserAddress[] = JSON.parse(JSON.stringify(addressesRaw))

    if (addresses.length === 0) redirect("/checkout/shipping")

    const selectedAddress =
        addresses.find(a => a._id === addressId) ??
        addresses.find(a => a.isDefault) ??
        addresses[0]

    return <PaymentClient selectedAddress={selectedAddress} shippingSettings={shippingSettings} />
}
