const { GraphQLServer, PubSub } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Mutation{
    sendMessage(channel:ID!,message:String!):Event!
  }

  type Event {
    id:ID!
    channel:ID!
    type:String
    message:String
  }
  
  type Subscription {
    channel(id:ID!): Event
    user(id:ID!):Event
  }
`

//Need to load conversations/Users/Messages from MongoDB
const users = {
  1:{
    id:1,
    name:"Arthur"
  }
}

const channels = {
  xylo:{
    id:"xylo",
    users:[users["1"]]
  }
}

const dispatchToUser = (event,pubsub) => {
  //Fetch Users in event.channel
  const targetChannel = channels[event.channel]
  if(targetChannel){
      const participants = targetChannel.users
      //Dispatch to Each User
      for(let i=participants.length;i>0;i--){
        pubsub.publish(participants[i-1].id, { user: { ...event } })
      }
  }
}

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
  Mutation:{
    sendMessage: (_, {channel,message},{pubsub}) => {
      const id = Math.random().toString(36).substring(2, 15)
      const event = {type:"message",message, id, channel}
      dispatchToUser(event,pubsub)
      //
      return event
    }
  },
  Subscription: {
    channel: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = args.id
        return pubsub.asyncIterator(channel)
      },
    },
    user: {
      subscribe: (parent, args, { pubsub }) => {
        const user = args.id
        return pubsub.asyncIterator(user)
      },
    },
  }
}

const pubsub = new PubSub()

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
server.start(() => console.log('Server is running on localhost:4000'))