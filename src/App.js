import React, { Component } from 'react';
import Routers from './Route';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import history from './History';
import firebase from "firebase"
import Config from './config'

firebase.initializeApp(Config)

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {



  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Routers />
      </MuiThemeProvider>
    );
  }
}

export default App;
