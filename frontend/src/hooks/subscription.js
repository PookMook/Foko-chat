import {useEffect} from 'react'

import GQL from '../helpers/gql'

export default ({id,token},callback) => {
  
  //Connect to a Chat Websocket
  useEffect(()=>{

    //Open WS connection to GraphQL
    const backend = process.env.REACT_APP_BACKEND || "localhost:3080"
    const protocol = process.env.REACT_APP_SOCKET_PROTOCOL || "ws"
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
          break
        }
        case GQL.CONNECTION_ERROR: {
          console.error(data.payload)
          break
        }
        case GQL.CONNECTION_KEEP_ALIVE: {
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
    return () => webSocket.close()
    
  },[id,token,callback])
}