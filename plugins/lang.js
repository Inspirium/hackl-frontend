export default function ({ app, store }) {
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    store.commit('userPreference/setLanguage', newLocale)
    app.$moment.locale(newLocale)
    if (store.state.auth.loggedIn && newLocale !== store.state.auth.user.lang) {
      app.$axios.post('/v2/me/set-locale', { locale: newLocale })
    }
  }
}
