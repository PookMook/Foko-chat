import isEmail from '../helpers/isEmail'

export default {
  login:{
    initial: 'UNAUTH',
    states:{
      UNAUTH:{
        on:{
          login:{
            target: 'LOGIN',
            condition: state => Boolean(
              state.authForm.email !== "" 
              && isEmail(state.authForm.email)
              && state.authForm.password !== ""
            )
          },
          register:{
            target: 'REGISTER',
            condition: state => Boolean(
              state.authForm.email !== "" 
              && isEmail(state.authForm.email)
              && state.authForm.password !== ""
              && state.authForm.password === state.authForm.passwordConfirm
              && state.authForm.username !== ""
            )
          },
          fillout:null,
          recoverPassword:'RECOVER_PASSWORD',
          recovering:'RECOVERING'
        }
      },
      RECOVER_PASSWORD:{
        on:{
          cancelRecover:'UNAUTH',
          filloutRecover:null,
          sendRecover:{
            target:'RECOVERING',
            condition:state=>Boolean(
              state.recover.email !== "" 
              && isEmail(state.recover.email)
            )
          }
        }
      },
      RECOVERING:{
        on:{
          cancelRecover:'UNAUTH',
          filloutRecovering:null,
          testRecover:{
            target:'SENDING_RECOVER',
            condition: state => Boolean(
              state.modal.token !== ""
              && state.modal.password !== ""
              && state.modal.password === state.modal.passwordConfirm
            )
          }
        }
      },
      SENDING_RECOVER:{
        on:{
          successRecover:'SUCCESS',
          failRecover:'RECOVERING'
        }

      },
      LOGIN:{
        on:{
          successLogin:'SUCCESS',
          failLogin:'ERROR_LOGIN'
        }
      },
      REGISTER:{
        on:{
          successRegister:'SUCCESS',
          failRegister:'ERROR_REGISTER'
        }
      },
      SUCCESS:{
        on:{
          signout:'UNAUTH',
          sendMessage:null,
          selectChannel:null,
          createChannel:null,
          handleEvent:null,
          fetchChannels:null,
          loadChannel:null,
          inviteToChannel:null,
        }
      },
      ERROR_LOGIN:{
        on:{
          fillout:'UNAUTH'
        }
      },
      ERROR_REGISTER:{
        on:{
          fillout:'UNAUTH'
        }
      }    
    }
  }
}