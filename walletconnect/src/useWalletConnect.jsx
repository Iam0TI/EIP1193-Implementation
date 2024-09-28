import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Utility functions
const getChainId = async () => {
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return parseInt(chainId, 16); // Convert from hex to decimal
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

const useWalletConnect = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [disconnectButtonText, setDisConnButtonText] = useState("");

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      console.log("Wallet Here!");
      try {
        const result = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await getAccountBalance(result[0]);
        await chainChangedHandler();
        await accountChangedHandler(result[0]);
        setConnButtonText("Wallet Connected");
        setDisConnButtonText("Disconnect Wallet");
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      console.log("Need to install wallet");
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

  return {
    errorMessage,
    defaultAccount,
    userBalance,
    chainId,
    connButtonText,
    disconnectButtonText,
    connectWalletHandler,
    disconnectWalletHandler,
  };
};

export default useWalletConnect;
