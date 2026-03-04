import { useContext, createContext } from "react";

export const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);
