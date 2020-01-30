import React from 'react'

import { useOvermind } from '../state/index'

import styles from './header.module.css'

export default () => {
  const {state,actions} = useOvermind()

  return(
    <header className={styles.header}>
      <p>Hello {state.user.username}</p>
      <button onClick={()=>actions.signout()}>Sign-out</button>
    </header>
  )
}