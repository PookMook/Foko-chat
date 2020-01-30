const jwt = require('jsonwebtoken')

module.exports = (jwtoken,id) => {
  try{
    const token = jwt.verify(jwtoken,process.env.JWT_SECRET_TOKEN)
    if(token.id !== id){
      throw new Error('id/token mismatch')
    }
    return token
  }
  catch(e){
    throw e
  }

}