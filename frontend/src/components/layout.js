import React,{useCallback} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import useSubscription from '../hooks/subscription'
import { useOvermind } from '../state/index';

import Header from './header'
import LastMessages from './lastMessages'
import NoMatch from './noMatch'
import Channels from './channels'
import Chat from './chat'

import './layout.scss';

function Layout() {

  const {state} = useOvermind()
  const callback = useCallback((event)=>{console.log("Display Event",event)},[])
  const {events,channels} = useSubscription(state.user,callback)

  return (
    <Router>
      <Header/>
      <LastMessages events={events}/>
      <Channels channels={channels}/>
      <Switch>
        <Route exact path="/">
          <p>Home</p>
        </Route>
        <Route path="/channel/:id" render={(props)=><Chat {...props} channels={channels}/>}/>
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default Layout;
