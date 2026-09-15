"use client"

import { useEffect, useState, useTransition } from 'react'
import { HiStar, HiOutlineStar } from "react-icons/hi2";
import { AiOutlineComment } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { TbUserSquareRounded } from "react-icons/tb";
import { addCommentAction } from './actions'
import Swal from 'sweetalert2';
import { PublicComment } from '@root/src/types/commentType';

import './CommentsSection.css'


type CommentsSectionProps = {
    productId: string
    linkName: string
    comments: PublicComment[]
    ratingAverage: number
    ratingCount: number
}

export default function CommentsSection({ productId, linkName, comments, ratingAverage, ratingCount }: CommentsSectionProps) {

    ////////// Handle NavBar visiblity
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true)

    const handleScroll = () => {
        const currentScrollPos = window.scrollY

        if (currentScrollPos > prevScrollPos) {
            setVisible(false)
        } else {
            setVisible(true)
        }

        setPrevScrollPos(currentScrollPos)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll)
    })

    ////////// Add-comment form state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [author, setAuthor] = useState('')
    const [text, setText] = useState('')
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isPending, startTransition] = useTransition()

    const resetForm = () => {
        setAuthor('')
        setText('')
        setRating(0)
        setHoverRating(0)
    }

    const handleSubmit = () => {
        if (!author.trim() || !text.trim()) {
            Swal.fire({ icon: 'error', title: 'خطا', text: 'لطفاً نام و متن نظر را وارد کنید' })
            return
        }
        if (rating < 1) {
            Swal.fire({ icon: 'error', title: 'خطا', text: 'لطفاً یک امتیاز انتخاب کنید' })
            return
        }

        const formData = new FormData()
        formData.append('author', author.trim())
        formData.append('text', text.trim())
        formData.append('rating', String(rating))

        startTransition(async () => {
            const res = await addCommentAction(productId, linkName, formData)
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'ثبت شد',
                    text: 'نظر شما ثبت شد و پس از تایید مدیر فروشگاه نمایش داده می‌شود',
                    timer: 2200,
                    showConfirmButton: false,
                })
                resetForm()
                setIsFormOpen(false)
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: res.error })
            }
        })

    }
    return (
        <div>
            <h1 className='product-info__title'>نظرات کاربران</h1>
            <div className='flex flex-col lg:flex-row gap-x-9 xl:gap-x-12 gap-y-10 mt-3 xl:mt-2'>
                {/* Right Col & Rating  */}
                <div className={`lg:sticky ${visible ? 'top-60' : 'top-44'} h-fit lg:w-72 shrink-0`}>
                    <div className='flex items-center gap-16 lg:gap-x-5 xl:gap-x-10'>
                        <div>
                            <div className='flex gap-1'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <HiStar key={i} className={`comment-section__star ${i < Math.round(ratingAverage) ? '' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className='block pt-3 text-sm lg:text-xs xl:text-sm text-zinc-500 '>از مجموع {ratingCount.toLocaleString('fa-IR')} نظر</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <h1 className='font-DanaDemiBold  text-4xl xl:text-[2.5rem]'>{ratingAverage.toFixed(1)}</h1>
                            <span className='text-sm xl:text-base text-zinc-500 /60'>از ۵</span>
                        </div>
                    </div>

                    <div className='mt-5 lg:mt-3 xl:mt-5 py-5 lg:py-3 xl:py-5 px-6 lg:px-4 xl:px-6 bg-white shadow-lg rounded-lg'>
                        {!isFormOpen ? (
                            <>
                                <div className='flex xl:items-center gap-1 xl:gap-2'>
                                    <AiOutlineComment className='w-5 xl:w-6 h-5 xl:h-6' />
                                    <p className='xl:font-DanaMedium text-sm lg:text-xs xl:text-sm tracking-tight'>نظر خود را در مورد این <span>محصول</span> بنویسید ...</p>
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className='flex-center gap-2 mt-3 py-3 lg:py-2 px-2 xl:px-4 w-full text-sm xl:text-base bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-text cursor-pointer rounded-lg transition-colors'>
                                    <span>افزودن نظر</span>
                                    <FaPlus className='w-3 xl:w-auto h-3 xl:h-auto' />
                                </button>
                            </>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-1 justify-center'>
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starValue = i + 1
                                        const filled = starValue <= (hoverRating || rating)
                                        return (
                                            <HiStar
                                                key={i}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(starValue)}
                                                className={`w-7 h-7 cursor-pointer transition-colors ${filled ? 'text-amber-500' : 'text-gray-300'}`}
                                            />
                                        )
                                    })}
                                </div>
                                <input
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                    type='text'
                                    placeholder='نام شما'
                                    className='w-full px-3 py-2 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors'
                                />
                                <textarea
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    rows={4}
                                    placeholder='نظر خود را بنویسید...'
                                    className='w-full px-3 py-2 text-sm border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors resize-none'
                                />
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        className='flex-1 flex-center py-2.5 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                                        {isPending ? 'در حال ثبت...' : 'ثبت نظر'}
                                    </button>
                                    <button
                                        onClick={() => { setIsFormOpen(false); resetForm() }}
                                        className='flex-1 flex-center py-2.5 text-sm text-zinc-500 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer'>
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Left Col & Comments  */}
                <div className='flex-1 min-w-0'>
                    {comments.length === 0 ? (
                        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center text-zinc-400'>
                            <AiOutlineComment className='w-10 h-10' />
                            <p>هنوز نظری برای این محصول ثبت نشده است. اولین نفری باش که نظر می‌دهد!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={comment._id}>
                                {/* Comment Header */}
                                <div>
                                    <div className='flex gap-x-1.5 xl:gap-x-2.5 mb-3.5 text-zinc-500'>
                                        <TbUserSquareRounded className='w-6 h-6' />
                                        <span className='font-DanaDemiBold xl:text-lg'>{comment.author}</span>
                                    </div>
                                    <div className='flex mb-2'>
                                        {Array.from({ length: comment.rating }).map((_, i) => (
                                            <HiStar key={i} className={`user-comment__star ${i < comment.rating ? '' : 'text-gray-300'}`} />
                                        ))}
                                        {Array.from({ length: 5 - comment.rating }).map((_, i) => (
                                            <HiOutlineStar key={i} className={`user-comment__star ${i < comment.rating ? '' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <div className='text-zinc-600 text-sm xl:text-base tracking-wider'>
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('fa-IR') : ''}
                                    </div>
                                </div>

                                {/* Comment Body */}
                                <div className='my-5 xl:my-7'>
                                    <p className='max-w-182.5 font-DanaMedium text-sm xl:text-base text-indigo-950 /85 leading-8 tracking-tight'>
                                        {comment.text}
                                    </p>
                                </div>

                                {index < comments.length - 1 && <div className='comments__divider-border'></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
