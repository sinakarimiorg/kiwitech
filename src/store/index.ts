import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartSlice"
import menuReducer from "./reducers/menuSlice"

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        menu: menuReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch