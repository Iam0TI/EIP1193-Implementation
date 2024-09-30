import { useWalletConnect } from "./context/walletConnectContext";
import "./walletConnect.css";

const WalletConnet = () => {
  console.log("WalletConnect component is rendering");

  const {
    errorMessage,
    defaultAccount,
    userBalance,
    chainId,
    connButtonText,
    disconnectButtonText,
    connectWalletHandler,
    disconnectWalletHandler,
  } = useWalletConnect();

  return (
    <div className="WalletConnect">
      <h4>{"Let's connect to MetaMask using window.ethereum methods"}</h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <button onClick={disconnectWalletHandler}>{disconnectButtonText}</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      <div className="networkDisplay">
        <h3>ChainId: {chainId}</h3>
      </div>
      {errorMessage}
    </div>
  );
};

export default WalletConnet;
