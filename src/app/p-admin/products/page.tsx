import Layout from "@root/src/components/layouts/AdminPanelLayout";
import AddProduct from "@root/src/components/templates/P-admin/Products/AddProduct";
import ProductsList from "@root/src/components/templates/P-admin/Products/ProductsList";
import { connectDB } from "@root/src/lib/mongodb";
import ProductModel from "@root/src/models/Product";
import { AdminProduct } from "@root/src/types/adminProductType";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const products = await ProductModel.find({}).sort({ _id: -1 }).lean();
    const initialProducts: AdminProduct[] = JSON.parse(JSON.stringify(products));
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">محصولات</h1>
                    <AddProduct />
                    <ProductsList initialProducts={initialProducts} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
