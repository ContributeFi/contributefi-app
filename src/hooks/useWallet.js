import { useDispatch, useSelector } from "react-redux";
import {
  setPublicKey,
  setNetwork,
  setStellarWalletKitIsOpen,
  clearWallet,
} from "@/store/walletSlice";

export const useWallet = () => {
  const dispatch = useDispatch();

  const publicKey = useSelector((state) => state.wallet.publicKey);
  const network = useSelector((state) => state.wallet.network);
  const stellarWalletKitIsOpen = useSelector(
    (state) => state.wallet.stellarWalletKitIsOpen,
  );

  const handleOpenStellarWalletKitModal = () => {
    dispatch(setStellarWalletKitIsOpen(true));
  };

  const handleCloseStellarWalletKitModal = () => {
    dispatch(setStellarWalletKitIsOpen(false));
  };

  return {
    publicKey,
    setPublicKey: (value) => dispatch(setPublicKey(value)),
    network,
    setNetwork: (value) => dispatch(setNetwork(value)),
    stellarWalletKitIsOpen,
    setStellarWalletKitIsOpen: (value) =>
      dispatch(setStellarWalletKitIsOpen(value)),
    handleOpenStellarWalletKitModal,
    handleCloseStellarWalletKitModal,
    clearWallet: () => dispatch(clearWallet()),
  };
};
