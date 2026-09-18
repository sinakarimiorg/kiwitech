"use client"

import { useTransition } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { submitContactMessageAction } from './actions'

interface FormValues {
    name: string
    phone: string
    email: string
    subject: string
    message: string
}

const initialValues: FormValues = { name: '', phone: '', email: '', subject: '', message: '' }

const validationSchema = Yup.object({
    name: Yup.string().required('نام و نام خانوادگی الزامی است'),
    phone: Yup.string().matches(/^0?9\d{9}$/, 'شماره موبایل معتبر نیست').required('شماره موبایل الزامی است'),
    email: Yup.string().email('ایمیل معتبر نیست'),
    subject: Yup.string().required('موضوع پیام الزامی است'),
    message: Yup.string().min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد').required('متن پیام الزامی است'),
})

export default function ContactForm() {
    const [isPending, startTransition] = useTransition()

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                const formData = new FormData()
                Object.entries(values).forEach(([key, val]) => formData.append(key, val))

                startTransition(async () => {
                    const res = await submitContactMessageAction(formData)
                    if (res.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'پیام شما ارسال شد',
                            text: 'همکاران ما در سریع‌ترین زمان ممکن با شما تماس خواهند گرفت.',
                            confirmButtonText: 'متوجه شدم',
                        })
                        resetForm()
                    } else {
                        Swal.fire({ icon: 'error', title: 'خطا', text: res.error })
                    }
                    setSubmitting(false)
                })
            }}
        >
            {({ isSubmitting, errors, submitCount }) => {
                const submitting = isSubmitting || isPending
                const showErr = (field: keyof FormValues) => submitCount > 0 && Boolean((errors as Record<string, string>)[field])

                return (
                    <Form className='flex flex-col gap-4'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <Field
                                    name='name'
                                    placeholder='نام و نام خانوادگی *'
                                    className={`w-full px-4 py-3 text-sm border rounded-xl outline-none transition-colors ${showErr('name') ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`}
                                />
                                <ErrorMessage name='name'>{msg => <span className='block mt-1.5 text-xs text-red-500'>{msg}</span>}</ErrorMessage>
                            </div>
                            <div>
                                <Field
                                    name='phone'
                                    placeholder='شماره موبایل *'
                                    dir='ltr'
                                    className={`w-full px-4 py-3 text-sm text-right border rounded-xl outline-none transition-colors ${showErr('phone') ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`}
                                />
                                <ErrorMessage name='phone'>{msg => <span className='block mt-1.5 text-xs text-red-500'>{msg}</span>}</ErrorMessage>
                            </div>
                        </div>

                        <div>
                            <Field
                                name='email'
                                type='email'
                                placeholder='ایمیل (اختیاری)'
                                dir='ltr'
                                className={`w-full px-4 py-3 text-sm text-right border rounded-xl outline-none transition-colors ${showErr('email') ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`}
                            />
                            <ErrorMessage name='email'>{msg => <span className='block mt-1.5 text-xs text-red-500'>{msg}</span>}</ErrorMessage>
                        </div>

                        <div>
                            <Field
                                name='subject'
                                placeholder='موضوع پیام *'
                                className={`w-full px-4 py-3 text-sm border rounded-xl outline-none transition-colors ${showErr('subject') ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`}
                            />
                            <ErrorMessage name='subject'>{msg => <span className='block mt-1.5 text-xs text-red-500'>{msg}</span>}</ErrorMessage>
                        </div>

                        <div>
                            <Field
                                as='textarea'
                                name='message'
                                rows={5}
                                placeholder='متن پیام شما *'
                                className={`w-full px-4 py-3 text-sm border rounded-xl outline-none transition-colors resize-none ${showErr('message') ? 'border-red-400' : 'border-gray-200 focus:border-primary-400'}`}
                            />
                            <ErrorMessage name='message'>{msg => <span className='block mt-1.5 text-xs text-red-500'>{msg}</span>}</ErrorMessage>
                        </div>

                        <button
                            type='submit'
                            disabled={submitting}
                            className='flex-center h-12 mt-2 text-base text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'>
                            {submitting ? 'در حال ارسال...' : 'ارسال پیام'}
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}
