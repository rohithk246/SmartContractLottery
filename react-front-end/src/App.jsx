import './App.css';
import React, { Component } from 'react';
import { Contract, ethers, utils } from 'ethers';
import { Container } from '@mui/material';
import Lottery from "./abis/Lottery.json";
import Navbar from './components/NavBar';

class App extends Component {
  state = {
    provider: null,
    signer: null,
    accounts: [],
    isConnected: false,
    lotteryContract: null
  };

  loadMetaMask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const isConnected = window.ethereum.isConnected();
    let lotteryContract = null;

    if(isConnected && signer) {
      lotteryContract = this.loadLottery();
    }

    this.setState({ provider, accounts, signer, isConnected, lotteryContract });
    console.log('state', this.state);
  }
  
  loadLottery = async () => {
    const lotteryAddress = '0x38E34b2aB00E879ED0F87C7360fa0994A6fB2bdc';
    const lotteryContract = new Contract(lotteryAddress, new utils.Interface(Lottery.abi), this.state.signer);
    const lotteryBalance = await this.state.provider.getBalance(lotteryAddress);

    console.log('lottery balance: ', lotteryBalance.toString());
    console.log('lottety state: ', await lotteryContract.getLotteryState());
    console.log('lottety entranceFee in wei: ', (await lotteryContract.getEntranceFee()).toString());
    // console.log('Enter lottery: ', await lotteryContract.enterLottery({value: 5000000000000000}))

    return lotteryContract;
  };
  
  render() {
    return (
      <div>
        <Navbar accounts={this.state.accounts} onConnect={this.loadMetaMask}/>
        <Container maxWidth="sm" sx={{ pt: 5 }}>
        
        </Container>
      </div>
    );
  }
}

export default App;
