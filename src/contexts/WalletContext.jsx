import { WalletContext } from "@/hooks/useWallet";
import { useState } from "react";

export const WalletProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userKey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [walletKitIsOpen, setWalletKitIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConnectStellarKit() {
    setIsOpen(false);
    setWalletKitIsOpen(true);
  }

  return (
    <WalletContext.Provider
      value={{
        userKey,
        setUserKey,
        network,
        setNetwork,
        isOpen,
        setIsOpen,
        walletKitIsOpen,
        setWalletKitIsOpen,
        handleConnectStellarKit,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
