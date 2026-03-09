import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publicKey: "",
  network: "",
  stellarWalletKitIsOpen: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setNetwork: (state, action) => {
      state.network = action.payload;
    },
    setStellarWalletKitIsOpen: (state, action) => {
      state.stellarWalletKitIsOpen = action.payload;
    },
    clearWallet: (state) => {
      state.publicKey = "";
      state.network = "";
    },
  },
});

export const {
  setPublicKey,
  setNetwork,
  setStellarWalletKitIsOpen,
  clearWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
