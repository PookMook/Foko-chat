const effects = require('../effects/index')

module.exports = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
  Mutation:{
    sendMessage: (_, {channel,message},{pubsub}) => {
      const id = Math.random().toString(36).substring(2, 15)
      const event = {type:"message",message, id, channel, channelName:channel}
      effects.messageToUser(event,pubsub)
      //
      return event
    }
  },
  Subscription: {
    user: {
      subscribe: (_, args, { pubsub }) => {
        const user = args.id
        return pubsub.asyncIterator(user)
      },
    },
  }
}