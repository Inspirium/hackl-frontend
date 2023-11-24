<script src="../../plugins/axios.js"></script>
<template>
  <div v-if="userClubWallet.length" class="p-b-300">
    <template v-if="clubPaymentBoth && !isUserPaid">
      <div class="has-text-white fw600 is-size-3 p-l-10 p-r-10 has-text-centered line-height-22 m-t-5">
        {{ $t('odaberiNainPlaanja') }}
      </div>
    </template>
    <template v-else>
      <div
        :class="isUserPaid ? 'has-text-green ' : 'has-text-white '"
        class="fw600 is-size-3 p-l-10 p-r-10 has-text-centered line-height-22 m-t-40"
      >
        {{ !isUserPaid ? $t('plaanje') : $t('plaeno') }}
      </div>
    </template>

    <!--    New staff-->
    <div class="m-t-20">
      <template v-if="!isUserPaid">
        <div v-if="clubPaymentBoth" class="buttons m-t-30 m-b-5">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'card' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': paymentMethod === 'card',
            }"
            pack="fal"
            rounded
            @click.prevent="paymentMethod = 'card'"
          >
            {{ $t('card') }}
          </b-button>

          <b-button
            :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'acc' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': paymentMethod === 'acc',
            }"
            pack="fal"
            rounded
            @click.prevent="paymentMethod = 'acc'"
          >
            {{ $t('acc') }}
          </b-button>
          <div class="divider-line-1 opacity3 m-t-5 w100 m-b-10"></div>
        </div>
      </template>

      <template v-if="!isUserPaid">
        <div
          v-if="userClubWallet.length && paymentMethod === 'acc'"
          class="fw600 is-size-6 has-text-white has-text-centered m-b-10"
        >
          {{ $t('stanjeAkontacijskogRauna') }}
        </div>
        <div
          v-if="user.wallets.length && userClubWallet.length && paymentMethod === 'acc'"
          class="fw600 has-text-centered is-size-3 has-text-black30 m-t--15 m-b-15"
          :class="[userClubWallet[0].amount > 0 ? 'has-text-white' : 'has-text-danger']"
        >
          <span v-if="userClubWallet.length" class="m-l-5 has-text-centered"
            >{{ $t('key5', { currency: userClubWallet[0].amount }) | currency }}
          </span>
        </div>
      </template>
      <!--      Don't show if negative balance-->
      <!--      TODO - if more the court cost allow-->
      <template v-if="userClubWallet.length || paymentMethod === 'card'">
        <template
          v-if="
            (userClubWallet.length ? userClubWallet[0].amount >= parseInt(totalPrice) : false) ||
            paymentMethod === 'card'
          "
        >
          <div v-if="!isUserPaid" class="activity__reservation">
            <div class="activity__box action__buttons">
              <div
                class="action__item__small fw600 payment_accontation is-green has-text-centered"
                :class="{ selected_payee: true }"
              >
                <div class="flex__column">
                  <div class="has-text-black80 has-text-centered is-size-4">{{ membership.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="has-text-centered fw600 is-size-6 has-text-lightblue m-l-auto m-r-auto m-b--20 m-t-15 w100">
            {{ $t('ukupnaCijena') }}
          </div>
          <div class="has-text-centered fw600 has-text-white is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
            {{ totalPrice | currency }}
          </div>
          <template v-if="paymentMethod === 'card' && false">
            <div class="has-text-centered m-t-20 m-b-20">
              <div class="label--center has-text-white">{{ $t('Želite li R1 račun?') }}</div>
              <div class="radio__box--smaller">
                <div class="block">
                  <b-radio v-model="is_business_invoice" type="is-danger" :native-value="false">
                    {{ $t('ne') }}
                  </b-radio>
                  <b-radio v-model="is_business_invoice" type="is-success" :native-value="true">
                    {{ $t('da') }}
                  </b-radio>
                </div>
              </div>
            </div>
          </template>
          <transition name="fade">
            <payment-company v-if="is_business_invoice" @update="selected_company = $event" />
          </transition>
          <template v-if="paymentMethod !== 'card' && !isUserPaid">
            <div class="label has-text-white">{{ $t('napomena') }}</div>
            <ValidationProvider v-slot="{ errors }" name="Napomena">
              <b-field class="login__input__container has-text-black80" :message="errors">
                <b-input v-model="payment_note" :placeholder="$t('napomena')" type="text" rounded> </b-input>
              </b-field>
            </ValidationProvider>
          </template>
        </template>
        <template v-else>
          <section v-if="paymentMethod === 'acc'" class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" size="is-large" pack="fal" type="is-danger"> </b-icon>
              <p class="fw600 has-text-centered is-size-4 has-text-white line-height-19 p-r-0">
                {{ $t('nemateDovoljnoSredstavaZaPlaanjeRauna') }}
              </p>
            </div>
          </section>
        </template>
      </template>
      <template v-else>
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" size="is-large" pack="fal" type="is-danger"> </b-icon>
            <p class="fw600 has-text-centered is-size-4 has-text-white p-r-0 line-height-19">
              {{ $t('Nemate otvoren akontacijski račun') }}
            </p>
            <p class="fw600 has-text-centered is-size-6 has-text-warning p-r-0 m-t--10">
              {{ $t('Za detalje otvaranja aktontacijskog računa obratite se voditelju kluba') }}
            </p>
          </div>
        </section>
      </template>
    </div>

    <div class="buttons is-fixed">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('otkai2') }}
      </b-button>
      <template
        v-if="
          (userClubWallet.length ? userClubWallet[0].amount >= parseInt(totalPrice) : false) || paymentMethod === 'card'
        "
      >
        <b-button
          v-if="
            (userClubWallet.length ? userClubWallet[0].amount >= parseInt(totalPrice) : false) ||
            paymentMethod === 'card'
          "
          pack="fal"
          icon-right="check"
          type="is-primary"
          rounded
          :loading="loading"
          @click="makePayment()"
        >
          {{ $t('plati') }}
        </b-button>
      </template>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Membership from '@/models/Membership'
