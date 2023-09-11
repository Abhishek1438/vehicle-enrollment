// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Include the authSlice reducer
    // Other reducers if you have them
  },
});

export default store;
