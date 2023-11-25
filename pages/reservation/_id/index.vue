<template>
  <div v-if="termCheck && true" v-touch:swipe="swipeHandler" class="p-b-500">
    <!--    <div class="breadcrumbs breadcrumbs-back m-t-10">-->
    <!--      <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="cancel()">-->
    <!--        <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>-->
    <!--        <span class="m-r-5">Nazad</span>-->
    <!--      </a>-->
    <!--    </div>-->
    <PageHeader
      :close-function="true"
      :title="$t('Uredi rezervaciju')"
      :background="'is-primary'"
      @back="cancel()"
    ></PageHeader>
    <div v-if="Object.keys(reservation).length" class="x-container m-t-10">
      <div class="activity x-container m-b-20 m-t-15 p-t-10 p-b-10 statistics_new softshadow">
        <div class="flex align__centar__all">
          <img class="w26 h26" src="/reservation.svg" alt="" />
          <div class="fw600 m-l-10">{{ termDisplay }}</div>
        </div>

        <div class="w100 m-t-7 m-b-5" :class="[!term.is_paid ? 'divider-line-1' : 'divider-line-1-white']"></div>
        <template>
          <template v-if="term.type !== 'school_group'">
            <div class="has-text-centered fw600 is-size-6 has-text-danger m-l-auto m-r-auto m-b--20 m-t-5 w100">
              {{ $t('Cijena rezervacije') }}
            </div>
            <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
              {{ totalPrice }}
            </div>
          </template>
          <div class="divider-line-1 w100"></div>
          <div class="has-text-centered fw600 is-size-6 has-text-black50 m-l-auto m-r-auto m-t-5 w100">
            {{ $t('Tip rezervacije') }}: <span class="has-text-primary">{{ $t(termtype) }}</span>
          </div>
          <template v-if="filterPlayers.length > 1 && reservation.created_by">
            <div class="divider-line-1 w100 m-t-7"></div>
            <div class="has-text-centered fw600 is-size-6 has-text-black50 m-l-auto m-r-auto m-t-5 w100">
              {{ $t('Napravio rezervaciju') }}:
              <span class="has-text-primary">{{ reservation.created_by.display_name }}</span>
            </div>
          </template>
        </template>
      </div>
      <!--      Odabir sati-->
      <!--      <div class="hour-select w100 flex flex__column align__centar__all m-b-10">-->
      <!--        <div class="hour-box">-->
      <!--          <div class="hour-item">-->
      <!--            <div-->
      <!--              class="fw600 is-size-1 is-white hour-hour hour-item softshadow rounded-md relative"-->
      <!--              @click="isModalHourActive = true"-->
      <!--            >-->
      <!--              {{ from }} <span class="relative hour-item-zero-mid">{{ fromM }}</span>-->
      <!--            </div>-->
      <!--            <div class="fw600 is-size-2 p-r-5 p-l-5 hour-item">-</div>-->
      <!--            <div-->
      <!--              class="fw600 is-size-1 is-white hour-item hour-hour softshadow rounded-md"-->
      <!--              @click="isModalHourActiveSecond = true"-->
      <!--            >-->
      <!--              {{ to }} <span class="relative hour-item-zero-mid">{{ toM }}</span>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="activity__reservation">
        <div class="activity__box action__buttons">
          <div
            v-for="(player, index) in filterPlayers"
            :key="player.id + index"
            class="payment_block cursor"
            :class="{ selected_payee: selectedPlayer.id === player.id }"
          >
            <div class="action__item__small fw600 payment_block">
              <div class="flex align__centar__y" @click="$router.push(localePath('/player/' + player.id))">
                <TennisImage
                  :size="[32, 32]"
                  :src="player.image"
                  class="user_image-small m-r-10 m-l--5 border__white"
                  alt=""
                />

                <div class="flex__column">
                  <div v-if="isBlocked(player)" class="x-tag m-l-auto is-red">{{ $t('korisnikJeBlokiran') }}</div>
                  <div class="has-text-black80">{{ player.display_name }}</div>
                </div>

                <template>
                  <div v-if="player.membership !== ''" class="fw600 is-size-65 has-text-lightblue m-t--2 flex">
                    {{ player.membership }}
                  </div>
                  <div v-else class="fw600 is-size-65 has-text-lightblue m-t--2 flex">{{ $t('nijeLan') }}</div>
                </template>
              </div>
              <div class="buttons m-l-auto">
                <b-button
                  class="softshadow invert-small-button active"
                  type="is-smaller m-t-10 is-danger has-text-white noborder__small"
                  pack="fal"
                  rounded
                  :loading="loadingDeletePlayer"
                  @click.prevent="deletePlayer(player, index)"
                >
                  {{ $t('ukloni') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons m-t-10">
          <b-button
            class="softshadow m-t-10 m-b-10"
            type="is-small noborder"
            icon-right="plus"
            pack="fal"
            rounded
            @click="isAddPlayerModal = true"
          >
            {{ $t('dodajIgraa') }}
          </b-button>
          <b-button
            v-if="term.type !== 'guest' && term.type !== 'special' && term.type !== 'group'"
            class="m-b-10 m-l-5 m-t-10 invert-small-button"
            type="is-danger noborder is-small"
            pack="fal"
            icon-right="ban"
            rounded
            @click.prevent="$emit('block')"
            >{{ $t('blokiraj') }}
          </b-button>
        </div>
      </div>
      <div v-if="reservation.type !== 'group'" class="">
        <b-field class="login__input__container has-text-lightblue" :label="$t('napomena')">
          <b-input v-model="reservation.name" type="text" rounded> </b-input>
        </b-field>
        <transition name="fade">
          <div v-if="isNoteEdited > 1" class="buttons">
            <b-button
              class="m-t-5 fw600 is-smaller"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="saveNoteLoading"
              @click.prevent="saveNote()"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
        </transition>
      </div>
      <template v-if="reservation.type !== 'group' && Object.keys(filteredList).length">
        <div class="divider-line-1 m-t-20"></div>
        <div class="fw600 is-size-4 has-text-black80 has-text-centered m-t-5">
          {{ $t('Uredi rezervaciju') }}
        </div>

        <div class="fw600 is-size-65 has-text-black50 has-text-centered m-b-10 w80 m-l-auto m-r-auto">
          {{
            $t(
              'Označite i uklonite željena vremena s rezervacije, razdvojite ih u dvije rezervacije, ili odmah napravite novu rezervaciju za označena vremena'
            )
          }}
        </div>

        <div class="activity__box activity__reservation softshadow">
          <div
            v-for="(hours, index) in filteredList"
            :id="hours.time"
            :key="hours.id + index"
            class="payment_block"
            @click="selectTime(hours)"
          >
            <div class="action__item__small payment_block" :class="!selected_times.includes(hours) ? '' : 'is-primary'">
              <div class="fw600 is-size-55" :class="!selected_times.includes(hours) ? '' : 'has-text-white'">
                {{ hours.time | parseTime(true) }} -
                {{ (hours.time + (court.reservation_duration / 30) * 50) | parseTime(true) }}
              </div>

              <div v-if="!selected_times.includes(hours)" class="buttons m-l-auto">
                <b-button
                  class="softshadow invert-small-button active"
                  type="is-smaller is-primary m-t-5 has-text-white noborder__small"
                  pack="fal"
                  rounded
                >
                  {{ $t('Odaberi') }}
                </b-button>
              </div>
              <div v-else class="m-l-auto">
                <b-icon icon="times" pack="fal" type="is-white" size="is-medium" class="m-r-15" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="reservation.series">
      <div class="divider-line-1 m-t-40"></div>
      <div class="fw600 is-size-4 has-text-black80 has-text-centered m-t-5 m-b-2">
        {{ $t('Ponavljajuća rezervacija') }}
      </div>
      <div class="fw600 is-size-65 has-text-black50 has-text-centered m-b-10">
        {{ $t('Korisnik ima sljedeće rezervacije na iste dane') }}
      </div>
    </template>
    <div class="x-container">
      <adminReservationsUser v-if="reservation.series" :repeated="reservation.series" />
      <transition name="slidea" mode="out-in">
        <div v-if="selected_times.length && !isReservationModal" class="buttons is-fixed m-t-20 m-l--5 m-t-40">
          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            rounded
            :loading="loadingComplex1"
            @click="
              splitTheReservation()
              bookNow = false
            "
          >
            {{ $t('Otkaži') }}
          </b-button>
          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            rounded
            :loading="loadingComplex1"
            @click="
              splitTheReservation()
              bookNow = true
            "
          >
            {{ $t('Otkaži i rezerviraj') }}
          </b-button>
        </div>
      </transition>
    </div>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('ukloniRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="cancelTermSimple()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isAddPlayerModal" class="hidescrollbar">
      <modalMembers
        :title="$t('dodajIgraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="reservation"
        @update="getReservation()"
      />
    </b-modal>
    <b-modal :active.sync="isReservationModal" :width="640" class="hidescrollbar no-close-btn" scroll="clip">
      <modalReservation
        :reservations="court.parsed_reservations"
        :court="court"
        :reservation-date="selected_date"
        :title="$t('rezervacija')"
        :selected-time-pre="selected_times"
        @close="
          selected_times = []
          $emit('close')
        "
      ></modalReservation>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import PageHeader from '~/components/headers/blankBack'
import adminReservationsUser from '~/components/court/adminReservationsUser'
import modalMembers from '~/components/modal/ModalCourtReservationAddOnly'
import modalReservation from '~/components/modal/ModalCourtReservation'

export default {
  name: 'CourtDetails',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
    adminReservationsUser,
    modalReservation,
  },
  props: {
    term: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    court: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      activeTabPayment: 0,
      isAddPlayerModal: false,
      saveNoteLoading: false,
      isModalDeleteActive: false,
      loadingDeletePlayer: false,
      isReservationModal: false,
      loading: false,
      loadingComplex: false,
      loadingComplex1: false,
      isLoaded: false,
      bookNow: false,
      edit: false,
      is_paid: false,
      payment_invoice: null,
      payment_note: null,
      reservation: {},
      markAsPaid: false,
      split: false,
      selected_payee: [],
      cash: false,
      updateMemberData: { member: [], applicant: [], blocked: [] },
      selectedPlayer: {},
      selectedPlayerIndex: 0,
      message: '',
      from: 0,
      to: 0,
      fromM: 0,
      toM: 0,
      isModalHourActive: false,
      isModalHourActiveSecond: false,
      isNoteEdited: 0,
      filteredList: [],
      selected_times: [],
      differenceSimple: [],
      differenceComplex1: [],
      differenceComplex2: [],
    }
  },
  computed: {
    selected_date() {
      return this.$moment(this.term.from).format('YYYY-MM-DD')
    },
    termCheck() {
      if (Object.keys(this.term).length) {
        return true
      }
      return false
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    isDelete() {
      if (!this.edit) {
        return true
      }
      return false
    },
    isDoubles() {
      if (this.reservation.players[0].players.length > 1) {
        return true
      }
      return false
    },
    termDisplay() {
      return (
        this.reservation.court.name +
        ', ' +
        this.$moment(this.reservation.from).format('DD.MM') +
        ', ' +
        this.$moment(this.reservation.from).format('HH.mm') +
        ' - ' +
        this.$moment(this.reservation.to).format('HH.mm') +
        'h'
      )
    },
    totalPrice() {
      const sum = this.reservation.prices.reduce((acc, val) => {
        return acc + val
      }, 0)
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(sum)
    },
    filterPlayers() {
      const allPlayers = []
      for (let i = 0; i < this.reservation.players.length; i++) {
        for (let p = 0; p < this.reservation.players[i].players.length; p++) {
          allPlayers.push(this.reservation.players[i].players[p])
        }
      }
      return allPlayers
    },
    termtype() {
      switch (this.term.type) {
        case 'players':
          return 'Igrač'
        case 'in_behalf':
          return 'Za člana'
        case 'guest':
          return 'Za gosta'
        case 'doubles':
          return 'Timovi'
        case 'special':
          return 'Rezervacijska kategorija'
        case 'school_group':
          return 'Škola'
      }
      return ''
    },
  },
  watch: {
    'reservation.name'() {
      this.isNoteEdited++
    },
    term() {
      this.getReservation()
      this.scrollToTop()
    },
    court() {
      this.filterParsedReservation()
    },
    payment_invoice() {
      if (this.payment_invoice === '') {
        this.is_paid = false
        this.markAsPaid = false
      } else {
        this.is_paid = true
        this.markAsPaid = true
      }
    },
  },
  unmounted() {
    this.selected_times = []
    this.term = {}
    this.court = {}
  },
  mounted() {
    this.selected_times = []
    this.selectedPlayer = {}
    this.bookNow = false
    this.getReservation()
    this.scrollToTop()
    this.filterParsedReservation()
  },
  methods: {
    splitTheReservation() {
      // Convert filteredList to an array
      const filteredListArray = Object.values(this.filteredList)

      // Filter out the selected terms that are also in the selected_times array
      const difference = filteredListArray.filter((term) => {
        return !this.selected_times.some((time) => time.time === term.time)
      })
      this.differenceSimple = difference

      // Check if the selected times are in the beginning or end of the filteredListArray
      const firstSelectedIndex = filteredListArray.findIndex((term) => term.time === this.selected_times[0].time)
      const lastSelectedIndex = filteredListArray.findIndex(
        (term) => term.time === this.selected_times[this.selected_times.length - 1].time
      )

      const isMiddle =
        firstSelectedIndex !== -1 &&
        lastSelectedIndex !== -1 &&
        firstSelectedIndex !== 0 &&
        lastSelectedIndex !== filteredListArray.length - 1

      if (isMiddle) {
        this.differenceComplex1 = filteredListArray.slice(0, firstSelectedIndex)
        this.differenceComplex2 = filteredListArray.slice(lastSelectedIndex + 1)
        this.cancelTerm('complex')
      } else {
        this.cancelTerm('simple')
      }
    },

    selectTime(hour) {
      if (this.selected_times.includes(hour)) {
        this.selected_times.splice(this.selected_times.indexOf(hour), 1)
      } else {
        this.selected_times.push(hour)
        this.selected_times.sort((a, b) => a.time - b.time)
      }
    },
    filterParsedReservation() {
      const c = this.court
      const filteredEntries = Object.entries(c.parsed_reservations).filter(([key, item]) => {
        return item.id === this.term.id
      })
      this.filteredList = Object.fromEntries(filteredEntries)
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.cancel()
      }
    },
    updateMember(player) {
      if (player !== undefined) {
        this.updateMemberData.member.push(player)
      }
      this.updateMemberData.message = this.message
      this.$axios
        .put('v2/club/member', this.updateMemberData)
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.getReservation()
          this.updateMemberData = { member: [], applicant: [], blocked: [] }
          this.selectedPlayer = {}
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.getReservation()
          this.updateMemberData = { member: [], applicant: [], blocked: [] }
        })
    },
    isBlocked(player) {
      if (player.club_member[this.club.id.toString()] !== undefined) {
        return player.club_member[this.club.id.toString()].type === 'blocked'
      } else {
        return false
      }
    },
    cancel() {
      this.selected_times = []
      this.$emit('close')
    },
    selectIt(item, index) {
      this.selectedPlayerIndex = index
      if (item.id === this.selectedPlayer.id) {
        this.selectedPlayer = {}
      } else {
        this.selectedPlayer = item
      }
    },
    updateHour(item, place) {
      if (place === 'from') {
        this.from = item.value
      } else {
        this.to = item.value
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    getReservation() {
      Reservation.find(this.$route.params.id).then((res) => {
        this.reservation = res
        // this.from = this.$moment(this.reservation.from).format('HH')
        // this.fromM = this.$moment(this.reservation.from).format(':mm')
        // this.to = this.$moment(this.reservation.to).format('HH')
        // this.toM = this.$moment(this.reservation.to).format(':mm')
        this.selected_payee = []
        this.selected_payee.push(this.reservation.players[0])
        this.isLoaded = true
        if (res.payment_invoice !== null) {
          this.edit = true
          this.payment_note = res.payment_note
        }
        this.is_paid = res.is_paid
        this.payment_invoice = res.payment_invoice
      })
    },
    cancelTerm(type) {
      this.$root.$loading.start()
      this.loadingDelete = true
      const r = new Reservation(this.term)
      r.delete()
        .then(() => {
          if (type === 'simple') {
            this.makeReservation()
          } else {
            this.makeReservationComplex()
          }
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.$root.$loading.finish()
          this.loadingDelete = false
        })
    },
    makeReservation() {
      this.loadingComplex1 = true
      const reservation = new Reservation({
        date: this.$moment(this.reservation.from).format('YYYY-MM-DD'),
        times: this.differenceSimple,
        players: this.reservation.players,
        group: {},
        court_id: this.reservation.court.id,
        name: this.reservation.name,
      })
      if (this.reservation.type === 'guest') {
        reservation.type = 'guest'
      }
      if (this.reservation.type === 'special') {
        reservation.category = this.reservation.category
        reservation.type = 'special'
      }
      if (this.reservation.type === 'doubles') {
        reservation.type = 'doubles'
      }
      if (this.reservation.type === 'in_behalf') {
        reservation.type = 'in_behalf'
      }
      if (this.reservation.type === 'group') {
        reservation.type = 'school_group'
      }
      reservation.id = null
      reservation
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.loadingComplex1 = false
          if (this.bookNow) {
            this.isReservationModal = true
          } else {
            this.$emit('close')
          }
          this.$root.$loading.finish()
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: this.$t(error.response.data.message),
            type: 'is-danger',
            duration: 5500,
          })
          this.loadingComplex1 = false
          this.$root.$loading.finish()
        })
    },
    makeReservationComplex() {
      this.loadingComplex = true

      // Make reservation for the firstPart
      const firstReservation = new Reservation({
        date: this.$moment(this.reservation.from).format('YYYY-MM-DD'),
        times: this.differenceComplex1,
        players: this.reservation.players,
        group: {},
        court_id: this.reservation.court.id,
        name: this.term.name,
      })
      firstReservation.id = null

      // Make reservation for the secondPart
      const secondReservation = new Reservation({
        date: this.$moment(this.reservation.from).format('YYYY-MM-DD'),
        times: this.differenceComplex2,
        players: this.reservation.players,
        group: {},
        court_id: this.reservation.court.id,
        name: this.term.name,
      })
      secondReservation.id = null

      if (this.reservation.type === 'guest') {
        firstReservation.type = 'guest'
        secondReservation.type = 'guest'
      }
      if (this.reservation.type === 'special') {
        firstReservation.category = this.reservation.category
        secondReservation.category = this.reservation.category
        firstReservation.type = 'special'
        secondReservation.type = 'special'
      }
      if (this.reservation.type === 'doubles') {
        firstReservation.type = 'doubles'
        secondReservation.type = 'doubles'
      }
      if (this.reservation.type === 'in_behalf') {
        firstReservation.type = 'in_behalf'
        secondReservation.type = 'in_behalf'
      }
      if (this.reservation.type === 'group') {
        firstReservation.type = 'school_group'
        secondReservation.type = 'school_group'
      }

      Promise.all([firstReservation.save(), secondReservation.save()])
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.loadingComplex = false
          if (this.bookNow) {
            this.isReservationModal = true
          } else {
            this.$emit('close')
          }
          this.$root.$loading.finish()
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: this.$t(error.response.data.message),
            type: 'is-danger',
            duration: 5500,
          })
          this.loading = false
          this.$root.$loading.finish()
        })
    },
    deletePlayer(player, playerIndex) {
      this.loadingDeletePlayer = true
      const r = new Reservation(this.reservation)
      r.players.splice(playerIndex, 1)
      r.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili igrača s rezervacije terena'),
            type: 'is-success',
          })
          this.loadingDeletePlayer = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDeletePlayer = false
        })
    },
    cancelTermSimple() {
      this.loadingDelete = true
      const r = new Reservation(this.term)
      r.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste otkazali rezervaciju'),
            type: 'is-success',
          })
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    saveNote() {
      this.saveNoteLoading = true
      const reservation = new Reservation({
        id: this.reservation.id,
        name: this.reservation.name,
      })
      reservation
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.saveNoteLoading = false
          this.$emit('close')
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: this.$t(error.response.data.message),
            type: 'is-danger',
            duration: 5500,
          })
          this.saveNoteLoading = false
        })
    },
  },
}
</script>
