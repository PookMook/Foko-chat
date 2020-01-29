module.exports = `
type Query {
  hello(name: String): String!
}
type Mutation{
  sendMessage(channel:ID!,message:String!):Event!
}

type Event {
  id:ID!
  channel:ID!
  channelName:String
  type:String
  message:String
}

type Subscription {
  user(id:ID!):Event
}
`