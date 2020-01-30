import React,{useState,useEffect} from 'react'

import styles from './chat.module.scss'
import { useOvermind } from '../state/index';

export default (props) => {
  const {state,actions} = useOvermind()
  const [input,setInput] = useState("")
  const { match: { params } } = props;
  const thisChannel = state.channelsById.get(params.id) || {name:"Not found or loading", events:[]}
  const handleSend = () => {
    actions.sendMessage({channel:params.id,message:input})
    setInput("")
  }
  useEffect(()=>{
    actions.loadChannel(params.id)
  },[params.id,actions.loadChannel])
  console.log("auto-reload",state.load)

  return(
    <main className={styles.chat}>
      <header>Channel: {thisChannel.name}</header>
      <section>
        {thisChannel.events.map(e=><pre key={e.id}>{e.author.username} > {e.message}</pre>)}
      </section>
      <textarea value={input} onChange={e=>setInput(e.target.value)}></textarea>
      <button onClick={()=>handleSend()}>Send</button>
    </main>
  )
}