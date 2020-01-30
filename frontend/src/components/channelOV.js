import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'

export default (props) => {
  return(
    <Link to={`/channel/${props.id}`}><article className={styles.channel}>
      <h1>{props.name}</h1>
    </article></Link>
  )
}