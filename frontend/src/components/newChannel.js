import React,{useState} from 'react'
import { useOvermind } from '../state'

export default () => {

  const {actions} = useOvermind()

  const [name,setName] = useState("")
  return(
    <main>
      <h1>Create new channel</h1>
      <input placeholder="Name of the channel" value={name} onChange={e=>setName(e.target.value)}/>
      <button onClick={()=>actions.createChannel(name)}>Create</button>
    </main>
  )
}