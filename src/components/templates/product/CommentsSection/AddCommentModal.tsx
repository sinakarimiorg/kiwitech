"use client"

import { useEffect, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { HiStar } from 'react-icons/hi2'
import { PiXBold, PiChatCircleTextLight, PiInfoLight, PiPaperPlaneRightLight } from 'react-icons/pi'
import Swal from 'sweetalert2'
import { addCommentAction } from './actions'

const MAX_TEXT = 500
const MIN_TEXT = 10

const ratingLabels = ['', 'خیلی بد', 'بد', 'معمولی', 'خوب', 'عالی']

type AddCommentModalProps = {
    productId: string
    linkName: string
    productName?: string
    onClose: () => void
}

type FieldErrors = {
    rating?: string
    author?: string
    text?: string
}

export default function AddCommentModal({ productId, linkName, productName, onClose }: AddCommentModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [author, setAuthor] = useState('')
    const [text, setText] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})
    const [serverError, setServerError] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isPending) onClose()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose, isPending])

    const validate = () => {
        const next: FieldErrors = {}
        if (rating < 1) next.rating = 'لطفاً امتیاز خود را انتخاب کنید'
        if (author.trim().length < 2) next.author = 'نام خود را وارد کنید'
        if (text.trim().length < MIN_TEXT) next.text = `متن نظر باید حداقل ${MIN_TEXT.toLocaleString('fa-IR')} کاراکتر باشد`
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = () => {
        setServerError('')
        if (!validate()) return

        const formData = new FormData()
        formData.append('author', author.trim())
        formData.append('text', text.trim())
        formData.append('rating', String(rating))

        startTransition(async () => {
            const res = await addCommentAction(productId, linkName, formData)

            if (res.success) {
                onClose()
                Swal.fire({
                    icon: 'success',
                    title: 'نظر شما ثبت شد',
                    text: 'پس از تایید مدیر فروشگاه نمایش داده می‌شود',
                    timer: 2200,
                    showConfirmButton: false,
                })
            } else {
                setServerError(res.error)
            }
        })
    }

    const activeRating = hoverRating || rating

    const inputClasses = (hasError?: string) =>
        `w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-colors
        ${hasError ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`

    return createPortal(
        <div
            className='fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:px-4'
            onMouseDown={event => {
                if (event.target === event.currentTarget && !isPending) onClose()
            }}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='add-comment-title'
                className='w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl'
            >
                {/* Header */}
                <div className='sticky top-0 z-10 flex items-center justify-between gap-3 px-5 sm:px-7 py-4 bg-white border-b border-gray-100'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <span className='flex-center w-11 h-11 shrink-0 text-primary-600 bg-primary-50 rounded-xl'>
                            <PiChatCircleTextLight className='w-6 h-6' />
                        </span>
                        <div className='min-w-0'>
                            <h2 id='add-comment-title' className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                                ثبت نظر شما
                            </h2>
                            {productName &&
                                <p className='mt-0.5 text-xs text-zinc-400 line-clamp-1'>درباره‌ی {productName}</p>
                            }
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isPending}
                        aria-label='بستن'
                        className='flex-center w-9 h-9 shrink-0 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
                    >
                        <PiXBold className='w-4 h-4' />
                    </button>
                </div>

                {/* Body */}
                <div className='flex flex-col gap-5 px-5 sm:px-7 py-6'>

                    {/* Score */}
                    <div className={`flex flex-col items-center gap-2 py-5 rounded-2xl ${errors.rating ? 'bg-red-50/60' : 'bg-primary-50/60'}`}>
                        <div className='flex items-center gap-1' onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(value => (
                                <button
                                    key={value}
                                    type='button'
                                    aria-label={`${value.toLocaleString('fa-IR')} ستاره`}
                                    onMouseEnter={() => setHoverRating(value)}
                                    onClick={() => {
                                        setRating(value)
                                        setErrors(prev => ({ ...prev, rating: undefined }))
                                    }}
                                    className='p-0.5 cursor-pointer transition-transform hover:scale-110'
                                >
                                    <HiStar className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${value <= activeRating ? 'text-amber-500' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                        <p className={`h-5 text-sm ${activeRating ? 'font-IranYekanBold text-zinc-700' : 'text-zinc-400'}`}>
                            {ratingLabels[activeRating] || 'امتیاز شما به این کالا'}
                        </p>
                        {errors.rating && <p className='text-xs text-danger'>{errors.rating}</p>}
                    </div>

                    <div>
                        <label htmlFor='comment-author' className='block mb-1.5 text-xs text-zinc-500'>نام شما</label>
                        <input
                            id='comment-author'
                            value={author}
                            onChange={event => {
                                setAuthor(event.target.value)
                                setErrors(prev => ({ ...prev, author: undefined }))
                            }}
                            type='text'
                            maxLength={50}
                            autoFocus
                            placeholder='مثال: سینا کریمی'
                            className={inputClasses(errors.author)}
                        />
                        {errors.author && <p className='mt-1.5 text-xs text-danger'>{errors.author}</p>}
                    </div>

                    <div>
                        <label htmlFor='comment-text' className='block mb-1.5 text-xs text-zinc-500'>متن نظر</label>
                        <textarea
                            id='comment-text'
                            value={text}
                            onChange={event => {
                                setText(event.target.value)
                                setErrors(prev => ({ ...prev, text: undefined }))
                            }}
                            rows={6}
                            maxLength={MAX_TEXT}
                            placeholder='تجربه‌ی خودتان از استفاده از این محصول را بنویسید: کیفیت، بسته‌بندی، ارزش خرید و ...'
                            className={`${inputClasses(errors.text)} resize-none leading-7`}
                        />
                        <div className='flex items-center justify-between mt-1.5'>
                            <span className='text-xs text-danger'>{errors.text}</span>
                            <span className='text-xs text-zinc-400'>
                                {text.length.toLocaleString('fa-IR')} / {MAX_TEXT.toLocaleString('fa-IR')}
                            </span>
                        </div>
                    </div>

                    <div className='flex items-start gap-2 p-3 text-xs leading-6 text-amber-700 bg-amber-50/70 rounded-xl'>
                        <PiInfoLight className='w-4 h-4 mt-1 shrink-0' />
                        نظر شما پس از بررسی و تایید مدیر فروشگاه در صفحه‌ی محصول نمایش داده می‌شود.
                    </div>

                    {serverError && <p className='text-sm text-danger'>{serverError}</p>}
                </div>

                {/* Footer */}
                <div className='flex items-center gap-3 px-5 sm:px-7 pt-5 pb-6 border-t border-gray-100'>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={isPending}
                        className='flex-1 flex-center gap-2 h-12 text-sm sm:text-base text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        <PiPaperPlaneRightLight className='w-5 h-5' />
                        {isPending ? 'در حال ثبت...' : 'ثبت نظر'}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isPending}
                        className='flex-1 flex-center h-12 text-sm sm:text-base text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer disabled:opacity-60'
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )

}