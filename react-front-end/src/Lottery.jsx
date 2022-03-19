import { Button } from '@mui/material';
import React, { Component } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

class LotteryContent extends Component {
  state = {
    lotteryBalance: "",
    lotteryState: "",
    lotteryEntranceFee: "",
    maxPlayers: "",
    totalPlayersJoined: "",
    winner: ""
  }
  
  getLotteryBalance = async () => {
    const lotteryBalance = (await this.props.getBalance(this.props.lotteryContract.address)).toString();
    this.setState({ lotteryBalance });
  }

  getLotteryState = async () => {
    const lotteryState = await this.props.lotteryContract.getLotteryState();
    this.setState({ lotteryState });
  }

  getLotteryEntranceFee = async () => {
    const lotteryEntranceFee = (await this.props.lotteryContract.getEntranceFee()).toString();
    this.setState({ lotteryEntranceFee });
  }

  getMaxPlayers = async () => {
    const maxPlayers = (await this.props.lotteryContract.maxPlayers()).toString();
    this.setState({ maxPlayers });
  }

  getTotalPlayersJoined = async () => {
    const totalPlayersJoined = (await this.props.lotteryContract.totalPlayersJoined()).toString();
    this.setState({ totalPlayersJoined });
  }

  getWinner = async () => {
    const winner = (await this.props.lotteryContract.winner()).toString();
    this.setState({ winner });
  }

  render() {
    
    return ( 
      <div>
        { 
          this.props.lotteryContract ?
          <div>
            <span>Lottery Balance: {this.state.lotteryBalance}</span>
            <Button variant="contained" size='small' style={{backgroundColor: '#2196f3'}} onClick={this.getLotteryBalance} sx={{ ml: 3 }}>
              Refresh Balance <RefreshIcon/> 
            </Button>
            <br/><br/>
            
            <span>Lottery State: {this.state.lotteryState}</span>
            <Button variant="outlined" color="primary" size='small' onClick={this.getLotteryState} sx={{ ml: 3 }}>
              Refresh State <RefreshIcon/>
            </Button>
            <br/><br/>
            
            <span>Lottery Entrance Fee in wei: {this.state.lotteryEntranceFee}</span>
            <Button variant="contained" size='small' style={{backgroundColor: '#2196f3'}} onClick={this.getLotteryEntranceFee} sx={{ ml: 3 }}>
              Refresh Entry Fee <RefreshIcon/>
            </Button>
            <br/><br/>
            
            <span>Max players that can join: {this.state.maxPlayers}</span>
            <Button variant="contained" size='small' style={{backgroundColor: '#2196f3'}} onClick={this.getMaxPlayers} sx={{ ml: 3 }}>
              Refresh Maxplayers <RefreshIcon/>
            </Button>
            <br/><br/>

            <span>Total players joined: {this.state.totalPlayersJoined}</span>
            <Button variant="contained" size='small' style={{backgroundColor: '#2196f3'}} onClick={this.getTotalPlayersJoined} sx={{ ml: 3 }}>
              Refresh joined players <RefreshIcon/>
            </Button>
            <br/><br/>

            <span>Winner: {this.state.winner}</span>
            <Button variant="contained" size='small' style={{backgroundColor: '#2196f3'}} onClick={this.getWinner} sx={{ ml: 3 }}>
              Refresh Winner <RefreshIcon/>
            </Button>
            <br/><br/>

            <Button variant="outlined" size='small' color="primary" onClick={this.props.enterLottery}>Enter Lottery</Button>
          </div>
          : <h2>Lottery is not connected :(</h2>
        }
      </div>
    );
  }
}

export default LotteryContent;