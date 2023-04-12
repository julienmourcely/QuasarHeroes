import { createStore } from 'vuex'

import data from './data'
import errors from './errors'
import authenticate from './authenticate'

export default function () {
  const Store = createStore({
    modules: {
      data,
      errors,
      authenticate,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  })

  return Store
}
