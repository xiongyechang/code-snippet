import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

import admin from './admin'

const store = new Vuex.Store({
  modules: {
    admin
  },
  plugins: [createPersistedState()]
})

export default store