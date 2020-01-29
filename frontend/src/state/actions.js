export default {
  fillout: ({state},{target,value}) => {
    state.authForm[target] = value
  },


  //Login
  login: ({state,effects,actions}) => {
    //Try to login
    effects.login({password:state.authForm.password, email:state.authForm.email})
    .then((response)=>{
      actions.successLogin(response)
    })
    .catch(e=>{
      actions.failLogin()
    })
  },
  failLogin: () => {
    
  },
  successLogin: () => {

  },


  //Register
  register:({state,actions,effects}) => {
    effects.register({...state.authForm})
    .then((response)=>{
      actions.successRegister(response)
    })
    .catch(e=>{
      actions.failRegister()
    })
  },
  failRegister: () => {

  },
  successLogin: () => {

  },
}