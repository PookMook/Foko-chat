import React from 'react'
import useSubscription from '../hooks/subscription'

export default (props) => {

  const events = useSubscription(props.id)

  return(
    <article>
      <header>{props.name} ({props.id})</header>
      {events.map(e=><li key={e.id} className={e.type}>{e.message}</li>)}
    </article>
  )
}