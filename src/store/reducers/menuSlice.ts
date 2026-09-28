import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getMenuCategoriesAction } from "@root/src/components/modules/Navbar/menuActions" 
import type { MenuCategory } from "@root/src/types/menuType"

type MenuState = {
    categories: MenuCategory[]
    status: "idle" | "loading" | "loaded" | "failed"
}

const initialState: MenuState = {
    categories: [],
    status: "idle",
}

export const fetchMenuCategories = createAsyncThunk<MenuCategory[]>(
    "menu/fetchCategories",
    async () => getMenuCategoriesAction(),
    {
        condition: (_, { getState }) => {
            const { menu } = getState() as { menu: MenuState }
            return menu.status === "idle" || menu.status === "failed"
        },
    }
)

const slice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchMenuCategories.pending, state => {
                state.status = "loading"
            })
            .addCase(fetchMenuCategories.fulfilled, (state, action) => {
                state.categories = action.payload
                state.status = "loaded"
            })
            .addCase(fetchMenuCategories.rejected, state => {
                state.status = "failed"
            })
    },
})

export default slice.reducer
