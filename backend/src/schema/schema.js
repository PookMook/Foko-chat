module.exports = `
type Query {
  fetchChannels(id:ID!,token:String!):[Channel!]!
  loadChannel(channel:ID!,id:ID!,token:String!):Channel!
}
type Mutation{
  sendMessage(channel:ID!,message:String!,id:ID!,token:String!):Event!
  login(email:String!,password:String!):Auth!
  register(email:String!,password:String!,username:String!):Auth!
  createChannel(name:String,participants:[ID!], id:ID!, token:String!): Channel!

  recoverPassword(email:String):System
  testRecover(token:String!,password:String!):Auth!
}

type System {
  confirm:Boolean
}

type Channel {
  id:ID!
  name:String
  events:[Event!]!
}

type Auth {
  id:ID!
  token:String!
  username:String!
}
type User {
  username:String
  id:ID!
}

type Event {
  id:ID!
  channel:ID!
  channelName:String
  type:String
  message:String
  author:User!
}

type Subscription {
  user(id:ID!,token:String!):Event
}
`