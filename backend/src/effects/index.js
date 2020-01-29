const memory = require('../models/memory')

module.exports = {
  messageToUser: (event,pubsub) => {
  //Fetch Users in event.channel
  const targetChannel = memory.channels[event.channel]
  if(targetChannel){
      const participants = targetChannel.users
      //Dispatch to Each User
      for(let i=participants.length;i>0;i--){
        pubsub.publish(participants[i-1].id, { user: { ...event } })
      }
    }
  }
}