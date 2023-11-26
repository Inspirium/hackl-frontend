<template>
  <div class="p-b-500">
    <location key="1" class="" @location="setLocation" @update="noLocation()" />
    <div class="bodyWrap p-b-150">
      <hero :page="'courts'" :options="heroImage">
        <h1 class="has-text-white">{{ $t('Rezerviraj termin') }}</h1>
      </hero>
      <div class="divider-line-1 m-t-0"></div>
      <div class="fw600 has-text-centered w100 has-text-lightblue m-t-20 m-b-10 is-size-6">
        {{ $t('Odaberi dan i vrijeme') }}
      </div>
      <div class="buttons m-t-10 m-b-5">
        <b-button
          v-for="(item, index) in dates"
          :key="index"
          class="m-t-5 m-b-5 m-l-5 m-r-5"
          :class="{ softshadow: true, 'invert-small-button': selected_index === index }"
          :type="{
            'is-small': true,
            noborder: true,
            'is-primary has-text-white': selected_index === index,
          }"
          pack="fal"
          rounded
          @click.prevent="updateSelectedDay(index)"
        >
          {{ item }}
        </b-button>
      </div>
      <div class="divider-line-1 m-t-0"></div>
      <div class="hour-select w100 flex flex__column align__centar__all m-t-10 m-b-10">
        <div class="hour-box">
          <div class="hour-item">
            <div
              class="fw600 is-size-1 is-white hour-hour hour-item softshadow rounded-md relative"
              @click="isModalHourActive = true"
            >
              {{ from }} <span class="relative hour-item-zero">00</span>
            </div>
            <div class="fw600 is-size-2 p-r-5 p-l-5 hour-item">-</div>
            <div
              class="fw600 is-size-1 is-white hour-item hour-hour softshadow rounded-md"
              @click="isModalHourActiveSecond = true"
            >
              {{ to }}<span class="relative hour-item-zero">00</span>
            </div>
          </div>
        </div>
      </div>
      <div class="divider-line-1 m-t-0"></div>
      <div class="buttons m-t-20 m-b-2">
        <b-button
          :type="{
            'is-small': true,
            noborder: true,
            'is-danger has-text-white': showFilter,
          }"
          :class="{ softshadow: true, 'invert-small-button': showFilter }"
          pack="fal"
          :icon-right="!showFilter ? 'filter' : 'times'"
          rounded
          @click="showFilter = !showFilter"
        >
          {{ $t('filtriraj') }}
        </b-button>
      </div>
      <div v-show="!showFilter" class="divider-line-1 m-t-0" />
      <transition name="fade" mode="out-in">
        <div v-show="showFilter">
          <div class="fw600 has-text-centered w100 has-text-lightblue m-t-5 m-b-10 is-size-6">Gradska četvrt</div>
          <b-field class="p-x-16">
            <b-autocomplete
              v-model="city"
              rounded
              field="name"
              :data="cities"
              :placeholder="$t('Odaberi gradsku četvrt')"
              clearable
              @select="(option) => (selected = option)"
            >
              <template #empty>{{ $t('Nema rezultata pretrage') }}</template>
            </b-autocomplete>
          </b-field>
          <div class="divider-line-1 m-t-10"></div>
          <div class="fw600 has-text-centered w100 has-text-lightblue m-t-5 m-b-10 is-size-6">Svojstva prostora</div>
          <div class="buttons m-t-5 m-b-5">
            <b-button
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': wifi }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': wifi,
              }"
              pack="fal"
              rounded
              @click.prevent="wifi = !wifi"
            >
              Wi-fi
            </b-button>
            <b-button
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': airconditioner }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': airconditioner,
              }"
              pack="fal"
              rounded
              @click.prevent="airconditioner = !airconditioner"
            >
              Klima
            </b-button>
            <b-button
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': heating }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': heating,
              }"
              pack="fal"
              rounded
              @click.prevent="heating = !heating"
            >
              Grijanje
            </b-button>
            <b-button
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': invalid }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': invalid,
              }"
              pack="fal"
              rounded
              @click.prevent="invalid = !invalid"
            >
              Pristup osobama s poteškoćama u kretanju
            </b-button>
          </div>
          <!--          <div class="divider-line-1 m-t-0"></div>-->
          <!--          <div class="fw600 has-text-centered w100 has-text-lightblue m-t-5 m-b-10 is-size-6">-->
          <!--            {{ $t('vrstaPodloge') }}-->
          <!--          </div>-->
          <!--          <div class="buttons m-t-5 m-b-5">-->
          <!--            <b-button-->
          <!--              v-for="(item, index) in surfaces"-->
          <!--              :key="index"-->
          <!--              class="m-t-5 m-b-5 m-l-5 m-r-5"-->
          <!--              :class="{ softshadow: true, 'invert-small-button': selectedSurface.title === item.title }"-->
          <!--              :type="{-->
          <!--                'is-small': true,-->
          <!--                noborder: true,-->
          <!--                'is-primary has-text-white': selectedSurface.title === item.title,-->
          <!--              }"-->
          <!--              pack="fal"-->
          <!--              rounded-->
          <!--              @click.prevent="updateSurfaces(item)"-->
          <!--            >-->
          <!--              {{ $t(item.title) }}-->
          <!--            </b-button>-->
          <!--          </div>-->
          <div class="divider-line-1 m-t-0"></div>
          <div class="divider-line-1 m-t-10"></div>
          <div class="has-text-centered m-t-20 m-b-20">
            <div class="label--center">{{ $t('Spremi opcije filtera') }}</div>
            <div class="radio__box--smaller">
              <div class="block">
                <b-radio v-model="savePreference" type="is-success" :native-value="true">
                  {{ $t('da') }}
                </b-radio>
                <b-radio v-model="savePreference" type="is-danger" :native-value="false">
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </div>
          </div>
          <div class="divider-line-1 m-b-30"></div>
        </div>
      </transition>

      <div class="buttons m-t-20">
        <b-button
          class="fw600"
          type="is-primary"
          icon-right="magnifying-glass"
          pack="fal"
          rounded
          :loading="loadingFree"
          @click="
            freeCourts = []
            getFreeCourts()
          "
        >
          {{ $t('Pretraži') }}
        </b-button>
      </div>

      <!-- Google map -->
      <div style="width: 100%;, height: 400px;">
        <GmapMap :center="mapCenter" :zoom="mapZoom" map-type-id="roadmap" style="width: 100%; height: 400px">
          <GmapMarker
            v-for="court in freeCourts"
            :key="court.id"
            :position="{ lat: parseFloat(court.club.latitude), lng: parseFloat(court.club.longitude) }"
            :clickable="true"
            @click="logCourtName(court)"
          />
        </GmapMap>
      </div>

      <div v-if="freeCourtsTotal" class="m-t--10">
        <h6 class="fw600 flex align__centar__all">
          {{ $t('Slobodnih termina') }}:
          <span>{{ freeCourtsTotal }}</span>
        </h6>
      </div>
      <div class="relative">
        <div v-if="freeCourts.length" class="bodyWrap p-l-10 p-r-10">
          <div v-for="(court, index) in freeCourts" :key="index">
            <template v-if="court.working_span.length">
              <!--      Universal club-->
              <!--            <p>{{ court.club.id }}</p>-->
              <!--            <p>{{ freeCourts[index === 0 ? index + 10 : index - 1]?.club.id }}</p>-->

              <template>
                <template v-if="court.club.id !== freeCourts[index === 0 ? index + 10 : index - 1]?.club.id">
                  <div
                    class="flex align__centar__y m-b-10"
                    :class="{ 'm-t-30': index !== 0 }"
                    @click="$router.push(localePath('/clubs/' + court.club.id))"
                  >
                    <img
                      v-if="court.club.logo"
                      :src="court.club.logo"
                      class="user_image-smallish border__white--2 m-l-1 m-r-10 softshadow"
                      alt=""
                    />
                    <div class="">
                      <div class="fw600 is-size-12 has-text-black80">{{ court.club.name }}</div>
                      <div class="fw600 is-size-7 m-t--2 has-text-black50 flex align__centar__y">
                        <font-awesome-icon class="m-r-2 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                        {{ court.club.county }}
                        <template v-if="court.reservation_prepayment">
                          <font-awesome-icon
                            class="m-r-4 m-l-10 has-text-lightblue iw08"
                            icon="fa-light fa-money-bill-1-wave"
                          />
                          {{ $t('Plaćanje unaprijed') }}
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div
                class="court activity__box--padding m-b-15 transition"
                :class="{
                  loading_opaq: swipeLoading,
                  'court-loading': true,
                  blur_button: loadingFree && offset === 1,
                  'border-court-slot-rain': court.weather,
                  'border-court-break': checkIfCourtBreakAdmin(court),
                }"
                @click.stop="
                  selected_court = court
                  isReservationModal = true
                "
              >
                <div>
                  <div>
                    <court-slot v-if="court.working_span.length" :court="court"></court-slot>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <section v-if="!freeCourts.length && !loadingFree" class="section has-text-centered m-t-10">
          <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
          <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
            {{ $t('Nema slobodnih termina') }}
          </div>
        </section>
      </div>
      <transition v-if="loadingFree" name="fade">
        <div class="align__centar__x m-t-30 loading_z_spinner--bottom">
          <b-icon
            class="comment-send"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </transition>
    </div>
    <b-modal :active.sync="isModalHourActive" :width="640" scroll="clip" class="hidescrollbar">
      <modalOptions
        :confirm="false"
        :send-object="true"
        :options="hoursList"
        :title="$t('Početak')"
        :subtitle="$t('Označi željeni početak rezervacije')"
        @update="updateHour($event, 'from')"
      ></modalOptions>
    </b-modal>
    <b-modal :active.sync="isModalHourActiveSecond" :width="640" scroll="clip" class="hidescrollbar">
      <modalOptions
        :confirm="false"
        :send-object="true"
        :options="hoursList"
        :title="$t('Početak')"
        :subtitle="$t('Označi željeni početak rezervacije')"
        @update="updateHour($event, 'to')"
      ></modalOptions>
    </b-modal>

    <b-modal
      :active.sync="isReservationModal"
      :width="640"
      scroll="clip"
      class="hidescrollbar"
      @close="
        offset = 1
        getFreeCourts()
      "
    >
      <modalReservation
        :reservations="selected_court.parsed_reservations"
        :court="selected_court"
        :reservation-date="selected_date"
        :title="$t('rezervacija')"
        @mustpay="mustpay($event)"
      ></modalReservation>
    </b-modal>
    <b-modal :active.sync="isModalUserPaymentActive" :width="640" class="hidescrollbar" scroll="clip">
      <courtUserPaymentModal
        :term="selectedTerm.id"
        @update="getCourts()"
        @cardpayment="cardPayment($event)"
      ></courtUserPaymentModal>
    </b-modal>
    <b-modal :active.sync="showStripe" :width="640" scroll="clip" class="z200">
      <modal-payment-stripe :secret="clientSecret" />
    </b-modal>
  </div>
