import { configureStore } from "@reduxjs/toolkit";
import users from "./slices/userSlice"
import categories from './slices/categorySlice'
import vocabularies from "./slices/vocabularySlice";
export const store = configureStore({
    reducer: {
        users: users,
        categories: categories,
        vocabularies: vocabularies
    }
})