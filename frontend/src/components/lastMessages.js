import React from 'react'
import styles from './lastMessage.module.css'

import Channel from './channel'

export default ({events}) => {
  return (
    <section className={styles.events}>
      {events.map(e=><Channel key={`message-${e.id}`} event={e}/>)}
    </section>
  )
}