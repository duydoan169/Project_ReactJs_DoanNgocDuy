import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../utils/type";
import { getAllUser, postUser } from "../../apis/userAPI";
export const getAllUsers = createAsyncThunk("getAllUsers", async ()=>{
    return getAllUser();
})
export const addUser = createAsyncThunk("addUser", async (data: User)=>{
    return postUser(data);
})

const initialState: {users: User[]} = {users: []};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase(getAllUsers.fulfilled, (state, action) =>{
            state.users=action.payload
        })
        .addCase(addUser.fulfilled, (state, action)=>{
            state.users.push(action.payload);
        })
    }
})
export default userSlice.reducer