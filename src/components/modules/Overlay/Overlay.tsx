import React, { useEffect, useState } from 'react'

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Overlay({ isOpen, onClose }: OverlayProps) {
    const [overlayClass, setOverlayClass] = useState('overlay')

    useEffect(() => {
        setOverlayClass(isOpen ? 'overlay overlay--visible' : 'overlay')
    }, [isOpen])

    return (
        <div className={overlayClass} onClick={onClose}></div>
    )
}