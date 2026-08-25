import Layout from "@root/src/components/layouts/AdminPanelLayout";
import MenusManager from "@root/src/components/templates/P-admin/Categories/MenusManager";
import { connectDB } from "@root/src/lib/mongodb";
import CategoryModel from "@root/src/models/Category";
import { AdminCategory } from "@root/src/types/adminCategoryType";

export const dynamic = "force-dynamic";

const page = async () => {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({order: 1}).lean();
    const initialCategories: AdminCategory[] = JSON.parse(JSON.stringify(categories));

    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">دسته‌بندی‌ها و منوها</h1>
                        <p className="text-sm text-zinc-400 mt-1">مدیریت دسته‌های اصلی و زیرمجموعه‌هایی که در منوی سایت نمایش داده می‌شوند.</p>
                    </div>

                    <MenusManager initialCategories={initialCategories} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
