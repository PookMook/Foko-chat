export default {
  login:{
    initial: 'UNAUTH',
    states:{
      UNAUTH:{
        on:{
          login:{
            target: 'AUTHENTICATING',
            condition: state => Boolean(state.authForm.email !== "" && state.authForm.password !== "")
          },
          register:{
            target: 'REGISTER',
            condition: state => Boolean(
              state.authForm.email !== "" 
              && state.authForm.password !== ""
              && state.authForm.password === state.authForm.passwordConfirm
              && state.authForm.username !== ""
            )
          },
          fillout:null
        }
      },
      AUTHENTICATING:{
        on:{
          successLogin:'SUCCESS',
          failLogin:'ERROR'
        }
      },
      REGISTER:{
        on:{
          successRegister:'SUCCESS',
          failRegister:'ERROR'
        }
      },
      SUCESS:{
        on:{
          signout:'UNAUTH'
        }
      },
      ERROR:{
        on:{
          fillout:'UNAUTH'
        }
      }   
    }
  }
}