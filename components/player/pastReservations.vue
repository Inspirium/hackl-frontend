<template>
  <div class="home__reservation p-b-100">
    <div class="x-container">
      <TimeRange :default-selected="'this_month'" @timespan="timerange($event)" />
    </div>
    <div v-if="pastReservations.length > 0" class="">
      <div class="m-t-15 m-b-5 fw600 is-size-4 has-text-centered">
        {{ $t('Ukupno rezervacija') }}:
        <span v-if="pastReservationsMeta.total" class="has-text-lightblue">{{ pastReservationsMeta.total }}</span>
      </div>
      <div class="divider-line-1 m-t-10 m-b-10"></div>
      <div class="flex align__centar__x p-x-16">
        <div class="m-b-10 fw600 is-size-65 m-r-5 m-l-5 has-text-centered">
          {{ $t('Prikazano') }}:
          <span class="has-text-lightblue">{{ pastReservations.length }}</span>
        </div>
        <div class="m-b-10 fw600 is-size-65 m-r-5 m-l-5 has-text-centered">
          {{ $t('Sati') }}:
          <span v-if="totalHours" class="has-text-lightblue">{{ totalHours }} {{ $t('h') }}</span>
        </div>
        <div class="m-b-10 fw600 is-size-65 m-r-5 m-l-5 has-text-centered">
          {{ $t('Cijena') }}:
          <span v-if="totalPrice" class="has-text-lightblue">{{ totalPrice | currency }}</span>
        </div>
      </div>
    </div>
    <div class="x-container p-b-100 relative">
      <div class="activity__box m-t-10">
        <div class="tablelist relative">
          <b-table :data="pastReservations" :bordered="false" :mobile-cards="false">
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
              <a class="m-l-10">
                <div class="list__content">
                  <div class="fw600 is-size-65 has-text-lightblue m-r-10 nowrap align__centar__x flex__column w100">
                    <span class="is-uppercase">{{
                      $moment(props.row.from).format('DD.' + 'MM.' + ', ' + 'dddd')
                    }}</span>
                    <div class="flex align__centar__y">
                      <span class="fw600 title-num is-size-6">{{
                        $moment(props.row.from).format('LT') + ' — ' + $moment(props.row.to).format('LT')
                      }}</span>
                      <b-icon
                        v-if="props.row.is_paid"
                        icon="check-circle"
                        type="is-success"
                        size="is-small-9"
                        pack="fal"
                        class="m-l-1 m-t--2"
                      >
                      </b-icon>
                      <b-icon
                        v-else
                        icon="times-circle"
                        type="is-danger"
                        size="is-small-9"
                        pack="fal"
                        class="m-l-1 m-t--2"
                      >
                      </b-icon>
                    </div>
                    <div v-if="props.row.created_by" class="has-text-black50 m-t-2">
                      {{ $t('Rezervirao') }}:
                      <span class="">{{ props.row.created_by.display_name }}</span>
                    </div>
                    <div v-if="$store.state.club.id === 26" class="has-text-black50 m-t-2">
                      {{ $t('klub') }}:
                      <span class="">{{ props.row.court.club.name }}</span>
                    </div>
                  </div>
                </div>
                <b-tag v-if="props.row.court" type="is-info">{{ props.row.court.name }}</b-tag>
                <b-tag v-else type="is-danger">{{ $t('Obrisan teren') }}</b-tag>
              </a>
            </b-table-column>
            <template v-if="!pastReservations.length && !loadingPast">
              <div class="has-text-centered m-t-30">
                <b-icon icon="calendar-times" size="is-medium" type="is-danger" pack="fal"></b-icon>
                <div class="m-t-5 m-b-5 fw600 is-size-6 has-text-centered">{{ $t('nemaRezervacija') }}</div>
              </div>
            </template>
          </b-table>
        </div>
      </div>
      <template>
        <transition v-if="loadingPast" name="fade">
          <div class="align__centar__x loading_z_spinner--bottom m-t-20">
            <b-icon
              class="comment-send m-b-20"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-primary"
              pack="far"
            ></b-icon>
          </div>
        </transition>
      </template>
    </div>
  </div>
</template>

<script>
import Reservation from '~/models/Reservation'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'PastReservations',
  components: {
    TimeRange,
  },
  data() {
    return {
      pastReservations: [],
      pastReservationsMeta: {},
      date: this.$moment(),
      loading: false,
      loadingPast: false,
      nomore: false,
      total: 0,
      last_page: 1,
      bottom: '',
      offset: 1,
      reservationTimeRange: '',
    }
  },
  computed: {
    totalPrice() {
      return this.pastReservations.reduce((total, reservation) => {
        const reservationPrice = reservation.prices.reduce((subtotal, price) => subtotal + price, 0)
        return total + reservationPrice
      }, 0)
    },
    totalHours() {
      return this.pastReservations.reduce((total, reservation) => {
        const from = new Date(reservation.from)
        const to = new Date(reservation.to)
        const durationMilliseconds = to - from
        const durationHours = durationMilliseconds / (1000 * 60 * 60) // Convert milliseconds to hours
        return total + durationHours
      }, 0)
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getReservations()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  methods: {
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
        this.pastReservations = []
        this.nomore = false
        this.getReservations()
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
        this.pastReservations = []
        this.nomore = false
        this.getReservations()
      } else {
        this.reservationTimeRange = item
        this.pastReservations = []
        this.nomore = false
        this.getReservations()
      }
    },
    getReservations() {
      if (this.last_page < this.offset) return
      this.loadingPast = true
      Reservation.page(this.offset)
        .where('player', this.$route.params.id)
        .where('active_between', this.reservationTimeRange)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.pastReservations = res.data
          } else {
            this.pastReservations = [...this.pastReservations, ...res.data]
          }
          if (res.meta.last_page === this.offset) {
            this.nomore = true
          }
          this.pastReservationsMeta = res.meta
          this.last_page = res.meta.last_page
          this.loadingPast = false
        })
        .catch(() => {
          this.loadingPast = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
