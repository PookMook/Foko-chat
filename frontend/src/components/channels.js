import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'
import Channel from './Channel'

export default (props) => {
  return(
    <aside className={styles.channels}>
      <Link to={`/`}>
        <article className={styles.channel}>
          <h1>New conversation</h1>
        </article>
      </Link>
      {props.channels.map(c=><Channel key={`channel-${c.id}`} {...c.events[0]}/>)}
    </aside>
  )
}


