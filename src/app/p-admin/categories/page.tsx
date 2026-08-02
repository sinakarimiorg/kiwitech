import Layout from "@root/src/components/layouts/AdminPanelLayout";
import MenusManager from "@root/src/components/templates/P-admin/Categories/MenusManager";

const page = async () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">دسته‌بندی‌ها و منوها</h1>
                        <p className="text-sm text-zinc-400 mt-1">مدیریت دسته‌های اصلی و زیرمجموعه‌هایی که در منوی سایت نمایش داده می‌شوند.</p>
                    </div>

                    <MenusManager />
                </div>
            </main>
        </Layout>
    );
}

export default page;
