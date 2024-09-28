import { useEffect, useState } from "react";
import { ethers } from "ethers";

const useBalance = (address) => {
  const [balance, setBalance] = useState("0");
  const { provider } = useConnection();

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const res = await provider.getBalance(address);
        setBalance(ethers.formatEther(res));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();
  }, [address, provider]);

  return balance;
};
