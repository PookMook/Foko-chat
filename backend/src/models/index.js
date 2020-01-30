const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const memory = require('./memory')
const mongo = require('./mongo')

const sortIDs = require('../helpers/sortIDs')



//need to load mongo => memory on load + creating indexes
const init = async () => {

  console.log("Loading Users") 
  const users = await mongo.Users.find()
  const filteredUsers = users.map(u=>({...u._doc,id:u.id,password:undefined, channels:new Set()}))
  memory.users = new Map()
  for(let i=0;i<filteredUsers.length;i++){
    console.log("loading: ",filteredUsers[i].username)
    memory.users.set(filteredUsers[i].id.toString(),filteredUsers[i])
  }

  console.log("Loading Channels")
  
  const channels = await mongo.Channels.find()
  //Populate in memory the last event of each channel
  for(const channel of channels){
    await channel.populate({path:'events',options:{limit:1,sort:{createdAt:-1}}}).execPopulate()
  }

  const filteredChannels = channels.map(c=>({
    ...c._doc,
    id:c.id
  }))
  memory.channels = new Map()
  for(let i=0;i<filteredChannels.length;i++){
    console.log("loading: ",filteredChannels[i].name)
    const participants = filteredChannels[i].participants

    //inject author into the loaded event, need to recreate the event object
    const author = memory.users.get(filteredChannels[i].events[0].author.toString())
    const event = {author,type:filteredChannels[i].events[0].type,message:filteredChannels[i].events[0].message}
    filteredChannels[i].events = [event]

    filteredChannels[i].users = new Set()
    for(let o=0;o<participants.length;o++){
      const user = memory.users.get(participants[o].toString())
      user.channels.add(filteredChannels[i])
      filteredChannels[i].users.add(user)
    }
    //Load users into participants
    memory.channels.set(filteredChannels[i].id.toString(),filteredChannels[i])
  }

  //console.log(memory.users)

}
init()


module.exports = {
  //Get from memory
  getChannel:(id)=>{
    return memory.channels.get(id)
  },
  getUser:(id)=>{
    return memory.users.get(id)
  },
  fetchChannels:(id)=>{
    return [...memory.users.get(id).channels]
  },

  //mix Memory + mongo
  register:async ({email,password,username})=> {
    //Check if email not already in
    const fetchedUser = await mongo.Users.findOne({email})
    if(fetchedUser){
      throw new Error('Email already taken')
    }

    //generate hash of the password
    const passwordHash = bcrypt.hashSync(password,10)

    //if not, add to mongo
    const createdUser = await mongo.Users.create({email,password:passwordHash,username})
    
    //Push to memory and return payload
    const payload = {
      id:createdUser.id,
      email,
      username,
      channels:new Set()
    }
    memory.users.set(createdUser.id,payload)

    return {...payload,token:jwt.sign(payload,process.env.JWT_SECRET_TOKEN)}
  },
  login: async ({email,password}) => {
    //Find user
    const fetchedUser = await mongo.Users.findOne({email})
    if(!fetchedUser){
      throw new Error('Email not found')
    }

    //check password
    if(!bcrypt.compareSync(password, fetchedUser._doc.password)){
      throw new Error('bad Password')
    }

    //send token
    const payload = {
      id:fetchedUser.id,
      email:fetchedUser._doc.email,
      username:fetchedUser._doc.username,
      channels:fetchedUser._doc.channels
    }
    
    return {...payload,token:jwt.sign(payload,process.env.JWT_SECRET_TOKEN)}

  },

  //Full mongo
  createChannel: async ({name,participants}) => {
    //Search if channel doesn't already exists
    const sortedParticipants = participants.sort(sortIDs)

    // TODO see if channel doesn't already exist
    
    //Add to mongo
    const createdChannel = await mongo.Channels.create({name,participants:sortedParticipants})

    //add to memory
    const payload = {
      id:createdChannel.id,
      name:createdChannel._doc.name,
    }
    memory.channels.set(createdChannel.id,payload)
    //Add Users to channel, and channel to Users
    payload.users=sortedParticipants.map(p=>{
      const user = memory.users.get(p)
      console.log("Adding channels to user: ",user)
      user.channels.add(payload)
      return user
    })
    

    return payload

  },

  addEvent: (event) => {
    //Save event + update channel in mongo
    mongo.Events.create(event)
    .then(event => {
      mongo.Channels.update(
        { _id: event._doc.channel }, 
        { $push: { events: event.id } })
        .then(res=>console.log("updating channel",res)) 
    })
  },

  loadChannel: async (id) => {
    //return mongo.Channels.findOne({id})
    const channel = await mongo.Channels.findOne({_id:id}).populate({path: 'events',populate: {path: 'author', model: 'User' }})
    return channel
  }


}