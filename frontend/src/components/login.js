import React from 'react'

import { useOvermind } from '../state/index'


export default () => {
  const {state,_} = useOvermind()
  return(
    <main>
      <p>Login here</p>
      <pre>{JSON.stringify(state,null,1)}</pre>
    </main>
  )
}