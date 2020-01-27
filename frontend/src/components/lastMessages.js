import React from 'react'
import styles from './lastMessage.module.css'

export default ({events}) => {
  return (
    <ul className={styles.events}>
      {events.map(e=><li key={e.id}>{JSON.stringify(e)}</li>)}
    </ul>
  )
}