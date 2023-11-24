export default function ({ store, redirect, route, app }) {
  if (store.state.auth.loggedIn) {
    if (store.state.auth.user.is_admin === 'admin') {
      if (route.name === 'login') {
        return redirect('/')
      }
    } else if (route.name !== 'login') {
      return redirect('/login')
    }
  } else if (route.name !== 'login') {
    return redirect('/login')
  }
}
