import createPersistedState from 'vuex-persistedstate'

export default ({ store, isHMR }) => {
  if (process.browser) {
    if (isHMR) return
    createPersistedState({
      key: 'tennis',
    })(store)
  }
}
