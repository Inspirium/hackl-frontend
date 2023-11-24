<template>
  <div v-if="courts.length" class="modal-confirmation p-b-500">
    <transition name="fade">
      <div v-show="!isConfirmation">
        <div
          class="is-size-25 line-height-24 has-text-light w90"
          :class="activeTab === 1 ? 'opacity0' : ''"
          @click="activeTab === 2 ? (activeTab = 1) : (activeTab = 2)"
        >
          {{ returnTitle }}
        </div>
        <div class="w100 flex align__centar__x has-text-centered m-t-30">
          <div v-if="activeTab !== 2" class="">
            <b-icon
              :icon="activeTab !== 0 ? 'ban' : 'person-digging'"
              class="m-r-15 m-l-15"
              :type="activeTab === 0 ? 'is-danger' : 'is-danger'"
              size="is-larger-45"
              pack="fal"
            ></b-icon>
          </div>
        </div>
        <b-tabs v-model="activeTab" class="hide_tab_navigation">
          <b-tab-item>
            <div class="">
              <template v-if="true">
                <div class="buttons m-t-20">
                  <b-button
                    class="softshadow"
                    :class="{ softshadow: true, 'invert-small-button': selected_courts.length > 1 }"
                    :icon-right="selected_courts.length > 1 ? 'times-circle' : 'check-circle'"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-danger has-text-white': selected_courts.length > 1,
                    }"
                    pack="fal"
                    rounded
                    @click="selectAll()"
                  >
                    {{ selected_courts.length > 1 ? $t('Poništi') : $t('Označi sve') }}
                  </b-button>
                  <b-button
                    v-if="checkIfSelectedHasBreakAfterToday"
                    class="softshadow"
                    type=" is-small noborder"
                    pack="fal"
                    rounded
                    @click="updateCourts(true)"
                  >
                    {{ $t('Označi terene dostupnim') }}
                  </b-button>
                </div>

                <div v-if="courts.length" class="m-t--10">
                  <div
                    v-for="c in courts"
                    :key="c.id"
                    class="flex flex__column m-b-4 radius__5 is-black-list cursor"
                    @click="selectCourtRain(c)"
                  >
                    <div class="flex justify-between" :class="getClass(c)">
                      <div class="w100">
                        <div class="fw500 is-size-55 p-l-15 p-t-7 p-b-7">
                          {{ c.name }}
                        </div>
                        <div v-if="checkBreakTo(c)" class="fw500 is-size-65 p-l-15 p-b-7 m-t--5">
                          <b-icon
                            icon="xmark"
                            pack="far"
                            size="is-small-10 top-5"
                            class="has-text-danger relative m-r--5"
                          ></b-icon>

                          {{ c.court_break_from | moment('DD. MMMM') }}
                          <span v-if="c.court_break_from !== c.court_break_to"
                            >— {{ c.court_break_to | moment('DD. MMMM') }}</span
                          >
                        </div>
                      </div>
                      <div v-if="checkBreakTo(c)" class="flex align__centar__all m-r-10" @click="cancelCourtBreak(c)">
                        <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <!--                <div v-if="checkIfSelectedHasBreakAfterToday" class="buttons m-t-20">-->
                <!--                  <b-button class="softshadow" type=" is-small noborder" pack="fal" rounded @click="updateCourts(true)">-->
                <!--                    {{ $t('Označi terene dostupnim') }}-->
                <!--                  </b-button>-->
                <!--                </div>-->

                <div :class="selected_courts.length ? '' : 'opacity3 noinput'">
                  <div class="m-t-30 has-text-white has-text-centered">
                    <div class="fw600 is-size-5 line-height-16 has-text-centered">
                      {{ $t('Označi period nedostupnosti terena') }}
                    </div>
                  </div>

                  <div v-if="true" class="m-b-20 m-t-10 block">
                    <!--      <div class="fw600 is-size-6 has-text-centered m-b-5">Unesi raspon</div>-->
                    <b-field>
                      <b-datepicker
                        v-model="dates"
                        :mobile-native="false"
                        :placeholder="$t('klikniOvdjeZaOdabir')"
                        :first-day-of-week="1"
                        trap-focus
                        rounded
                        range
                      >
                      </b-datepicker>
                    </b-field>
                  </div>
                </div>
              </template>
            </div>
          </b-tab-item>
          <b-tab-item>
            <div class="m-t-20 has-text-white has-text-centered">
              <div class="fw600 is-size-4 line-height-22 has-text-centered">
                {{ $t('Želite otkazati sve rezervacije u odabranom periodu?') }}
              </div>
              <div class="fw600 is-size-6 m-t-10 has-text-centered has-text-lightblue">
                {{ $t('Svi korisnici će dobiti obavijest o otkazanim terminma') }}
              </div>
            </div>
            <div v-if="true" class="">
              <div class="buttons m-t-30">
                <b-button size="is-large" type="is-danger" rounded @click="closeIt()">
                  {{ $t('ne') }}
                </b-button>
                <b-button type="is-primary" size="is-large" rounded @click="activeTab = 2"> {{ $t('da') }} </b-button>
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
            <!--            <template v-if="club.payment_accontation === 0">-->
            <!--              <div class="m-t-30 empty_red_empty has-text-white has-text-centered">-->
            <!--                <div class="fw600 is-size-65 line-height-12 has-text-centered">-->
            <!--                  {{-->
            <!--                    $t(-->
            <!--                      'Ako želite izvršiti povrat plaćenih rezervacija prvo morate omogućiti akontacijsko plaćanje u postavkama kluba'-->
            <!--                    )-->
            <!--                  }}-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              <div class="m-t-30 has-text-white has-text-centered">-->
            <!--                <div class="fw600 is-size-5 line-height-16 has-text-centered">-->
            <!--                  {{ $t('Želite li omogućiti akontacijsko plaćanje u klubu?') }}-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              <div class="buttons m-t-20">-->
            <!--                <b-button-->
            <!--                  class="softshadow"-->
            <!--                  :class="{ softshadow: true }"-->
            <!--                  icon-right="check"-->
            <!--                  :type="{-->
            <!--                    'is-small': true,-->
            <!--                    noborder: true,-->
            <!--                  }"-->
            <!--                  pack="fal"-->
            <!--                  rounded-->
            <!--                  :loading="loadingClub"-->
            <!--                  @click="saveClub()"-->
            <!--                >-->
            <!--                  {{ $t('Omogući') }}-->
            <!--                </b-button>-->
            <!--              </div>-->
            <!--            </template>-->
          </b-tab-item>
        </b-tabs>
        <div v-if="activeTab !== 1" class="buttons is-fixed m-t-30 m-b-30">
          <b-button type="is-danger" rounded @click="$parent.close()">
            {{ $t('zatvori') }}
          </b-button>
          <b-button
            v-if="activeTab === 0"
            :loading="loadingUpdateCourt"
            type="is-primary"
            rounded
            @click="updateCourts()"
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
import Court from '~/models/Court'
import Reservervation from '~/models/Reservation'

