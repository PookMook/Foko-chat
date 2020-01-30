import {authForm,defaultState} from './state'

const channels = () => ([])
const channelsById = () => new Map()
const events = () => ([])

export default {

  //Form
  fillout: ({state},{target,value}) => {
    state.authForm[target] = value
  },

  //Login
  login: ({state,effects,actions}) => {
    //Try to login
    effects.login({password:state.authForm.password, email:state.authForm.email})
    .then((response)=>{
      actions.successLogin(response.login)
    })
    .catch(e=>{
      actions.failLogin()
    })
  },
  failLogin: ({state}) => {
    //Wipe state.authForm.password
    state.authForm.password = ""
    
  },
  successLogin: ({state},authType) => {
    //Wipe state.authForm
    state.authForm = JSON.parse(authForm)

    //Populate 
    state.user = authType
    state.channels = channels()
    state.channelsById = channelsById()
    state.events = events()
  },


  //Register
  register:({state,actions,effects}) => {
    effects.register({...state.authForm})
    .then((response)=>{
      console.log(response)
      actions.successRegister(response.register)
    })
    .catch(e=>{
      actions.failRegister()
    })
  },
  failRegister: () => {

  },
  successRegister: ({state},authType) => {
    //Wipe state.authForm
    state.authForm = JSON.parse(authForm)

    //Populate 
    state.user = authType
    state.channels = channels()
    state.channelsById = channelsById()
    state.events = events()
  },


  //SignOut
  signout:({state}) => {
    //Wipe state
    state = JSON.parse(defaultState)
  },


  //Channel management
  sendMessage: ({state,effects},args)=> {
    effects.sendMessage({...args,id:state.user.id,token:state.user.token})
  },
  createChannel: ({state,effects},name)=>{
    effects.createChannel({name,participants:[],id:state.user.id,token:state.user.token}).then(response=>{
      const newChannel = response.createChannel
      newChannel.events = []
      state.channels.unshift(newChannel)
      state.channelsById.set(newChannel.id,newChannel)
    })
  },

  //Init
  fetchChannels: ({state,effects}) => {
    effects.fetchChannels({id:state.user.id,token:state.user.token})
    .then(response=>{
      const channels = response.fetchChannels
      for(let i=0;i<channels.length;i++){
        //Populate empty events
        //channels[i].events = []
        state.channelsById.set(channels[i].id,channels[i])
      }
      state.channels = [...channels,...state.channels]
      state.load += 1
    })
  },

  //Event Handling
  handleEvent: ({state},event) => {
    //Test if channel exist
    let channel = state.channelsById.get(event.channel)
    if(channel){
      //Need to remove it from array, to place it on top
      const index = state.channels.indexOf(channel)
      state.channels.splice(index,1)
    }
    else{
      //Create channel structure
      channel = {name:event.channelName,id:event.channel,events:[]}
      state.channelsById.set(event.channel,channel)
    }
    channel.events.unshift(event)
    state.channels = [channel, ...state.channels]
    state.events.push(event)
  }

}