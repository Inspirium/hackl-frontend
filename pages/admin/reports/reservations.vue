<template>
  <div class="p-b-150">
    <PageHeader :title="'Rezervacije'" />
    <div class="fw600 has-text-centered has-text-black50 w100 is-size-6 m-t-20 m-b-20 p-x-16">
      {{ $t('Popis članova s najviše rezervacija u odabranom vremenskom razdoblju') }}
    </div>
    <div v-show="!activeReservation" class="x-container">
      <TimeRange :default-selected="'this_year'" @timespan="timerange($event)" />
    </div>
    <div class="">
      <!--      <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19 m-t-5">-->
      <!--        {{ $t('Prikaži aktivne rezervacije') }}-->
      <!--      </div>-->
      <div class="buttons m-t-20 m-b-0">
        <b-button
          :type="{
            'is-small': true,
            noborder: true,
            'is-primary has-text-white': activeReservation,
          }"
          :icon-right="activeReservation ? 'times' : ''"
          :class="{ softshadow: true, 'invert-small-button': activeReservation }"
          pack="far"
          rounded
          @click="
            activeReservation = !activeReservation
            getReservations()
          "
        >
          {{ $t('Prikaži aktivne rezervacije') }}
        </b-button>
      </div>
    </div>

    <div class="activity x-container relative">
      <template>
        <div v-if="reservations.length" class="is-white radius__5 softshadow">
          <div class="bb1-10"></div>
          <div v-for="(item, index) in reservations" :key="index + 'ob'" class="">
            <template v-if="item.players">
              <nuxt-link
                v-if="item.players.length"
                :to="localePath('/player/' + item.players[0].id)"
                class="fw600 align__centar__all p-r-10 p-l-10 p-t-7 p-b-7 bb1-10"
              >
                <div v-if="item.image" class="list__img">
                  <TennisImage :size="[42, 42]" :src="item.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <h4 class="fw600 is-size-55 m-t--2">{{ item.display_name }}</h4>
                  <div class="fw600 is-size-65 has-text-black30 align__centar__y flex">
                    <!--                  <b-icon-->
                    <!--                    icon="ban"-->
                    <!--                    pack="far"-->
                    <!--                    type="is-danger"-->
                    <!--                    size="is-small-10 top-5"-->
                    <!--                    class="relative has-text-black30"-->
                    <!--                  ></b-icon>-->
                    <span class="has-text-black30">{{ $t('Ukupno otkazivanja') }}:</span
                    ><span class="m-l-4 has-text-danger">{{ item.inactive_reservations_count }} </span>
                  </div>
                </div>
                <div class="">
                  <div class="fw600 has-text-black80 is-size-5 m-l-auto nowrap">
                    {{ item.reservations_count }}
                  </div>
                </div>
              </nuxt-link>
            </template>
          </div>
        </div>
        <template v-if="loading">
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
        <section v-if="!reservations.length && !loading" class="">
          <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <p class="fw600 is-size-6 has-text-centered has-text-black50 m-b-10">
              {{ $t('nemaPodatakaZaUneseneVrijednosti') }}
            </p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import ReservationCount from '~/models/ReservationCount'
import PageHeader from '~/components/headers/blankBack'
import TimeRange from '~/components/reports/TimeRange'
import TennisImage from '~/components/TennisImage'

export default {
  name: 'Reports',
  components: {
    TimeRange,
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      loading: false,
      activeReservation: false,
      selectedType: 'all',
      selectedCourtsActive: 1,
      selectedTimeSpan: 'day',
      selectedCourts: [],
      reservations: [],
      reservationTimeRange: '',
      dates: [],
      heroImage: '/hero_court.jpg',
    }
  },
  computed: {
    activeReservationSpan() {
      const min = this.$moment().format('YYYY-MM-DD')
      const max = this.$moment().add(1, 'y').format('YYYY-MM-DD')
      return min + ',' + max
    },
  },
  mounted() {
    // this.getReservations()
  },
  methods: {
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
        this.reservations = []
        this.getReservations()
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
        this.reservations = []
        this.getReservations()
      } else {
        this.reservationTimeRange = item
        this.reservations = []
        this.getReservations()
      }
    },
    getReservations() {
      this.loading = true
      const rc = new ReservationCount()
      rc.where('active_between', this.activeReservation ? this.activeReservationSpan : this.reservationTimeRange)
        .get()
        .then((res) => {
          this.reservations = res
          this.loading = false
        })
    },
  },
}
</script>
