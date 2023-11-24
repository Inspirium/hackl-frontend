// import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
  preference: {
    courts: {
      showDetailedCourtsView: false,
      showButtonsInDetailedCourtsView: true,
    },
    courtsGlobalFilter: {
      city: {},
      sport: {},
      surface: {},
      lights: {},
    },
    selectedSport: {},
    lastPlayersOnReservation: [],
  },
  language: null,
})

export const mutations = {
  setSport(state, payload) {
    state.preference.selectedSport = payload
  },
  setShowDetailedCourtsView(state, payload) {
    state.preference.courts = payload
  },
  setGlobalCourtFilter(state, payload) {
    state.preference.courtsGlobalFilter = payload
  },
  setLastPlayersOnReservation(state, payload) {
    const newPlayer = payload
    const index = state.preference.lastPlayersOnReservation.findIndex(
      (existingUser) => existingUser.id === newPlayer.id
    )
    if (index !== -1) {
      state.preference.lastPlayersOnReservation.splice(index, 1)
    }

    state.preference.lastPlayersOnReservation.unshift(newPlayer)

    if (state.preference.lastPlayersOnReservation.length > 10) {
      state.preference.lastPlayersOnReservation = state.preference.lastPlayersOnReservation.slice(0, 10)
    }
  },
  setLanguage(state, payload) {
    state.language = payload
  },
}
