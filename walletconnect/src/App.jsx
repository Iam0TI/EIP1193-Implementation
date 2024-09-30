import "./App.css";
import BalanceChecker from "./BalanceChecker";
import WalletConnectProvider from "./context/walletConnectContext";
import WalletConnect from "./WalletConnet";

function App() {
  return (
    <>
      <WalletConnectProvider>
        <WalletConnect />
        <BalanceChecker />
      </WalletConnectProvider>
    </>
  );
}
export default App;
