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

  //AutoLog
  autoLog: ({actions,effects},token) => {
    effects.autoLog(token)
    .then(response=>{
      actions.successLog(response.autoLog)
    })
    .catch(error=>{
      console.log("error",error)
      actions.failLog()
    })
  },
  successLog: ({state},authType) => {
    //Wipe state.authForm
    state.authForm = JSON.parse(authForm)

    //Populate 
    state.user = authType
    state.channels = channels()
    state.channelsById = channelsById()
    state.events = events()

  },
  failLog: ({state})=> {
  },


  //Register
  register:({state,actions,effects}) => {
    //console.log("Starting register")
    effects.register({...state.authForm})
    .then((response)=>{
      //console.log(response)
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


  //Recover Password
  recoverPassword:({state})=>{
    state.recover = {email:""}
  },
  filloutRecover:({state},{target,value})=>{
    state.recover[target] = value
  },
  sendRecover:({state,effects})=> {
    //Effect send email here, we don't care about the callback
    effects.recoverPassword(state.recover.email)
    //add modal to the state
    state.modal = {token:"",password:"",passwordConfirm:""}

  },
  recovering:({state},token) => {
    state.modal = {token,password:"",passwordConfirm:""}
  },
  filloutRecovering:({state},{target,value}) => {
    state.modal[target] = value
  },
  cancelRecover: ({state})=>{
    state = JSON.parse(defaultState)
  },
  testRecover: ({actions,state,effects})=> {
    // TODO add Effect
    effects.testRecover({token:state.modal.token,password:state.modal.password})
    .then(response=>{
      //console.log(response)
      actions.successRecover(response.testRecover)
    })
    .catch(err=>{
      alert(err)
      actions.failRecover()
    })

  },
  successRecover:({state},authType)=>{
    //Wipe state.authForm
    state.authForm = JSON.parse(authForm)

    //Populate 
    state.user = authType
    state.channels = channels()
    state.channelsById = channelsById()
    state.events = events()
  },
  failRecover:()=>{},


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
  inviteToChannel: ({effects,state},args) => {
    effects.inviteToChannel({...args,id:state.user.id,token:state.user.token})
    .then(response=>{

    })
    .catch(err=>{
      alert(err)
    })
  },

  //Init
  fetchChannels: ({state,effects}) => {
    effects.fetchChannels({id:state.user.id,token:state.user.token})
    .then(response=>{
      const channels = response.fetchChannels
      for(let i=0;i<channels.length;i++){
        //If channel already exist, leave it be
        if(!state.channelsById.has(channels[i].id)){
          state.channelsById.set(channels[i].id,channels[i])
        }
        else{
          //if Channel already exist, need to remove from array
          //console.log("removing ",channels[i].id)
          const index = state.channels.indexOf(state.channelsById.get(channels[i].id))
          state.channels.splice(index,1)
          channels.splice(i,1)
        }
      }
      state.channels = [...channels,...state.channels]
      state.load += 1
    })
  },
  loadChannel: ({state,effects},id)=> {
    effects.loadChannel({channel:id,id:state.user.id,token:state.user.token})
    .then(response=>{
      //console.log(response.loadChannel)
      const loadedChannel = response.loadChannel
      //GraphQL send all in order
      loadedChannel.events = loadedChannel.events.reverse()
      //Replace state.channel
      const channel = state.channelsById.get(loadedChannel.id)
      if(channel){
        channel.events = loadedChannel.events
      }
      else{
        state.channelsById.set(loadedChannel.id,loadedChannel)
        state.channels = [loadedChannel,...state.channels]
      }
      state.load += 1
    })
  },

  //Event Handling
  handleEvent: ({state},event) => {
    //Test if channel exist
    let channel = state.channelsById.get(event.channel)
    if(channel){
      //Need to remove it from array, to place it on top
      //console.log("removing",channel)
      const index = state.channels.indexOf(channel)
      state.channels.splice(index,1)
      //console.log("channels",JSON.stringify(state.channels.length,null,1))
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