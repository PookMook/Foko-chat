import env from '../helpers/env'

const askGraphQL = (payload) => {
  return fetch(env.REACT_APP_PROTOCOL+'://'+env.REACT_APP_BACKEND,{
    method: "POST",
    mode: "cors",
    credentials: 'include', 
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload),
  }).then(response=>{
    if(!response.ok){
      throw new Error(response)
    }
    return response.json()
  })
  .then(json=>{
    if(json.errors){
      throw new Error(json.errors.map(e=>e.message).join(', '))
    }
    return json.data
  })
}

const authType = `token
id
username`

export default {
  login: (variables) => {

    //Prepare GraphQL
    const payload = {
      query:`mutation($email:String!,$password:String!){
  login(email:$email,password:$password){
    ${authType}
  }
}`,
      variables
    }
    return askGraphQL(payload)
    
  },
  register: (variables) => {
    //Prepare GraphQL
    const payload = {
      query:`mutation($email:String!,$password:String!,$username:String!){
  register(email:$email,password:$password, username:$username){
    ${authType}
  }
}`,
      variables
    }
    return askGraphQL(payload)
  },
  recoverPassword: (email)=> {
    const payload = {
      query:`mutation($email:String!){
  recoverPassword(email:$email){
    confirm
  }
}
`,
      variables:{email}
    }
    return askGraphQL(payload)
  },
  testRecover: (args)=> {
    const payload = {
      query:`mutation($token:String!,$password:String!){
  testRecover(token:$token,password:$password){
    ${authType}
  }
}
`,
      variables:args
    }
    return askGraphQL(payload)
  },

  sendMessage: (args) => {
    const payload = {
      query:`mutation($channel:ID!, $message:String!, $id:ID!, $token:String!){
  sendMessage(channel:$channel,message:$message,id:$id,token:$token){
    message
  }
}`,
      variables:args
    }
      askGraphQL(payload)
  },
  createChannel: (args) => {
    const payload = {
      query:`mutation($name:String,$id:ID!,$token:String!){
  createChannel(name:$name,participants:[],id:$id,token:$token){
    id
    name
  }
}`,
      variables:args
    }
    return askGraphQL(payload)
  },

  fetchChannels: (args) => {
    const payload = {
      query:`query($id:ID!,$token:String!){
  fetchChannels(id:$id,token:$token){
    id
    name
    events{
      message
      author{
        username
      }
    }
  }
}`,
      variables:args
    }
    return askGraphQL(payload)
  },
  loadChannel: (args) => {
    const payload = {
      query:`query($channel:ID!,$id:ID!,$token:String!){
  loadChannel(channel:$channel,id:$id,token:$token){
    id
    name
    events{
      id
      message
      author{
        username
      }
    }
  }
}`,
      variables:args
    }
    return askGraphQL(payload)
  },
  inviteToChannel: (args) => {
    const payload = {
      query:`mutation($email:String!,$channel:ID!,$id:ID!,$token:String!){
  inviteToChannel(email:$email,channel:$channel,id:$id,token:$token){
    confirm
  }
}`,
      variables:args
    }
    return askGraphQL(payload)


  },
  autoLog: (token) => {
    const payload = {
      query:`mutation($token:String!){
  autoLog(token:$token){
    ${authType}
  }
}`,
      variables:{token}
    }
    return askGraphQL(payload)
  }

}