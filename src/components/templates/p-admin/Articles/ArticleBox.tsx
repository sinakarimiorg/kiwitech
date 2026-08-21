import { PiPencilSimpleLight, PiTrashLight, PiEyeLight } from 'react-icons/pi'
import { AdminArticle } from "@root/src/types/adminArticleType"

type ArticleBoxProps = {
    article: AdminArticle
    onEdit: (article: AdminArticle) => void
    onDelete: (id: string) => void
}

const statusStyle: Record<AdminArticle["status"], string> = {
    "منتشر شده": "bg-primary-50 text-primary-600",
    "پیش‌نویس": "bg-amber-50 text-amber-600",
}

export default function ArticleBox({ article, onEdit, onDelete }: ArticleBoxProps) {
    return (
        <tr className='hover:bg-primary-50/30 transition-colors'>
            <td className='px-5 sm:px-6 py-3.5'>
                <div className='flex items-center gap-3'>
                    <div className='w-14 h-11 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                        <img src={article.img} className='w-full h-full object-cover' alt={article.title} />
                    </div>
                    <div className='min-w-0'>
                        <p className='text-zinc-700 line-clamp-1 max-w-64'>{article.title}</p>
                        <p className='text-xs text-zinc-400 tracking-tight' dir='ltr'>/{article.linkName}</p>
                    </div>
                </div>
            </td>
            <td className='px-3 py-3.5 text-zinc-500'>{article.category}</td>
            <td className='px-3 py-3.5 text-zinc-400'>
                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('fa-IR') : '—'}
            </td>
            <td className='px-3 py-3.5'>
                <span className='inline-flex items-center gap-1 text-zinc-600'>
                    <PiEyeLight className='w-3.5 h-3.5' />
                    {(article.views ?? 0).toLocaleString()}
                </span>
            </td>
            <td className='px-3 py-3.5'>
                <span className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${statusStyle[article.status]}`}>
                    {article.status}
                </span>
            </td>
            <td className='px-3 py-3.5'>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => onEdit(article)}
                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                        <PiPencilSimpleLight className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => onDelete(article._id)}
                        className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                        <PiTrashLight className='w-4 h-4' />
                    </button>
                </div>
            </td>
        </tr>
    )
}
