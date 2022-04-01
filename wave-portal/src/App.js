import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [isAccountConnected, setIsAccountConnected] = useState(true);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure to connect metamask!");
      }
      else {
        console.log("We have ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        setIsAccountConnected(false);
      }
      else {
        console.log("No accounts found");
        setIsAccountConnected(true);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    }
    catch (error) {
      console.log(error);
    }
  };

  const contractAddress = "0x54F8d9de142620Fb1E3a832E5A39b5e48f3D3Cd3";
  const contractABI = abi.abi;

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.totalNumberWaves();
        console.log(count);

        const waveTxn = await wavePortalContract.wave();

        await waveTxn.wait();

        count = await wavePortalContract.totalNumberWaves();
        console.log(count);
      }
      else {
        console.log("Ethereum Object doesn't exist");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      {isAccountConnected && <div>No authorized Account Found</div>}
      {!currentAccount && <button onClick={connectWallet}>Connect Wallet</button>}
      <button className="waveButton" onClick={wave}>Wave at Me</button>
    </div>
  );
}

export default App;