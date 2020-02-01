import React,{useState,useEffect} from 'react'

import styles from './chat.module.scss'
import { useOvermind } from '../state/index';

export default (props) => {
  const {state,actions} = useOvermind()
  const [input,setInput] = useState("")
  const [inviteMail,setInviteMail] = useState("")
  const { match: { params } } = props;
  const thisChannel = state.channelsById.get(params.id) || {name:"Not found or loading", events:[]}
  const handleSend = () => {
    actions.sendMessage({channel:params.id,message:input})
    setInput("")
  }
  useEffect(()=>{
    actions.loadChannel(params.id)
  },[params.id,actions])
  console.log("auto-reload",state.load)

  return(
    <main className={styles.chat}>
      <header>
        <h1>{thisChannel.name}</h1>
        <input type="text" placeholder="Invite people by email" value={inviteMail} onChange={e=>setInviteMail(e.target.value)} />
        <button onClick={()=>actions.inviteToChannel({email:inviteMail,channel:params.id})}>Invite!</button>
      </header>

      <section>
        {thisChannel.events.map(e=><pre key={`event-${e.id}`}>{e.author.username} > {e.message}</pre>)}
      </section>
      <textarea value={input} onChange={e=>setInput(e.target.value)}></textarea>
      <button onClick={()=>handleSend()}>Send</button>
    </main>
  )
}