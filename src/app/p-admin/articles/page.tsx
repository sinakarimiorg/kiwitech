import Layout from "@root/src/components/layouts/AdminPanelLayout";
import AddArticle from "@root/src/components/templates/P-admin/Articles/AddArticle";
import ArticlesList from "@root/src/components/templates/P-admin/Articles/ArticlesList";
import { connectDB } from "@root/src/lib/mongodb";
import ArticleModel from "@root/src/models/Article";
import { AdminArticle } from "@root/src/types/adminArticleType";

export const dynamic = "force-dynamic"

const page = async () => {
    await connectDB()
    const articles = await ArticleModel.find({}).sort({_id: -1}).lean();
    const initialArticles: AdminArticle[] = JSON.parse(JSON.stringify(articles));
    return (
        <Layout>
            <main className="flex-1 min-w-0">
                <div className="p-5 sm:p-6 flex flex-col gap-6">
                    <h1 className="text-xl font-semibold text-zinc-900">مقالات (کیوی‌تک مگ)</h1>
                    <AddArticle />
                    <ArticlesList initialArticles={initialArticles} />
                </div>
            </main>
        </Layout>
    );
}

export default page;
