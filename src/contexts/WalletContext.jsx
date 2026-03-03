import { WalletContext } from "@/hooks/useWallet";
import { useState } from "react";

export const WalletProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userKey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [walletKitIsOpen, setWalletKitIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  console.log("the connected wallet and userkey are", userKey, network);

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
        selectedNetwork,
        setSelectedNetwork,
        walletKitIsOpen,
        setWalletKitIsOpen,
        handleConnectStellarKit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
