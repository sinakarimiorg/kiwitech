import Layout from "@root/src/components/layouts/AdminPanelLayout";
import BannersManager from "@root/src/components/templates/p-admin/Banners/BannersManager";

const page = () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <BannersManager />
            </main>
        </Layout>
    );
};

export default page;