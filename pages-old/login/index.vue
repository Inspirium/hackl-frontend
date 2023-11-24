/* eslint-disable */
<template>
  <div class="page__login no-double-zoom p-b-300">
    <div class="page__login--bckg"></div>
    <img v-if="$store.state.club.logo !== ''" class="logo__login__tenisplus" src="/logo__login-sign.svg" alt="" />
    <div>
      <TennisImage :size="[600, 600]" :src="heroLogo" class="logo__login__main" alt="" />
    </div>
    <b-tabs v-model="activeTab" class="flex__column align__centar__y">
      <b-tab-item class="flex__column login__content login__input__container--index" :label="$t('prijava')">
        <!--<social-logins v-if="!isNative" class="m-t-15 m-b-15"></social-logins>-->
        <div class="align__centar__all m-b-25 m-t-10" @click="langOpen = true">
          <div class="fw600 is-size-6 has-text-white flex align__centar__y">
            <img :src="'/lang/' + $i18n.locale + '.png'" class="radius__full w24 m-r-7" />{{ getlang[0].name
            }}<b-icon icon="chevron-right" size="is-small-9" pack="fal"> </b-icon>
          </div>
        </div>

        <ValidationObserver v-slot="{ invalid }" class="w80">
          <form @submit.prevent="submit">
            <ValidationProvider v-slot="{ errors, valid }" name="Email" rules="required|email">
              <b-field
                class="login__input__container m-b-10"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  id="email"
                  v-model="email"
                  class="login-icon"
                  placeholder="E-mail"
                  type="email"
                  name="email"
                  pack="fal"
                  icon="envelope"
                  autocomplete="username"
                  rounded
                >
                </b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Lozinka" rules="required|min:8">
              <b-field
                class="login__input__container"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  id="current-password"
                  v-model="password"
                  class="login-icon"
                  type="password"
                  name="current-password"
                  autocomplete="current-password"
                  :placeholder="$t('lozinka')"
                  pack="fal"
                  icon="lock-alt"
                  password-reveal
                  rounded
                >
                </b-input>
              </b-field>
            </ValidationProvider>
            <div class="buttons">
              <b-button
                :class="['m-l-5', 'm-t-20', 'fw600', 'no-double-zoom']"
                type="submit is-primary"
                pack="fal"
                icon-right="arrow-right"
                rounded
                native-type="submit"
                :loading="loading"
                @click.prevent="submit(invalid)"
              >
                {{ $t('prijaviSe') }}
              </b-button>
            </div>
          </form>
        </ValidationObserver>
        <div class="buttons">
          <b-button
            class="m-l-5 m-t-75 fw600"
            type="is-danger"
            pack="fal"
            size="is-smaller"
            icon-right="question-circle"
            rounded
            @click.prevent="
              activeTab = 2
              email !== '' ? (lostPassEmail = email) : (lostPassEmail = '')
            "
          >
            {{ $t('zaboravljenaLozinka') }}
          </b-button>
        </div>
      </b-tab-item>
      <b-tab-item class="flex__column login__content login__input__container--index" :label="$t('registracija')">
        <div class="align__centar__all m-b-15 m-l-10 m-t-20" @click="langOpen = true">
          <div class="fw600 is-size-6 has-text-white flex align__centar__y">
            <img :src="'/lang/' + $i18n.locale + '.png'" class="radius__full w24 m-r-7" />{{ getlang[0].name
            }}<b-icon icon="chevron-right" size="is-small-9" pack="fal"> </b-icon>
          </div>
        </div>
        <div class="">
          <RegistrationForm class="w100"></RegistrationForm>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="p-l-30 p-r-30">
          <b-icon class="m-t-20" icon="unlock-alt" size="is-large" type="is-white" pack="fal"> </b-icon>
          <div class="title has-text-white">{{ $t('novaLozinka') }}</div>
          <ValidationObserver v-slot="{ invalid }" tag="form" @submit.prevent="resetPassword">
            <ValidationProvider v-slot="{ errors, valid }" name="E-mail adresa" rules="required|email">
              <b-field
                class="login__input__container is-small"
                :label="$t('emailAdresa')"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="lostPassEmail"
                  type="email"
                  pack="fal"
                  class="login-icon"
                  icon="envelope"
                  :placeholder="$t('upiiEmailKojiSiKoristioZaPrijavu')"
                  rounded
                >
                </b-input>
              </b-field>
            </ValidationProvider>
            <div class="fw600 has-text-white m-t-20 m-b-10">
              {{ $t('nakonToZatraiteNovuLozinkuUVaEmailSanduiDoiEPoruka') }}
            </div>
            <div class="buttons">
              <b-button
                class="m-l-5 m-t-20 fw600"
                type="is-danger"
                pack="fal"
                icon-left="arrow-left"
                rounded
                @click.prevent="activeTab = 0"
              >
                {{ $t('odustani') }}
              </b-button>
              <b-button
                :class="['m-l-5', 'no-double-zoom', 'm-t-20', 'fw600', invalid ? 'inactive' : '']"
                rounded
                :loading="loading1"
                type="submit is-primary"
                @click.prevent="resetPassword"
              >
                {{ $t('poalji') }}
              </b-button>
            </div>
          </ValidationObserver>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="langOpen" :width="640" scroll="clip">
      <modalLanguange
        :title="$t('promjenaJezika')"
        style="min-height: 200px"
        @closeit="isMenuModalActive = false"
      ></modalLanguange>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
