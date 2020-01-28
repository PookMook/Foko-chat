import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import useSubscription from '../hooks/subscription'

import { useOvermind } from '../state/index'

import Login from './login'

import Header from './header'
import LastMessages from './lastMessages'
import NoMatch from './noMatch'
import Channels from './channels'
import Chat from './chat'

import './app.css';

function App() {

  const {events,channels} = useSubscription("1",(event)=>{console.log("Display Event",event)})

  const {state,_} = useOvermind()
  const isLoggedIn = state.matches({login:{SUCCESS:true}})
  const notAuth = state.matches({login:{UNAUTH:true}})

  return (
    <>
      {notAuth && <Login />}
      {isLoggedIn && <Router>
        <Header/>
        <LastMessages events={events}/>
        <Channels channels={channels}/>
        <main>
          <Switch>
            <Route exact path="/">
              <p>Home</p>
            </Route>
            <Route path="/channel/:id" component={Chat}/>
            <Route component={NoMatch} />
          </Switch>
        </main>
      </Router>}
    </>
  );
}

export default App;
