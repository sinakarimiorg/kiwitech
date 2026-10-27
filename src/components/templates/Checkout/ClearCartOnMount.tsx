"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@root/src/store/hooks"
import { clearCart } from "@root/src/store/reducers/cartSlice"

// only when the result is success
export default function ClearCartOnMount() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(clearCart())
    }, [dispatch])
    return null
}
