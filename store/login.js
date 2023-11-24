export const state = () => ({
  social: {
    email: '',
    id: '',
    name: '',
    token: '',
    service: '',
  },
})

export const mutations = {
  set_social(state, social) {
    state.social.email = social.email ? social.email : ''
    state.social.id = social.id ? social.id : 0
    state.social.token = social.token ? social.token : ''
    state.social.name = social.name ? social.name : ''
    state.social.service = social.service ? social.service : ''
  },
}

export const actions = {
  connect_social({ state }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/v2/login/connect', {
          id: state.social.id,
          email: state.social.email,
          token: state.social.token,
          service: state.social.service,
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  login({ state, commit, rootState }, login) {
    return new Promise((resolve, reject) => {
      this.$auth
        .loginWith('password_grant', {
          data: {
            username: login.email,
            password: login.password,
          },
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
