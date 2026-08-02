import Layout from "@root/src/components/layouts/AdminPanelLayout";
import DiscountsManager from "@root/src/components/templates/P-admin/Discounts/DiscountsManager";

const page = () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <DiscountsManager />
            </main>
        </Layout>
    );
};

export default page;