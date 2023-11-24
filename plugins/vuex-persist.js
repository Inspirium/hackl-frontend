import { VuexPersistence } from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    storage: window.localStorage,
    modules: ['club', 'auth', 'userPreference', 'app'],
  }).plugin(store)
}
