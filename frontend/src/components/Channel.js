import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'

export default (props) => {
  const event = props.event
  return(
    <Link to={`/channel/${event.channel}`}><article className={styles.channel}>
      <h1>{event.channelName}</h1>
        <p>{event.author.username} > {event.message}</p>
    </article></Link>
  )
}