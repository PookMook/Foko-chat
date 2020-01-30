const effects = require('../effects/index')
const models = require('../models/index')
const veryfy = require('../helpers/jwtVerify')

module.exports = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    fetchChannels: (_, {id,token}) => {
      const verif = veryfy(token,id)
      const payload = models.fetchChannels(verif.id)
      return payload
    }
  },
  Mutation:{
    sendMessage: (_, {channel,message,id,token},{pubsub}) => {
      //Need to verify author
      const verif = veryfy(token,id)
      const idR = Math.random().toString(36).substring(2, 15)
      const event = {type:"message",message, id:idR, channel, author:verif.id}
      effects.messageToUser(event,pubsub)
      return event
    },
    login: async (_, args) => {
        const payload = await models.login(args)
        return payload //{token,id,username}
    },
    register: async (_, args) => {
        const payload = await models.register(args)
        return payload //{token,id,username}
    },
    //changeUsername
    //changePassword
    createChannel: async (_, args) => {
      const token = veryfy(args.token,args.id)
      const payload = await models.createChannel({name:args.name,participants:[...args.participants, token.id]})
      return payload
    }
    //LoadChannels
  },
  Subscription: {
    user: {
      subscribe: (_, args, { pubsub }) => {
        //check if subscription is legit allowed
        const token = veryfy(args.token,args.id)
        return pubsub.asyncIterator(token.id)
      },
    },
  }
}