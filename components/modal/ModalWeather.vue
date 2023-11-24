<template>
  <div v-if="courts.length" class="modal-confirmation p-b-300">
    <transition name="fade">
      <div v-show="!isConfirmation">
        <div
          class="is-size-25 line-height-24 has-text-light w90"
          @click="activeTab === 2 ? (activeTab = 1) : (activeTab = 2)"
        >
          {{ returnTitle }}
        </div>
        <!--        <div class="is-size-3 line-height-24 has-text-light">{{ $t('Želite li poslati poruku igračima?') }}</div>-->
        <!--        <div class="is-size-6 fw600 has-text-primary m-b-20 m-t-10">-->
        <!--          {{ $t('Poruku će primiti svi igrači koji imaju rezervaciju na vanjskim terenima') }}-->
        <!--        </div>-->
        <div class="w100 flex align__centar__x has-text-centered m-t-30">
          <div v-if="activeTab !== 2 && filteredSetRain.length" class="" @click="activeTab = 0">
            <b-icon
              icon="cloud-showers-heavy"
              class="m-r-15 m-l-15"
              :class="activeTab === 0 ? 'dropshadow1' : ''"
              :type="activeTab === 0 ? 'is-primary' : 'is-dark'"
              size="is-larger-45"
              pack="fal"
            ></b-icon>
          </div>
          <div v-if="activeTab !== 2 && filteredSetSun.length" class="" @click="activeTab = 1">
            <b-icon
              icon="sun-bright"
              class="m-r-15 m-l-15"
              :class="activeTab === 1 ? 'dropshadow2' : ''"
              :type="activeTab === 1 ? 'is-warning' : 'is-dark'"
              size="is-larger-45"
              pack="fal"
            ></b-icon>
          </div>
          <div v-if="activeTab === 2" class="" @click="activeTab = 2">
            <b-icon
              icon="money-bill-1-wave"
              class="m-r-15 m-l-15"
              :class="activeTab === 2 ? 'dropshadow3' : ''"
              :type="activeTab === 2 ? 'is-success' : 'is-dark'"
              size="is-larger-45"
              pack="fal"
            ></b-icon>
          </div>
        </div>
        <b-tabs v-model="activeTab">
          <b-tab-item>
            <div class="">
              <template v-if="filteredSetSun.length || true">
                <div class="m-t-20 has-text-white has-text-centered">
                  <div class="fw600 is-size-5 line-height-16 has-text-centered">
                    {{ $t('Odaberi terene za prekid igre') }}
                  </div>
                </div>
                <div class="buttons m-t-20">
                  <b-button
                    class="softshadow"
                    :class="{ softshadow: true, 'invert-small-button': selected_courts_rain.length > 1 }"
                    :icon-right="selected_courts_rain.length > 1 ? 'times-circle' : 'check-circle'"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-danger has-text-white': selected_courts_rain.length > 1,
                    }"
                    pack="fal"
                    rounded
                    @click="selectAllRain()"
                  >
                    {{ selected_courts_rain.length > 1 ? $t('Poništi') : $t('Označi sve') }}
                  </b-button>
                </div>

                <div v-if="filteredSetRain.length" class="bodyWrap m-t--10">
                  <div
                    v-for="c in filteredSetRain"
                    :key="c.id"
                    class="flex flex__column m-b-4"
                    @click="selectCourtRain(c)"
                  >
                    <div class="fw500 is-size-55 radius__5 p-l-15 p-t-7 p-b-7" :class="getClassRain(c)">
                      {{ c.name }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="filteredSetSun.length === 0 || selected_courts_rain.length">
                <template v-if="false">
                  <div class="m-t-20 has-text-white has-text-centered">
                    <div class="fw600 is-size-5 has-text-centered">{{ $t('Želite li poslati poruku igračima?') }}</div>
                  </div>
                  <div class="buttons m-t-15">
                    <b-button
                      :class="{ softshadow: true, 'invert-small-button': sendMessage }"
                      :type="{
                        'is-bigger': true,
                        noborder: true,
                        'is-primary has-text-white': sendMessage,
                      }"
                      pack="fal"
                      rounded
                      @click="sendMessage = true"
                    >
                      {{ $t('Da') }}
                    </b-button>
                    <b-button
                      :class="{ softshadow: true, 'invert-small-button': !sendMessage }"
                      :type="{
                        'is-bigger': true,
                        noborder: true,
                        'is-danger has-text-white': !sendMessage,
                      }"
                      pack="fal"
                      rounded
                      @click="sendMessage = false"
                    >
                      {{ $t('Ne') }}
                    </b-button>
                  </div></template
                >
                <div v-if="sendMessage" class="rounded-md m-t-20">
                  <div class="activity__header m-b-5 has-text-centered">
                    <div class="fw600 is-size-6 has-text-lightblue has-text-centered">{{ $t('poruka') }}</div>
                  </div>
                  <b-field>
                    <b-input v-model="messageRain" type="textarea" rows="4"></b-input>
                  </b-field>
                  <div class="fw600 has-text-white is-size-65 has-text-left">
                    {{ $t('Poruku će primiti samo igrači s današnjim aktivnim rezervacijama na vanjskim terenima') }}
                  </div>
                </div>
              </template>
            </div>
          </b-tab-item>
          <b-tab-item>
            <div class="m-t-20 has-text-white has-text-centered">
              <div class="fw600 is-size-5 line-height-16 has-text-centered">
                {{ $t('Označi terene za nastavak igre') }}
              </div>
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow"
                :class="{ softshadow: true, 'invert-small-button': selected_courts_sun.length > 1 }"
                :icon-right="selected_courts_sun.length > 1 ? 'times-circle' : 'check-circle'"
                :type="{
                  'is-small': true,
                  noborder: true,
                  'is-danger has-text-white': selected_courts_sun.length > 1,
                }"
                pack="fal"
                rounded
                @click="selectAllSun()"
              >
                {{ selected_courts_sun.length > 1 ? $t('Poništi') : $t('Označi sve') }}
              </b-button>
            </div>

            <div v-if="filteredSetSun.length" class="bodyWrap m-t--10">
              <div v-for="c in filteredSetSun" :key="c.id" class="flex flex__column m-b-4" @click="selectCourtSun(c)">
                <div class="fw500 is-size-55 radius__5 p-l-15 p-t-7 p-b-7" :class="getClassSun(c)">
                  {{ c.name }}
                </div>
              </div>
            </div>

            <div v-if="selected_courts_sun.length" class="">
              <template v-if="false">
                <div class="m-t-40 has-text-white has-text-centered">
                  <div class="fw600 is-size-5 line-height-16 has-text-centered">
                    {{ $t('Želite li poslati poruku igračima?') }}
                  </div>
                </div>
                <div class="buttons m-t-15">
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': sendMessage }"
                    :type="{
                      'is-bigger': true,
                      noborder: true,
                      'is-primary has-text-white': sendMessage,
                    }"
                    pack="fal"
                    rounded
                    @click="sendMessage = true"
                  >
                    {{ $t('Da') }}
                  </b-button>
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': !sendMessage }"
                    :type="{
                      'is-bigger': true,
                      noborder: true,
                      'is-danger has-text-white': !sendMessage,
                    }"
                    pack="fal"
                    rounded
                    @click="sendMessage = false"
                  >
                    {{ $t('Ne') }}
                  </b-button>
                </div>
              </template>
              <div v-if="sendMessage" class="rounded-md m-t-20">
                <div class="activity__header m-b-5 has-text-centered">
                  <div class="fw600 is-size-6 has-text-lightblue has-text-centered">{{ $t('poruka') }}</div>
                </div>
                <b-field>
                  <b-input v-model="messageSun" type="textarea" rows="4"></b-input>
                </b-field>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item>
            <!--            izvrši povrat-->
            <template v-if="true">
              <div class="">
                <div class="m-t-30 has-text-white has-text-centered">
                  <div class="fw600 is-size-55 line-height-16 has-text-centered">
                    {{
                      $t(
                        'Odabrane rezervacije će biti otkazane, a plaćeni iznosi vraćeni prebacivanjem na akontacijski račun korisnika'
                      )
                    }}
                  </div>
                </div>
              </div>
              <div class="buttons m-t-20">
                <b-button
                  class="softshadow"
                  :class="{ softshadow: true, 'invert-small-button': selected_reservations.length > 1 }"
                  :icon-right="selected_reservations.length > 1 ? 'times-circle' : 'check-circle'"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-danger has-text-white': selected_reservations.length > 1,
                  }"
                  pack="fal"
                  rounded
                  @click="selectAllTerms()"
                >
                  {{ selected_reservations.length > 1 ? $t('Poništi') : $t('Označi sve') }}
                </b-button>
              </div>
              <div v-if="selected_reservations.length" class="has-text-white has-text-centered flex align__centar__all">
                <div class="fw600 is-size-7 line-height-12 has-text-centered m-r-15 flex align__centar__y">
                  {{ $t('Rrezervacija') }}:
                  <span class="has-text-lightblue is-size-6 m-l-4">{{ selected_reservations.length }}</span>
                </div>
                <div v-if="sumPaid" class="fw600 is-size-7 line-height-12 has-text-centered flex align__centar__y">
                  {{ $t('Ukupni iznos') }}:
                  <span class="has-text-lightblue is-size-6 m-l-4">{{ sumPaid | currency }}</span>
                </div>
              </div>
              <div
                v-if="!selected_reservations.length && reservations.length"
                class="has-text-white has-text-centered flex align__centar__all"
              >
                <div class="fw600 is-size-7 line-height-12 has-text-centered">
                  {{ $t('Popis svih rezervacija na zahvaćenim terenima') }}
                </div>
              </div>
              <div class="relative">
                <transition name="fade">
                  <div v-if="loadingReservation" class="align__centar__x loading_z_spinner">
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

                <div v-if="reservations.length" class="m-t-5 softshadow return_funds">
                  <div
                    v-for="(item, index) in reservations"
                    :key="index + 'ob'"
                    class="return_funds_item radius__12 overflow-hidden m-b-4"
                    :class="getClassTerm(item)"
                    @click="selectReservation(item)"
                  >
                    <div v-if="item.players.length" class="fw600 align__centar__all p-r-10 p-l-10 p-t-3 p-b-7">
                      <div v-if="item.players[0].image" class="list__img">
                        <TennisImage :size="[42, 42]" :src="item.players[0].image" class="user_image" alt="" />
                      </div>
                      <div class="list__content">
                        <div class="">
                          <div class="x-tag--small is-primary m-l-auto inlineblock m-b-2 m-t--2">
                            {{ item.court.name }}
                          </div>
                          <div v-if="item.is_paid" class="x-tag--small green m-l-auto inlineblock m-b-2 m-t--2">
                            {{ $t('Plaćeno') }}
                          </div>
                        </div>

                        <h4 class="fw600 is-size-55 m-t-0 m-b--5">{{ item.players[0].display_name }}</h4>
                        <div class="fw600 is-size-65 has-text-black30 m-r-5 m-t-3">
                          {{ $t('Rezervacija') }}:<span class="has-text-black80">
                            {{ item.from | moment('DD.MM.' + ', ' + 'HH:mm') }} - {{ item.to | moment('HH:mm') }}h</span
                          ><span v-if="$store.state.auth.user.id === 1">{{ item.id }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <section v-if="!reservations.length && !loadingReservation" class="">
                  <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
                    <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                    <p class="fw600 is-size-6 has-text-centered has-text-black30 m-b-10">
                      {{ $t('Nema rezervacija za ovaj period prekida igre') }}
                    </p>
                  </div>
                </section>
              </div>
            </template>
            <template v-if="club.payment_accontation === 0">
              <div class="m-t-50 empty_red_empty has-text-white has-text-centered">
                <div class="fw600 is-size-65 line-height-12 has-text-centered">
                  {{
                    $t(
                      'Ako želite izvršiti povrat plaćenih rezervacija prvo morate omogućiti akontacijsko plaćanje u postavkama kluba'
                    )
                  }}
                </div>
                <div class="buttons m-t-20">
                  <b-button
                    class="softshadow"
                    :class="{ softshadow: true }"
                    icon-right="check"
                    :type="{
                      'is-small': true,
                      noborder: true,
                    }"
                    pack="fal"
                    rounded
                    :loading="loadingClub"
                    @click="saveClub()"
                  >
                    {{ $t('Omogući') }}
                  </b-button>
                </div>
              </div>
            </template>
          </b-tab-item>
        </b-tabs>
        <div class="buttons is-fixed m-t-30 m-b-30">
          <b-button type="is-danger" rounded @click="$parent.close()">
            {{ $t('zatvori') }}
          </b-button>
          <b-button
            v-if="activeTab === 0"
            :loading="loadingUpdateCourt"
            type="is-primary"
            rounded
            @click="
              dontGoOnTab = true
              updateCourts(true)
            "
          >
            {{ $t('Pošalji') }}
          </b-button>
          <b-button
            v-if="activeTab === 1"
            :loading="loadingUpdateCourt"
            type="is-primary"
            rounded
            @click="updateCourts()"
          >
            {{ $t('Pošalji') }}
          </b-button>
          <b-button
            v-if="activeTab === 2 && reservations.length && !loadingReservation"
            :loading="loadingDelReservation"
            :class="{ blur_button: !selected_reservations.length }"
            type="is-primary"
            rounded
            @click="deleteReservation()"
          >
            {{ $t('Otkaži') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import Club from '~/models/Club'
import CourtWeatherUpdate from '~/models/CourtWeatherUpdate'
import Court from '~/models/Court'
import Reservervation from '~/models/Reservation'

export default {
  name: 'ModalWeather',
  data() {
    return {
      activeTab: 0,
      loadingUpdateCourt: false,
      loadingReservation: false,
      loadingDelReservation: false,
      enableAcc: true,
      sendMessage: true,
      isConfirmation: false,
      expand: false,
      loading: false,
      loadingClub: false,
      loadingCourts: false,
      dontGoOnTab: false,
      messageRain: this.$t('Zbog lošeg vremena, igra na vanjskim terenima nije moguća'),
      messageSun: this.$t('Vremenske prilike su se poboljšale'),
      courts: [],
      selected_courts_rain: [],
      selected_courts_sun: [],
      selected_courts: [],
      reservations: [],
      reservations1: [],
      selected_reservations: [],
      closedRange: [],
    }
  },
  computed: {
    returnTitle() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Obavijest o lošem vremenu')
        case 1:
          return this.$t('Obavijest o nastavku igre')
        case 2:
          return this.$t('Otkažite rezervacije')
      }
      return ''
    },
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
    filteredSetRain() {
      return this.courts.filter((item) => !item.weather && item.type === 'open')
    },
    filteredSetSun() {
      return this.courts.filter((item) => item.weather && item.type === 'open')
    },
    partialSet() {
      return this.filteredSetRain.length && this.filteredSetSun.length
    },
    filterCwu() {
      const updatedWeather = []
      const seenCourtIds = new Set()
      for (const item of this.closedRange) {
        if (this.selected_courts_sun.some((court) => court.id === item.court_id) && !seenCourtIds.has(item.court_id)) {
          updatedWeather.push(item)
          seenCourtIds.add(item.court_id)
        }
      }
      return updatedWeather
    },
    sumPaid() {
      return this.selected_reservations.reduce((acc, item) => {
        if (item.is_paid) {
          const pricesTotal = item.prices.reduce((priceAcc, price) => priceAcc + price, 0)
          return acc + pricesTotal
        }
        return acc
      }, 0)
    },
    isFirstWeather() {
      return this.filteredSetSun.length === 0 && !this.club.weather
    },
    isFirstWeatherAndPartial() {
      return (
        this.isFirstWeather &&
        this.selected_courts_rain.length &&
        this.selected_courts_rain.length !== this.courts.length
      )
    },
    isAllOpen() {
      return (
        this.filteredSetSun.length === this.selected_courts_sun.length &&
        this.filteredSetSun.length !== 0 &&
        this.selected_courts_sun.length !== 0
      )
    },
  },
  watch: {
    partialSet() {
      if (this.partialSet) {
        this.activeTab = 1
      }
    },
    filteredSetRain() {
      if (this.filteredSetRain.length === 0) {
        if (!this.dontGoOnTab) {
          this.activeTab = 1
        }
        this.selected_courts_sun = [...this.filteredSetSun]
      }
    },
  },
  mounted() {
    this.getCourts()
    this.getClosedRange()
  },
  methods: {
    selectAllRain() {
      if (this.selected_courts_rain.length > 1) {
        this.selected_courts_rain = []
      } else {
        this.selected_courts_rain = []
        this.selected_courts_rain = [...this.filteredSetRain]
      }
    },
    selectAllSun() {
      if (this.selected_courts_sun.length > 1) {
        this.selected_courts_sun = []
      } else {
        this.selected_courts_sun = []
        this.selected_courts_sun = [...this.filteredSetSun]
      }
    },
    getClassRain(court) {
      return {
        active: _.indexOf(this.selected_courts_rain, court) > -1,
        'is-primary has-text-white': _.indexOf(this.selected_courts_rain, court) > -1,
        'is-black-list has-text-white': _.indexOf(this.selected_courts_rain, court) < 0,
      }
    },
    getClassSun(court) {
      return {
        active: _.indexOf(this.selected_courts_sun, court) > -1,
        'is-primary has-text-white': _.indexOf(this.selected_courts_sun, court) > -1,
        'is-black-list has-text-white': _.indexOf(this.selected_courts_sun, court) < 0,
      }
    },
    selectCourtRain(court) {
      if (_.indexOf(this.selected_courts_rain, court) > -1) {
        this.selected_courts_rain.splice(_.indexOf(this.selected_courts_rain, court), 1)
      } else {
        this.selected_courts_rain.push(court)
      }
    },
    selectCourtSun(court) {
      if (_.indexOf(this.selected_courts_sun, court) > -1) {
        this.selected_courts_sun.splice(_.indexOf(this.selected_courts_sun, court), 1)
      } else {
        this.selected_courts_sun.push(court)
      }
    },
    getClassTerm(term) {
      return {
        active: _.indexOf(this.selected_reservations, term) > -1,
      }
    },
    selectReservation(term) {
      if (_.indexOf(this.selected_reservations, term) > -1) {
        this.selected_reservations.splice(_.indexOf(this.selected_reservations, term), 1)
      } else {
        this.selected_reservations.push(term)
      }
    },
    selectAllTerms() {
      if (this.selected_reservations.length > 1) {
        this.selected_reservations = []
      } else {
        this.selected_reservations = []
        this.selected_reservations = [...this.reservations]
      }
    },
    getCourts() {
      this.loadingCourts = true
      Court.where('is_active', 1)
        .where('club_id', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.courts = res.data
          this.loadingCourts = false
        })
        .catch(() => {
          this.loadingCourts = false
        })
    },
    async getReservations() {
      if (this.closedRange[0].to === null) {
        this.getClosedRange()
      }
      this.loadingReservation = true

      const promises = this.filterCwu.map((court) => {
        // for testing purpose
        // const from = this.$moment(court.from).subtract(23, 'hours')
        // za testiranje pa uzme malo više rezervacija
        // const to = this.$moment().add(5, 'hours')

        const from = this.$moment(this.closedRange[0].from)
        const to = this.$moment()
        const reservationTimeRange = `${from.format('YYYY-MM-DD HH:mm')},${to.format('YYYY-MM-DD HH:mm')}`
        // end
        // const reservationTimeRange = `${this.$moment(court.from).format('YYYY-MM-DD HH:mm')},${this.$moment().format(
        //   'YYYY-MM-DD HH:mm'
        // )}`

        return new Reservervation()
          .where('active_between', reservationTimeRange)
          .where('court', court.court_id)
          .orderBy('created_at')
          .get()
      })

      try {
        const results = await Promise.all(promises)

        this.reservations = results.flatMap((res) => res.data)
        this.loadingReservation = false
      } catch (error) {
        this.$buefy.toast.open({
          message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
          type: 'is-danger',
        })
        this.loadingReservation = false
      }
    },
    updateCourts(status) {
      this.setWeatherWarning()
      this.removeWeatherWarning()
      this.loadingUpdateCourt = true
      const x = this.activeTab === 0 ? this.selected_courts_rain : this.selected_courts_sun
      // Loop through each court in selected_courts array
      const promises = x.map((court) => {
        if (this.activeTab === 0) {
          court.weather = 1 // Set weather to 1 (rain)
          court.weather_message = this.sendMessage ? this.messageSun : '' // Set weather_message for rain
        } else {
          court.weather = 0 // Set weather to 0 (no rain)
          court.weather_message = this.sendMessage ? this.messageRain : '' // Set weather_message for no rain
        }

        const updatedCourt = new Court(court)
        return updatedCourt.save()
      })
      Promise.all(promises)
        .then(() => {
          if (status) {
            this.$parent.close()
          }
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene za sve terene'),
            type: 'is-success',
          })
          this.$store.dispatch('club/init_club', { force: true })
          this.loadingUpdateCourt = false
          this.selected_courts_rain = []
          this.$emit('update')

          if (this.activeTab === 1) {
            this.getReservations()
            if (this.club.payment_online) {
              this.activeTab = 2
            }
          } else {
            this.$parent.close()
          }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingUpdateCourt = false
        })
    },
    setWeatherWarning() {
      if (this.isFirstWeather) {
        const c = new Club({
          id: this.club.id,
          weather: 'open',
          weather_message: this.messageRain,
        })
        c.save().then(() => {
          this.$store.dispatch('club/init_club', { force: true })
        })
      }
    },
    removeWeatherWarning() {
      if (this.isAllOpen) {
        const c = new Club({
          id: this.club.id,
          weather: 'off',
          weather_message: this.messageSun,
        })
        c.save().then(() => {
          this.$store.dispatch('club/init_club', { force: true })
        })
      }
    },
    saveClub() {
      this.loadingClub = true
      const club = new Club(this.club)
      club.payment_accontation = 1
      club
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili podatke'),
            type: 'is-success',
          })
          this.loadingClub = false
          this.$store.dispatch('club/init_club', { force: true })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingClub = false
        })
    },
    weatherSave() {
      this.$emit('update')
      if (this.$auth.user.is_admin || this.isCashier) {
        this.loading = true
        const c = new Club({
          id: this.club.id,
          weather: this.club.weather ? 'off' : 'open',
          weather_message: this.club.weather ? this.messageSun : this.messageRain,
        })
        c.save().then(() => {
          this.$store.dispatch('club/init_club', { force: true })
          this.loading = false
          if (this.activeTab !== 2) {
            this.$parent.close()
          }
        })
      }
    },
    getClosedRange() {
      CourtWeatherUpdate.where('club', this.club.id)
        .orderBy('-created_at')

        .get()
        .then((res) => {
          this.closedRange = res.data
        })
        .catch(() => {})
    },
    deleteReservation() {
      this.loadingDelReservation = true
      this.$axios
        .post('v2/reservation/deleteMany', { reservations: this.selected_reservations })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali rezervacije'),
            type: 'is-success',
          })
          this.loadingDelReservation = false
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelReservation = false
        })
    },
  },
}
</script>
