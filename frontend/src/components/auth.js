import React from 'react'

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'

import App from './app'

import charts from '../state/index'

const overmind = createOvermind(charts)

export default () => {

  return(
    <Provider value={overmind}>
      <App/>
    </Provider>
  )
}