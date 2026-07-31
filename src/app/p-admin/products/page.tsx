import Layout from "@root/src/components/layouts/AdminPanelLayout";
import AddProduct from "@root/src/components/templates/p-admin/Products/AddProduct";

const page = async () => {
return (
    <Layout>
        <main className="flex-1 min-w-0">
            <div className="p-5 sm:p-6 flex flex-col gap-6">
                <h1 className="text-xl font-semibold text-zinc-900">محصولات</h1>
                <AddProduct />
            </div>
        </main>
    </Layout>
);
}

export default page;
