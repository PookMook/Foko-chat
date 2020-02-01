const effects = require('../effects/index')
const models = require('../models/index')
const veryfy = require('../helpers/jwtVerify')

module.exports = {
  Query: {
    fetchChannels: (_, {id,token}) => {
      const verif = veryfy(token,id)
      const payload = models.fetchChannels(verif.id)
      return payload
    },
    loadChannel:async (_, args)=> {
      const verif = veryfy(args.token,args.id)
      const channel = models.getChannel(args.channel)
      if(!channel.users.has(models.getUser(verif.id))){
        throw new Error('You need to be a participant')
      }
      //fetch Channel from Mongo
      const fetchedChannel = await models.loadChannel(args.channel)
      return {id:fetchedChannel._id, name:fetchedChannel.name, events:fetchedChannel.events}
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
    autoLog: async (_,args)=> {
      const payload = await models.autoLog(args)
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
    },
    recoverPassword: async (_, {email}) => {
      //Find if user exists
      const foundUser = await models.findUserByEmail(email)
      if(!foundUser){
        return {confirm:false}
      }

      //User exists, trigger sendEmail
      effects.recoverPassword({to:email,username:foundUser._doc.username,id:foundUser.id})
      return {confirm:true}
    },
    testRecover: async (_, args) =>{
      return await models.testRecoverPassword(args)
    },
    inviteToChannel: async (_,args,{ pubsub }) => {
      const token = veryfy(args.token,args.id)
      const success = await models.inviteToChannel({channel:args.channel,email:args.email,author:token.id,pubsub})
      effects.messageToUser(success.event,pubsub)
      effects.inviteToChannel(success.email)
      return success
    }
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