<template>
  <div class="">
    <div v-if="appBuildVersion && appBuildVersion < this.$store.state.app.app[system]" class="updateapp">
      <b-icon icon="exclamation-square" type="is-white" size="is-medium" pack="fal"> </b-icon>
      <p class="fw600 is-size-4">{{ $t('Ažurirajte aplikaciju') }}</p>
      <p class="fw500 is-size-65">
        {{ $t('Osigurajte pravilno funkcioniranje aplikacije ažuriranjem na najnoviju verziju') }}
      </p>
      <div class="buttons m-t-20">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fal"
          icon-right="arrows-rotate"
          rounded
          @click.prevent="updateApp"
        >
          {{ $t('Ažuriraj') }}
        </b-button>
      </div>
    </div>
    <nav class="topnav">
      <div class="container">
        <div class="cursor" @click="isMenuModalActive = true">
          <img class="hamburger" src="~assets/img/hamburger.svg" alt="" />
        </div>
        <div class="align__centar__all">
          <nuxt-link :to="localePath('/')" class="clubname lh12">{{ $store.state.club.name }}</nuxt-link>
          <span v-if="user && user.id === 2" class="m-t-5 m-l-10" @click="isModalMembersActive = true">
            <font-awesome-icon icon="fa-light fa-chevron-down" class="has-text-black80 iw15"> </font-awesome-icon>
          </span>
        </div>
        <div v-if="$auth.loggedIn" class="usermenu cursor" @click="isUserMenuModalActive = true">
          <div v-if="notifications.number !== 0" class="x-tag primary-light nav__notification">
            {{ notifications.number }}
          </div>

          <TennisImage :size="[200, 200]" :src="$auth.user.image" :alt="$auth.user.display_name" />
        </div>
        <div v-else class="usermenu">
          <nuxt-link :to="localePath('/login')" class="is-uppercase fw600 is-size-65">{{ $t('prijava') }}</nuxt-link>
        </div>
      </div>
      <b-modal :active.sync="isMenuModalActive" :width="640" scroll="keep" class="hidescrollbar">
        <div>
          <div class="modal-title has-text-light m-b-20">{{ $t('izbornik') }}</div>
          <div class="flex align__centar__y">
            <div
              class="align__centar__y select-item--menu--invert m-b-15 flex-grow-1"
              @click="isModalMembersActive = true"
            >
              <b-icon class="m-l-5 m-r-10" icon="random" size="is-smaller" type="is-white" pack="fal"></b-icon>
              <div class="fw600 is-size-6 has-text-white">{{ $t('promjeniKlub') }}</div>
            </div>
            <div
              class="align__centar__y select-item--menu--invert m-b-15 m-l-10 p-r-25 w-auto"
              @click="
                isModalMembersActive = false
                langOpen = true
              "
            >
              <div class="fw600 is-size-6 has-text-white flex align__centar__y">
                <img :src="'/lang/' + $i18n.locale + '.png'" class="radius__full" />
                <div v-if="getlang.length" class="fw600">{{ getlang[0].local.toUpperCase() }}</div>
              </div>
            </div>
          </div>
          <div v-if="$store.state.club.id === 26 && user" class="m-b-20" @click="isMenuModalActive = false">
            <div class="fw600 has-text-white is-size-65 m-b-3">
              {{ Object.keys(user.club_member).length > 1 ? $t('Tvoji klubovi') : $t('Tvoj klub') }}
            </div>
            <div v-for="(item, key, index) in user.club_member" v-show="key !== '26'" :key="index">
              <div
                v-if="index < 3"
                class="align__centar__y select-item--menu--invert"
                @click.prevent="submit(item, key)"
              >
                <img :src="item.logo" class="min-w-33 m-r-10" alt="" />
                <div class="fw600 is-size-55 has-text-white">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div v-else class="m-t-10" @click="isMenuModalActive = false">
            <div class="align__centar__y select-item--menu--invert" @click.prevent="submitToTopClub()">
              <img src="/logo__login-sign.svg" class="min-w-33 m-r-10" alt="" />
              <div class="fw600 is-size-55 has-text-white is-uppercase">{{ $t('mojtenisplus') }}</div>
              <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
            </div>
          </div>
          <div class="p-b-20" @click="isMenuModalActive = false">
            <div v-for="(item, index) in menu" :key="index">
              <template v-if="!(item.name === 'Rang ljestvica' && !club.hide_ranks)">
                <nuxt-link
                  v-if="tournamentClub(item)"
                  :to="localePath(item.link)"
                  class="align__centar__y select-item--menu"
                >
                  <img :src="item.image" alt="" />
                  <div class="menu-title has-text-black80">{{ $t(item.name) }}</div>
                </nuxt-link>
              </template>
            </div>
          </div>
        </div>
        <div v-if="appBuildVersion" class="fw600 p-b-200 is-size-65 has-text-white m-t-5">
          v{{ appBuildVersion }} - {{ this.$store.state.app.app[system] }}
        </div>
      </b-modal>
      <b-modal :active.sync="isUserMenuModalActive" :width="640" scroll="keep">
        <div v-if="$auth.loggedIn" class="my-menu">
          <div class="filter-list" @click="isUserMenuModalActive = false">
            <TennisImage :src="$auth.user.image" :size="[200, 200]" :alt="$auth.user.display_name" class="user_image" />
            <div class="buttons">
              <b-button
                tag="nuxt-link"
                :to="localePath('/player/' + user.id + '/edit')"
                class="m-t--30 is-smaller"
                type="is-primary"
                pack="fal"
                icon-right="user-edit"
                rounded
              >
                {{ $t('urediProfil') }}
              </b-button>
            </div>
            <div class="title fw400">{{ $auth.user.display_name }}</div>
            <div v-if="filterUsersClubWallet" class="has-text-centered is-size-6 has-text-white m-t--20 m-b-10 fw500">
              {{ $t('stanjeNaRaunu') }}
              <span
                class="fw600"
                :class="filterUsersClubWallet.amount > 0 ? 'has-text-lightblue' : 'has-text-danger'"
                >{{ $t('key5', { currency: filterUsersClubWallet.amount }) | currency }}</span
              >
            </div>
            <nuxt-link :to="localePath('/player/' + $auth.user.id)" class="select-item--menu">
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-user-circle"> </font-awesome-icon>
              <div class="menu-title">{{ $t('mojProfil') }}</div>
            </nuxt-link>
            <nuxt-link
              v-if="notifications.reservations > 0"
              :to="localePath('/player/' + $auth.user.id + '/reservation')"
              class="select-item--menu"
            >
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-racquet"> </font-awesome-icon>
              <div class="menu-title">{{ $t('Moje rezervacije') }}</div>
              <div class="x-tag primary-light m-l-auto m-r-5">
                {{ notifications.reservations }}
              </div>
            </nuxt-link>
            <nuxt-link
              v-if="notifications.orders > 0"
              :to="localePath('/player/' + $auth.user.id + '/orders')"
              class="select-item--menu"
            >
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-barcode-read"> </font-awesome-icon>
              <div class="menu-title">{{ $t('Moje narudžbe') }}</div>
              <div class="x-tag primary-light m-l-auto m-r-5">
                {{ notifications.orders }}
              </div>
            </nuxt-link>
            <nuxt-link
              v-if="notifications.workOrders > 0"
              :to="localePath('/player/' + $auth.user.id + '/workorders')"
              class="select-item--menu"
            >
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-person-digging"> </font-awesome-icon>
              <div class="menu-title">{{ $t('Moji radni nalozi') }}</div>
              <div class="x-tag primary-light m-l-auto m-r-5">
                {{ notifications.workOrders }}
              </div>
            </nuxt-link>
            <nuxt-link v-if="$auth.user.is_admin || isCashier" :to="localePath('/admin')" class="select-item--menu">
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-user-cog"> </font-awesome-icon>
              <div class="menu-title">{{ $t('administracija') }}</div>
            </nuxt-link>
            <nuxt-link :to="localePath('/notification')" class="select-item--menu">
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-bells"> </font-awesome-icon>
              <div class="menu-title">{{ $t('obavijesti') }}</div>
              <div v-if="notifications.number !== 0" class="x-tag primary-light m-l-auto m-r-5">
                {{ notifications.number }}
              </div>
            </nuxt-link>
            <nuxt-link :to="localePath('/messages')" class="select-item--menu">
              <font-awesome-icon class="m-r-10 m-l-5" icon="fa-light fa-comments"> </font-awesome-icon>
              <div class="menu-title">{{ $t('poruke') }}</div>
              <div v-if="notifications.unreads !== 0" class="x-tag primary-light m-l-auto m-r-5">
                {{ notifications.unreads }}
              </div>
            </nuxt-link>
            <div v-if="$auth.loggedIn" class="select-item--menu has-background-danger has-text-white" @click="logout">
              <b-icon class="m-r-10 m-l-5" type="is-white" pack="fal" icon="times-circle"> </b-icon>
              <div class="menu-title">{{ $t('odjaviSe') }}</div>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="hidescrollbar">
        <modalMembers :title="$t('odaberiKlub')" style="min-height: 200px" @club="newClub"></modalMembers>
      </b-modal>
      <b-modal :active.sync="langOpen" :width="640" scroll="clip">
        <modalLanguange
          :title="$t('promjenaJezika')"
          style="min-height: 200px"
          @closeit="isMenuModalActive = false"
        ></modalLanguange>
      </b-modal>
    </nav>
  </div>
