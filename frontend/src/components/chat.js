import React,{useState} from 'react'

import styles from './chat.module.scss'
import { useOvermind } from '../state/index';

export default (props) => {

  const {state,actions} = useOvermind()
  const [input,setInput] = useState("")
  const { match: { params } } = props;
  const thisChannel = state.channelsById.get(params.id) || {name:"Not found", events:[]}
  const handleSend= () => {
    actions.sendMessage({channel:params.id,message:input})
    setInput("")
  }

  return(
    <main className={styles.chat}>
      <header>Channel: {params.id} / {thisChannel.name}</header>
      <section>
        {thisChannel.events.map(e=><pre key={e.id}>{e.author.username} > {e.message}</pre>)}
      </section>
      <textarea value={input} onChange={e=>setInput(e.target.value)}></textarea>
      <button onClick={()=>handleSend()}>Send</button>
    </main>
  )
}