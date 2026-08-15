import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AdminProduct, AdminProductsState } from "@root/src/types/adminProductType"

const initialState: AdminProductsState = {
    items: [],
    loading: false,
    isSubmitting: false,
    error: null,
}

// ────────────────────────────────
// Get Products API
// ────────────────────────────────
export const fetchAdminProducts = createAsyncThunk<AdminProduct[]>(
    "adminProducts/fetchAdminProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/products")
            const data = await res.json()

            if (Array.isArray(data)) return data
            if (Array.isArray(data.products)) return data.products
            if (Array.isArray(data.data)) return data.data
            return []
        } catch (error) {
            return rejectWithValue("خطا در دریافت محصولات")
        }
    }
)

// ────────────────────────────────
// Add New Product (FormData includes images and fields)
// ────────────────────────────────
export const addAdminProduct = createAsyncThunk<AdminProduct, FormData>(
    "adminProducts/addAdminProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                return rejectWithValue(data.error || "خطا در ثبت محصول")
            }
            return data.data as AdminProduct
        } catch (error) {
            return rejectWithValue("مشکلی در ذخیره محصول پیش آمد")
        }
    }
)

// ────────────────────────────────
// Update Product
// ────────────────────────────────
export const updateAdminProduct = createAsyncThunk<
    AdminProduct,
    { id: string; formData: FormData }
>(
    "adminProducts/updateAdminProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                body: formData,
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                return rejectWithValue(data.error || "خطا در ویرایش محصول")
            }
            return data.data as AdminProduct
        } catch (error) {
            return rejectWithValue("مشکلی در ویرایش محصول پیش آمد")
        }
    }
)

// ────────────────────────────────
//  Delete Product
// ────────────────────────────────
export const deleteAdminProduct = createAsyncThunk<string, string>(
    "adminProducts/deleteAdminProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                return rejectWithValue(data.error || "خطا در حذف محصول")
            }
            return id
        } catch (error) {
            return rejectWithValue("مشکلی در حذف محصول پیش آمد")
        }
    }
)

const adminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        clearAdminProductsError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // ───── fetch ─────
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action: PayloadAction<AdminProduct[]>) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || "خطا در دریافت محصولات"
            })

            // ───── add ─────
            .addCase(addAdminProduct.pending, (state) => {
                state.isSubmitting = true
                state.error = null
            })
            .addCase(addAdminProduct.fulfilled, (state, action: PayloadAction<AdminProduct>) => {
                // محصول جدید به ابتدای لیست اضافه می‌شود تا نیازی به رفرش دستی نباشد
                state.items.unshift(action.payload)
                state.isSubmitting = false
            })
            .addCase(addAdminProduct.rejected, (state, action) => {
                state.isSubmitting = false
                state.error = (action.payload as string) || "خطا در ثبت محصول"
            })

            // ───── update ─────
            .addCase(updateAdminProduct.pending, (state) => {
                state.isSubmitting = true
                state.error = null
            })
            .addCase(updateAdminProduct.fulfilled, (state, action: PayloadAction<AdminProduct>) => {
                state.items = state.items.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                )
                state.isSubmitting = false
            })
            .addCase(updateAdminProduct.rejected, (state, action) => {
                state.isSubmitting = false
                state.error = (action.payload as string) || "خطا در ویرایش محصول"
            })

            // ───── delete ─────
            .addCase(deleteAdminProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter((p) => p._id !== action.payload)
            })
            .addCase(deleteAdminProduct.rejected, (state, action) => {
                state.error = (action.payload as string) || "خطا در حذف محصول"
            })
    },
})

export const { clearAdminProductsError } = adminProductsSlice.actions
export default adminProductsSlice.reducer
