import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cartType";
import type { RootState } from "../index"


type CartState = {
    items: CartItem[],
    hydrated: boolean
}

type AddToCartPayload = Omit<CartItem, "count"> & { count?: number }

const initialState: CartState = {
    items: [],
    hydrated: false,
}

const limitToStock = (count: number, stock?: number) =>
    stock === undefined ? count : Math.min(count, Math.max(stock, 0))


const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        //___Loading Step
        hydrateCart(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload
            state.hydrated = true
        },

        addToCart(state, action: PayloadAction<AddToCartPayload>) {
            const { count = 1, ...product } = action.payload
            const existing = state.items.find(i => i.id === product.id)

            if (existing) {
                existing.price = product.price
                existing.exPrice = product.exPrice
                existing.stock = product.stock
                existing.count = limitToStock(existing.count + count, product.stock)
                return
            }

            const safeCount = limitToStock(count, product.stock)
            if (safeCount > 0) state.items.push({ ...product, count: safeCount })
        },

        incrementItem(state, action: PayloadAction<string>) {
            const item = state.items.find(i => i.id === action.payload)
            if (item) item.count = limitToStock(item.count + 1, item.stock)
        },

        decrementItem(state, action: PayloadAction<string>) {
            const item = state.items.find(i => i.id === action.payload)
            if (!item) return
            if (item.count > 1) item.count -= 1
            else state.items = state.items.filter(i => i.id !== action.payload)
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload)
        },

        clearCart: (state) => {
            state.items = []
        },
    },
})

export const {
    hydrateCart,
    addToCart,
    incrementItem,
    decrementItem,
    removeFromCart,
    clearCart
} = slice.actions

export default slice.reducer

/* ───────── Selectors ───────── */
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartHydrated = (state: RootState) => state.cart.hydrated

/* ───────── Handle Count Bach Icon ───────── */
export const selectCartCount = (state: RootState) =>
    state.cart.items.length

/* ───────── Calculating the shopping cart ───────── */
export const selectCartTotals = createSelector([selectCartItems], items => {
    const totalCount = items.reduce((sum, item) => sum + item.count, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0)
    const originalTotal = items.reduce((sum, item) => sum + (item.exPrice ?? item.price) * item.count, 0)

    return {
        totalCount,
        subtotal,
        originalTotal,
        totalDiscount: originalTotal - subtotal,
    }
})