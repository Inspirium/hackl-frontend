<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Dnevni izvještaj')" :background="'is-primary'" />

    <div class="activity x-container">
      <!--      <div class="divider m-t-20"></div>-->
      <!--      <div class="fw600 has-text-centered m-t-10 m-b-5 is-size-3 line-height-19">Izvještaj</div>-->
      <!--      <div class="statistics_new m-b-10 m-t-15 softshadow">-->
      <!--        <div class="statistic__item">-->
      <!--          <div class="label&#45;&#45;center">Prihodi</div>-->
      <!--          <div class="label__num is-size-2 has-text-black50">-->
      <!--            <span class="has-text-primary fw400">{{ '458,50 €' }}</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="activity x-container m-t-20 p-t-10 p-b-10 statistics_new softshadow">
        <div class="has-text-centered fw600 is-size-6 has-text-black50 m-l-auto m-r-auto w100">
          {{ $t('dananjiPrihodi') }}
        </div>
        <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t--2 m-b-0">
          {{ '458,50 €' }}
        </div>
      </div>

      <div v-if="club.payment_accontation" class="m-t-20 softshadow radius__12 overflow-hidden">
        <div class="fw600 has-text-centered has-text-black80 is-size-6 p-t-7 p-b-7 is-bgblue">
          {{ $t('transkacijskiRaun') }}
        </div>
        <div class="statistics_new">
          <div class="statistic__item">
            <div class="label--center">{{ $t('uplate') }}</div>
            <div class="label__num is-size-4 has-text-black50">
              <span class="has-text-green fw600">{{ '+458,50 €' }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('plaanja') }}</div>
            <div class="label__num is-size-4 has-text-black50">
              <span class="has-text-danger fw600">{{ '-458,50 €' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons m-t-15">
        <b-button
          class="fw600 softshadow"
          type="is-small noborder__small"
          pack="fal"
          icon-right="long-arrow-right"
          rounded
          native-type="submit"
          tag="nuxt-link"
          :to="localePath('/admin/reports/')"
        >
          {{ $t('vieOPrihodima') }}
        </b-button>
      </div>

      <div class="fw600 has-text-centered m-b-5 is-size-55 line-height-19 flex align__centar__all">
        {{ $t('prihodiPoAdministratoru') }}
      </div>
      <div class="activity__box action__buttons">
        <div v-for="(item, index) in structureType" :key="index" class="action__item__small fw600">
          <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
          <div class="is-size-6 has-text-black80 m-r-5">{{ item.name }}</div>
          <span class="m-l-auto is-size-5 has-text-lightblue m-t--2">{{ item.amount }} €</span>
          <!--          <span>-->
          <!--            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-5 m-r&#45;&#45;5"> </b-icon>-->
          <!--          </span>-->
        </div>
      </div>
      <div class="fw600 has-text-centered m-t-15 m-b-5 is-size-55 line-height-19 flex align__centar__all">
        {{ $t('prihodiUsluga') }}
      </div>
      <div class="activity__box action__buttons">
        <div v-for="(item, index) in services" :key="index" class="action__item__small fw600">
          <div class="is-size-6 has-text-black80 m-r-5">{{ item.name }}</div>
          <span class="m-l-auto is-size-5 has-text-lightblue m-t--2">{{ item.amount }} €</span>
          <!--          <span>-->
          <!--            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-5 m-r&#45;&#45;5"> </b-icon>-->
          <!--          </span>-->
        </div>
      </div>
      <div class="fw600 has-text-centered m-t-40 is-size-3 line-height-19 flex align__centar__all">
        {{ $t('rezervacije') }}
      </div>
      <div class="m-t-15 softshadow radius__12 overflow-hidden">
        <div class="fw600 has-text-centered has-text-black80 is-size-6 p-t-7 p-b-7 is-bgblue">
          {{ $t('rezervacije') }}
        </div>
        <div class="statistics_new">
          <div class="statistic__item">
            <div class="label--center">{{ $t('sveukupno') }}</div>
            <div class="label__num is-size-4 has-text-black50">
              <span class="has-text-black80 fw600">{{ '55.895' }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('danas') }}</div>
            <div class="label__num is-size-4 has-text-black50">
              <span class="has-text-black80 fw600">{{ '45' }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('aktivne') }}</div>
            <div class="label__num is-size-4 has-text-black50">
              <span class="has-text-black80 fw600">{{ '-345' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fw600 has-text-centered m-t-20 m-b-5 is-size-55 line-height-19 flex align__centar__all">
        {{ $t('otkazivanjeRezervacija') }} <span class="x-tag is-primary m-l-7">{{ admins.length }}</span>
      </div>
      <div class="activity__box action__buttons">
        <div v-for="(item, index) in structureType" :key="index" class="action__item__small fw600">
          <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
          <div class="is-size-6 has-text-black80 m-r-5">{{ item.name }}</div>
          <div class="m-l-auto has-text-right">
            <div class="x-tag is-primary inlineblock">{{ $t('dvorana') }}</div>
            <div class="is-size-65 has-text-black80 m-t-2">12:00-14:00h</div>
          </div>
          <!--          <span>-->
          <!--            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-5 m-r&#45;&#45;5"> </b-icon>-->
          <!--          </span>-->
        </div>
      </div>
      <div class="buttons m-t-15 m-b-10">
        <b-button
          class="fw600 softshadow"
          type="is-small noborder__small"
          pack="fal"
          icon-right="long-arrow-right"
          rounded
          native-type="submit"
          tag="nuxt-link"
          :to="localePath('/admin/reports/')"
        >
          {{ $t('vieOOtkazivanjima') }}
        </b-button>
      </div>
      <div class="fw600 has-text-centered m-t-30 is-size-3 line-height-19 flex align__centar__all">
        {{ $t('lanovi') }}
      </div>
      <template v-if="admins.length">
        <div class="fw600 has-text-centered m-t-20 m-b-5 is-size-55 line-height-19 flex align__centar__all">
          {{ $t('administratoriUKlubu') }} <span class="x-tag is-primary m-l-7">{{ admins.length }}</span>
        </div>
        <div class="activity__box action__buttons">
          <div v-for="(item, index) in admins" :key="index" class="action__item__small fw600 w100">
            <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
            <div class="is-size-6 has-text-black80 m-r-5">{{ item.display_name }}</div>
            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-auto m-r--5" />
          </div>
        </div>
      </template>

      <template v-if="trainers.length">
        <div class="fw600 has-text-centered m-t-20 m-b-5 is-size-55 line-height-19 flex align__centar__all">
          {{ $t('treneriUKlubu') }} <span class="x-tag is-primary m-l-7">{{ trainers.length }}</span>
        </div>
        <div class="activity__box action__buttons">
          <div v-for="(item, index) in trainers" :key="index" class="action__item__small fw600">
            <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
            <div class="is-size-6 has-text-black80 m-r-5">{{ item.display_name }}</div>
            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-auto m-r--5" />
          </div></div
      ></template>
      <template v-if="blocked.length">
        <div class="fw600 has-text-centered m-t-20 m-b-5 is-size-55 line-height-19 flex align__centar__all">
          {{ $t('blokiraniLanovi') }} <span class="x-tag is-primary m-l-7">{{ blocked.length }}</span>
        </div>
        <div class="activity__box action__buttons">
          <div v-for="(item, index) in blocked" :key="index" class="action__item__small fw600">
            <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
            <div class="is-size-6 has-text-black80 m-r-5">{{ item.display_name }}</div>
            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-auto m-r--5" />
          </div>
        </div>
      </template>
      <template v-if="applicant.length">
        <div class="fw600 has-text-centered m-t-20 m-b-5 is-size-55 line-height-19 flex align__centar__all">
          {{ $t('aplikanti') }} <span class="x-tag is-primary m-l-7">{{ applicant.length }}</span>
        </div>
        <div class="activity__box action__buttons">
          <div v-for="(item, index) in applicant" :key="index" class="action__item__small fw600">
            <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small mr-3" alt="" />
            <div class="is-size-6 has-text-black80 m-r-5">{{ item.display_name }}</div>
            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-auto m-r--5" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Court from '~/models/Court'
import Reservation from '~/models/Reservation'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Dashboard',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      selectedCourtsActive: 1,
      selectedTimeSpan: 'day',
      selectedCourts: [],
      courts: [],
      dates: [],
      admins: [],
      trainers: [],
      blocked: [],
      applicant: [],
      reservations: [],
      club_players_total: null,
      total_reservations: null,
      heroImage: '/hero_court.jpg',
      structureType: [
        { name: 'Ivan Ivić', amount: 67, image: '/club-brand-image.jpg' },
        { name: 'Marko Markić', amount: 21, image: '/club-brand-image.jpg' },
        { name: 'Sven Čikara', amount: 9, image: '/club-brand-image.jpg' },
        { name: 'Karlo Rosandić', amount: 4, image: '/club-brand-image.jpg' },
      ],
      services: [
        { name: 'Rasvjeta', amount: 67, image: '/club-brand-image.jpg' },
        { name: 'Špananje', amount: 3, image: '/club-brand-image.jpg' },
      ],
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    this.getCourts()
    this.getTotalPlayers()
    this.getAdmins()
    this.getTrainers()
    this.getBlocked()
    this.getApplicant()
    this.loadReservations()
  },
  methods: {
    selectCourt(item) {
      if (this.selectedCourts.includes(item)) {
        this.selectedCourts.splice(this.selectedCourts.indexOf(item), 1)
      } else {
        this.selectedCourts.push(item)
      }
    },
    getCourts() {
      this.loading = true
      Court.where('is_active', this.selectedCourtsActive)
        .get()
        .then((res) => {
          // this.$buefy.toast.open({
          //   message: this.$t('Uspješno ste izmjenili osnovno članstvo'),
          //   type: 'is-success',
          // })

          this.courts = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getAdmins() {
      Player.where('club', this.$store.state.club.id)
        .where('is_admin', true)
        .get()
        .then((res) => {
          this.admins = res.data
        })
    },
    getTrainers() {
      Player.where('club', this.$store.state.club.id)
        .where('is_trainer', true)
        .get()
        .then((res) => {
          this.trainers = res.data
        })
    },
    getTotalPlayers() {
      Player.where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.club_players_total = res.meta.total
        })
    },
    getBlocked() {
      Player.where('club', this.$store.state.club.id)
        .where('club_member_status', 'blocked')
        .get()
        .then((res) => {
          this.blocked = res.data
        })
    },
    getApplicant() {
      Player.where('club', this.$store.state.club.id)
        .where('club_member_status', 'applicant')
        .get()
        .then((res) => {
          this.applicant = res.data
        })
    },
    loadReservations() {
      Reservation.where('club', this.$store.state.club.id)
        .where('from', '0000-00-00')
        .where('to', '2222-00-00')
        .get()
        .then((res) => {
          this.reservations = res.data
          this.total_reservations = res.meta.total
        })
    },
  },
}
</script>
