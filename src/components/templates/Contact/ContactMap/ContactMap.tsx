"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const STORE_POSITION: [number, number] = [35.7219, 51.3347]

// کامپوننت داخلی نقشه برای جلوگیری از خطای SSR
const MapInner = dynamic(
    () => import('./MapInner').then((mod) => mod.default),
    { ssr: false }
)

export default function ContactMap() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className='w-full h-full bg-gray-100 animate-pulse' />
    }

    return (
        <div className='w-full h-full'>
            <MapInner position={STORE_POSITION} />
        </div>
    )
}