import {useEffect} from 'react'

import GQL from '../helpers/gql'
import env from '../helpers/env'

export default ({id,token},callback) => {
  
  //Connect to a Chat Websocket
  useEffect(()=>{

    //Open WS connection to GraphQL
    const backend = env.REACT_APP_BACKEND
    const protocol = env.REACT_APP_SOCKET_PROTOCOL
        
    let keepAlive 
    const webSocket = new WebSocket(protocol+"://"+backend, "graphql-ws")
    //Define console.log as default handling of data
    //const handleData = props.handleData || console.log
    const handleData = (_,error,data) => {
      if(error){
        return
      }
      callback(data.user)
    }

    //Prepare query/variables
    const query = `subscription($id:ID!,$token:String!){
      user(id:$id, token:$token){
        id
        channel
        channelName
        type
        message
        author{
          username
        }
      }
    }`
    const variables = {
      id,
      token
    }
    


    //Behavior on responses
    webSocket.onmessage = event => {
      const data = JSON.parse(event.data) 
      switch (data.type) {
        case GQL.CONNECTION_ACK: {
          webSocket.send(JSON.stringify({
            type: GQL.START,
            id:id,
            payload: { query, variables}
          }))
          keepAlive = setInterval(()=>{
            webSocket.send(JSON.stringify({
              type: GQL.CONNECTION_KEEP_ALIVE,
              id:id
            }))
          },25000)
          break
        }
        case GQL.CONNECTION_ERROR: {
          console.error(data.payload)
          break
        }
        case GQL.CONNECTION_KEEP_ALIVE: {
          console.log("Keeping alive!")
          break
        }
        case GQL.DATA: {
          handleData(data.id, data.payload.errors, data.payload.data)
          break
        }
        case GQL.COMPLETE: {
          //console.log('completed', data.id)
          break
        }
        default: {
          console.log("unknown Message :",data)
        }
      }
    }

    //On opening, send Auth informations
    webSocket.onopen = () => {
      webSocket.send(JSON.stringify({
        type: GQL.CONNECTION_INIT,
        // TODO add auth infos
        payload: {}
      }))
            
    }
    
    //return the cleanup function for useEffect
    return () => {
      webSocket.close()
      clearInterval(keepAlive)
    }
    
  },[id,token,callback])
}