import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Category } from "../../utils/type";
import { deleteCategory, getAllCategory, patchCategory, postCategory } from "../../apis/categoryAPI";

export const getAllCategories = createAsyncThunk("getAllCategories", async ({currentPage, search, limit}: {currentPage: number, search: string, limit: number})=>{
    return getAllCategory({currentPage, search, limit});
})

export const addCategory = createAsyncThunk("addCategory", async (data: Category)=>{
    return postCategory(data);
})

export const removeCategory = createAsyncThunk("removeCategory", async (id: number)=>{
    return deleteCategory(id);
})
export const updateCategory = createAsyncThunk("updateCategory", async (data: Category)=>{
    return patchCategory(data);
})
const initialState: {categories: Category[], totalPages: number} = {categories: [], totalPages: 1}
export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(getAllCategories.fulfilled, (state, action)=>{
            state.categories=action.payload.data;
            state.totalPages=action.payload.totalPages
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload);
        })
        .addCase(removeCategory.fulfilled, (state, action) => {
            state.categories = state.categories.filter((category) => category.id!=action.payload);
        })
        .addCase(updateCategory.fulfilled, (state, action)=>{
            state.categories = state.categories.map((category) =>{ return category.id == action.payload.id ? action.payload : category})
        })
    }
})
export default categorySlice.reducer