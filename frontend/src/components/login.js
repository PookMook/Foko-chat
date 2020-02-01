import React from 'react'

import { useOvermind } from '../state/index'

import styles from './login.module.scss'

export default () => {
  const {state,actions} = useOvermind()

  const sending = state.matches({login:{AUTHENTICATING:true}})
  const error = state.matches({login:{ERROR:true}})

  return(
    <main className={styles.login}>
      <h1>Sign in</h1>
      <input placeholder="email" value={state.authForm.email} onChange={e=>actions.fillout({target:"email",value:e.target.value})}/>
      <input type="password" placeholder="password" value={state.authForm.password} onChange={e=>actions.fillout({target:"password",value:e.target.value})} />
      <button className={state.actions.login?"primary":null} disabled={!state.actions.login} onClick={()=>actions.login()}>{sending?'Sending...':error?'Error':'Sign-in'}</button>
      <h2>Or register</h2>
      <input type="password" placeholder="Confirm password" value={state.authForm.passwordConfirm} onChange={e=>actions.fillout({target:"passwordConfirm",value:e.target.value})} />
      <input placeholder="Username" value={state.authForm.username} onChange={e=>actions.fillout({target:"username",value:e.target.value})} />
      <button className={state.actions.register?"primary":null} disabled={!state.actions.register} onClick={()=>actions.register()}>{sending?'Sending...':error?'Error':'Register'}</button>
      <p><span onClick={()=>actions.recoverPassword()}>or recover password</span></p>
    </main>
  )
}