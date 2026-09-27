"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const formatUnit = (value: number) =>
    value.toLocaleString('fa-IR', { minimumIntegerDigits: 2, useGrouping: false })

export default function OfferCountdown({ endsAt }: { endsAt: number }) {
    const router = useRouter()
    const [remaining, setRemaining] = useState<number | null>(null)
    const refreshedRef = useRef(false)

    useEffect(() => {
        refreshedRef.current = false

        const tick = () => {
            const diff = Math.max(endsAt - Date.now(), 0)
            setRemaining(diff)

            if (diff === 0 && !refreshedRef.current) {
                refreshedRef.current = true
                router.refresh()
            }
        }

        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [endsAt, router])

    const totalSeconds = remaining === null ? null : Math.floor(remaining / 1000)

    const units = [
        { label: 'ساعت', value: totalSeconds === null ? null : Math.floor(totalSeconds / 3600) },
        { label: 'دقیقه', value: totalSeconds === null ? null : Math.floor(totalSeconds / 60) % 60 },
        { label: 'ثانیه', value: totalSeconds === null ? null : totalSeconds % 60 },
    ]

    return (
        <div dir='ltr' className='flex items-start gap-2' role='timer' aria-label='زمان باقی‌مانده تا پایان پیشنهاد'>
            {units.map((unit, index) => (
                <div key={unit.label} className='flex items-start gap-2'>
                    <div className='flex flex-col items-center gap-1.5'>
                        <span className='flex-center min-w-12 py-2 font-IranYekanBold text-xl text-neon bg-white/10 border border-white/10 rounded-xl'>
                            {unit.value === null ? '--' : formatUnit(unit.value)}
                        </span>
                        <span className='text-[11px] text-text-muted'>{unit.label}</span>
                    </div>
                    {index < units.length - 1 &&
                        <span className='pt-2 text-lg text-text-muted'>:</span>
                    }
                </div>
            ))}
        </div>
    )
}
