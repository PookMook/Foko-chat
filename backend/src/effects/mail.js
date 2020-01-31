const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateToken = (to,minutes) =>{
  //Maybe user doesn't exist


  return "token"
}

module.exports = {
  recoverPassword: ({to,username}) => {
    // TODO generate link 
    const link = generateToken("arthur@juchereau.com",5)
    const msg = {
      to,
      //Most likely this is going to take a sendgrid.env config file for the API key/from/templates and so on
      from: 'arthur@juchereau.com',
      subject: 'Password recovery',
      text: `Hey ${username},
Please follow the link below to set your new password.
This link is only valid for 30 minutes, so change your password quickly and log in!

${link}

Cheers,
Arthur`,
    // TODO add an HTML version/template in sendgrid: html:'<h1>hello here</h1>'
    };
    sgMail.send(msg);
  }
}