//Export only primitives
export const authForm = JSON.stringify({
  email:"",
  password:"",
  passwordConfirm:"",
  username:""
})
export const user = null

export default {
  authForm:JSON.parse(authForm),
  user:null,
  channels:null,
  channelsById:null
}