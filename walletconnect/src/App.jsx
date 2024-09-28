import "./App.css";
import BalanceChecker from "./BalanceChecker";
import WalletConnect from "./WalletConnet";

function App() {
  return (
    <>
      <div>
        <WalletConnect />
        <BalanceChecker />
      </div>
    </>
  );
}
export default App;
