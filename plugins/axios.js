import { Capacitor } from '@capacitor/core'
import { ToastProgrammatic as Toast } from 'buefy'
export default function ({ app, $axios, redirect, store }) {
  $axios.onRequest((config) => {
    if (Capacitor.isNativePlatform()) {
      config.headers['X-Club'] = store.state.club.id
    }
    if (process.env.NODE_ENV !== 'production') {
    }
    config.headers['X-Language'] = app.i18n.locale
  })
  $axios.onError((error) => {
    if (error.response.status === 401) {
      redirect('/login')
      Toast.open({
        message: app.i18n.t('Istekla vam je prijava. Pokušajte se ponovo prijaviti.'),
        type: 'is-danger',
        duration: 10000,
      })
    }
  })
}
