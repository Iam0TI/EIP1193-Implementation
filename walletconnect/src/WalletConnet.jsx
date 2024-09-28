import useWalletConnect from "./useWalletConnect";
import "./walletConnect.css";

const WalletConnect = () => {
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
      <h4>{"Boys let's connect to MetaMask using window.ethereum methods"}</h4>
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

export default WalletConnect;
