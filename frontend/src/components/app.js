import React, {useEffect} from 'react';

import { useOvermind } from '../state/index'

import Login from './login'
import Layout from './layout'
import RecoveringPassword from './recoveringPassword'
import RecoverPassword from './recoverPassword'
import AutoLog from './autoLog'

function App() {

  const {state,actions} = useOvermind()
  const isLoggedIn = state.matches({login:{SUCCESS:true}})
  const isRecover = state.matches({login:{RECOVER_PASSWORD:true}})
  const isRecovering = state.matches({login:{RECOVERING:true}})
  const isSendingRecover = state.matches({login:{SENDING_RECOVER:true}})
  const isInvited = state.matches({login:{INVITED:true}})
  const isAutoLoging = state.matches({login:{AUTOLOG:true}})
  const isLogining = !(isLoggedIn || isRecovering || isInvited || isRecover || isSendingRecover || isAutoLoging)

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
    if(from === "autoLog"){
      actions.autoLog(urlParams.get('token'))
    }

  },[])

  return (
    <>
      {isLoggedIn && <Layout />}
      {isRecover && <RecoverPassword />}
      {isRecovering && <RecoveringPassword />}
      {isSendingRecover && <RecoveringPassword/>}
      {isAutoLoging && <AutoLog />}
      {isLogining && <Login />}
    </>
  );
}

export default App;