import TennisImage from '@/components/TennisImage.vue'
import { Capacitor } from '@capacitor/core'
import SocialLogins from '~/components/login/SocialLogins'
import RegistrationForm from '~/components/login/registrationForm'
import {TextZoom} from "@capacitor/text-zoom";
import modalLanguange from '~/components/modal/ModalLanguange'

export default {
  name: 'LoginIndex',
  components: { SocialLogins, RegistrationForm, TennisImage, modalLanguange },
  layout: 'noTop',
  data() {
    return {
      heroLogo: this.$store.state.club.logo, //TODO: tennis plus logo when no club
      isMenuModalActive: false,
      loading: false,
      langOpen: false,
      loading1: false,
      lostPassEmail: '',
      activeTab: 0,
      email: '',
      password: '',
    }
  },
  computed: {
    languages() {
      return this.$store.state.languages.languages
    },
    currentLanguage() {
      return this.$i18n.locale
    },
    getlang() {
      return this.languages.filter((item) => {
        return item.local === this.currentLanguage
      })
    },
    showTenisPlusLogoIfNoClub() {
      if (!this.$store.state.club.logo === '') {
        return '/logo__login.svg'
      } else {
        return this.$store.state.club.logo
      }
    },
    isNative() {
      return Capacitor.isNativePlatform()
    },
    style() {
      return {
        backgroundImage: 'url(' + 'login__bckg.jpg' + ')',
      }
    },
  },
  async mounted() {
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      const fontSize = await TextZoom.get()
      if (fontSize.value > 1.2) {
        await TextZoom.set({value: 1.2})
      }
    }
  },
  methods: {
    submit(invalid) {
      if (invalid) {
        this.$buefy.toast.open({
          message: this.$t('Provjerite pristupne podatke i pokušajte ponovno'),
          type: 'is-primary',
          duration: 3000,
        })
      }
      this.loading = true
      this.$store
        .dispatch('login/login', { email: this.email, password: this.password })
        .then(() => {
          // this.$i18n.locale = this.$store.state.auth.user.lang
          this.$buefy.toast.open({
            message: this.$t('Dobro došli u', this.$store.state.auth.user.lang) + ' ' + this.$store.state.club.name,
            type: 'is-primary',
            duration: 5000,
          })
          this.loading = false
          this.$router.push(this.localePath('/', this.$store.state.auth.user.lang))
        })
        .catch((err) => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Provjerite pristupne podatke i pokušajte ponovno'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
          this.password = ''
          // this.$router.go()
        })
    },
    resetPassword() {
      this.loading1 = true
      this.$axios.post('/v2/login/reset', {email: this.lostPassEmail}).then(() => {
        this.$buefy.toast.open({
          message: this.$t('Email s poveznicom'),
          type: 'is-primary',
          duration: 4000,
        })
        this.loading1 = false
        this.activeTab = 0
      })
      .catch(() => {
        this.$buefy.toast.open({
          message: this.$t('Dogodila se greška pri slanju poruke'),
          type: 'is-danger',
          duration: 4000,
        })
        this.loading1 = false
      })
    }
  },
  head() {
    return {
      title: 'Prijava',
    }
  },
}
</script>
<style scoped>
  body {
    max-width: 100%;
    margin: 0 auto;
  }
</style>
