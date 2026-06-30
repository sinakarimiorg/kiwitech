"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { showSwal } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoMdRefresh } from "react-icons/io";
import { ErrorMessage, Field, Form, Formik } from "formik";

const login_register = () => {

    const [isCodeStep, setIsCodeStep] = useState(false)
    const [timeExpired, setTimeExpired] = useState(true)
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')

    const verifyCode = async (values: { phone: string; code: string; }) => {
        // const body = { phone, code };
        // const res = await fetch("/api/auth/sms/verify", {
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(body)
        // });

        // if (res.status === 409) {
        //     return showSwal("کد وارد شده معتبر نیست", "error", "تلاش مجدد");
        // } else if (res.status == 410) {
        //     return showSwal("کد وارد شده منقضی شده", "error", "تلاش مجدد");
        // } else if (res.status === 200) {
        //     await showSwal(
        //         "ثبت نام شما با موفقیت انجام شد",
        //         "success",
        //         "ورود به پنل کاربری"
        //     ).then(() => {
        //         router.replace("p-user");
        //     });
        // }
        setIsCodeStep(true)
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
                                initialValues={{ phone: "", code }}
                                onSubmit={(values, { setSubmitting }) => {
                                    setPhone(values.phone)
                                    setIsCodeStep(true)
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
                                {({ isSubmitting, errors, submitCount }) => (
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
                                            className="w-full p-3 mt-4 linear_btn text-lg text-white"
                                        >
                                            ادامه

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
                            <h3 className="mb-16 mt-4 text-xl font-extrabold font-IranYekanBold">کــد تــایـیـد:</h3>

                            <Formik
                                initialValues={{ phone, code: "" }}
                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        setSubmitting(false)
                                    }, 3000)
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
                                {({ isSubmitting, errors, submitCount }) => (
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
                                            timeExpired ?
                                                <div className="mt-3 mb-18 pl-2 flex items-center justify-end gap-1 font-semibold text-primary-700 text-xs cursor-pointer">
                                                    <p>دریافت مجدد کد</p>
                                                    <IoMdRefresh className="size-4 text-primary-500" />
                                                </div>
                                                :
                                                <div className="mt-3 mb-18 pl-2 text-end font-semibold">
                                                    <span>
                                                        1:59
                                                    </span>
                                                </div>
                                        }


                                        <div className="flex items-center justify-center gap-2 mb-4 text-primary-700 cursor-pointer" onClick={() => setIsCodeStep(false)}>
                                            <span>ویرایش شماره</span>
                                            <IoIosArrowBack className="size-3.5 text-primary-500" />
                                        </div>
                                        <button
                                            className="w-full p-3 mt-4 linear_btn text-lg text-white"
                                        >
                                            ثبت کد تایید

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