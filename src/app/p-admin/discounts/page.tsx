import Layout from "@root/src/components/layouts/AdminPanelLayout";
import DiscountsManager from "@root/src/components/templates/P-admin/Discounts/DiscountsManager";
import { connectDB } from "@root/src/lib/mongodb";
import DiscountModel from "@root/src/models/Discount";
import { AdminDiscount } from "@root/src/types/adminDiscountType";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const discounts = await DiscountModel.find({}).sort({ _id: -1 }).lean();
    const initialDiscounts: AdminDiscount[] = JSON.parse(JSON.stringify(discounts));

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <DiscountsManager initialDiscounts ={initialDiscounts} />
            </main>
        </Layout>
    );
};

export default page;