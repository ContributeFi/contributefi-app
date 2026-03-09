import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  email: null,
  otp: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    login: (state, action) => {
      const { token, email, user, otp, username } = action.payload;
      state.token = token || null;
      state.user = user || null;
      state.email = email || null;
      state.otp = otp || null;
      state.username = username || null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
      state.otp = null;
      state.username = null;
    },
  },
});

export const {
  setUser,
  setToken,
  setEmail,
  setOtp,
  setUsername,
  login,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
