import {statecharts } from 'overmind/config'
import { createHook } from 'overmind-react'
import actions from './actions'
import state from './state'
import effects from './effects'
import charts from './charts'

export const useOvermind = createHook()

const config = {
  actions,
  state,
  effects
}

export default statecharts(config, charts)