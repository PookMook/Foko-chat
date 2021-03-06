// CRA builds only keeps process.env.NODE_ENV, so switching this one here

let env = {}

if(process.env.NODE_ENV === "production"){
  env.REACT_APP_BACKEND = "graphql.arthurdev.duckdns.org"
  env.REACT_APP_PROTOCOL = "https"
  env.REACT_APP_SOCKET_PROTOCOL= "wss"
}
else{
  env.REACT_APP_BACKEND = process.env.REACT_APP_BACKEND || "localhost:4000"
  env.REACT_APP_PROTOCOL = process.env.REACT_APP_PROTOCOL || "http"
  env.REACT_APP_SOCKET_PROTOCOL= process.env.REACT_APP_SOCKET_PROTOCOL || "ws"
}

export default env