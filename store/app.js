import { Capacitor } from '@capacitor/core'

export const state = () => ({
  appVersion: '1.32.1',
  app: {
    ios: '1321',
    android: '1321',
  },
  updated: null,
})

export const mutations = {
  setVersion(state, data) {
    state.appVersion = parseInt(data.appVersion.replace('.', ''))
    state.app.ios = parseInt(data.ios.replace('.', ''))
    state.app.android = parseInt(data.android.replace('.', ''))
    state.updated = new Date().getTime()
  },
}

export const actions = {
  initVersion({ commit, state }) {
    if (state.updated + 12 * 3600 * 1000 < new Date().getTime()) {
      this.$axios.$get('https://api.tenis.plus/v2/status').then((res) => {
        commit('setVersion', res)
      })
    }
  },
}

export const getters = {
  getLink() {
    const links = {
      ios: 'https://apps.apple.com/us/app/tennis-plus/id1619337469',
      android: 'https://play.google.com/store/apps/details?id=plus.tenis.app',
    }
    if (Capacitor.isNativePlatform()) {
      return links[Capacitor.getPlatform()]
    }
    return ''
  },
}
