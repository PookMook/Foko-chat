import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'

export default (props) => {
  return(
    <Link to={`/channel/${props.channel}`}><article className={styles.channel}>
      <h1>{props.channelName}</h1>
        <p>{props.author} > {props.message}</p>
    </article></Link>
  )
}