import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getAccountBalance } from "./useWalletConnect";
import { readOnlyProvider } from "./utils";

const BalanceChecker = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [balance2, setBalance2] = useState(null);

  const [error, setError] = useState(null);

  const getBalance = async () => {
    setError(null);
    setBalance(null);
    setBalance2(null);

    if (!ethers.isAddress(address)) {
      setError("Invalid Ethereum address");
      return;
    }
    try {
      const bal = await getAccountBalance(address);
      setBalance2(bal);
    } catch (err) {
      console.error("Error getting balance:", err);
    }
    try {
      const provider = readOnlyProvider;
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (err) {
      console.error("Error getting balance:", err);
      setError("Failed to getting  balance. Please try again.");
    }
  };

  useEffect(() => {
    if (address) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div className="BalanceChecker">
      <h3>Check Wallet Balance</h3>
      <input
        type="text"
        placeholder="Enter EVM address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <button onClick={getBalance}>Check Balance</button>
      <p>Default Sepolia Balance: {balance} ETH</p>
      <p>Connected Chain Balance: {balance2} ETH</p>

      {<p className="error">{error}</p>}
    </div>
  );
};

export default BalanceChecker;
