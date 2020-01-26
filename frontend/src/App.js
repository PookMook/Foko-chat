import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import useSubscription from './hooks/subscription'

import Header from './components/header'
import Chat from './components/chat'

import './App.css';

function App() {

  const events = useSubscription("1",(event)=>{console.log("Display Event",event)})

  return (
    <Router>
      <Header/>
      <main>
        <Switch>
          <Route exact path="/">
            <p>Home</p>
          </Route>
          <Route path="/about">
            <p>About</p>
          </Route>
          <Route path="/dashboard">
            <p>Dashboard</p>
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
