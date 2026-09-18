import React from 'react'

type LoaderSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<LoaderSize, number> = {
    sm: 22,
    md: 40,
    lg: 60,
}

type LoaderProps = {
    size?: LoaderSize
    className?: string
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
    const px = sizeMap[size]

    return (
        <svg
            className={`animate-spin ${className}`}
            style={{ width: px, height: px }}
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            role="status"
            aria-label="در حال بارگذاری"
        >
            <defs>
                <linearGradient id="kiwi-loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7D971B" />
                    <stop offset="100%" stopColor="#D7FF5C" />
                </linearGradient>
            </defs>

            {/* دایره‌ی پس‌زمینه، کم‌رنگ */}
            <circle cx="25" cy="25" r="20" fill="none" stroke="#E7F5B8" strokeWidth="5" />

            {/* کمان چرخنده با گرادینت برند */}
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="url(#kiwi-loader-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="90 125"
            />
        </svg>
    )
}
