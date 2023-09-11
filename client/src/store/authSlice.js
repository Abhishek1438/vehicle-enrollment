// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Initially, the user is null when not logged in
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set the user when logged in
    },
    clearUser: (state) => {
      state.user = null; // Clear the user when logged out
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
