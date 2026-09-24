"use client"

import { Provider } from "react-redux"
import { store } from "../store"
import { useEffect } from "react"
import { setCart } from "@/store/reducers/cartSlice"

const CART_STORAGE_KEY = "kiwitech_cart"

function CartPersistence() {
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY)
            if (raw) {
                store.dispatch(setCart(JSON.parse(raw)))
            }
        } catch (error) {
            console.error("Error loading cart from storage:", error)
        }

        const unsubscribe = store.subscribe(() => {
            try {
                window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart.items))
            } catch (error) {
                console.error("Error saving cart to storage:", error)
            }
        })

        return () => unsubscribe()
    }, [])

    return null
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <CartPersistence />
            {children}
        </Provider>
    )
}