import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productsSlice"
import adminProductsReducer from "./reducers/adminProductsSlice"

export const store = configureStore({
    reducer: {
        products: productReducer,
        adminProducts: adminProductsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch