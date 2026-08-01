import Layout from "@root/src/components/layouts/AdminPanelLayout";
import AddArticle from "@root/src/components/templates/p-admin/Articles/AddArticle";
import ArticlesList from "@root/src/components/templates/p-admin/Articles/ArticlesList";

const page = async () => {
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">مقالات (موبولند مگ)</h1>
                    <AddArticle />
                    <ArticlesList />
                </div>
            </main>
        </Layout>
    );
}

export default page;
