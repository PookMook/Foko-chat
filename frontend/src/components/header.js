import React from 'react'
import {Link} from 'react-router-dom'

export default () => {

  return(
    <header>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </header>
  )
}