const { GraphQLServer, PubSub } = require('graphql-yoga')

const typeDefs = require('./schema/schema')
const resolvers = require('./resolvers/index')


const pubsub = new PubSub()

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })


const options = {
  cors:{
    origin: [process.env.ALLOW_CORS_FRONTEND,'http://localhost:3000'],
    allowed_methods: ["HEAD", "GET", "POST"],
    allowed_headers: ["*"],
    optionsSuccessStatus: 200,
    credentials: true,
  }
}

server.start(options, () => console.log('Server is running on localhost:4000'))