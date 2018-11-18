const state = () => ({ position: {city: '', province: ''} })

const mutations = {
  setPosition(state, val) {
    state.position = val
  },
  setPositionCity(state, val) {
    state.position.city = val
  }
}

const actions = {
  setPosition: ({ commit }, position) => {
    commit('setPosition', position)
  },
  setPositionCity: ({ commit }, position) => {
    commit('setPositionCity', position)
  }
}

export default { namespaced: true, state, mutations, actions }