import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'

export default (props) => {
  return(
    <Link to={`/channel/${props.id}`}><article className={styles.channel}>
      <h1>{props.name}</h1>
      {props.events && props.events[0] && <p>{props.events[0].author.username} > {props.events[0].message}</p>}
    </article></Link>
  )
}