const state = {
  isLoading: false,
  store: null
}
let storage = window.sessionStorage
let keyStore = "znstoreorg"
const getters = {
  store: (state, getters) => {
    let org = state.store;
    if (org) {
      return org
    }
    org = storage.getItem(keyStore)
    if (org) {
      if (typeof (org) == 'string')
        return JSON.parse(org)
      return org;
    }
    return null
  }
}

const mutations = {
  updateLoadingStatus(state, payload) {
    state.isLoading = payload.isLoading
  },
  updateCurrentStore(state, payload) {
    state.store = payload;
    let org = JSON.stringify(payload)
    storage.setItem(keyStore, org)
  }
}


const actions = {
  updateLoadingStatus({
    state,
    commit
  }, payload) {
    commit('updateLoadingStatus', payload);
  },
  updateCurrentStore({
    state,
    commit
  }, payload) {
    commit('updateCurrentStore', payload);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
