import './App.css';
import React, { Component } from 'react';
import { Contract, ethers, utils } from 'ethers';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Lottery from "./abis/Lottery.json";
import Navbar from './components/NavBar';
import LotteryContent from './components/Lottery';
import { parseUnits } from 'ethers/lib/utils';
import StarsCanvas from './components/StarsCanvas';

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

    this.setState({ provider, accounts, signer, isConnected });
    
    if(isConnected && signer) {
      await this.loadLottery();
    }
    console.log('state', this.state);
  }
  
  loadLottery = async () => {
    const lotteryAddress = '0xd470b08280dAb2713BD918A66E26ce3E9fdC406D';
    const lotteryContract = new Contract(lotteryAddress, new utils.Interface(Lottery.abi), this.state.signer);

    this.setState({ lotteryContract });
  };
  
  enterLottery = async () => {
    let entryFee = await this.state.lotteryContract.getEntranceFee();
    entryFee = parseUnits("1", "gwei").add(entryFee);
    const tx = await this.state.lotteryContract.enterLottery({value: entryFee})
    const reciept = await tx.wait();
    console.log(reciept);
    console.log("Entered Lottery");
  }

  getBalance = async (address) => {
    const balance = await this.state.provider.getBalance(address);

    return balance.toString();
  }
  
  render() {    
    const theme = createTheme({
      palette: {
        mode: 'light',
      },
    });

    return (
      this.state.lotteryContract ?
      <ThemeProvider theme={theme}>
        <div className='app'>
          <Navbar accounts={this.state.accounts} onConnect={this.loadMetaMask}/>
          <iframe title='lotterySeaAnimation' src='https://my.spline.design/untitled-242a0ebc2034a8d370c50748a6f072a7/'></iframe>
          <Container maxWidth="md" sx={{ pt: 5 }}>
            <LotteryContent lotteryContract={this.state.lotteryContract} enterLottery={this.enterLottery} getBalance={this.getBalance}/>
          </Container>
        </div>
      </ThemeProvider>
      :
      <div  className='canvasWrapper'>
        <StarsCanvas onConnect={this.loadMetaMask}/>
      </div>
    );
  }
}

export default App;
