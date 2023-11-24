// import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
  competitions: {},
  competitionsList: [],
  selectedLiga: {},
})

export const mutations = {
  setCompetitions(state, payload) {
    state.competitionsList = payload
    state.competitions = payload.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
  },
  setSelectedLiga(state, payload) {
    state.selectedLiga = payload
  },
}
