import React from 'react'
import styles from './lastMessage.module.css'

import {useOvermind} from '../state'
import Channel from './channel'

export default () => {
  const {state} = useOvermind()

  return (
    <section className={styles.events}>
      {state.events.map(e=><Channel key={`message-${e.id}`} event={e}/>)}
    </section>
  )
}