import ReservationPayment from '~/models/ReservationPayment'

export default {
  name: 'UserMembershipPayment',
  components: {
    TennisImage,
  },
  props: {
    membership: {
      type: Object,
      required: true,
      default() {
        return {
          membership: {},
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      reservation: {},
      selected_payee: [],
      selected_company: {},
      split: false,
      payAll: true,
      isCash: false,
      payment_fiskal: null,
      payment_note: '',
      paymentMethod: 'card',
      is_business_invoice: false,
    }
  },
  computed: {
    isUserPaid() {
      return false
    },
    clubPaymentBoth() {
      return this.club.payment_accontation === 1 && this.club.payment_online === 1
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    userClubWallet() {
      const w = this.user.wallets.filter((item) => {
        return item.club_id === this.club.id
      })
      return this.$store.state.club.id === 26 ? [] : w
    },
    totalPrice() {
      return this.membership.subscription.price
    },
  },
  watch: {},
  mounted() {
    this.club.payment_online === 1 ? (this.paymentMethod = 'card') : (this.paymentMethod = 'acc')
  },
  methods: {
    isPlayerPaid(player) {
      const x = this.reservation.payments.filter((item) => {
        return item.user_id === player.players[0].id
      })
      return !!x.length
    },
    findPlayersPaymentInfo(id) {
      return this.reservation.payments.filter((item) => {
        return item.user_id === id
      })
    },
    filteredClubWallet(w) {
      return w.find((item) => {
        return item.club_id === this.club.id
      })
    },
    makePayment() {
      this.loading = true
      const clubsWallet = this.filteredClubWallet(this.user.wallets)
      const r = new Membership(this.membership)
      const p = new ReservationPayment({
        player: this.user,
        receiver_id: this.user,
        buyer: this.user,
        wallet: clubsWallet,
        cash: false,
        for_all: this.payAll,
        note: this.payment_note,
        payment_fiskal: this.payment_fiskal,
        payment_method: this.paymentMethod,
        company: this.selected_company,
      }).for(r)
      p.save()
        .then((res) => {
          if (this.paymentMethod === 'card') {
            this.clientSecret = res.client_secret
            this.$emit('cardpayment', res.client_secret)
          } else {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste izvšili plaćanja'),
              type: 'is-success',
            })
            this.$emit('update')
            this.$auth.fetchUser()
            this.loading = false
            this.split = false
            this.note = ''
            this.payment_fiskal = null
            this.$parent.close()
          }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
<style scoped></style>