</template>

<script>
import Wallet from '@/models/Wallet'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import TennisImage from '@/components/TennisImage.vue'
import { App } from '@capacitor/app'
import ShopOrder from '~/models/ShopOrder'
import Reservation from '~/models/Reservation'
import modalMembers from '~/components/modal/ModalClubs'
import modalLanguange from '~/components/modal/ModalLanguange'
import WorkOrder from '~/models/WorkOrder'

export default {
  name: 'Mainmenu',
  components: {
    modalMembers,
    modalLanguange,
    TennisImage,
  },
  data() {
    return {
      isMenuModalActive: false,
      isUserMenuModalActive: false,
      isModalMembersActive: false,
      reservations: [],
      player: [],
      langOpen: false,
      funds: 0,
      total: 0,
      totalOrders: null,
      totalWorkOrders: null,
      clubs: [],
      appBuildVersion: '',
      system: 'web',
    }
  },
  computed: {
    filterUsersClubWallet() {
      return this.$user.wallet(this.user.wallets)
    },
    filteredClubs() {
      const obj = {}
      for (let i = 0; i < this.clubs.length; i++) {
        const element = this.clubs[i]
        obj[element.id] = element
      }
      return obj
    },
    notifications() {
      return this.$store.state.notifications
    },
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
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
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
    menu() {
      return [
        {
          name: 'Početna',
          image: '/topnav/home_1.svg',
          link: '/',
        },
        {
          name: 'Prostori',
          image: '/topnav/reservation_1.svg',
          link: '/courts',
        },
        {
          name: 'Korisnici',
          image: '/topnav/players_1.svg',
          link: '/player',
        },
        {
          name: 'Zaprimljene prijave',
          image: '/topnav/schedule_1.svg',
          link: '/schedule',
        },

        {
          name: 'novosti',
          image: '/topnav/news_1.svg',
          link: '/news',
        },
        {
          name: 'O gradskom odboru',
          image: `${this.club.logo}`,
          link: `/clubs/${this.club.id}/myclub`,
        },
        {
          name: 'oAplikaciji',
          image: '/topnav/about_1.svg',
          link: '/info',
        },
      ]
    },
  },
  mounted() {
    if (this.$auth.loggedIn) {
      // this.loadReservations()
      // this.getOrders()
      // this.getWorkOrders()
      this.getNotifications()
      this.getFunds()
    }
    if (Capacitor.getPlatform() !== 'web') {
      this.getAppBuildVersion()
      this.$store.dispatch('app/initVersion')
    } else {
      this.appBuildVersion = ''
    }
  },
  methods: {
    async updateApp() {
      await Browser.open({ url: this.$store.getters['app/getLink'] })
    },
    getAppBuildVersion() {
      App.getInfo().then((version) => {
        this.appBuildVersion = parseInt(version.version.replace(/\./g, ''))
      })
      this.system = Capacitor.getPlatform()
    },
    submit(club, key) {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://${club.link}tenis.plus`
      } else {
        this.$store.commit('club/setId', key)
        this.$store.dispatch('club/init_club', { force: true })
      }
    },
    submitToTopClub() {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://my.tenis.plus`
      } else {
        this.$store.commit('club/setId', 26)
        this.$store.dispatch('club/init_club', { force: true })
        this.$router.push(this.localePath('/'))
      }
    },
    getClubs() {
      /* Club.get().then((res) => {
        this.clubs = res.data
      }) */
    },
    async getFunds() {
      if (this.user.wallets.length && this.$store.state.club.id) {
        this.funds = await Wallet.where('club', this.$store.state.club.id).$find(this.user.wallets[0].id)
      }
    },
    tournamentClub(item) {
      if (
        (item.name === 'Lige' && this.club.type === 'tournament') ||
        (item.name === 'Rang ljestvica' && this.club.type === 'tournament')
      ) {
        return false
      } else {
        return true
      }
    },
    newClub(subdomain) {
      this.isModalMembersActive = false
    },
    getNotifications() {
      this.$store.dispatch('notifications/init')
    },
    loadReservations() {
      if (this.$auth.loggedIn) {
        Reservation.where('player', this.user.id)
          .where('from', this.today)
          .get()
          .then((res) => {
            this.total = res.meta.total
          })
      }
    },
    getOrders() {
      ShopOrder.where('club', this.$store.state.club.id)
        .where('buyer', this.user.id)
        .get()
        .then((res) => {
          this.totalOrders = res.meta.total
        })
    },
    getWorkOrders() {
      WorkOrder.where('club', this.$store.state.club.id)
        .where('assignee', this.user.id)
        .get()
        .then((res) => {
          this.totalWorkOrders = res.meta.total
        })
    },
    async logout() {
      const locale = this.$i18n.locale
      await this.$auth.logout()
      window.localStorage.clear()
      this.isUserMenuModalActive = false
      await this.$router.push(this.localePath('/login', locale))
    },
  },
}
</script>
