const users = {
  1:{
    id:1,
    name:"Arthur"
  }
}

const channels = {
  xylo:{
    id:"xylo",
    users:[users["1"]]
  },
  Xylo:{
    id:"Xylo",
    users:[users["1"]]
  },
}

module.exports = {
  users,
  channels
}