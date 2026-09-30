import Layout from "@root/src/components/layouts/AdminPanelLayout"
import { getHomeSections } from "@root/src/lib/siteSettings"
import HomeSectionsManager from "@/components/templates/P-admin/Settings/HomeSectionsManager"

export const dynamic = 'force-dynamic'

const page = async () => {
    const sections = await getHomeSections()

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <HomeSectionsManager initialSections={sections} />
            </main>
        </Layout>
    )
}

export default page;