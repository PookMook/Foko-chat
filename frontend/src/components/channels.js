import React from 'react'
import {Link} from 'react-router-dom'

import styles from './channel.module.css'
import Channel from './channel'
import ChannelOV from './channelOV'
import { useOvermind } from '../state'

export default (props) => {
  const {state} = useOvermind()
  return(
    <aside className={styles.channels}>
      <Link to={`/`}>
        <article className={styles.channel}>
          <h1>New conversation</h1>
        </article>
      </Link>
      {state.channels.map(c=><ChannelOV key={`channel-${c.id}`} {...c}/>)}
    </aside>
  )
}


