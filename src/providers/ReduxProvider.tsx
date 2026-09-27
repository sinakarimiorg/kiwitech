"use client"

import { Provider } from "react-redux"
import { store } from "../store"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { hydrateCart } from "../store/reducers/cartSlice"
import { CartItem } from "../types/cartType"

const CART_STORAGE_KEY = "kiwitech_cart"

function readStoredCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return []

        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []

        // فقط آیتم‌های سالم رو قبول می‌کنیم (اگه کسی localStorage رو دستکاری کرده باشه)
        return parsed.filter(
            (item): item is CartItem =>
                item &&
                typeof item.id === "string" &&
                typeof item.title === "string" &&
                typeof item.price === "number" &&
                Number.isInteger(item.count) &&
                item.count > 0
        )
    } catch {
        return []
    }
}

// Save Data In Cart Storage 
function CartPersistence() {
    const dispatch = useAppDispatch()
    const items = useAppSelector(state => state.cart.items)
    const hydrated = useAppSelector(state => state.cart.hydrated)

    // ۱) بعد از mount: خوندن سبد ذخیره‌شده + همگام‌سازی بین تب‌ها
    useEffect(() => {
        dispatch(hydrateCart(readStoredCart()))

        const onStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY) dispatch(hydrateCart(readStoredCart()))
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [dispatch])

    // ۲) ذخیره‌ی تغییرات (قبل از hydrate نباید بنویسیم، وگرنه سبد ذخیره‌شده با یه سبد خالی پاک می‌شه)
    useEffect(() => {
        if (!hydrated) return
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        } catch {
            // حافظه پر بود یا مرورگر در حالت خصوصیه؛ سبد فقط در همین نشست می‌مونه
        }
    }, [items, hydrated])

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