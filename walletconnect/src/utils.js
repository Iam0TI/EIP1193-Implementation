import { ethers } from "ethers";

export const readOnlyProvider = new ethers.JsonRpcProvider(
  "https://sepolia.drpc.org"
);
