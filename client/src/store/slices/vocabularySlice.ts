import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Vocabulary } from "../../utils/type";
import { deleteVocabulary, getAllVocabulary, patchVocabulary, postVocabulary } from "../../apis/vocabularyAPI";

export const getAllVocabularies = createAsyncThunk("getAllVocabularies", async ({currentPage, search, limit}: {currentPage: number, search:{wordSearch: string, categorySearch: number}, limit: number})=>{
    return getAllVocabulary({currentPage, search, limit});
})

export const addVocabulary = createAsyncThunk("addVocabulary", async (data: Vocabulary)=>{
    return postVocabulary(data);
})

export const removeVocabulary = createAsyncThunk("removeVocabulary", async (id: number)=>{
    return deleteVocabulary(id);
})
export const updateVocabulary = createAsyncThunk("updateVocabulary", async (data: Vocabulary)=>{
    return patchVocabulary(data);
})
const initialState: {vocabularies: Vocabulary[], totalPages: number} = {vocabularies: [], totalPages: 1}
export const vocabularySlice = createSlice({
    name: "vocabulary",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(getAllVocabularies.fulfilled, (state, action)=>{
            state.vocabularies=action.payload.data;
            state.totalPages=action.payload.totalPages
        })
        .addCase(addVocabulary.fulfilled, (state, action) => {
            state.vocabularies.push(action.payload);
        })
        .addCase(removeVocabulary.fulfilled, (state, action) => {
            state.vocabularies = state.vocabularies.filter((vocabulary) => vocabulary.id!=action.payload);
        })
        .addCase(updateVocabulary.fulfilled, (state, action)=>{
            state.vocabularies = state.vocabularies.map((vocabulary) =>{ return vocabulary.id == action.payload.id ? action.payload : vocabulary})
        })
    }
})
export default vocabularySlice.reducer