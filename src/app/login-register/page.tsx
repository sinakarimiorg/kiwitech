"use client"

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoMdRefresh } from "react-icons/io";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { requestOtpAction, verifyOtpAction, completeProfileAction } from "@root/src/components/templates/Auth/action";


const RESEND_SECONDS = 119

const login_register = () => {

    const [isCodeStep, setIsCodeStep] = useState(false)
    const [isProfileStep, setIsProfileStep] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const startResendTimer = () => {
        setSecondsLeft(RESEND_SECONDS)
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60)
        const s = totalSeconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const sendOtp = (phoneValue: string) => {
        startTransition(async () => {
            const result = await requestOtpAction(phoneValue)
            if (result.success) {
                setPhone(phoneValue)
                setIsCodeStep(true)
                startResendTimer()
                if (result.devCode) {
                    console.log("Otp code:", result.devCode)
                    showSwal(`کد تایید : ${result.devCode}`, "info", "متوجه شدم")
                }
            } else {
                showSwal(result.error, "error", "تلاش مجدد")
            }

        })
    }

    const verifyCode = async (values: { phone: string; code: string; }) => {
        startTransition(async () => {
            const result = await verifyOtpAction(phone, values.code)
            console.log("verifyCode result:", result)
            if (result.success) {
                if (result.isNewUser) {
                    setIsProfileStep(true)
                    return
                }
                await showSwal(
                    result.isNewUser ? "ثبت نام شما با موفقیت انجام شد" : "خوش آمدید",
                    "success",
                    "ورود به فروشگاه"
                )
                router.replace("/")
                router.refresh()
            } else {
                showSwal(result.error, "error", "تلاش مجدد")
            }
        })
    }

    const completeProfile = (values: { fullName: string; email: string }) => {
        startTransition(async () => {
            const result = await completeProfileAction(values.fullName, values.email)
            if (result.success) {
                await showSwal("ثبت نام شما با موفقیت انجام شد", "success", "ورود به فروشگاه")
                router.replace("/")
                router.refresh()
            } else {
                showSwal(result.error, "error", "تلاش مجدد")
            }
        })
    }

    const resendCode = () => {
        if (secondsLeft > 0) return
        sendOtp(phone)
    }

    return (
        <div className='h-screen overflow-hidden w-full bg-cover flex'>

            <div className="flex flex-col w-1/4 justify-between py-4 h-screen bg-white" data-aos="fade-right overflow-hiedden">
                {
                    !isCodeStep ?
                        <div className="flex flex-col px-13 text-center text-surface">
                            <Link href={"/"} className="mx-auto">
                                <Image
                                    src={"/images/logo/logo.png"}
                                    alt="logo"
                                    width={300}
                                    height={300}
                                />
                            </Link>
                            <p className="mt-4 flex items-center justify-center gap-3 xs:gap-4.5 text-surface-3">
                                <span className="text-base font-semibold leading-5 xs:text-xl xs:leading-6">ورود</span>
                                <span className="h-4.5 w-0 border-l border-gray-700 xs:h-5 xs:border-l-[1.5px]"></span>
                                <span className="text-base font-semibold leading-5 xs:text-xl xs:leading-6">ثبت نام</span>
                            </p>
                            <h3 className="my-12 font-medium tracking-wider">خوش اومدی :)
                            </h3>
                            <Formik
                                initialValues={{ phone: "", code: "" }}
                                onSubmit={(values) => {
                                    sendOtp(values.phone)
                                }}
                                validateOnBlur={false}
                                validate={(values) => {
                                    const errors: { phone?: string } = {}

                                    if (values.phone === '') {
                                        errors.phone = "شماره موبایل را وارد کنید.";
                                    } else if (!/^0?9\d{9}$/.test(values.phone)) {
                                        errors.phone = 'شماره وارد شده معتبر نمی‌باشد!'
                                    }
                                    return errors;
                                }}
                            >
                                {({ errors, submitCount }) => (
                                    <Form>
                                        <div className="relative">
                                            <Field
                                                name='phone'
                                                type="text"
                                                placeholder=" "
                                                className={`peer w-full p-3 border-2  rounded-md outline-none 
                                                    ${submitCount > 0 && errors.phone
                                                        ?
                                                        'border-red-500'
                                                        :
                                                        'border-gray-300 focus:border-primary-500'}`}
                                            />
                                            <label
                                                className="absolute right-3 top-[30%] bg-white px-1 text-gray-500 text-sm transition-all duration-1000 pointer-events-none
                               peer-focus:-top-2
                                peer-focus:text-xs
                              peer-focus:text-primary-500
                                peer-not-placeholder-shown:-top-2
                                peer-not-placeholder-shown:text-xs">
                                                شماره موبایل خود را وارد کنید
                                            </label>
                                        </div>
                                        <ErrorMessage name='phone'>{(msg) => <span className='block w-full mt-2 mr-4 text-xs text-right text-red-500'>{msg}</span>}</ErrorMessage>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full p-3 mt-4 linear_btn text-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isPending ? "در حال ارسال..." : "ادامه"}
                                        </button>
                                    </Form>
                                )}

                            </Formik>
                        </div>
                        : !isProfileStep ?
                            <div className="flex flex-col bg-white px-13 text-center text-surface">
                                <Link href={"/"} className="mx-auto">
                                    <Image
                                        src={"/images/logo/logo.png"}
                                        alt="logo"
                                        width={300}
                                        height={300}
                                    />
                                </Link>
                                <h3 className="mb-16 mt-4 text-xl font-extrabold font-IranYekanBold">کــد تــایـیـد:</h3>

                                <Formik
                                    initialValues={{ phone, code: "" }}
                                    onSubmit={(values) => {
                                        verifyCode(values)
                                    }}
                                    validateOnBlur={false}
                                    validate={(values) => {
                                        const errors: { code?: string } = {}

                                        if (values.code === '') {
                                            errors.code = "کد را وارد کنید";
                                        }
                                        return errors;
                                    }}
                                >
                                    {({ errors, submitCount }) => (
                                        <Form>
                                            <div>
                                                <div className="flex gap-2 items-center mb-2">
                                                    <span className="text-text-muted text-xs opacity-75 text-nowrap">
                                                        لطفاً کد تأیید ارسال شده را به شماره
                                                    </span>
                                                    <span className="font-bold text-sm text-surface-3 tracking-widest">{phone} </span>
                                                    <span className="text-text-muted text-xs opacity-75 text-nowrap">
                                                        را وارد کنید
                                                    </span>
                                                </div>
                                                <Field
                                                    name='code'
                                                    type="text"
                                                    placeholder=" "
                                                    className={`peer w-full p-3 border-2  rounded-md outline-none 
                                                    ${submitCount > 0 && errors.code
                                                            ?
                                                            'border-red-500'
                                                            :
                                                            'border-gray-300 focus:border-primary-500'}`}
                                                />

                                            </div>
                                            <ErrorMessage name='code'>{(msg) => <span className='block w-full mt-2 mr-4 text-xs text-right text-red-500'>{msg}</span>}</ErrorMessage>
                                            {
                                                secondsLeft > 0 ?
                                                    <div className="mt-3 mb-18 pl-2 text-end font-semibold">
                                                        <span>
                                                            {formatTime(secondsLeft)}
                                                        </span>
                                                    </div>
                                                    :
                                                    <div
                                                        onClick={resendCode}
                                                        className="mt-3 mb-18 pl-2 flex items-center justify-end gap-1 font-semibold text-primary-700 text-xs cursor-pointer">
                                                        <p>دریافت مجدد کد</p>
                                                        <IoMdRefresh className="size-4 text-primary-500" />
                                                    </div>
                                            }


                                            <div className="flex items-center justify-center gap-2 mb-4 text-primary-700 cursor-pointer" onClick={() => setIsCodeStep(false)}>
                                                <span>ویرایش شماره</span>
                                                <IoIosArrowBack className="size-3.5 text-primary-500" />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className="w-full p-3 mt-4 linear_btn text-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isPending ? "در حال بررسی..." : "ثبت کد تایید"}
                                            </button>
                                        </Form>
                                    )}

                                </Formik>

                            </div>
                            :
                            <div className="flex flex-col bg-white px-13 text-center text-surface">
                                <Link href={"/"} className="mx-auto">
                                    <Image
                                        src={"/images/logo/logo.png"}
                                        alt="logo"
                                        width={300}
                                        height={300}
                                    />
                                </Link>
                                <h3 className="mb-3 mt-4 text-xl font-extrabold font-IranYekanBold">تکمیل اطلاعات حساب</h3>
                                <p className="mb-10 text-xs text-text-muted leading-6">
                                    خوش اومدی! برای تکمیل ثبت‌نام، لطفاً نام و نام خانوادگی خودتون رو وارد کنید.
                                </p>

                                <Formik
                                    initialValues={{ fullName: "", email: "" }}
                                    onSubmit={(values) => {
                                        completeProfile(values)
                                    }}
                                    validateOnBlur={false}
                                    validate={(values) => {
                                        const errors: { fullName?: string; email?: string } = {}

                                        if (!values.fullName.trim()) {
                                            errors.fullName = "نام و نام خانوادگی را وارد کنید."
                                        }

                                        if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
                                            errors.email = "ایمیل وارد شده معتبر نیست."
                                        }

                                        return errors;
                                    }}
                                >
                                    {({ errors, submitCount }) => (
                                        <Form>
                                            <div className="relative mb-6">
                                                <Field
                                                    name='fullName'
                                                    type="text"
                                                    placeholder=" "
                                                    className={`peer w-full p-3 border-2  rounded-md outline-none 
                                                    ${submitCount > 0 && errors.fullName
                                                            ?
                                                            'border-red-500'
                                                            :
                                                            'border-gray-300 focus:border-primary-500'}`}
                                                />
                                                <label
                                                    className="absolute right-3 top-[30%] bg-white px-1 text-gray-500 text-sm transition-all duration-1000 pointer-events-none
                               peer-focus:-top-2
                                peer-focus:text-xs
                              peer-focus:text-primary-500
                                peer-not-placeholder-shown:-top-2
                                peer-not-placeholder-shown:text-xs">
                                                    نام و نام خانوادگی
                                                </label>
                                            </div>
                                            <ErrorMessage name='fullName'>{(msg) => <span className='block w-full mb-4 -mt-3 mr-4 text-xs text-right text-red-500'>{msg}</span>}</ErrorMessage>

                                            <div className="relative">
                                                <Field
                                                    name='email'
                                                    type="email"
                                                    placeholder=" "
                                                    dir="ltr"
                                                    className={`peer w-full p-3 border-2  rounded-md outline-none 
                                                    ${submitCount > 0 && errors.email
                                                            ?
                                                            'border-red-500'
                                                            :
                                                            'border-gray-300 focus:border-primary-500'}`}
                                                />
                                                <label
                                                    className="absolute right-3 top-[30%] bg-white px-1 text-gray-500 text-sm transition-all duration-1000 pointer-events-none
                               peer-focus:-top-2
                                peer-focus:text-xs
                              peer-focus:text-primary-500
                                peer-not-placeholder-shown:-top-2
                                peer-not-placeholder-shown:text-xs">
                                                    ایمیل (اختیاری)
                                                </label>
                                            </div>
                                            <ErrorMessage name='email'>{(msg) => <span className='block w-full mt-2 mr-4 text-xs text-right text-red-500'>{msg}</span>}</ErrorMessage>

                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className="w-full p-3 mt-6 linear_btn text-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isPending ? "در حال ثبت..." : "تکمیل ثبت‌نام"}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                }
                {/* //////////// Terms and Caonditions */}
                <p className="px-10 text-xs font-medium text-gray-600 leading-6">
                    ورود | ثبت نام شما به معنای پذیرش &nbsp;
                    <Link target="_blank" className="text-xs text-blue-500" href="/rules">
                        قوانین و مقررات
                    </Link>
                    &nbsp; و &nbsp;
                    <Link target="_blank" className="text-xs text-blue-500" href="/rules">
                        حریم خصوصی کاربران
                    </Link>
                    &nbsp; کیـوی‌تـــک است.
                </p>
            </div>
            {/* /////////////////// Background Image */}
            <div className='w-3/4 relative'>
                <Image
                    src="/images/loginBg.png"
                    alt="logo"
                    fill
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

export default login_register;