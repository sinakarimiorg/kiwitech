import { redirect } from "next/navigation"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { connectDB } from "@root/src/lib/mongodb"
import AddressModel from "@models/Address"
import type { UserAddress } from "@root/src/types/userAddressType"
import { getShippingSettingsAction } from "@root/src/components/templates/P-admin/Settings/actions"
import ShippingClient from "@root/src/components/templates/Checkout/Shipping/ShippingClient"

export const dynamic = "force-dynamic"

export default async function CheckoutShippingPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login-register")

    await connectDB()

    const [addressesRaw, shippingSettings] = await Promise.all([
        AddressModel.find({ user: user._id }).sort({ isDefault: -1, _id: -1 }).lean(),
        getShippingSettingsAction(),
    ])

    const addresses: UserAddress[] = JSON.parse(JSON.stringify(addressesRaw))

    return <ShippingClient initialAddresses={addresses} shippingSettings={shippingSettings} />
}
