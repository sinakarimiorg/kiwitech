import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cartType";

type CartState = {
    items: CartItem[]
}

type AddToCartPayload = {
    item: Omit<CartItem, "count">
    count?: number
}

const initialState: CartState = {
    items: [],
}


const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        //___Loading Step
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload
        },

        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { item, count = 1 } = action.payload
            const maxAllowed = item.stock ?? Infinity
            const existing = state.items.find(i => i.id === item.id)

            if (existing) {
                existing.count = Math.min(existing.count + count, maxAllowed)
            } else {
                state.items.push({ ...item, count: Math.min(Math.max(count, 1), maxAllowed) })
            }
        },

        incrementItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload)
            if (!item) return
            const maxAllowed = item.stock ?? Infinity
            if (item.count < maxAllowed) item.count += 1
        },

        decrementItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload)
            if (!item) return
            if (item.count <= 1) {
                state.items = state.items.filter(i => i.id !== action.payload)
            } else {
                item.count -= 1
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload)
        },

        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { setCart, addToCart, incrementItem, decrementItem, removeFromCart, clearCart } = slice.actions
export default slice.reducer
