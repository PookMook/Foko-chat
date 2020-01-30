const models = require('../models/index')

module.exports = {
  messageToUser: (event,pubsub) => {
  //Fetch Users in event.channel
  const targetChannel = models.getChannel(event.channel)
  if(targetChannel){

      //populate Author
      event.author = models.getUser(event.author)

      //Dispatch to Each User
      const participants = targetChannel.users
      for(let user of participants){
        pubsub.publish(user.id, { user: { ...event } })
      }
    }
  }
}