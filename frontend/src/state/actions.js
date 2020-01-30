import {authForm,user} from './state'

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
  },


  //SignOut
  signout:({state}) => {
    //Wipe state.user
    state.user = user
  },


  //Channel management
  sendMessage: ({state,effects},args)=> {
    effects.sendMessage({...args,id:state.user.id,token:state.user.token})

  }
}