export default {
  name: 'ModalCourtBreak',
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
      messageRain: this.$t('Zbog lošeg vremena, igra na vanjskim terenima nije moguća'),
      messageSun: this.$t('Vremenske prilike su se poboljšale'),
      courts: [],
      selected_courts: [],
      selected_courts_sun: [],
      reservations: [],
      reservations1: [],
      selected_reservations: [],
      closedRange: [],
      dates: [],
    }
  },
  computed: {
    returnTitle() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Označi nedostupne terene')
        case 1:
          return this.$t('Otkažite rezervacije')
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
    sumPaid() {
      return this.selected_reservations.reduce((acc, item) => {
        if (item.is_paid) {
          const pricesTotal = item.prices.reduce((priceAcc, price) => priceAcc + price, 0)
          return acc + pricesTotal
        }
        return acc
      }, 0)
    },
    checkIfSelectedHasBreakAfterToday() {
      return this.selected_courts.some((court) => {
        const x = this.$moment(court.court_break_to)
        if (court.court_break_to === null) return false
        if (x.isAfter(this.$moment()) || x.isSame(this.$moment(), 'day')) {
          return true
        } else {
          return false
        }
      })
    },
  },
  watch: {},
  mounted() {
    this.getCourts()
  },
  methods: {
    closeIt() {
      this.$emit('update')
      this.$parent.close()
    },
    cancelCourtBreak(court) {
      this.loading = true
      court.court_break_from = null
      court.court_break_to = null
      const courty = new Court(court)
      courty
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.loading = false
          this.getCourts()
          this.selected_courts = []
          this.dates = []
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    checkBreakTo(court) {
      const x = this.$moment(court.court_break_to)
      if (court.court_break_to === null) return false
      if (x.isAfter(this.$moment()) || x.isSame(this.$moment(), 'day')) {
        return true
      } else {
        return false
      }
    },
    selectAll() {
      if (this.selected_courts.length > 1) {
        this.selected_courts = []
      } else {
        this.selected_courts = []
        this.selected_courts = [...this.courts]
      }
    },
    getClass(court) {
      return {
        active: _.indexOf(this.selected_courts, court) > -1,
        'is-primary has-text-white': _.indexOf(this.selected_courts, court) > -1,
        'has-text-white': _.indexOf(this.selected_courts, court) < 0,
      }
    },
    selectCourtRain(court) {
      if (_.indexOf(this.selected_courts, court) > -1) {
        this.selected_courts.splice(_.indexOf(this.selected_courts, court), 1)
      } else {
        this.selected_courts.push(court)
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
      this.loadingReservation = true

      const promises = this.selected_courts.map((court) => {
        // for testing purpose
        // const from = this.$moment(court.from).subtract(23, 'hours')
        // za testiranje pa uzme malo više rezervacija
        // const to = this.$moment().add(5, 'hours')

        const from = this.$moment(this.dates[0])
        const to = this.$moment(this.dates[1]).add(1, 'day')
        const reservationTimeRange = `${from.format('YYYY-MM-DD HH:mm')},${to.format('YYYY-MM-DD HH:mm')}`
        // end
        // const reservationTimeRange = `${this.$moment(court.from).format('YYYY-MM-DD HH:mm')},${this.$moment().format(
        //   'YYYY-MM-DD HH:mm'
        // )}`
        return new Reservervation()
          .where('active_between', reservationTimeRange)
          .where('court', court.id)
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
    updateCourts(reset) {
      this.loadingUpdateCourt = true
      const x = this.selected_courts
      // Loop through each court in selected_courts array
      const promises = x.map((court) => {
        if (reset) {
          court.court_break_from = null
          court.court_break_to = null
        } else {
          court.court_break_from = this.dates[0].toDateString()
          court.court_break_to = this.dates[1].toDateString()
        }

        const updatedCourt = new Court(court)
        return updatedCourt.save()
      })
      Promise.all(promises)
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene za sve terene'),
            type: 'is-success',
          })
          this.$store.dispatch('club/init_club', { force: true })
          this.loadingUpdateCourt = false
          if (reset) {
            this.closeIt()
          }
          this.activeTab = 1
          this.getReservations()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingUpdateCourt = false
        })
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
