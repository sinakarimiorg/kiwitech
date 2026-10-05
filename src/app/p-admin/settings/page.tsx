import Layout from "@root/src/components/layouts/AdminPanelLayout"
import { getHomeSections } from "@root/src/lib/siteSettings"
import HomeSectionsManager from "@/components/templates/P-admin/Settings/HomeSectionsManager"
import ShippingSettingsForm from "@root/src/components/templates/P-admin/Settings/ShippingSettingsForm"
import { getShippingSettingsAction } from "@root/src/components/templates/P-admin/Settings/actions"

export const dynamic = 'force-dynamic'

const page = async () => {
    const shippingSettings = await getShippingSettingsAction()
    const sections = await getHomeSections()

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-4 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold text-zinc-900">تنظیمات فروشگاه</h1>
                        <p className="text-sm text-zinc-400 mt-1">تنظیمات مربوط به هزینه و شرایط ارسال سفارش‌ها در صفحه پرداخت</p>
                    </div>

                    <ShippingSettingsForm initialSettings={shippingSettings} />
                </div>
                <HomeSectionsManager initialSections={sections} />
            </main>
        </Layout>
    )
}

export default page;