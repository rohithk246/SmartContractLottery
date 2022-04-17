import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import './NavBar.css';

const Navbar = ({accounts, onConnect}) => {
    return (
      <AppBar position="static" className='navBar' sx={{ mx: 'auto', mb: 2 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, ml: 2, mr: 15 }}
        >
          Lottery Dapp
        </Typography>
        { 
          accounts?.length ?
          <IconButton
            size="small"
            edge="start"
            color="primary"
            aria-label="open drawer"
            onClick={() => {alert("Wallet is connected. Please use metamask if you want to disconnect wallet!")}}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
          :
          <Button variant="contained" style={{backgroundColor: '#2196f3'}} onClick={onConnect}>Connect</Button>
        }
        </Toolbar>
      </AppBar>
    );
}
 
export default Navbar;