import { Product, ProductsState } from "@/types/productType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import allProducts from "@root/Products"

export const getProducts = createAsyncThunk<Product[]>(
    "products/getProducts",
    async () => {
        return allProducts;
    }
)

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
}

const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load products";
            })
    }
})

export default slice.reducer;