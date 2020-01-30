const askGraphQL = (payload) => {
  return fetch(process.env.REACT_APP_PROTOCOL+'://'+process.env.REACT_APP_BACKEND,{
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
      throw new Error(json.map(e=>e.message).join(', '))
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
  }

}