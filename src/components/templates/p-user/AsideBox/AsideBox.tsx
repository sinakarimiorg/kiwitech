import TomanIcon from "@root/src/components/modules/Icons/TomanIcon";
import { log } from "console";
import Link from "next/link";
import { PiShieldCheckLight, PiTruckLight } from "react-icons/pi";


type AsideBoxProps = {
    totalCount: number;
    originalTotal: number;
    totalDiscount: number;
    shippingCost: number;
    payable: number;
    href: string
};

export default function AsideBox(
    { totalCount,
        originalTotal,
        totalDiscount,
        shippingCost,
        payable,
        href }: AsideBoxProps
) {

    return (
        <aside className='w-full lg:w-87.5 shrink-0'>
            <div className='lg:sticky lg:top-28 bg-white shadow-lg rounded-2xl p-5 sm:p-6'>
                <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800 pb-4 mb-4 border-b border-gray-100'>
                    خلاصه سفارش
                </h2>

                <div className='flex flex-col gap-3 text-sm'>
                    <div className='flex items-center justify-between text-zinc-500'>
                        <span>قیمت کالاها ({totalCount})</span>
                        <span className='inline-flex items-center gap-1 text-zinc-700'>
                            {originalTotal.toLocaleString()}
                            <TomanIcon />
                        </span>
                    </div>

                    {totalDiscount > 0 &&
                        <div className='flex items-center justify-between text-primary-600'>
                            <span>سود شما از خرید</span>
                            <span className='inline-flex items-center gap-1'>
                                {totalDiscount.toLocaleString()}
                                <TomanIcon />
                            </span>
                        </div>
                    }

                    <div className='flex items-center justify-between text-zinc-500'>
                        <span>هزینه ارسال</span>
                        <span className={shippingCost === 0 ? 'text-primary-600 font-IranYekanMedium' : 'text-zinc-700'}>
                            {shippingCost === 0 ? 'رایگان' : `${shippingCost.toLocaleString()} تومان`}
                        </span>
                    </div>
                </div>

                <div className='flex items-center justify-between mt-5 pt-4 border-t border-dashed border-gray-200'>
                    <span className='font-IranYekanMedium text-zinc-700'>مبلغ قابل پرداخت</span>
                    <span className='inline-flex items-center gap-1 font-IranYekanBold text-lg text-zinc-800'>
                        {payable.toLocaleString()}
                        <TomanIcon />
                    </span>
                </div>

                <Link href={`/checkout/${href}`} className='flex-center w-full h-12 mt-6 font-IranYekanMedium text-base linear_btn'>
                    ادامه و ثبت آدرس
                </Link>

                <div className='flex flex-col gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-zinc-400'>
                    <div className='flex items-center gap-2'>
                        <PiShieldCheckLight className='w-4 h-4 text-primary-500' />
                        ضمانت اصل بودن کالا
                    </div>
                    <div className='flex items-center gap-2'>
                        <PiTruckLight className='w-4 h-4 text-primary-500' />
                        امکان بازگشت کالا تا ۷ روز
                    </div>
                </div>
            </div>
        </aside>
    )
}
