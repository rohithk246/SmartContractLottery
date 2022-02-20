import './App.css';
import { Component } from 'react';
import { ethers } from 'ethers';
import { Button } from '@material-ui/core';

class App extends Component {

  async loadMetaMask () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    console.log(provider, signer)
    console.log("Is metamask connected? ", window.ethereum.isConnected());
    return { provider, signer };
  }
  
  render() {
    return (
      <div>
        Hello world
        <Button variant="contained" color="primary" onClick={this.loadMetaMask}>Connect</Button>
      </div>
    );
  }
}

export default App;
