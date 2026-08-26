import Layout from "@root/src/components/layouts/AdminPanelLayout";
import BannersManager from "@root/src/components/templates/P-admin/Banners/BannersManager";
import { connectDB } from "@root/src/lib/mongodb";
import BannerModel from "@root/src/models/Banner";
import { AdminBanner } from "@root/src/types/adminBannerType";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const banners = await BannerModel.find({}).sort({ position: 1, order: 1 }).lean();
    const initialBanners: AdminBanner[] = JSON.parse(JSON.stringify(banners));

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <BannersManager initialBanners={initialBanners} />
            </main>
        </Layout>
    );
};

export default page;
