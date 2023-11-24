import { App } from '@capacitor/app'
export default function ({ app }) {
  App.addListener('appUrlOpen', function (event) {
    const slug = event.url.split('.plus').pop()
    // We only push to the route if there is a slug present
    if (slug) {
      app.router.push({
        path: slug,
      })
    }
  })
}
