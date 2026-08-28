import { AdminComment, CommentStatus } from "@root/src/types/adminCommentType";
import {
    PiUserCircleLight,
    PiCheckCircleLight,
    PiXCircleLight,
    PiTrashLight,
} from "react-icons/pi"
import { RiStarFill } from "react-icons/ri"


const statusStyle: Record<CommentStatus, string> = {
    "تایید شده": "bg-primary-50 text-primary-600",
    "در انتظار بررسی": "bg-amber-50 text-amber-600",
    "رد شده": "bg-danger/10 text-danger",
}

type CommentBoxProps = {
    comment: AdminComment
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onDelete: (id: string) => void

}

export default function CommentBox({ comment, onApprove, onReject, onDelete }: CommentBoxProps) {
    return (
        <div key={comment._id} className='flex flex-col sm:flex-row sm:items-start gap-4 px-5 sm:px-6 py-5'>

            {/* Author */}
            <div className='flex items-center gap-3 sm:w-48 shrink-0'>
                <span className='flex-center w-10 h-10 shrink-0 bg-primary-50 text-primary-500 rounded-full'>
                    <PiUserCircleLight className='w-6 h-6' />
                </span>
                <div>
                    <p className='font-IranYekanMedium text-sm text-zinc-700'>{comment.author}</p>
                    <p className='text-xs text-zinc-400'>{comment.createdAt}</p>
                </div>
            </div>

            {/* Body */}
            <div className='flex-1 min-w-0'>
                <p className='text-xs text-zinc-400 mb-1.5'>
                    نظر روی: <span className='text-zinc-600'>{comment.product?.name ?? 'محصول حذف شده'}</span>
                </p>
                <div className='flex gap-0.5 mb-2'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <RiStarFill key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? "text-amber-500" : "text-gray-200"}`} />
                    ))}
                </div>
                <p className='text-sm text-zinc-600 leading-7'>{comment.text}</p>
            </div>

            {/* Status & Actions */}
            <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:w-40 shrink-0'>
                <span className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg ${statusStyle[comment.status]}`}>
                    {comment.status}
                </span>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => onApprove(comment._id)}
                        className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'>
                        <PiCheckCircleLight className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => onReject(comment._id)}
                        className='flex-center w-8 h-8 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer'>
                        <PiXCircleLight className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => onDelete(comment._id)}
                        className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'>
                        <PiTrashLight className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}
