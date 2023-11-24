<template>
  <div v-if="termCheck && true" v-touch:swipe="swipeHandler" class="">
    <!--    <div class="breadcrumbs breadcrumbs-back m-t-10">-->
    <!--      <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="cancel()">-->
    <!--        <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>-->
    <!--        <span class="m-r-5">Nazad</span>-->
    <!--      </a>-->
    <!--    </div>-->
    <PageHeader
      :close-function="true"
      :title="$t('Blokiraj korisnika')"
      :background="'is-red'"
      @back="cancel()"
    ></PageHeader>
    <div v-if="Object.keys(reservation).length" class="x-container p-b-150 m-t-10">
      <div
        class="activity x-container m-b-20 m-t-15 p-t-10 p-b-10 statistics_new softshadow"
        :class="{ green: term.is_paid, 'has-text-white': term.is_paid }"
      >
        <div class="flex align__centar__all">
          <img class="w26 h26" src="/reservation.svg" alt="" />
          <div class="fw600 m-l-10">{{ termDisplay }}</div>
        </div>

        <div class="w100 m-t-7 m-b-5" :class="[!term.is_paid ? 'divider-line-1' : 'divider-line-1-white']"></div>
        <template v-if="Object.keys(selectedPlayer).length">
          <div class="has-text-centered fw600 is-size-6 has-text-danger m-l-auto m-r-auto m-b--20 m-t-5 w100">
            {{ $t('iznosNeplaenogRauna') }}
          </div>
          <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
            {{ $t('key5', { currency: reservation.prices[selectedPlayerIndex] }) | currency }}
          </div>
        </template>
        <template v-else>
          <div class="has-text-centered fw600 is-size-6 has-text-danger m-l-auto m-r-auto m-b--20 m-t-5 w100">
            {{ $t('ukupniIznosRauna') }}
          </div>
          <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
            {{ totalPrice }}
          </div>
        </template>
      </div>

      <div class="fw600 is-size-6 has-text-black80 has-text-centered m-b-10">
        {{ $t('blokirajKorisnikaZbogNeplaanja') }}
      </div>

      <div class="activity__reservation">
        <div class="activity__box action__buttons">
          <div
            v-for="(player, index) in filterPlayers"
            :key="player.id + index"
            class="payment_block"
            :class="{ selected_payee: selectedPlayer.id === player.id }"
          >
            <div class="action__item__small fw600 payment_block">
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
              <div v-if="!isBlocked(player)" class="buttons m-l-auto">
                <b-button
                  :class="{
                    softshadow: true,
                    'invert-small-button': selectedPlayer.id !== player.id,
                    active: selectedPlayer.id !== player.id,
                  }"
                  :type="{
                    'is-smaller m-t-10': true,
                    noborder__small: true,
                    'is-danger has-text-white': selectedPlayer.id !== player.id,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="selectIt(player, index)"
                >
                  {{ selectedPlayer.id === player.id ? $t('ukloni') : $t('Odaberi') }}
                </b-button>
              </div>
              <div v-else class="buttons m-l-auto">
                <b-button
                  :class="{
                    softshadow: true,
                    'invert-small-button': selectedPlayer.id !== player.id,
                    active: selectedPlayer.id !== player.id,
                  }"
                  :type="{
                    'is-smaller m-t-10': true,
                    noborder__small: true,
                    'is-primary has-text-white': selectedPlayer.id !== player.id,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="updateMember(player)"
                >
                  {{ $t('odblokiraj') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition name="slidea" mode="out-in">
        <div v-if="Object.keys(selectedPlayer).length" class="m-t-30 rounded-md">
          <div class="activity__header m-b-5 m-t--10 has-text-centered">
            <div class="fw600 is-size-6 has-text-black80 has-text-centered">{{ $t('poaljitePoruku') }}</div>
          </div>
          <b-field>
            <b-input
              v-model="message"
              type="textarea"
              rows="5"
              :placeholder="$t('ovdjeMoeteUpisatiPorukuZaBlokiranogKorisnikaIliUit')"
            ></b-input>
          </b-field>
          <div class="fw600 has-text-primary is-size-65 has-text-centered" @click="message = pre_message">
            {{ $t('popuniPredefiniranimTekstom') }}
          </div>
        </div>
      </transition>
      <div class="buttons m-t-20 m-l--5 m-t-40">
        <b-button
          class="m-l-10 fw600"
          type="is-primary"
          pack="fal"
          icon-left="chevron-left"
          rounded
          @click="$emit('close')"
        >
          {{ $t('nazad') }}
        </b-button>
        <b-button
          v-if="Object.keys(selectedPlayer).length"
          class="m-l-10 fw600"
          type="is-danger"
          pack="fal"
          rounded
          @click="
            !isBlocked ? updateMemberData.member.push(selectedPlayer) : updateMemberData.blocked.push(selectedPlayer)
            updateMember()
          "
        >
          {{ $t('blokiraj') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'CourtPaymentBlock',
  components: {
    PageHeader,
    TennisImage,
  },
  props: {
    term: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      activeTabPayment: 0,
      loading: false,
      isLoaded: false,
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
    }
  },
  computed: {
    pre_message() {
      return `${this.$t('Zbog neplaćanja rezervacije — ')}${this.termDisplay}${this.$t(
        ', ukupne cijene '
      )}${this.reservation.prices[this.selectedPlayerIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${this.$t(
        ' €, blokirane su Vam buduće rezervacije. Za dodatne informacije obratiti te se voditelju kluba.'
      )}`
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
  },
  watch: {
    term() {
      this.getReservation()
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
  methods: {
    swipeHandler(direction) {
      if (direction === 'right') {
        this.cancel()
      }
    },
    // submitMessage() {
    //   const x = this.selectedPlayer
    //   x.type = 'player'
    //   const t = new Thread({ players: [x], message: this.message, title: this.$t('Dugovanje') })
    //   t.save().then((res) => {
    //     this.$router.push(this.localePath(`/messages/${res.id}`))
    //   })
    // },
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
      this.selected_payee = []
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
    getReservation() {
      Reservation.find(this.term.id).then((res) => {
        this.reservation = res
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
  },
}
</script>
