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

const inputClass = (hasError: boolean) =>
    `peer w-full p-3 border-2 rounded-md outline-none transition-colors ${hasError ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'}`

const labelClass = `absolute right-3 top-[30%] bg-white px-1 text-gray-500 text-sm transition-all duration-200 pointer-events-none
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-500
    peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs`

const submitClass = "w-full p-3 linear_btn text-base sm:text-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"

const AuthLogo = () => (
    <Link href={"/"} className="mx-auto block">
        <Image
            src={"/images/logo/logo.png"}
            alt="کیوی‌تک"
            width={300}
            height={300}
            priority
            className="h-auto w-32 xs:w-36 sm:w-40 lg:w-48 xl:w-56"
        />
    </Link>
)

const FieldError = ({ name }: { name: string }) => (
    <ErrorMessage name={name}>
        {(msg) => <span className='block w-full mt-2 pr-1 text-xs text-right text-red-500'>{msg}</span>}
    </ErrorMessage>
)

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
        <div className="min-h-dvh w-full overflow-x-hidden flex flex-col lg:flex-row bg-white">

            {/* /////////////////// Banner (top strip on mobile/tablet, right side on desktop) */}
            <div className="relative order-first lg:order-last h-40 xs:h-48 sm:h-64 md:h-80 lg:h-auto lg:min-h-dvh lg:flex-1 shrink-0 overflow-hidden">
                <Image
                    src="/images/loginBg.png"
                    alt="لوازم جانبی کیوی‌تک"
                    fill
                    priority
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-cover object-[60%_center] lg:object-center"
                />
                {/* soft fade into the form card on small screens */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/10 to-transparent lg:hidden" />
            </div>

            {/* /////////////////// Form panel */}
            <div
                className="relative z-10 -mt-6 lg:mt-0 flex flex-1 lg:flex-none flex-col justify-between rounded-t-3xl lg:rounded-none bg-white
                           px-5 pt-6 pb-6 sm:px-10 lg:w-100 xl:w-110 2xl:w-1/4 lg:px-8 lg:py-6 lg:min-h-dvh
                           shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:shadow-none"
                data-aos="fade-right"
            >
                <div className="mx-auto w-full max-w-md flex flex-col justify-center flex-1 text-center text-surface">
                    {
                        !isCodeStep ?
                            <div className="flex flex-col">
                                <AuthLogo />
                                <p className="mt-2 sm:mt-4 flex items-center justify-center gap-3 xs:gap-4.5 text-surface-3">
                                    <span className="text-base font-semibold leading-5 xs:text-xl xs:leading-6">ورود</span>
                                    <span className="h-4.5 w-0 border-l border-gray-700 xs:h-5 xs:border-l-[1.5px]"></span>
                                    <span className="text-base font-semibold leading-5 xs:text-xl xs:leading-6">ثبت نام</span>
                                </p>
                                <h3 className="my-6 sm:my-10 lg:my-12 font-medium tracking-wider">خوش اومدی :)
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
                                        <Form noValidate>
                                            <div className="relative">
                                                <Field
                                                    name='phone'
                                                    type="tel"
                                                    inputMode="numeric"
                                                    autoComplete="tel"
                                                    placeholder=" "
                                                    className={inputClass(submitCount > 0 && !!errors.phone)}
                                                />
                                                <label className={labelClass}>
                                                    شماره موبایل خود را وارد کنید
                                                </label>
                                            </div>
                                            <FieldError name="phone" />
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className={`${submitClass} mt-4`}
                                            >
                                                {isPending ? "در حال ارسال..." : "ادامه"}
                                            </button>
                                        </Form>
                                    )}

                                </Formik>
                            </div>
                            : !isProfileStep ?
                                <div className="flex flex-col">
                                    <AuthLogo />
                                    <h3 className="mb-6 sm:mb-10 lg:mb-16 mt-2 sm:mt-4 text-lg sm:text-xl font-extrabold font-IranYekanBold">کــد تــایـیـد:</h3>

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
                                            <Form noValidate>
                                                <div>
                                                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-3 text-center">
                                                        <span className="text-text-muted text-xs opacity-75">
                                                            لطفاً کد تأیید ارسال شده را به شماره
                                                        </span>
                                                        <span className="font-bold text-sm text-surface-3 tracking-widest">{phone}</span>
                                                        <span className="text-text-muted text-xs opacity-75">
                                                            را وارد کنید
                                                        </span>
                                                    </div>
                                                    <Field
                                                        name='code'
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="one-time-code"
                                                        dir="ltr"
                                                        placeholder=" "
                                                        className={`${inputClass(submitCount > 0 && !!errors.code)} text-center text-lg tracking-[0.4em]`}
                                                    />
                                                </div>
                                                <FieldError name="code" />
                                                {
                                                    secondsLeft > 0 ?
                                                        <div className="mt-3 mb-6 sm:mb-10 lg:mb-14 pl-2 text-end font-semibold">
                                                            <span>
                                                                {formatTime(secondsLeft)}
                                                            </span>
                                                        </div>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={resendCode}
                                                            disabled={isPending}
                                                            className="mt-3 mb-6 sm:mb-10 lg:mb-14 mr-auto pl-2 flex items-center justify-end gap-1 font-semibold text-primary-700 text-xs cursor-pointer disabled:opacity-60">
                                                            <p>دریافت مجدد کد</p>
                                                            <IoMdRefresh className="size-4 text-primary-500" />
                                                        </button>
                                                }


                                                <button
                                                    type="button"
                                                    className="mx-auto flex items-center justify-center gap-2 mb-4 text-primary-700 cursor-pointer"
                                                    onClick={() => setIsCodeStep(false)}
                                                >
                                                    <span>ویرایش شماره</span>
                                                    <IoIosArrowBack className="size-3.5 text-primary-500" />
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className={`${submitClass} mt-2`}
                                                >
                                                    {isPending ? "در حال بررسی..." : "ثبت کد تایید"}
                                                </button>
                                            </Form>
                                        )}

                                    </Formik>

                                </div>
                                :
                                <div className="flex flex-col">
                                    <AuthLogo />
                                    <h3 className="mb-3 mt-2 sm:mt-4 text-lg sm:text-xl font-extrabold font-IranYekanBold">تکمیل اطلاعات حساب</h3>
                                    <p className="mb-6 sm:mb-10 text-xs text-text-muted leading-6">
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
                                            <Form noValidate>
                                                <div className="relative">
                                                    <Field
                                                        name='fullName'
                                                        type="text"
                                                        autoComplete="name"
                                                        placeholder=" "
                                                        className={inputClass(submitCount > 0 && !!errors.fullName)}
                                                    />
                                                    <label className={labelClass}>
                                                        نام و نام خانوادگی
                                                    </label>
                                                </div>
                                                <div className="mb-5 text-right"><FieldError name="fullName" /></div>

                                                <div className="relative">
                                                    <Field
                                                        name='email'
                                                        type="email"
                                                        autoComplete="email"
                                                        placeholder=" "
                                                        dir="ltr"
                                                        className={inputClass(submitCount > 0 && !!errors.email)}
                                                    />
                                                    <label className={labelClass}>
                                                        ایمیل (اختیاری)
                                                    </label>
                                                </div>
                                                <FieldError name="email" />

                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className={`${submitClass} mt-6`}
                                                >
                                                    {isPending ? "در حال ثبت..." : "تکمیل ثبت‌نام"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                    }
                </div>

                {/* //////////// Terms and Conditions */}
                <p className="mt-8 lg:mt-6 px-2 sm:px-6 lg:px-2 text-center lg:text-right text-xs font-medium text-gray-600 leading-6">
                    ورود | ثبت نام شما به معنای پذیرش &nbsp;
                    <Link className="text-xs text-blue-500" href="/rules">
                        قوانین و مقررات
                    </Link>
                    &nbsp; و &nbsp;
                    <Link className="text-xs text-blue-500" href="/rules#privacy">
                        حریم خصوصی کاربران
                    </Link>
                    &nbsp; کیـوی‌تـــک است.
                </p>
            </div>
        </div>
    )
}

export default login_register;