import CartClient from '@root/src/components/templates/Checkout/Cart/CartClient'
import { getShippingSettingsAction } from '@root/src/components/templates/P-admin/Settings/actions'

export const dynamic = 'force-dynamic'

export default async function CheckoutCartPage() {
    const shippingSettings = await getShippingSettingsAction()

    return <CartClient shippingSettings={shippingSettings} />
}
