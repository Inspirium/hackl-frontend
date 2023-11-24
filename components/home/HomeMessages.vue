<template>
  <div v-if="notifications.length" class="home__reservation page__notification">
    <div class="x-container activity">
      <div class="activity__reservation">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/notification')" class="fw600"
            >{{ $t('obavijesti') }}
            <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
          </nuxt-link>
        </div>
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
                        {{ props.row.data.time | moment('LT[, ]DD.MM.') }}
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
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import Notification from '~/models/Notification'

export default {
  name: 'HomeNotifications',
  components: {
    TennisImage,
  },
  async fetch() {
    await this.getNotifications()
  },
  data() {
    return {
      notifications: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
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
        case 'App\\Notifications\\LeagueStart':
          return this.$t('Liga je počela')
        case 'App\\Notifications\\WeatherUpdate':
          return this.$t('Vremenska prognoza')
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
    async getNotifications() {
      this.notifications = await Notification.where('read', 'unread').limit(3).$get()
    },
  },
}
</script>

<style scoped>
.activity__reservation h4 {
  color: $black60;
}
</style>
