import { Capacitor } from '@capacitor/core'

export default function ({ $auth, store, app, route, redirect }) {
  app.router.beforeEach((to, from, next) => {
    store.dispatch('club/init_club')
    /* if (to.path.includes('login') || to.path.includes('stream')) {
      return next()
    }
    // If the user is not authenticated
    if (!store.state.auth.loggedIn) {
      return next('login')
    } */
    return next()
  })
  store.subscribe((mutation, state) => {
    if (
      mutation.type === 'auth/SET' &&
      Capacitor.isNativePlatform() &&
      !store.state.club.id &&
      $auth.user &&
      $auth.user.primary_club_id
    ) {
      store.commit('club/setId', $auth.user.primary_club_id)
      store.dispatch('club/init_club')
    }
    if (mutation.type === 'auth/SET' || mutation.type === 'club/init_club') {
      if (!$auth.loggedIn || !$auth.user) {
        return
      }
      $auth.user.is_admin = $auth.user.admin.includes(store.state.club.id)
    }
  })
}
