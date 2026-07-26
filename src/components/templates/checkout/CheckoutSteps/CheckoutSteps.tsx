import Link from 'next/link'
import { HiMiniCheck } from 'react-icons/hi2'

type StepKey = 'cart' | 'shipping' | 'payment'

const steps: { key: StepKey; label: string; href: string }[] = [
    { key: 'cart', label: 'سبد خرید', href: '/checkout/cart' },
    { key: 'shipping', label: 'اطلاعات ارسال', href: '/checkout/shipping' },
    { key: 'payment', label: 'پرداخت', href: '/checkout/payment' },
]

export default function CheckoutSteps({ current }: { current: StepKey }) {
    const currentIndex = steps.findIndex(s => s.key === current)

    return (
        <div className='flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10'>
            {steps.map((step, index) => {
                const isCompleted = index < currentIndex
                const isActive = index === currentIndex

                const circle = (
                    <span className={`flex-center w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border-2 font-IranYekanMedium text-xs sm:text-sm transition-colors
                        ${isActive
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : isCompleted
                                ? 'bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-zinc-400'}`}>
                        {isCompleted ? <HiMiniCheck className='w-4.5 h-4.5' /> : index + 1}
                    </span>
                )

                return (
                    <div key={step.key} className='flex items-center gap-2 sm:gap-3'>
                        <div className='flex flex-col items-center gap-1.5'>
                            {isCompleted ? <Link href={step.href}>{circle}</Link> : circle}
                            <span className={`hidden sm:block text-xs whitespace-nowrap
                                ${isActive ? 'text-primary-600 font-IranYekanMedium' : isCompleted ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {step.label}
                            </span>
                        </div>

                        {index < steps.length - 1 &&
                            <span className={`w-8 sm:w-16 h-0.5 rounded-full transition-colors ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}`}></span>
                        }
                    </div>
                )
            })}
        </div>
    )
}
