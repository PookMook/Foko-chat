import React, {useEffect} from 'react';

import { useOvermind } from '../state/index'

import Login from './login'
import Layout from './layout'
import RecoveringPassword from './recoveringPassword'
import RecoverPassword from './recoverPassword'

function App() {

  const {state,actions} = useOvermind()
  const isLoggedIn = state.matches({login:{SUCCESS:true}})
  const isRecover = state.matches({login:{RECOVER_PASSWORD:true}})
  const isRecovering = state.matches({login:{RECOVERING:true}})
  const isInvited = state.matches({login:{INVITED:true}})
  const isLogining = !(isLoggedIn || isRecovering || isInvited || isRecover)

  useEffect(()=>{
    //Recovery/invite are not the main driver here so can be second-class citizen (aka reprint from the login form)
    const urlParams = new URLSearchParams(window.location.search);
    if(!urlParams.has('from') || !urlParams.has('token')){
      //early return,nothing to see here
      return
    }
    const from = urlParams.get('from')
    if(from === "passwordRecovery"){
      actions.recovering(urlParams.get('token'))
    }

  },[])

  return (
    <>
      {isLoggedIn && <Layout />}
      {isRecover && <RecoverPassword />}
      {isRecovering && <RecoveringPassword />}
      {isLogining && <Login />}
    </>
  );
}

export default App;
