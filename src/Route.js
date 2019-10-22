import React, { Component } from 'react';
import './App.css'
import { Route, Switch, Router } from 'react-router-dom';
import history from './History';
// import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Notfound from './components/notFound';


class Routers extends Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={SignUp} />
                    <Route path="/SignUp" component={SignUp} />
                    <Route path="*" component={Notfound} />
                </Switch>
            </Router>
        )

    }
}

export default Routers;