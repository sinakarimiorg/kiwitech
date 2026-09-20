"use client"

import { useState, useTransition } from "react"
import {
    PiMagnifyingGlassLight,
    PiChatCircleTextLight,
} from "react-icons/pi"
import Swal from "sweetalert2"
import { AdminComment, CommentStatus } from "@root/src/types/adminCommentType";
import { approveCommentAction, rejectCommentAction, deleteCommentAction } from "./actions"
import CommentBox from "./CommentBox"


const filters: ("همه" | CommentStatus)[] = ["همه", "در انتظار بررسی", "تایید شده", "رد شده"]

type CommentsListProps = {
    initialComments: AdminComment[];
}

export default function CommentsList({ initialComments }: CommentsListProps) {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState<"همه" | CommentStatus>("همه")
    const [isPending, startTransition] = useTransition()

    const handleApprove = (id: string) => {
        startTransition(async () => {
            const res = await approveCommentAction(id)
            if (!res.success) Swal.fire({ icon: "error", title: "خطا", text: res.error })
        })
    }

    const handleReject = (id: string) => {
        startTransition(async () => {
            const res = await rejectCommentAction(id)
            if (!res.success) Swal.fire({ icon: "error", title: "خطا", text: res.error })
        })
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "حذف نظر",
            text: "آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله، حذف شود",
            cancelButtonText: "انصراف",
            confirmButtonColor: "#EF4444",
        })
        if (!result.isConfirmed) return

        startTransition(async () => {
            const res = await deleteCommentAction(id)
            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: "حذف شد",
                    text: "نظر با موفقیت حذف شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: res.error || "مشکلی در حذف نظر پیش آمد" })
            }
        })
    }

    const filtered = initialComments.filter(c => {
        const matchesSearch = c.author.includes(search) || (c.product?.name ?? "")
        const matchesFilter = activeFilter === "همه" || c.status === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='flex flex-col gap-3 px-4 sm:px-6 py-4 border-b border-gray-100'>
                <h2 className='flex items-center gap-2 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                    <PiChatCircleTextLight className='w-5 h-5 text-primary-500' />
                    نظرات کاربران
                    <span className='text-xs font-IranYekan text-zinc-400'>({filtered.length})</span>
                </h2>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    {/* Status Filter */}
                    <div className='flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl text-xs overflow-x-auto scrollbar-none'>
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-1.5 md:px-3 py-0.75 md:py-1.5 whitespace-nowrap rounded-md md:rounded-lg transition-colors cursor-pointer text-[10px] md:text-xs
                                    ${activeFilter === f
                                        ? "bg-primary-500 text-white font-IranYekanMedium"
                                        : "text-zinc-500 hover:text-zinc-700"}`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className='flex items-center gap-2 px-3.5 py-2 w-full sm:w-56 bg-gray-50 border border-gray-200 rounded-xl text-sm text-zinc-400 focus-within:border-primary-400 transition-colors'>
                        <PiMagnifyingGlassLight className='w-4 h-4 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type='text'
                            placeholder='نام کاربر یا محصول...'
                            className='w-full bg-transparent outline-none placeholder:text-zinc-400'
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className='divide-y divide-gray-50'>
                {filtered.map(comment => (
                    <CommentBox
                        key={comment._id}
                        comment={comment}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete} />
                ))}

                {filtered.length === 0 &&
                    <div className='py-10 text-center text-zinc-400'>نظری یافت نشد.</div>
                }
            </div>
        </div>
    )
}
