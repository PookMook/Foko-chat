const models = require('../models/index')
const mail = require('./mail')

module.exports = {
  ...mail,
  messageToUser: (event,pubsub) => {


    models.addEvent(event);


    //Fetch Users in event.channel
    const targetChannel = models.getChannel(event.channel)
    if(targetChannel){
      event.channelName = targetChannel.name
      //populate Author
      event.author = models.getUser(event.author)
      targetChannel.events = [event]
      
      //Dispatch to Each User
      const participants = targetChannel.users
      for(let user of participants){
        pubsub.publish(user.id, { user: { ...event } })
      }
    }
  }
}