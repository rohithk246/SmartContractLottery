import React from 'react';
import './App.css';
import { ChainId, Config, DAppProvider, Kovan, Rinkeby } from '@usedapp/core';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Container } from '@material-ui/core';



const config: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: 'https://rinkeby.infura.io/v3/6edd332334d745d69b8f3a64aa3ad902',
  },
  networks: [Rinkeby, Kovan]
}

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="sm">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
