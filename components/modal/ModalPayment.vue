<template>
  <div class="modal-confirmation">
    <transition name="fade">
      <div v-show="!isConfirmation">
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="x-container registration">
          <div class="fw600 is-size-65 has-text-white has-text-centered m-b-15 m-t-10 is-size-5 line-height-16">
            {{ $t('unesiteVrijednostUplateIliOdaberiTipTroka') }}
          </div>
          <ValidationProvider v-slot="{ errors, valid }" name="Uplata" rules="required">
            <b-field
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-numberinput
                v-model="newPayment.price"
                :placeholder="$t('upiiIznos')"
                step="1"
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
          <div class="fw600 has-text-white has-text-centered m-b-10 m-t-10 is-size-6 line-height-16">
            {{ $t('tipoviTroka') }}
          </div>
          <div class="activity__reservation p-b-75">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="type in paymentTypes"
                  :key="type.id"
                  :class="['action__item__small', 'fw600', newPayment.type === type ? 'active' : '']"
                  @click="prepaymentType(type)"
                >
                  <div>{{ type.name }}</div>
                  <span class="x-tag primary-light m-l-auto m-r-5">{{
                    $t('key5', { currency: type.price }) | currency
                  }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="buttons m-t-20 is-fixed">
          <b-button
            class="m-l-10 fw600"
            type="is-danger"
            pack="fal"
            icon-right="times"
            rounded
            @click="$parent.close()"
          >
            {{ $t('otkai') }}
          </b-button>
          <b-button
            :loading="loading"
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            @click="action()"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'
import Club from '@/models/Club'
import Payment from '@/models/Payment'
import Player from '~/models/Player'

export default {
  name: 'ModalPayment',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Podnaslov',
    },
    data: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },
  async fetch() {
    await this.getPaymentTypes()
    await this.getPlayer()
  },
  data() {
    return {
      isConfirmation: false,
      player: {},
      payments: [
        {
          id: 1,
          amount: 90,
          date: '2020-09-28T12:52:31+02:00',
          type: 'Zlatno članstvo 2020',
          user: {
            id: 1,
            name: 'Stjepan Drmić',
            image: 'https://www.gravatar.com/avatar/7aef278cb7824653f8292d2a4bc304f8?s=200&d=robohash',
          },
          receiver: {
            id: 4,
            name: 'Ivica Grizelj',
          },
        },
        {
          id: 2,
          amount: 190,
          type: 'Zlatno članstvo 2020',
          date: '2020-09-28T12:52:31+02:00',
          user: {
            id: 3,
            name: 'Danijel Galić',
            image: 'https://www.gravatar.com/avatar/7aef278cb7824653f8292d2a4bc304f8?s=200&d=robohash',
          },
          receiver: {
            id: 4,
            name: 'Ivica Grizelj',
          },
        },
        {
          id: 2,
          amount: 190,
          type: 'Zlatno članstvo 2020',
          date: '2020-09-28T12:52:31+02:00',
          user: {
            id: 3,
            name: 'Danijel Galić',
            image: 'https://www.gravatar.com/avatar/7aef278cb7824653f8292d2a4bc304f8?s=200&d=robohash',
          },
          receiver: {
            id: 4,
            name: 'Ivica Grizelj',
          },
        },
        {
          id: 3,
          amount: 240,
          type: 'Zlatno članstvo 2020',
          date: '2020-09-28T12:52:31+02:00',
          user: {
            id: 3,
            name: 'Marko Novak',
            image: 'https://www.gravatar.com/avatar/7aef278cb7824653f8292d2a4bc304f8?s=200&d=robohash',
          },
          receiver: {
            id: 4,
            name: 'Ivica Grizelj',
          },
        },
      ],
      newPayment: {
        price: null,
        type: null,
        playerList: [],
        reminder: 0,
      },
      paymentTypes: [],
      loading: false,
    }
  },
  methods: {
    action() {
      this.loading = true
      this.newPayment.playerList.push(this.player)
      const payment = new Payment(this.newPayment).for(new Club({ id: this.$store.state.club.id }))
      payment
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili uplatu'),
            type: 'is-success',
          })
          this.loading = false
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    prepaymentType(type) {
      this.newPayment.type = type
      this.newPayment.price = type.price
    },
    async getPlayer() {
      this.player = await Player.$find(parseInt(this.$route.params.player, 10))
    },
    getPaymentTypes() {
      const club = new Club({ id: this.$store.state.club.id })
      club
        .otherExpenses()
        .get()
        .then((res) => {
          this.paymentTypes = [...res.data, ...this.paymentTypes]
        })
      club
        .memberships()
        .get()
        .then((res) => {
          this.paymentTypes = [...res.data, ...this.paymentTypes]
        })
    },
    send() {
      this.$emit('update', {
        confirm: this.isConfirmation,
      })
      this.$parent.close()
    },
  },
}
</script>
