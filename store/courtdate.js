export const state = () => ({
  date: '',
})

export const mutations = {
  isDate(state, payload) {
    state.date = payload
  },
}
