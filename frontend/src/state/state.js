//Export only primitives
export const authForm = JSON.stringify({
  email:"",
  password:"",
  passwordConfirm:"",
  username:""
})
export const user = null
export const defaultState = JSON.stringify({
  authForm:JSON.parse(authForm),
  user:null,
  channels:null,
  channelsById:null,
  events:null,
  load:0
})

export default JSON.parse(defaultState)