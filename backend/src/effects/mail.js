const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateToken = (id,minutes) =>{
  //Maybe user doesn't exist
  const payload = {id}
  let token
  if(minutes){
    token = jwt.sign(payload,process.env.JWT_SECRET_TOKEN,{expiresIn:`${minutes}m`})
  }
  else{
    token = jwt.sign(payload,process.env.JWT_SECRET_TOKEN)
  }

  return token
}

module.exports = {
  recoverPassword: ({to,username,id}) => {
    
    try{
      const token = generateToken(id,5)
      const msg = {
        to,
        //Most likely this is going to take a sendgrid.env config file for the API key/from/templates and so on
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Password recovery',
        text: `Hey ${username},
Please copy paste the following token or click the link below to set your new password.
This link is only valid for 30 minutes, so change your password quickly and log in!

${token}

${process.env.ALLOW_CORS_FRONTEND}/?from=passwordRecovery&token=${token}

Cheers,
Arthur`,
      // TODO add an HTML version/template in sendgrid: html:'<h1>hello here</h1>'
      }
      sgMail.send(msg);
    }
    catch(e){
      console.error(e)
    }
  },
  inviteToChannel: ({to,username,id}) => {
    
    try{
      const token = generateToken(id)
      const msg = {
        to,
        //Most likely this is going to take a sendgrid.env config file for the API key/from/templates and so on
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Invitation to a chat channel',
        text: `Hey ${username},
Someone Invited you to a chat channel, follow the link bellow to interract

${process.env.ALLOW_CORS_FRONTEND}/channel/5e34b72db23ce9001f87af05?from=autoLog&token=${token}

Cheers,
Arthur`,
      // TODO add an HTML version/template in sendgrid: html:'<h1>hello here</h1>'
      }
      sgMail.send(msg);
    }
    catch(e){
      console.error(e)
    }
  }
}