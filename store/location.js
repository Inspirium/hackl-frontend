// import Capacitor from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'
export const state = () => ({
  latitude: 0,
  longitude: 0,
  city: '',
  country: '',
  updated: null,
})

export const mutations = {
  setLocation(state, data) {
    state.latitude = data.coords.latitude
    state.longitude = data.coords.longitude
    state.updated = new Date().getTime()
  },
}

export const actions = {
  async getLocation({ commit, state }) {
    if (state.updated + 12 * 3600 * 1000 < new Date().getTime()) {
      try {
        await Geolocation.getCurrentPosition().then((res) => {
          commit('setLocation', res)
        })
      } catch (e) {
        commit('setLocation', { coords: { latitude: 0, longitude: 0 } })
      }
    }
  },
}
