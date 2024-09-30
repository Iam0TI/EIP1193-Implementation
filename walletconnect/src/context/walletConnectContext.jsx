/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";

// Utility functions
const getChainId = async () => {
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return parseInt(chainId, 16); // convert from hex to decimal
  } catch (error) {
    console.error("Failed to get chain ID:", error);
    return null;
  }
};

export const getAccountBalance = async (account) => {
  try {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Failed to get account balance:", error);
    return null;
  }
};

const WalletConnect = createContext();

const WalletConnectProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [disconnectButtonText, setDisConnButtonText] = useState("");

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const result = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // await getAccountBalance(result[0]);
        await chainChangedHandler();
        await accountChangedHandler(result[0]);
        setConnButtonText("Wallet Connected");
        setDisConnButtonText("Disconnect Wallet");
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("Please install wallet extension to interact");
    }
  };
  const disconnectWalletHandler = async () => {
    try {
      setDefaultAccount(null);
      setChainId(null);
      setUserBalance(null);
      setConnButtonText("Connect Wallet");
      setDisConnButtonText("");

      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });

      return true;
    } catch (error) {
      console.error("Failed to disconnect", error);
      return false;
    }
  };

  const accountChangedHandler = async (newAccount) => {
    setDefaultAccount(newAccount);
    const balance = await getAccountBalance(newAccount);
    setUserBalance(balance);
  };

  const chainChangedHandler = async () => {
    const newChainId = await getChainId();
    setChainId(newChainId);
    const balance = await getAccountBalance(defaultAccount);
    setUserBalance(balance);
  };

  useEffect(() => {
    console.log("WalletConnectProvider useEffect is running");
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountChangedHandler);
      window.ethereum.on("chainChanged", chainChangedHandler);
      return () => {
        window.ethereum.removeListener("chainChanged", chainChangedHandler);
        window.ethereum.removeListener(
          "accountsChanged",
          accountChangedHandler
        );
      };
    }
  }, []);

  const contextValue = {
    errorMessage,
    defaultAccount,
    userBalance,
    chainId,
    connButtonText,
    disconnectButtonText,
    connectWalletHandler,
    disconnectWalletHandler,
  };

  return (
    <WalletConnect.Provider value={contextValue}>
      {children}
    </WalletConnect.Provider>
  );
};

export const useWalletConnect = () => {
  const context = useContext(WalletConnect);
  if (context === undefined) {
    throw new Error(
      "useWalletConnect must be used within a WalletConnectProvider"
    );
  }
  return context;
};

export default WalletConnectProvider;
