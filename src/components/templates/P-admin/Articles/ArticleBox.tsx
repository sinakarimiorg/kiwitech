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
        <>
            {/* md+ */}
            <tr className='hidden md:table-row hover:bg-primary-50/30 transition-colors'>
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

            {/* below md  */}
            <tr className='md:hidden'>
                <td colSpan={6} className='p-0'>
                    <div className='flex gap-3 px-4 py-4 border-b border-gray-50'>
                        <div className='w-16 h-14 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                            <img src={article.img} className='w-full h-full object-cover' alt={article.title} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm text-zinc-700 line-clamp-1'>{article.title}</p>
                            <p className='text-xs text-zinc-400 tracking-tight' dir='ltr'>/{article.linkName}</p>

                            <div className='flex items-center justify-between mt-2'>
                                <span className='text-xs text-zinc-400'>{article.category}</span>
                                <span className={`px-2 py-0.5 text-[11px] rounded-lg shrink-0 ${statusStyle[article.status]}`}>
                                    {article.status}
                                </span>
                            </div>

                            <div className='flex items-center justify-between mt-1.5'>
                                <span className='inline-flex items-center gap-1 text-xs text-zinc-400'>
                                    <PiEyeLight className='w-3.5 h-3.5' />
                                    {(article.views ?? 0).toLocaleString()}
                                </span>
                                <span className='text-xs text-zinc-400'>
                                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('fa-IR') : '—'}
                                </span>
                            </div>

                            <div className='flex items-center gap-2 mt-3'>
                                <button
                                    onClick={() => onEdit(article)}
                                    className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-primary-600 bg-primary-50 rounded-lg cursor-pointer'>
                                    <PiPencilSimpleLight className='w-3.5 h-3.5' />
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => onDelete(article._id)}
                                    className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-danger bg-danger/10 rounded-lg cursor-pointer'>
                                    <PiTrashLight className='w-3.5 h-3.5' />
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}
