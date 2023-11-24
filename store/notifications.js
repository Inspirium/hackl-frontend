import { PushNotifications } from '@capacitor/push-notifications'

export const state = () => ({
  notifications: [],
  admin: [],
  number: 0,
  unreads: 0,
  reservations: 0,
  orders: 0,
  workOrders: 0,
  granted: false,
  last_register: null,
  last_check: null,
})
export const mutations = {
  add_notification(state, notification) {
    state.number += 1
  },
  notifications(state, payload) {
    state.notifications = payload
  },
  number(state, payload) {
    state.number = payload.number
    state.unreads = payload.unreads
    state.reservations = payload.reservations
    state.orders = payload.orders
    state.workOrders = payload.workOrders
    state.last_check = new Date().getTime()
  },
  reset(state) {
    state.number = 0
  },
  setGranted() {
    state.granted = true
  },
  setRegister() {
    state.last_register = new Date().getTime()
  },
}
export const actions = {
  init({ commit, state }) {
    if (this.$auth.loggedIn) {
      if (state.last_check + 600 * 1000 < new Date().getTime()) {
        this.$axios.get('v2/notification/number?v=2').then((res) => {
          commit('number', res.data)
        })
      }
      this.$echo.private('App.User.' + this.$auth.user.id).notification((notification) => {
        commit('add_notification', notification)
      })
    }
  },
  hasGranted({ commit, state }) {
    commit('setGranted')
    if (state.last_register + 24 * 3600 * 1000 < new Date().getTime()) {
      PushNotifications.register()
    }
  },
}
