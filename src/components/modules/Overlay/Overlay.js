import React, { useEffect, useState } from 'react'

import './Overlay.css'

export default function Overlay({ isOpen, isClose }) {

    const [overlayClass, setOverlayClass] = useState('')

    useEffect(() => {
        { isOpen ? ( setOverlayClass('overlay overlay--visible') ) : setOverlayClass('overlay') }

    }, [isOpen])

    return (
        <>
            <div className={overlayClass} onClick={isClose}></div>
        </>
    )
}
