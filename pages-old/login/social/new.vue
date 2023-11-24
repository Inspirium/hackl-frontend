<template>
  <div class="container">
    <div class="page__login">
      <div class="page__login--bckg"></div>
      <nuxt-link :to="localePath('/')">
        <img class="logo__login" src="~assets/img/logo__login.svg" alt="" />
      </nuxt-link>
      <div class="login__notice m-b-15 is-size-5">
        <div class="title has-text-white m-t-10">{{ $t('korisnikNePostojiUTennisplusBazi') }}</div>
        {{ $t('eliteLiSe') }} <span @click="activeTab = 0">{{ $t('registrirati') }}</span> {{ $t('iliElite') }}
        <span @click="activeTab = 1">{{ $t('povezati') }}</span> {{ $t('postojeiRaunSOvimDrutvenimProfilom') }}
      </div>
      <b-tabs v-model="activeTab" class="flex__column align__centar__y">
        <b-tab-item class="flex__column login__content" :label="$t('registracija')">
          <RegistrationForm></RegistrationForm>
        </b-tab-item>
        <b-tab-item class="flex__column login__content" :label="$t('povei')">
          <div class="login__notice m-t-20 m-b-30">
            {{ $t('molimoPrijaviteSeSPostojeimRaunomKakoBiMogliUparit') }}
          </div>
          <form class="" @submit.prevent="submit">
            <b-field class="login__input__container">
              <b-input v-model="email" placeholder="E-mail" type="email" pack="fal" icon="envelope" rounded> </b-input>
            </b-field>
            <b-field class="login__input__container">
              <b-input
                v-model="password"
                type="password"
                :placeholder="$t('lozinka')"
                pack="fal"
                icon="lock-alt"
                password-reveal
                rounded
              >
              </b-input>
            </b-field>
            <div class="buttons">
              <b-button
                class="m-l-5 m-t-20 m-b-30 fw600"
                type="is-primary"
                pack="fal"
                icon-right="link"
                rounded
                @click.prevent="submit"
              >
                {{ $t('prijaviSeIPovei') }}
              </b-button>
            </div>
          </form>
        </b-tab-item>
        <b-tab-item></b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import RegistrationForm from '~/components/login/registrationForm'

export default {
  components: { RegistrationForm },
  layout: 'noTop',
  data() {
    return {
      lostPassEmail: '',
      activeTab: 0,
      email: '',
      password: '',
      newUser: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        member: 1,
        birthyear: '',
        address: '',
        city: '',
        phone: '',
        gender: 'M',
      },
    }
  },
  computed: {
    style() {
      return {
        backgroundImage: 'url(' + 'login__bckg.jpg' + ')',
      }
    },
  },
  mounted() {
    this.$store.commit('login/set_social', this.$route.query)
  },
  methods: {
    login() {
      this.$store
        .dispatch('login/login', this.$data)
        .then(() => {
          this.$store
            .dispatch('login/connect_social')
            .then(() => {
              this.$router.push(this.localePath('/'))
            })
            .catch(() => {
              // TODO: toastr for fail to connect
            })
        })
        .catch(() => {
          // TODO: toastr for fail to login
        })
    },
    submit() {
      this.$store
        .dispatch('login/login', this.$data)
        .then(() => {
          this.$router.push(this.localePath('/'))
        })
        .catch(() => {
          // TODO: toastr for fail
        })
    },
    submitRegistration() {
      this.$store
        .dispatch('login/login', this.$data)
        .then(() => {
          this.$router.push(this.localePath('/'))
        })
        .catch(() => {
          // TODO: toastr for fail
        })
    },
  },
}
</script>
