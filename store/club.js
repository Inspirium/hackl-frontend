import moment from 'moment'
import Surface from '@/models/Surface'
export const state = () => ({
  name: 'Teniski klub',
  logo: '/logo__login.svg',
  club_loaded: false,
  courts: [],
  filters: {
    surface: 'any',
    date: '',
  },
  address: '',
  city: '',
  county: '',
  description: '',
  email: '',
  id: 0,
  is_active: false,
  latitude: '',
  longitude: '',
  phone: '',
  postal_code: '',
  region: '',
  subdomain: '',
  weather: '',
  main_thread: 0,
  last_update: 0,
  payment_accontation: null,
  payment_online: null,
  surfaces: [],
  canceled: {},
  memberships: [],
  business_data: {
    bank_account: '',
    subject_number: '',
    oib: '',
    swift_code: '',
  },
  type: '',
  validate_user: '',
  hide_personal_data: false,
  hide_ranks: false,
  is_w2p: false,
  social: {},
  country: {
    id: 1,
    currency: 'EUR',
    locale: 'de-DE',
  },
  hero_images: {
    home: '/club-brand-image.jpg',
    classified: '/hero_classifieds.jpg',
    courts: '/hero_courts.jpg',
    cup: '/liga.jpg',
    doubles: '/hero_doubles.jpg',
    liga: '/liga.jpg',
    news: '/hero_news.jpg',
    notification: '/members.jpg',
    player: '/members.jpg',
    reservation: '/members.jpg',
    result: '/members.jpg',
    school: '/hero_school.jpg',
    trainer: '/hero_trainer.jpg',
    rankings: '/hero_ranks.jpg',
    schedule: '/hero_schedule.jpg',
    sponsors: '/hero_sponsors.jpg',
  },
  domain: '',
  club_socials: [],
  sports: [],
})

export const mutations = {
  init_club(state, data) {
    for (const i in Object.keys(state)) {
      const key = Object.keys(state)[i]
      if (typeof data.club[key] !== 'undefined') {
        state[key] = data.club[key]
      }
    }
    state.last_update = moment()
    state.club_loaded = data.club.domain
  },
  setId(state, id) {
    state.id = id
  },
  set_surfaces(state, surfaces) {
    state.surfaces = surfaces
  },
}

export const actions = {
  init_club({ commit, state }, payload) {
    if (!payload) {
      payload = { force: false }
    }
    if (window.location.hostname === 'app.tenis.plus' && !state.id) {
      return
    }
    if (
      payload.force ||
      !state.club_loaded ||
      state.club_loaded !== window.location.hostname ||
      state.last_update < moment().subtract(1, 'h')
    ) {
      this.$axios
        .$get('v2/club/this')
        .then((res) => {
          if (Object.keys(res).length) {
            commit('init_club', { club: res, force: payload.force })
          }
        })
        .catch(() => {})
    }
  },
  surfaces({ commit }) {
    Surface.get().then((res) => {
      commit('set_surfaces', res.data)
    })
  },
}
