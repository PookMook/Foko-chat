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
import NewChannel from './newChannel'

import './layout.scss';

function Layout() {

  const {state,actions} = useOvermind()
  const callback = useCallback((event)=>{actions.handleEvent(event)},[])
  useSubscription(state.user,callback)

  return (
    <Router>
      <Header/>
      <LastMessages/>
      <Channels />
      <Switch>
        <Route exact path="/">
          <NewChannel />
        </Route>
        <Route path="/channel/:id" component={Chat}/>
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default Layout;
