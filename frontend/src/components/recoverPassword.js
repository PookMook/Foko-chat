import React from 'react'

import { useOvermind } from '../state/index'
import styles from './login.module.scss'

export default ()=> {

  const {state,actions} = useOvermind()

  return(
    <main className={styles.login}>
      <h1>Recover Password</h1>
      <input value={state.recover.email} onChange={e=>actions.filloutRecover({target:"email",value:e.target.value})} type="text" placeholder="Email address"/>
      <button className={state.actions.sendRecover?"primary":null} disabled={!state.actions.sendRecover} onClick={()=>actions.sendRecover()}>Submit</button>
      <p><span onClick={()=>actions.cancelRecover()}>or cancel</span></p>
    </main>
  )

}