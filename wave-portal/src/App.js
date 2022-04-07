import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [isAccountConnected, setIsAccountConnected] = useState(true);
  const [allWaves, setAllWaves] = useState([]);
  const [messsage, setMessage] = useState("");

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

  const contractAddress = "0x63DeDABA09Da4886771379cFA26f213EEA55F645";
  const contractABI = abi.abi;

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log(count);

        const waveTxn = await wavePortalContract.wave(messsage);

        await waveTxn.wait();

        count = await wavePortalContract.getTotalWaves();
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

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            👋 Hey there!
          </div>

          <div className="bio">
            I am Parth and I worked as a Full-Stack Developer? Connect your Ethereum wallet and wave at me!
          </div>

          <div>
            <input type="text" onChange={(e) => handleChange(e)} />
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allWaves != null &&
            allWaves.length > 0 &&
            allWaves.map((wave, index) => {
              return (
                <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>)
            })}
        </div>
      </div>
    </div>
  );
}

export default App;