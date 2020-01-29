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
  }).then(async response=>{
    if(!response.ok){
      let res = await response.json()
      if(res){res = res.errors || [{message:"Unknow problem"}]}
      if(res){res = res.map(e=>e.message).join(', ')}
      alert(`Something wrong happened =>  ${response.status}, ${response.statusText}.\n${res}`);
      throw new Error(res)
    }
    const json = response.json()
    if(json.errors){throw new Error(json.map(e=>e.message).join(', '))}
    return json.data
  })
}


export default {
  login: (variables) => {

    //Prepare GraphQL
    const payload = {
      query:`query($email:String!,$password:String!){
  login(email:$email,password:$password){
    token
    channels{
      channelName
      channel
      events{
        author
        channel
        channelName
        type
        message
      }
    }
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
    token
    channels{
      channelName
      channel
      events{
        author
        channel
        channelName
        type
        message
      }
    }
  }
}`,
      variables
    }
    return askGraphQL(payload)
  }
}