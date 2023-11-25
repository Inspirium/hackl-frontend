<template>
  <div :class="selectedLanguageStyle">
    <topnav />
    <!-- <home-sport-picker v-if="user.id === 2" /> -->
    <nuxt v-if="(isMember || !validateUser) && !isBlocked" />
    <template>
      <div :class="isScrolled ? 'totop' : 'totop_init'" class="totop transition" @click="scrollToTop">
        <span class="fw600 is-size-55 has-text-black80 align__centar__y">
          <b-icon icon="arrow-circle-up" pack="fal" type="is-black80" class=""> </b-icon>
        </span>
      </div>
    </template>

    <!--    <p>isMember: {{ isMember }}</p>-->
    <!--    <p>isApplicant: {{ isApplicant }}</p>-->
    <!--    <p>isNew: {{ isNew }}</p>-->
    <!--    <p>isBlocked: {{ isBlocked }}</p>-->
    <!--    <p>validateUser: {{ validateUser }}</p>-->
    <div v-if="isNew && club.validate_user === 1" class="notify p-b-150">
      <!--      <div class="member__info liga__header is-red">-->
      <!--        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10 p-l-10 p-r-10">-->
      <!--          Za rezervaciju terena u {{ club.name }} morate biti član kluba-->
      <!--        </div>-->
      <!--      </div>-->
      <template>
        <div class="breadcrumbs breadcrumbs-back m-t-10 m-b-20">
          <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
            <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
            <span class="m-r-5">{{ $t('nazad') }}</span>
          </a>
        </div>
      </template>
      <div class="m-b-20">
        <div class="birthday softshadow4">
          <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-20 p-b-10">
            <b-icon icon="user-plus" size="is-large" type="is-white" pack="fal"></b-icon>
            <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5 m-t-20">
              {{ $t('akoEliteIgratiNaTerenimaMoratePodnijetiZahtjevZaLa', { name: club.name }) }}
            </div>
            <div class="buttons m-t-20 m-b-0" @click="newApplicant()">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="far"
                icon-right="check"
                rounded
                :loading="loading"
              >
                {{ $t('poaljiZahtjevZaLanstvo') }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="x-container">
        <template v-if="isAdmin">
          <div v-if="check === null || check === 'applicant'" class="m-t-20 m-b-20">
            <div class="birthday rounded-md softshadow4">
              <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-10 p-b-10">
                <b-icon icon="check" size="is-large" type="is-white" pack="fal"></b-icon>
                <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5">
                  {{ $t('dobiliSteZahtjevZaPotvrduNovogLanaKluba') }}
                </div>
                <div class="fw600 is-size-4 has-text-centered has-text-white">
                  {{ player.display_name }}
                </div>
                <div class="buttons m-t-20 m-b-0">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="far"
                    icon-right="user-plus"
                    rounded
                    @click="
                      updateMemberData.member.push(player)
                      updateMember()
                    "
                  >
                    {{ $t('potvrdiLanstvo') }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <TennisImage
          :size="[180, 180]"
          :src="club.logo"
          class="user_image-large m-r-auto m-l-auto m-t-10 m-b-10"
          alt=""
        />
        <div class="title m-b-5 m-t-5 has-text-centered">{{ club.name }}</div>
        <div class="modal-subtitle is-size-5 has-text-lightblue has-text-centered">{{ club.city }}</div>
        <template>
          <div class="m-b-10 m-t-10 has-text-centered">
            <div class="fw600 is-size-6 has-text-centered">
              {{ $t('sveOUvjetimaLanstvaMoeteSaznatiPozivomNaOvajBroj') }}
            </div>
            <div class="buttons m-t-20">
              <b-button
                :href="'tel:' + club.phone"
                tag="a"
                class="softshadow m-l-10"
                type="is-small noborder"
                pack="far"
                icon-right="phone"
                rounded
              >
                {{ $t('nazovi') }}
              </b-button>
            </div>
          </div>
        </template>
        <!-- eslint-disable-next-line -->
        <div class="has-text-left is-size-6 content-tiny m-t-20" v-html="club.description"></div>

        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('kontaktPodaci') }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('adresa') }}</div>
          <div class="fw600 is-size-55">{{ club.address }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
          <div class="fw600 is-size-55">{{ club.email }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <div class="fw600 is-size-55">{{ club.phone }}</div>
        </div>

        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left m-b--10">{{ $t('vrsteLanstva') }}</div>
        </div>
        <div v-for="item in club.memberships" :key="item.id" class="">
          <div class="m-t-30 display-data__box is-black30">
            <div class="fw600 is-size-4 has-text-white has-text-centered">{{ item.name }}</div>
          </div>
          <!--          <div class="fw600 is-size-3 m-t-20 has-text-lightblue has-text-centered">{{ item.name }}</div>-->

          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rezervacijaTerena') }}</div>
            <div class="fw600 is-size-55">
              {{ $t('danaUnaprijed', { max_reservation_span: item.max_reservation_span }) }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('otkazivanjeRezervacije') }}
            </div>
            <div class="fw600 is-size-55">{{ item.is_reservation_cancelable ? $t('mogue') : $t('nijeMogue') }}</div>
          </div>
          <div v-if="item.is_reservation_cancelable" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('rokOtkazivanjaRezervacije') }}
            </div>
            <div class="fw600 is-size-55">
              {{ $t('satiRanije', { reservation_cancelable: item.reservation_cancelable }) }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('popustNaCijeneRezervacije') }}
            </div>
            <div class="fw600 is-size-55">{{ item.hasDiscount ? $t('da') : $t('ne') }}</div>
          </div>
          <div v-if="item.hasDiscount" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('iznosPopusta') }}</div>
            <div v-if="item.discount_type === 1" class="fw600 is-size-55">
              {{ $t('key5', { currency: item.discount_amount }) | currency }}
            </div>
            <div v-else class="fw600 is-size-55">{{ item.discount_amount }}%</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('godinjaCijena') }}</div>
            <div class="fw600 is-size-55">{{ $t('key5', { currency: item.price }) | currency }}</div>
          </div>
          <div v-if="item.description" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
            <div class="fw600 is-size-6">{{ item.description }}</div>
          </div>
        </div>
      </div>
      <div class="buttons m-t-15 m-b-15">
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-primary"
          pack="fal"
          icon-right="user-plus"
          rounded
          tag="nuxt-link"
          to="/admin/"
        >
          {{ $t('poaljiZahtjevZaLanstvo') }}
        </b-button>
      </div>
    </div>
    <template v-if="isApplicant">
      <div class="x-container">
        <TennisImage
          :size="[180, 180]"
          :src="club.logo"
          class="user_image-large m-r-auto m-l-auto m-t-20 m-b-10"
          alt=""
        />
        <div class="title m-b-5 m-t-5 has-text-centered">{{ club.name }}</div>
        <div class="modal-subtitle is-size-5 has-text-lightblue has-text-centered">{{ club.city }}</div>
        <div class="m-t-10 m-b-20">
          <div class="birthday rounded-md softshadow4 p-b-30">
            <div class="fw600 is-size-4 has-text-centered has-text-white p-t-20">{{ $t('lanstvoUKlubu') }}</div>
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-b-10">
              <TennisImage
                :size="[72, 72]"
                :src="user.image"
                class="user_image-medium border__white--2 m-r-auto m-l-auto m-t-20 m-b-10"
                alt=""
              />
              <!--              <b-icon icon="clock" size="is-large" type="is-white" pack="fal"></b-icon>-->
              <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('vaSeZahtjevZaLanstvomURazmatra', { display_name: user.display_name, name: club.name }) }}
              </div>
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow m-l-10"
                type="is-small noborder"
                pack="far"
                icon-right="repeat"
                rounded
                @click="checkStatus()"
              >
                {{ $t('provjeriStatusZahtjeva') }}
              </b-button>
            </div>
          </div>
          <div class="fw600 is-size-6 has-text-centered has-text-black80 m-b--5 m-t-20">
            {{ $t('zaDetaljneInformacijeOStatusuVaegZahtjevaNazoviteO') }}
          </div>
          <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-5 m-t-20">
            {{ club.phone }}
          </div>

          <div class="buttons m-t-20">
            <b-button
              :href="'tel:' + club.phone"
              tag="a"
              class="softshadow m-l-10"
              type="is-small noborder"
              pack="far"
              icon-right="phone"
              rounded
            >
              {{ $t('nazovi') }}
            </b-button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="isBlocked">
      <div class="x-container">
        <div class="fw600 is-size-3 has-text-centered m-t-20">{{ $t('blokiraniSte') }}</div>
        <div class="m-t-20 m-b-20">
          <div class="is-red rounded-md softshadow4">
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-20 p-b-10">
              <b-icon icon="exclamation-circle" size="is-large" type="is-white" pack="fal"></b-icon>
              <div class="fw600 is-size-5 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('administratorBlokiraoJeVaPristupAplikacijiKluba', { name: club.name }) }}
              </div>
              <template v-if="$auth.user.club_member[club.id].message">
                <div class="divider-line-1-white m-t-20 w100"></div>
                <div class="fw600 is-size-5 has-text-centered has-text-white m-b--5 m-t-20">
                  {{ $auth.user.club_member[club.id].message }}
                </div>
                <div class="divider-line-1-white m-t-20 w100"></div>
              </template>

              <div class="fw600 is-size-7 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('zaDetaljneIndormacijeORazlozimaBlokadeNazoviteOvaj', { phone: club.phone }) }}
              </div>
              <div class="buttons m-t-30 m-b-15">
                <b-button
                  :href="'tel:' + club.phone"
                  tag="a"
                  class="softshadow m-l-10"
                  type="is-small noborder"
                  pack="far"
                  icon-right="phone"
                  rounded
                >
                  {{ $t('nazovi') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { TextZoom } from '@capacitor/text-zoom'
import { SplashScreen } from '@capacitor/splash-screen'
import TopNav from '~/components/TopNav'

export default {
  middleware: 'authenticated',
  name: 'Layout',
  meta: [
    {
      name: 'viewport',
      content: 'user-scalable=no',
    },
  ],
  components: {
    topnav: TopNav,
    TennisImage,
  },
  data() {
    return {
      heroImage: '/club-brand-image.jpg',
      loading: false,
      isScrolled: false,
      backListener: null,
    }
  },
  computed: {
    selectedLanguageStyle() {
      const selectedLanguage = this.$i18n.locale
      if (selectedLanguage === 'el') {
        return 'bodyWrap greek'
      } else {
        return 'bodyWrap'
      }
    },
    heroLogo() {
      return this.$store.state.club.logo
    },
    isMember() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id].type === 'member'
      )
    },
    isApplicant() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id.toString()].type === 'applicant'
      )
    },
    isNew() {
      return (
        this.$auth.loggedIn &&
        (!this.user.club_member[this.club.id] ||
          this.user.club_member[this.club.id.toString()].type === null ||
          this.user.club_member[this.club.id.toString()].type === undefined)
      )
    },
    isBlocked() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id.toString()].type === 'blocked'
      )
    },
    validateUser() {
      return this.club.validate_user === 1
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  async mounted() {
    await SplashScreen.hide()
    if (this.$auth.loggedIn) {
      this.$auth.fetchUser().then((r) => {
        this.$i18n.setLocale(this.$auth.user.lang)
      })
    }
    window.addEventListener('scroll', this.handleScroll)

    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      const fontSize = await TextZoom.get()
      if (fontSize.value > 1.1) {
        await TextZoom.set({ value: 1.1 })
      }
    }
    this.redirectToFindClub()
    if (Capacitor.getPlatform() === 'web') {
      this.$fire.messaging.onMessage((e) => {
        this.$buefy.toast.open({
          message: e.notification.body,
          type: 'is-info',
          duration: 3500,
        })
      })
    } else {
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        this.$buefy.toast.open({
          message: notification.body,
          type: 'is-info',
          duration: 3500,
        })
      })
      await PushNotifications.addListener('registration', (token) => {
        if (!this.$auth.loggedIn) return
        this.$axios
          .post('v2/notification/subscribe', { token: token.value, source: Capacitor.getPlatform() })
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste aktivirali primanje obavijesti'),
              type: 'is-success',
            })
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške prilikom aktivacije primanja obavijesti'),
              type: 'is-danger',
            })
          })
        this.$store.commit('notifications/setGranted')
        this.$store.commit('notifications/setRegister')
      })
      await PushNotifications.addListener('registrationError', () => {
        this.$buefy.toast.open({
          message: this.$t('Došlo je do greške prilikom aktivacije primanja obavijesti'),
          type: 'is-danger',
        })
      })
      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        let url = notification.notification.data.url
        if (url.includes('https://') && !url.includes('tenis.plus')) {
          window.open(notification.notification.data.url, '_blank')
          return
        }
        const regex = /https:\/\/(.*?).tenis\.plus/
        if (url.includes('https://')) {
          url = url.replace(regex, '')
        }
        this.$router.push(url)
      })
      if (Capacitor.getPlatform() === 'android') {
        await PushNotifications.createChannel({
          id: 'tennis-plus',
          name: 'Tennis.plus',
          importance: 5,
          visibility: 1,
          sound: 'ball',
          lights: true,
          vibration: true,
        })
        this.backListener = await App.addListener('backButton', (e) => {
          if (this.$route.name === 'index') {
            App.exitApp()
          } else {
            this.$router.go(-1)
          }
        })
      }
    }
  },
  beforeDestroy() {
    if (Capacitor.getPlatform() === 'android' && this.backListener) {
      this.backListener.remove()
    }
  },
  methods: {
    scrollToTop() {
      const scrollDuration = 10000
      const scrollStep = -window.scrollY / (scrollDuration / 15)
      let scrollInterval = null

      function step() {
        window.scrollBy(0, scrollStep)
        if (window.scrollY <= 0) {
          clearInterval(scrollInterval)
        } else {
          requestAnimationFrame(step)
        }
      }

      scrollInterval = setInterval(step, 15)
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 600
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        // this.direction = 'right'
        this.$router.go(-1)
      } else if (direction === 'left') {
        // this.direction = 'left'
        this.$router.go(1)
      }
    },
    checkStatus() {
      this.$router.go()
    },
    newApplicant() {
      this.loading = true
      this.$axios
        .put('v2/club/member', { member: [], applicant: [this.user], blocked: [] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste poslali zatražili članstvo u klubu'),
            type: 'is-success',
          })
          this.$auth.fetchUser()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    redirectToFindClub() {
      if (!this.$store.state.club.id) {
        this.$store.dispatch('club/init_club', { force: true })
        // this.$router.push(this.localePath('/login/club'))
      }
    },
    async registerNotifications() {
      const permStatus = await PushNotifications.checkPermissions()
      if (permStatus.receive === 'granted') {
        this.$store.dispatch('notifications/hasGranted')
      }
    },
  },
}
</script>