</template>
<script>
import { dragscroll } from 'vue-dragscroll'
import moment from 'moment'
import Sport from '@/models/Sport'
import _ from 'lodash'
import location from '~/components/GeoLocation'
// import Court from '~/models/Court'
import FreeCourt from '~/models/FreeCourt'
import Player from '~/models/Player'
import Club from '~/models/Club'
import City from '~/models/City'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'
import modalReservation from '~/components/modal/ModalCourtReservation'
import modalOptions from '~/components/modal/ModalOptionsHours'
import courtUserPaymentModal from '~/components/court/CourtUserPaymentModal'

export default {
  name: 'Courts',
  directives: {
    dragscroll,
  },
  components: {
    hero,
    location,
    courtSlot,
    modalReservation,
    modalOptions,
    courtUserPaymentModal,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getClubs()
    })
  },
  data() {
    return {
      history: '',
      showDatePicked: '',
      datePicked: null,
      admin: '',
      heroImage: '/hero_courts.jpg',
      isModalUserPaymentActive: false,
      isWeatherModalActive: false,
      isReservationModal: false,
      selected_date: this.$moment(),
      inactive: true,
      options: ['Igračima vanjskih terena', 'Igračima unutrarnjih terena', 'Svim igračima', 'Nemoj slati obavijesti'],
      courts: [],
      clubs: [],
      selected_court: 0,
      test: 0,
      gotoDate: '',
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loadingFree: false,
      fwd: false,
      swipeLoading: false,
      loadingDelete: false,
      offset: 1,
      selected_index: 0,
      bottom: false,
      last_page: 1,
      selectedLight: { name: 'Sve' },
      lights: [{ name: 'Sve' }, { name: 'Rasvjeta' }, { name: 'Bez rasvjete' }],
      selectedSport: { name: 'Sve' },
      sports: [],
      selectedSurface: { title: 'Sve' },
      surfaces: [],
      location: {
        latitude: 0,
        longitude: 0,
      },
      freeCourts: [],
      freeCourtsTotal: null,
      freeCourtsTotalLastPage: [],
      showFilter: false,
      isModalHourActive: false,
      isModalHourActiveSecond: false,
      savePreference: false,
      locationOnApp: true,
      cities: [],
      city: '',
      selected: {},
      from: 0,
      to: 0,
      counter: 0,
      counter1: 0,
      kojije: 0,
      clientSecret: '',
      showStripe: false,
      selectedTerm: {},
      wifi: false,
      airconditioner: false,
      heating: false,
      invalid: false,
      mapCenter: { lat: 45.815, lng: 15.9819 }, // coordinates for Zagreb, Croatia
      mapZoom: 11,
    }
  },
  computed: {
    hoursList() {
      const hoursArray = []
      for (let i = 0; i <= 24; i++) {
        const hour = {
          name: i < 10 ? `0${i}:00` : `${i}:00`,
          value: i,
        }
        hoursArray.push(hour)
      }
      return hoursArray
    },
    filteredClubs() {
      const obj = {}
      for (let i = 0; i < this.clubs.length; i++) {
        const element = this.clubs[i]
        obj[element.id] = element
      }
      return obj
    },
    windowWidth() {
      return window.innerWidth
    },
    isMemberOfTheClub() {
      return !!this.user.club_member[this.club.id]
    },
    minDate() {
      return this.isAdmin ? null : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    maxDate() {
      return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + this.maxSpan)
    },
    courtdate() {
      return this.$store.state.courtdate
    },
    inactiveNext() {
      const a = this.$moment(this.selected_date)
      const b = this.$moment()
      if (a.diff(b, 'days') < this.maxSpan || this.user.is_admin) {
        return true
      } else {
        this.$buefy.toast.open({
          message:
            this.$t('Vaše članstvo"') + this.$t('"omogućuje rezervaciju') + ' ' + 7 + ' ' + this.$t('dana unaprijed'),
          type: 'is-primary',
          duration: 5000,
        })

        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    maxSpan() {
      return 7
      // return this.user.membership.max_reservation_span
    },
    club() {
      return this.$store.state.club
    },
    dates() {
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = this.$moment().add(i, 'days').format('DD.MM.')
        dates.push(date)
      }
      dates[0] = this.$t('danas')
      dates[1] = this.$t('sutra')
      return dates
    },
    isToday() {
      const today = moment(this.selected_date).format('YYYY-MM-DD')
      return moment().isSame(today, 'day')
    },
    dateHasPassed() {
      const selectedDay = this.$moment.utc(this.selected_date)
      const today = this.$moment()
      const dif = selectedDay.diff(today)
      if (dif > 0) {
        return false
      } else {
        return true
      }
    },
    preference() {
      return this.$store.state.userPreference.preference
    },
  },
  watch: {
    city() {
      this.debouncedGetCity()
    },
    selected() {
      if (this.selected === null) {
        this.selected = {}
      }
    },
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getFreeCourts('skip')
      }
    },
    from(from) {
      this.to = parseInt(from) + 1
      if (this.from.toString().length === 1) {
        this.from = '0' + this.from
      }
    },
    to(to) {
      if (this.to.toString().length === 1) {
        this.to = '0' + this.to
      }
      if (parseInt(to) - parseInt(this.from) < 1) {
        this.from = parseInt(this.to) - 1
        if (this.to.toString().length === 1) {
          this.to = '0' + this.to
        }
      }
    },
    preference: {
      immediate: true,
      handler() {
        this.city = Object.keys(this.preference.courtsGlobalFilter.city).length
          ? this.preference.courtsGlobalFilter.city.name
          : ''
        this.selected = Object.keys(this.preference.courtsGlobalFilter.city).length
          ? this.preference.courtsGlobalFilter.city
          : {}
        this.selectedSport = Object.keys(this.preference.courtsGlobalFilter.sport).length
          ? this.preference.courtsGlobalFilter.sport
          : { name: 'Sve' }
        this.selectedSurface = Object.keys(this.preference.courtsGlobalFilter.surface).length
          ? this.preference.courtsGlobalFilter.surface
          : { title: 'Sve' }
        this.selectedLight = Object.keys(this.preference.courtsGlobalFilter.lights).length
          ? this.preference.courtsGlobalFilter.lights
          : { name: 'Sve' }
      },
    },
  },
  created() {
    this.debouncedGetCity = _.debounce(this.getCity, 500)
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    if (!this.$store.state.club.surfaces.length) {
      this.$store.dispatch('club/surfaces')
    }
    this.surfaces = this.$store.state.club.surfaces
    this.from = this.$moment().add(2, 'h').format('HH')
    this.to = this.$moment().add(3, 'h').format('HH')
    this.debouncedGetCity()

    // this might be useless (google maps)
    this.$nextTick(() => {
      window.dispatchEvent(new Event('resize'))
    })
  },
  methods: {
    checkIfCourtBreakAdmin(court) {
      const now = this.$moment(this.selected_date)
      if (court.court_break_from && court.court_break_to) {
        const breakStart = this.$moment(court.court_break_from)
        const breakEnd = this.$moment(court.court_break_to).add(1, 'day')

        if (now.isSameOrAfter(breakStart) && now.isSameOrBefore(breakEnd)) {
          return true
        }
      }

      return false
    },
    mustpay(item) {
      const reservations = item
      this.selectedTerm = { id: reservations.reservations[0] }
      this.isModalUserPaymentActive = true
    },
    cardPayment(item) {
      this.clientSecret = item
      this.showStripe = true
    },
    getCity() {
      const c = City
      c.where('name', this.city)
        .where('country', 1)
        .include('country')
        .get()
        .then((res) => {
          this.cities = res.data
        })
    },
    changePreference() {
      const x = {
        city: this.selected === null ? {} : this.selected,
        sport: this.selectedSport,
        surface: this.selectedSurface,
        lights: this.selectedLight,
      }
      this.$store.commit('userPreference/setGlobalCourtFilter', x)
    },
    updateHour(item, place) {
      if (place === 'from') {
        this.from = item.value
      } else {
        this.to = item.value
      }
    },
    getFreeCourts(item) {
      this.counter++
      if (item !== 'skip') {
        this.freeCourts = []
        this.offset = 1
      }
      if (this.savePreference) {
        this.changePreference()
      }
      this.loadingFree = true
      const lights = this.selectedLight.name === 'Rasvjeta' ? 1 : 0
      const date = this.$moment(this.selected_date).format('YYYY-MM-DD')
      const fc = FreeCourt.page(this.offset)
      fc.where('show_on_tenisplus', 1)
      fc.include('club').where('is_active', 1)
      if (this.selectedLight.name !== 'Sve') {
        fc.where('lights', lights)
      }
      if (this.wifi) {
        fc.where('wifi', 1)
      }
      if (this.airconditioner) {
        fc.where('airconditioner', 1)
      }
      if (this.heating) {
        fc.where('heating', 1)
      }
      if (this.invalid) {
        fc.where('invalid', 1)
      }
      if (this.selectedSurface.title !== 'Sve') {
        fc.where('surface', this.selectedSurface.id)
      }
      const params = {
        date,
        from: this.from.toString(),
        to: this.to.toString(),
        latitude: 0,
        longitude: 0,
      }
      /*
      if (this.location.latitude) {
        params.latitude = this.location.latitude
        params.longitude = this.location.longitude
        fc.orderBy('distance')
      }
      if (Object.keys(this.selected).length) {
        params.latitude = this.selected.latitude
        params.longitude = this.selected.longitude
        fc.orderBy('distance')
      } */
      fc.orderBy('club')
      fc.params(params)
      fc.get()
        .then((res) => {
          if (this.offset === 1) {
            this.freeCourts = res.data
          } else {
            this.freeCourts = [...this.freeCourts, ...res.data]
          }
          this.freeCourtsTotal = res.meta.total
          this.freeCourtsTotalLastPage = res.meta.last_page
          this.loadingFree = false
        })
        .catch(() => {
          this.loadingFree = false
        })
    },
    updateLights(item) {
      this.selectedLight = item
      this.offset = 1
    },
    updateSports(item) {
      this.selectedSport = item
      this.offset = 1
    },
    updateSurfaces(item) {
      this.selectedSurface = item
    },
    getSports() {
      Sport.get().then((res) => {
        this.sports = res
        this.sports.unshift({ name: 'Sve' })
      })
    },
    updateSelectedDay(item) {
      this.selected_date = this.$moment().add(item, 'days')
      this.selected_index = item
    },
    noLocation() {
      this.locationOnApp = false
      this.counter1++
      this.offset = 1
      this.getFreeCourts()
    },
    setLocation(data) {
      this.counter1++
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.offset = 1
      this.getFreeCourts()
    },
    getClubs() {
      Club.limit(100)
        .get()
        .then((res) => {
          this.clubs = res.data
        })
    },
    joinClub() {
      this.loading3 = true
      const player = new Player({ id: this.user.id, newMember: this.club.id })
      player
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u novi klub'),
            type: 'is-success',
          })
          this.loading3 = false
          this.$auth.fetchUser()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading3 = false
          this.$auth.fetchUser()
        })
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.swipeLoading = true
        this.prevDay()
      } else if (direction === 'left') {
        this.swipeLoading = true
        this.nextDay()
      }
    },
    scrollToTop() {
      document.getElementById('tu').scrollIntoView({
        top: 10,
        behavior: 'smooth',
      })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },

    logCourtName(court) {
      window.location.href =
        'https://' +
        court.club.subdomain +
        '.inspirium.hr/courts/' +
        court.id +
        '/' +
        moment(this.selected_date).format('YYYY-MM-DD')
    },
  },
  head() {
    return {
      title: 'Tereni',
    }
  },
}
</script>
