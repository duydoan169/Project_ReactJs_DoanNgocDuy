import { configureStore } from "@reduxjs/toolkit";
import users from "./slices/userSlice"
export const store = configureStore({
    reducer: {
        users: users
    }
})