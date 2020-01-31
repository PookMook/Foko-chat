import React from 'react'

import { useOvermind } from '../state/index'
import styles from './login.module.scss'

export default ()=> {

  const {state,actions} = useOvermind()

  return(
    <main className={styles.login}>
      <h1>Recover Password</h1>
      <textarea value={state.modal.token} placeholder="Paste the token received in the email"  onChange={e=>actions.filloutRecovering({target:"token",value:e.target.value})}/>
      <input value={state.modal.password} onChange={e=>actions.filloutRecovering({target:"password",value:e.target.value})} type="password" placeholder="New password"/>
      <input value={state.modal.passwordConfirm} onChange={e=>actions.filloutRecovering({target:"passwordConfirm",value:e.target.value})} type="password" placeholder="Confirm password"/>
      <button className={state.actions.sendRecover?"primary":null} disabled={!state.actions.sendRecover}>Submit</button>
      <p><span onClick={()=>actions.cancelRecover()}>or cancel</span></p>
    </main>
  )

}