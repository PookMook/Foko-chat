import React,{useCallback} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import useSubscription from '../hooks/subscription'

import Header from './header'
import LastMessages from './lastMessages'
import NoMatch from './noMatch'
import Channels from './channels'
import Chat from './chat'

import './layout.scss';

function Layout() {

  const callback = useCallback((event)=>{console.log("Display Event",event)},[])
  const {events,channels} = useSubscription("1",callback)

  return (
      <Router>
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
    </Router>
  );
}

export default Layout;
