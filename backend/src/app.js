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

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
  Mutation:{
    sendMessage: (_, {channel,message},{pubsub}) => {
      const id = Math.random().toString(36).substring(2, 15)
      const event = {type:"message",message, id}
      pubsub.publish(channel, { channel: { ...event } })
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
  }
}

const pubsub = new PubSub()

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
server.start(() => console.log('Server is running on localhost:4000'))