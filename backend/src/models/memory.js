//Preload information
const users = new Map()
users.set('5e31ecd9d410a2011d74655c',{id:'5e31ecd9d410a2011d74655c',username:"Arthur",email:"arthur@juchereau.com", channels:[]})

const channels = new Map()

channels.set('xylo',{id:"xylo",users:new Set([
  users.get('5e31ecd9d410a2011d74655c')
])})
channels.set('Xylo',{id:"Xylo",users:new Set([
  users.get('5e31ecd9d410a2011d74655c')
])})


module.exports = {
  users,
  channels
}