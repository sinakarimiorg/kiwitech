import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productsSlice"
import cartReducer from "./reducers/cartSlice"

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch