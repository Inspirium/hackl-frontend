<template>
  <div class="container">
    <hero :page="'notification'">
      <h1 class="has-text-white navigation__title">{{ $t('obavijesti') }}</h1>
    </hero>
    <div class="buttons m-t-25 p-x-16">
      <b-button
        class="softshadow"
        type="is-small noborder"
        pack="fal"
        icon-right="cog"
        rounded
        @click="$router.push(localePath('/notification/edit'))"
      >
        {{ $t('Uredi') }}
      </b-button>
      <b-button
        class="softshadow"
        type="is-small noborder"
        pack="fal"
        icon-right="bell-on"
        :loading="loading1"
        rounded
        @click="subscribe"
      >
        {{ $t('primajNotifikacije') }}
      </b-button>
    </div>

    <!--    <div class="notify" @click.prevent="subscribe">-->
    <!--      <div class="notification-info is-primary m-b-30">-->
    <!--        <b-icon v-if="!loading1" icon="bell-on" pack="fal" type="is-white" class="is-larger"> </b-icon>-->
    <!--        <div v-else class="align__centar__x">-->
    <!--          <b-icon-->
    <!--            class="comment-send m-b-2"-->
    <!--            custom-class="rotating"-->
    <!--            icon="spinner"-->
    <!--            size="is-medium"-->
    <!--            type="is-white"-->
    <!--            pack="fal"-->
    <!--          ></b-icon>-->
    <!--        </div>-->

    <!--        <div class="has-text-centered is-size-5 has-text-white fw600 m-t&#45;&#45;5">{{ $t('primajNotifikacije') }}</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div
      v-if="loadingNotification && activeTab === 0 && notifications.length === 0"
      class="align__centar__x m-t-30 loading_z_spinner--bottom"
    >
      <b-icon
        class="comment-send"
        custom-class="rotating"
        icon="spinner"
        size="is-large"
        type="is-primary"
        pack="far"
      ></b-icon>
    </div>

    <div v-if="notifications.length" v-touch:swipe="swipeHandler" class="home__reservation page__notification">
      <div class="buttons">
        <b-button
          class="m-b-10"
          type="is-primary"
          pack="fal"
          icon-right="comment-times"
          rounded
          :loading="loading"
          @click.prevent="markAll"
        >
          {{ $t('oznaiSveProitanim') }}
        </b-button>
      </div>
      <template v-if="isAdmin">
        <div class="divider-line-1"></div>
        <div class="buttons m-t-25 p-x-16">
          <b-button
            class="softshadow"
            type="is-small noborder"
            pack="fal"
            icon-right="users"
            :loading="loading1"
            rounded
            @click="$router.push(localePath('/notification/message'))"
          >
            {{ $t('Pošalji obavijest') }}
          </b-button>
        </div>
      </template>

      <b-tabs v-model="activeTab" position="is-centered" size="is-medium">
        <b-tab-item :label="$t('sve')">
          <div class="x-container m-t-15">
            <div class="activity__reservation">
              <div class="activity__box">
                <div class="tablelist">
                  <b-table :data="notifications" :mobile-cards="false" :bordered="false">
                    <b-table-column
                      v-slot="props"
                      :td-attrs="(row) => ({ class: !row.read_at ? 'active list__image-col' : 'list__image-col' })"
                      field="first_name"
                    >
                      <div class="align__centar__y" @click="markOne(props.row)">
                        <div class="list__img">
                          <TennisImage :size="[42, 42]" :src="props.row.data.user.image" class="user_image" alt="" />
                        </div>
                        <div class="list__content">
                          <div class="align__centar__y">
                            <h4 class="has-text-grey-light fw600 is-size-65">
                              {{ props.row.data.time | moment('LT[ — ]D MMM') }}
                            </h4>
                            <div :class="['x-tag', tagColor(props.row.type), 'm-l-auto', 'm-r-5']">
                              {{ tagName(props.row.type) }}
                            </div>
                          </div>
                          <h3 class="fw600 is-size-55">
                            {{ props.row.data.user.name }}
                          </h3>
                          <h4 class="is-size-65">
                            {{ props.row.data.message }}
                          </h4>
                        </div>
                      </div>
                    </b-table-column>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('rezervacije')">
          <div class="x-container m-t-15">
            <div class="activity__reservation">
              <div class="activity__box">
                <div class="tablelist">
                  <b-table :data="notificationsReservation" :mobile-cards="false" :bordered="false">
                    <b-table-column
                      v-slot="props"
                      :td-attrs="(row) => ({ class: !row.read_at ? 'active list__image-col' : 'list__image-col' })"
                      field="first_name"
                    >
                      <div class="align__centar__y" @click="markOne(props.row)">
                        <div class="list__img">
                          <TennisImage :size="[42, 42]" :src="props.row.data.user.image" class="user_image" alt="" />
                        </div>
                        <div class="list__content">
                          <div class="align__centar__y">
                            <h4 class="has-text-grey-light fw600 is-size-65">
                              {{ props.row.data.time | moment('LT[ — ]D MMM') }}
                            </h4>
                            <div :class="['x-tag', 'primary-light', 'm-l-auto', 'm-r-5']">
                              {{ tagName(props.row.type) }}
                            </div>
                          </div>
                          <h3 class="fw600 is-size-55">
                            {{ props.row.data.user.name }}
                          </h3>
                          <h4 class="is-size-65">
                            {{ props.row.data.message }}
                          </h4>
                        </div>
                      </div>
                    </b-table-column>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import Notification from '@/models/Notification'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'

