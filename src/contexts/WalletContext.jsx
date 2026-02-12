import { createContext, useState } from "react";
// import { BASE_FEE, STELLAR_SDK_SERVER_URL } from "../freighter-wallet/soroban";
// import { getNetwork } from "@stellar/freighter-api";
import { v4 as uuid } from "uuid";
// import { Soroban } from "@stellar/stellar-sdk";
import { useAccount, useSwitchChain } from "wagmi";

import {
  abi,
  pools,
  tokens,
  chainIds,
  native,
  // chainType,
  // chainsArr,
  // tokensDecimals,
  // chainNetwork,
  // protocolTokens,
  // protocolDecimals,
} from "../contracts/contracts-details.json";
// import { erc20Abi, formatUnits } from "viem";
// import { readContract, waitForTransactionReceipt } from "@wagmi/core";
// import { config } from "@/lib/wagmiConfig";
// import axios from "axios";

const WalletContext = createContext();

const WalletContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isXLM, setIsXLM] = useState(false);
  const [userPubKey, setUserPubKey] = useState("");
  const { address } = useAccount();

  const [userKey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);
  const [walletKitIsOpen, setWalletKitIsOpen] = useState(false);

  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [claimableCashback, setClaimableCashback] = useState("0.");
  const [freighterConnecting, setFreighterConnecting] = useState(false);
  const [updateBalances, setUpdateBalances] = useState(0);
  const [tokenDes, setTokenDes] = useState(null);
  const [messageId, setMessageId] = useState("");
  const [bridgeBalances, setBridgeBalances] = useState(null);
  const [walletBalances, setWalletBalances] = useState(null);

  // const [depositBalances, setDepositBalances] = useState(null);
  // const [walletInTestnet, setWalletInTestnet] = useState(false);

  const [nativeBalance, setNativeBalance] = useState(null);

  // const { data } = useBalance({
  //   address: address,
  // });

  const { chains } = useSwitchChain();

  const stellarChains = [
    {
      id: 12000000,
      name: "Stellar Testnet",
      chainType: "soroban",
      testnet: true,
      nativeCurrency: { decimals: 7, name: "Stellar Lumen", symbol: "XLM" },
    },
    {
      id: 14000000,
      name: "Stellar Mainnet",
      chainType: "soroban",
      testnet: false,
      nativeCurrency: { decimals: 7, name: "Stellar Lumen", symbol: "XLM" },
    },
  ];

  const allChains = [
    ...stellarChains,
    ...chains.map((chain) => ({ ...chain, chainType: "evm" })),
  ];

  const storedChainId = Number(
    localStorage.getItem("selectedChainId") || 12000000,
  );

  const [selectedSourceChain, setSelectedSourceChain] = useState(null);

  const tokenOptions = Object.entries(tokens).map(([symbol, data]) => ({
    id: uuid(),
    symbol,
    ...data,
  }));

  const [switchToken, setSwitchToken] = useState(tokenOptions[0]);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

  const walletIsConnected =
    (selectedSourceChain?.chainType === "evm" && address) ||
    (selectedSourceChain?.chainType === "soroban" && userKey);

  const needConnectWallet = !selectedSourceChain;

  // async function fetchBalanceAll(type, chain, account, token, decimals) {
  //   try {
  //     if (!account) {
  //       return "0";
  //     }
  //     if (type === "soroban") {
  //       const body = {
  //         pubKey: "GDUDNJQXGLWSVGX5JZOG35FF7PNULGK5ITKPTN7ZBM5DDAZTJVW5ABOZ",
  //         fee: BASE_FEE,
  //         network: chainNetwork[chain],
  //         contractId: token,
  //         operation: "balance",
  //         args: [{ type: "Address", value: account }],
  //       };

  //       const response = await axios.post(
  //         `${STELLAR_SDK_SERVER_URL}/simulateTransaction`,
  //         body,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );

  //       const amount = Soroban.formatTokenAmount(
  //         response?.data?.data,
  //         decimals[token],
  //       );

  //       return amount;
  //     } else if (type === "evm") {
  //       const result = await readContract(config, {
  //         abi: erc20Abi,
  //         address: token,
  //         functionName: "balanceOf",
  //         args: [account],
  //         account: account,
  //       });

  //       return formatUnits(result, decimals[token]);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // useEffect(() => {
  //   async function fetchDepositBalances() {
  //     for (let option of tokenOptions) {
  //       for (let chain of chainsArr) {
  //         const account =
  //           chainType[chain] === "evm"
  //             ? address
  //             : chainType[chain] === "soroban"
  //               ? userKey
  //               : null;
  //         if (account) {
  //           const bal = await fetchBalanceAll(
  //             chainType[chain],
  //             chain,
  //             account,
  //             protocolTokens[option[chain]],
  //             protocolDecimals,
  //           );

  //           setDepositBalances((cur) => ({
  //             ...cur,
  //             [option[chain]]: bal || "0",
  //           }));
  //         }
  //       }
  //     }
  //   }

  //   fetchDepositBalances();
  // }, [address, userKey, isOpenDeposit]);

  // useEffect(() => {
  //   async function fetchWalletBalances() {
  //     for (let option of tokenOptions) {
  //       for (let chain of chainsArr) {
  //         const account =
  //           chainType[chain] === "evm"
  //             ? address
  //             : chainType[chain] === "soroban"
  //               ? userKey
  //               : null;

  //         if (account) {
  //           const bal = await fetchBalanceAll(
  //             chainType[chain],
  //             chain,
  //             account,
  //             option[chain],
  //             tokensDecimals,
  //           );

  //           setWalletBalances((cur) => ({
  //             ...cur,
  //             [option[chain]]: bal || "0",
  //           }));
  //         }
  //       }
  //     }
  //   }

  //   fetchWalletBalances();
  // }, [address, userKey, isOpenDeposit]);

  // useEffect(() => {
  //   async function fetchBridgeBalances() {
  //     for (let option of tokenOptions) {
  //       for (let chain of chainsArr) {
  //         const bal = await fetchBalanceAll(
  //           chainType[chain],
  //           chain,
  //           pools[chain],
  //           option[chain],
  //           tokensDecimals,
  //         );

  //         setBridgeBalances((cur) => ({
  //           ...cur,
  //           [option[chain]]: bal || "0",
  //         }));
  //       }
  //     }
  //   }

  //   fetchBridgeBalances();
  // }, [isOpenDeposit]);

  // useEffect(() => {
  //   setSwitchToken(tokenOptions[0]);
  // }, [isOpenDeposit]);

  // useEffect(() => {
  //   async function fetchBalance() {
  //     // setSwitchToken(tokenOptions[0]);
  //     if (selectedSourceChain?.chainType === "evm") {
  //       const tokenDecimal = await readContract(config, {
  //         abi: erc20Abi,
  //         address: switchToken[selectedSourceChain?.id],
  //         functionName: "decimals",
  //         chainId: selectedSourceChain?.id,
  //       });

  //       setTokenDes(tokenDecimal);

  //       // setBalance(() => formatUnits(result, tokenDecimal));
  //     } else if (selectedSourceChain?.chainType === "soroban") {
  //       setTokenDes(7);
  //     }
  //   }
  //   if (selectedSourceChain) {
  //     fetchBalance();
  //   }
  // }, [address, selectedSourceChain?.id, isOpenDeposit, switchToken.id]);

  // useEffect(() => {
  //   if (storedChainId) {
  //     const selectedChain = allChains?.find(
  //       (chain) => chain?.id === Number(storedChainId),
  //     );

  //     setSelectedSourceChain(selectedChain);
  //   }
  // }, [storedChainId]);

  // useEffect(() => {
  //   async function setNetwork() {
  //     if (selectedSourceChain?.chainType === "evm") {
  //       const walletNetwork = !!selectedSourceChain?.testnet;
  //       setWalletInTestnet(walletNetwork);
  //     } else if (selectedSourceChain?.chainType === "soroban") {
  //       const nt = await getNetwork();

  //       setWalletInTestnet(nt?.network === "TESTNET");
  //     }
  //   }
  //   setNetwork();
  // }, [selectedSourceChain?.id]);

  // useEffect(() => {
  //   async function fetchNativeBalance() {
  //     if (selectedSourceChain?.chainType === "evm") {
  //       if (data) {
  //         setNativeBalance(Number(data?.formatted).toFixed(3));
  //       }
  //     } else if (selectedSourceChain?.chainType === "soroban") {
  //       const networkSelected = selectedSourceChain?.testnet
  //         ? "TESTNET"
  //         : "PUBLIC";

  //       const xlmToken = {
  //         PUBLIC: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
  //         TESTNET: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  //       };

  //       async function fetchXlmBalance() {
  //         try {
  //           if (!userKey) {
  //             setNativeBalance("0.000");
  //           }

  //           const body = {
  //             pubKey: userKey,
  //             fee: BASE_FEE,
  //             network: networkSelected,
  //             contractId: xlmToken[networkSelected],
  //             operation: "balance",
  //             args: [{ type: "Address", value: userKey }],
  //           };

  //           const response = await axios.post(
  //             `${STELLAR_SDK_SERVER_URL}/simulateTransaction`,
  //             body,
  //             {
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //             },
  //           );

  //           if (response) {
  //             const amount = Soroban.formatTokenAmount(response?.data?.data, 7);
  //             console.log("the amount is", Number(amount).toFixed(3));

  //             setNativeBalance(Number(amount).toFixed(3));
  //           }
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       }
  //       fetchXlmBalance();
  //     }
  //   }
  //   fetchNativeBalance();
  // }, [address, userKey, selectedSourceChain?.id, data?.formatted]);

  async function handleConnectStellarKit() {
    setIsOpen(false);
    setWalletKitIsOpen(true);
  }

  // async function awaitTransactionConfirmation(hashIn) {
  //   const confirmHash = await waitForTransactionReceipt(config, {
  //     hash: hashIn,
  //   });

  //   return confirmHash;
  // }

  // const testnetIsSelected = !!selectedSourceChain?.testnet;

  return (
    <WalletContext.Provider
      value={{
        selectedSourceChain,
        setSelectedSourceChain,
        selectedDestinationChain,
        setSelectedDestinationChain,
        selectedChain,
        allChains,
        setSelectedChain,
        userKey,
        setUserKey,
        network,
        setNetwork,
        isOpen,
        setIsOpen,
        isXLM,
        setIsXLM,
        userPubKey,
        setUserPubKey,
        selectedNetwork,
        setSelectedNetwork,
        freighterConnecting,
        setFreighterConnecting,
        claimableCashback,
        setClaimableCashback,
        updateBalances,
        setUpdateBalances,
        address,
        tokenOptions,
        switchToken,
        setSwitchToken,
        tokenDes,
        setTokenDes,
        isOpenDeposit,
        setIsOpenDeposit,
        pools,
        tokens,
        chainIds,
        native,
        abi,
        // awaitTransactionConfirmation,
        messageId,
        setMessageId,
        successModalIsOpen,
        setSuccessModalIsOpen,
        bridgeBalances,
        setBridgeBalances,
        walletBalances,
        setWalletBalances,
        // depositBalances,
        // isOpenSidebar,
        // setIsOpenSidebar,
        walletIsConnected,
        needConnectWallet,
        storedChainId,
        // walletInTestnet,
        setNativeBalance,
        nativeBalance,
        // testnetIsSelected,
        walletKitIsOpen,
        setWalletKitIsOpen,
        handleConnectStellarKit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
