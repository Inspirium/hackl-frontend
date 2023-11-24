export default function ({ store, redirect, route, app }) {
  let should = true
  const not = ['/login/', '/registration/', '/login', '/registration', 'stream']
  for (let i = 0; i < not.length; i++) {
    if (route.path.includes(not[i])) {
      should = false
    }
  }
  /* if (route.path.indexOf('login')) {
    return
  } */
  // If the user is not authenticated
  if (should && !store.state.auth.loggedIn) {
    return redirect(app.localePath('login', store.state.userPreference.language ?? app.i18n.getBrowserLocale()))
  }
}
