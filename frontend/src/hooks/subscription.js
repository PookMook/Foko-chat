import {useReducer, useEffect} from 'react'

import GQL from '../helpers/gql'

export default (userID,callback) => {
  const [events,addEvent] = useReducer((events, newEvent) => {
    //bring new element to the top
    return [...events,newEvent];
  }, []);

  const [channels,addToChannel] = useReducer((channels, newEvent) => {
    //Test if channel exist
    let channel = channels.find(c=>c.id===newEvent.channel)
    if(channel){
      //Need to remove it from array, to place it on top
      const index = channels.indexOf(channel)
      channels.splice(index,1)
    }
    else{
      //Create channel structure
      channel = {name:newEvent.channelName,id:newEvent.channel,events:[]}
    }
    channel.events.unshift(newEvent)
    return [channel, ...channels]
  }, [])


  //Connect to a Chat Websocket
  useEffect(()=>{

    //Define console.log as default handling of data
    //const handleData = props.handleData || console.log
    const handleData = (_,error,data) => {
      if(error){
        return
      }
      addEvent(data.user)
      addToChannel(data.user)
      callback(data.user)
    }


    //Open WS connection to GraphQL
    const backend = process.env.BACKEND || "localhost:3030"
    const webSocket = new WebSocket("ws://"+backend, "graphql-ws")

    //Prepare query/variables
    const query = `subscription($id:ID!){
      user(id:$id){
        id
        channel
        channelName
        type
        message
      }
    }`
    const variables = {
      "id":userID
    }
    
    //Behavior on responses
    webSocket.onmessage = event => {
      const data = JSON.parse(event.data)  
      switch (data.type) {
        case GQL.CONNECTION_ACK: {
          webSocket.send(JSON.stringify({
            type: GQL.START,
            id:userID,
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
    
    
    
  },[])

  return {events,channels}
}