import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    admin: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loginAdmin: (state, action) => {
            state.admin = action.payload;
        },
        logoutAdmin: (state) => {
            state.admin = null;
        },
    }
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;