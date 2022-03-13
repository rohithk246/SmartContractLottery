import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({accounts, onConnect}) => {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          Smart Lottery
        </Typography>
        { 
          accounts?.length ?
          <Button variant="contained" color="secondary" onClick={() => {alert("Please disconnect accounts using metamask")}}>Disconnect</Button> :
          <Button variant="contained" style={{backgroundColor: '#2196f3'}} onClick={onConnect}>Connect</Button>
        }
        </Toolbar>
      </AppBar>
    );
}
 
export default Navbar;