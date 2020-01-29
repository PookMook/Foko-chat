import React from 'react';

import { useOvermind } from '../state/index'

import Login from './login'
import Layout from './layout'

function App() {

  const {state} = useOvermind()
  const isLoggedIn = state.matches({login:{SUCCESS:true}})
  const notAuth = state.matches({login:{SUCCESS:false}})

  return (
    <>
      {notAuth && <Login />}
      {isLoggedIn && <Layout />}
    </>
  );
}

export default App;
