import React from 'react'

export default (props) => {

  const { match: { params } } = props;

  return(<p>Channel: {params.id}</p>)
}