export default {
  name: 'Notifications',
  components: {
    hero,
    TennisImage,
  },
  async fetch() {
    await this.getNotification()
  },
  data() {
    return {
      activeTab: 0,
      notifications: [],
      notificationsReservation: [],
      notifications_page: 1,
      notificationsReservation_page: 1,
      total_notifications_pages: 1,
      total_notificationsReservation_pages: 1,
      link: '/',
      bottom: false,
      test: '',
      loading: false,
      loading1: false,
      hasSubscription: false,
      loadingNotification: false,
    }
  },
  computed: {
    canNotify() {
      return 'Notification' in window
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getNotification()
      }
    },
    activeTab() {
      this.getNotification()
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    if (window.Notification.permission === 'granted') {
      this.hasSubscription = true
    }
  },
  methods: {
    subscribe() {
      this.loading1 = true
      if (Capacitor.isNativePlatform()) {
        PushNotifications.requestPermissions().then((status) => {
          if (status.receive === 'granted') {
            PushNotifications.register()
          }
          this.loading1 = false
        })
      } else {
        this.$fire.messaging.getToken({ vapidKey: process.env.FIREBASE_VAPID }).then((currentToken) => {
          if (currentToken) {
            this.$axios.post('v2/notification/subscribe', { token: currentToken })
            this.$store.commit('notifications/setGranted')
            this.loading1 = false
          } else {
            this.$buefy.toast.open({
              message: this.$t('Molimo vas da omogućite primanje obavijesti potvrdom na iskočni prozor'),
              type: 'is-primary',
            })
            this.loading1 = false
          }
        })
      }
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    getNotification() {
      this.loadingNotification = true
      if (this.activeTab === 0) {
        Notification.where('-type', 'App\\Notifications\\NewReservation')
          .page(this.notifications_page)
          .get()
          .then((res) => {
            this.notifications = [...this.notifications, ...res.data]
            this.notifications_page++
            this.total_notifications_pages = res.meta.last_page
            this.loadingNotification = false
          })
      } else {
        Notification.where('type', 'App\\Notifications\\NewReservation')
          .page(this.notificationsReservation_page)
          .get()
          .then((res) => {
            this.notificationsReservation = [...this.notificationsReservation, ...res.data]
            this.notificationsReservation_page++
            this.total_notificationsReservation_pages = res.meta.last_page
            this.loadingNotification = false
          })
      }
    },
    tagName(tag) {
      switch (tag) {
        case 'App\\Notifications\\AddedToReservation':
          return this.$t('Dodan si')
        case 'App\\Notifications\\InvitedToReservation':
          return this.$t('Dodan si')
        case 'App\\Notifications\\NewReservation':
          return this.$t('Rezervacija')
        case 'App\\Notifications\\NewMultipleReservation':
          return this.$t('Ponavljajuća rezervacija')
        case 'App\\Notifications\\AdminError':
          return this.$t('Greška')
        case 'App\\Notifications\\ContactMessage':
          return this.$t('Poruka')
        case 'App\\Notifications\\NewClassifiedComment':
          return this.$t('Komentar na oglasu')
        case 'App\\Notifications\\NewMember':
          return this.$t('Novi član')
        case 'App\\Notifications\\NewMessage':
          return this.$t('Poruka')
        case 'App\\Notifications\\NewNews':
          return this.$t('Obavijest')
        case 'App\\Notifications\\NewResultComment':
          return this.$t('Komentar na rezultat')
        case 'App\\Notifications\\RequestResultVerificationNotification':
          return this.$t('Potvrda rezultata')
        case 'App\\Notifications\\ReservationCanceled':
          return this.$t('Otkazivanje rezervacije')
        case 'App\\Notifications\\ResetPasswordNotification':
          return this.$t('Promjena lozinke')
        case 'App\\Notifications\\ResultDisputed':
          return this.$t('Odbijen rezultat')
        case 'App\\Notifications\\ResultVerified':
          return this.$t('Potvrđen rezultat')
        case 'App\\Notifications\\NewApplicant':
          return this.$t('Novi član - potvrda')
        case 'App\\Notifications\\ApplicationApproved':
          return this.$t('Potvrda članstva')
        case 'App\\Notifications\\WatcherAnnounced':
          return this.$t('Najavljen dolazak')
        case 'App\\Notifications\\TournamentStart':
          return this.$t('Turnir je počeo')
        case 'App\\Notifications\\NewPlayerInTournament':
          return this.$t('Prijava u turnir')
        case 'App\\Notifications\\NewPlayerInLeague':
          return this.$t('Prijava u ligu')
        case 'App\\Notifications\\NewProfileData':
          return this.$t('Novo profiliranje')
        case 'App\\Notifications\\TestNotification':
          return this.$t('Test')
        case 'App\\Notifications\\WeatherUpdate':
          return this.$t('Vremenska prognoza')
        case 'App\\Notifications\\LeagueStart':
          return this.$t('Liga je počela')
        case 'App\\Notifications\\Notification':
          return this.$t('Obavijest')
        case 'App\\Notifications\\AddedToMultipleReservations':
          return this.$t('Dodan si na ponavljajuću rezervaciju')
        case 'App\\Notifications\\Shop\\NewWorkOrderCreated':
          return this.$t('Radni nalog')
        case 'App\\Notifications\\Shop\\NewWorkOrderCompleted':
          return this.$t('Nalog završen')
        case 'App\\Notifications\\Shop\\NewOrderCreated':
          return this.$t('Nova narudžba')
        case 'App\\Notifications\\Shop\\NewOrderCompleted':
          return this.$t('Narudžba završena')
        case 'App\\Notifications\\Shop\\ReservationCanceledPayment':
          return this.$t('Otkazana neplaćena rezervacija')
      }
      return this.$t('Nije unesen')
    },
    tagColor(tag) {
      switch (tag) {
        case 'App\\Notifications\\AddedToReservation':
          return 'badge-acrylic'
        case 'App\\Notifications\\InvitedToReservation':
          return 'badge-acrylic'
        case 'App\\Notifications\\NewReservation':
          return 'badge-acrylic'
        case 'App\\Notifications\\NewMultipleReservation':
          return 'badge-acrylic'
        case 'App\\Notifications\\AdminError':
          return 'is-red'
        case 'App\\Notifications\\ContactMessage':
          return 'is-primary'
        case 'App\\Notifications\\NewClassifiedComment':
          return 'is-primary'
        case 'App\\Notifications\\NewMember':
          return 'green'
        case 'App\\Notifications\\NewMessage':
          return 'is-primary'
        case 'App\\Notifications\\NewResultComment':
          return 'badge-artifical-clay'
        case 'App\\Notifications\\RequestResultVerificationNotification':
          return 'badge-artifical-clay'
        case 'App\\Notifications\\ReservationCanceled':
          return 'is-red'
        case 'App\\Notifications\\ResetPasswordNotification':
          return 'is-red'
        case 'App\\Notifications\\NewNews':
          return 'is-red'
        case 'App\\Notifications\\ResultDisputed':
          return 'is-red'
        case 'App\\Notifications\\ResultVerified':
          return 'darkgreen'
        case 'App\\Notifications\\NewApplicant':
          return 'green'
        case 'App\\Notifications\\ApplicationApproved':
          return 'darkgreen'
        case 'App\\Notifications\\WatcherAnnounced':
          return 'badge-carpet'
        case 'App\\Notifications\\TournamentStart':
          return 'is-orange'
        case 'App\\Notifications\\NewPlayerInTournament':
          return 'is-clay'
        case 'App\\Notifications\\NewPlayerInLeague':
          return 'is-clay'
        case 'App\\Notifications\\TestNotification':
          return 'badge-carpet'
        case 'App\\Notifications\\NewProfileData':
          return 'green'
        case 'App\\Notifications\\LeagueStart':
          return 'is-orange'
        case 'App\\Notifications\\WeatherUpdate':
          return 'is-orange'
        case 'App\\Notifications\\Notification':
          return 'badge-artificial-grass'
        case 'App\\Notifications\\AddedToMultipleReservations':
          return 'badge-acrylic'
        case 'App\\Notifications\\Shop\\NewWorkOrderCreated':
          return 'is-tirkiz'
        case 'App\\Notifications\\Shop\\NewWorkOrderCompleted':
          return 'badge-artificial-grass'
        case 'App\\Notifications\\Shop\\NewOrderCreated':
          return 'is-tirkiz'
        case 'App\\Notifications\\Shop\\NewOrderCompleted':
          return 'badge-artificial-grass'
        case 'App\\Notifications\\Shop\\ReservationCanceledPayment':
          return 'is-red'
      }
      return 'is-red'
    },
    markAsRead(id) {
      const n = new Notification(id)
      n.save()
    },
    markOne(item) {
      this.loading = true
      const n = new Notification({ id: item.id })
      n.save()
        .then(() => {
          if (item.data.link.includes('https://')) {
            window.open(item.data.link, '_blank')
          } else {
            this.$router.push(item.data.link ? this.localePath(item.data.link) : this.localePath('#'))
          }
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
    markAll() {
      this.loading = true
      this.$axios
        .get('v2/notification/all')
        .then((res) => {
          this.notifications = []
          this.$store.commit('notifications/number', 0)
          if (Capacitor.isNativePlatform()) {
            PushNotifications.removeAllDeliveredNotifications()
          }
          this.notificationsReservation_page = 1
          this.notifications_page = 1
          this.getNotification()
          this.$buefy.toast.open({
            message: this.$t('Sve su obavijesti označene pročitanima'),
            type: 'is-success',
          })
          this.loading = false
          this.$auth.fetchUser()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
  head() {
    return {
      title: 'Obavijesti',
    }
  },
}
</script>
