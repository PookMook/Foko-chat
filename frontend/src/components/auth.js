import React from 'react'

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'

import App from './app'

import charts from '../state/index'

const overmind =  process.env.NODE_ENV === "development" ? createOvermind(charts,{
  devtools: true // defaults to 'localhost:3031'
}) : createOvermind(charts)

export default () => {

  return(
    <Provider value={overmind}>
      <App/>
    </Provider>
  )
}