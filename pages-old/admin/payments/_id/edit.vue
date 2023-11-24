<template>
  <div>
    <hero :options="heroImage" :back="true">
      <h1 class="has-text-white">{{ $t('urediPlaanje') }}</h1>
    </hero>
    <div v-if="newPayment.playerList.length" class="align__centar__all is-primary has-text-white p-t-10 p-b-10">
      <div class="modal-subtitle is-uppercase m-r-10">{{ $t('uplatio') }}</div>
      <TennisImage :size="[42, 42]" :src="payment.receiver.image" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ payment.receiver.display_name }}</div>
    </div>
    <div class="buttons m-t-30">
      <b-button
        :class="['fw600', 'm-b-10']"
        type="is-danger"
        pack="fal"
        icon-right="times"
        rounded
        @click="deletePayment"
      >
        {{ $t('obriiUplatu') }}
      </b-button>
    </div>

    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="m-t--20 hide_tab_navigation">
      <b-tab-item>
        <div class="x-container registration">
          <div :class="['fw600', 'has-text-centered', 'm-b-15', 'm-t-20', 'is-size-5', 'line-height-16']">
            {{ newPayment.type !== null ? $t('Odabrana vrsta uplate:') : $t('Iznos uplate:') }}
          </div>
          <ValidationProvider v-if="newPayment.type === null" v-slot="{ errors, valid }" name="Uplata" rules="required">
            <b-field
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-numberinput
                v-model="newPayment.price"
                :placeholder="$t('upiiIznos')"
                min="0"
                step="1"
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
          <div v-else class="activity__box action__buttons m-b-15 radius__full">
            <div class="action__item fw600">
              <nuxt-link class="is-size-55 has-text-black80" :to="localePath('/admin/membership/')">{{
                newPayment.type.name
              }}</nuxt-link>
              <span class="x-tag primary-light m-l-auto m-r-5">{{
                $t('key5', { currency: newPayment.price }) | currency
              }}</span>
              <span @click=";(newPayment.type = null), (newPayment.price = 0)">
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
              </span>
            </div>
          </div>
          <div class="fw600 has-text-centered m-b--10 m-t-20 is-size-5 line-height-16">{{ $t('tipoviTroka') }}</div>
          <div class="x-container registration">
            <div class="buttons m-t-20 m-b-0">
              <b-button
                class="m-b-15 m-t-10 softshadow"
                type="is-small noborder"
                pack="fal"
                icon-right="plus"
                rounded
                @click="isModalActive = true"
              >
                {{ $t('dodajNoviTipTroka') }}
              </b-button>
            </div>
          </div>
          <div class="activity__reservation p-b-75">
            <div class="activity__box action__buttons">
              <div
                v-for="type in paymentTypes"
                :key="type.id"
                class="action__item__small fw600"
                @click="prepaymentType(type)"
              >
                <div>{{ type.name }}</div>
                <span class="x-tag primary-light m-l-auto m-r-5">{{
                  $t('key5', { currency: type.price }) | currency
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="buttons is-fixed m-t-30">
      <b-button
        :class="['m-l-10', 'fw600']"
        type="is-danger"
        pack="fal"
        icon-left="chevron-left"
        rounded
        tag="nuxt-link"
        :to="localePath('/admin/payments')"
      >
        {{ $t('nazad') }}
      </b-button>
      <b-button
        :class="['fw600', newPayment.price ? '' : 'blur_button']"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        @click.prevent="action()"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalPaymentType
        :title="$t('noviTipTroka')"
        :subtitle="$t('Unesi podatke za novi tip troška')"
        @update="addExpense"
      ></modalPaymentType>
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'
import Payment from '@/models/Payment'
import hero from '~/components/Hero'
import modalPaymentType from '~/components/modal/ModalPaymentType'

export default {
  name: 'PaymentEdit',
  components: {
    hero,
    modalPaymentType,
    TennisImage,
  },
  async fetch() {
    await this.getPaymentTypes()
    await this.getPayments()
  },
  data() {
    return {
      indicator: {
        tabs: 2,
      },
      isModalActive: false,
      isModalConfirmation: false,
      heroImage: '/hero_court.jpg',
      activeTab: 0,
      activeTabPayment: 0,
      paymentList: [],
      newPayment: {
        price: 0,
        type: null,
        playerList: [],
      },
      paymentTypes: [],
      payment: [],
    }
  },
  computed: {
    nextArrow() {
      if (this.activeTab === 0) {
        return true
      }
      if (this.activeTab === 1 && this.newPayment.playerList.length) {
        return true
      }
      if (this.activeTab === 2) {
        return false
      } else {
        return false
      }
    },
  },
  methods: {
    prepaymentType(type) {
      this.newPayment.type = type
      this.newPayment.price = type.price
    },
    playerList(data) {
      this.$set(this.newPayment, 'playerList', data)
    },
    addExpense(expense) {
      this.paymentTypes.push(expense)
      this.newPayment.type = expense
      this.newPayment.price = expense.price
    },
    deletePayment() {
      const club = new Club({ id: this.$store.state.club.id })
      const p = new Payment({ id: this.payment.id }).for(club)
      p.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali uplatu'),
          type: 'is-success',
        })
        this.$router.push(this.localePath('/admin/payments'))
      })
    },
    getPayments() {
      const club = new Club({ id: this.$store.state.club.id })
      club
        .payments()
        .include(['user', 'receiver', 'type'])
        .find(this.$route.params.id)
        .then((res) => {
          this.payment = res
          this.newPayment.playerList.push(res.user)
          this.newPayment.type = res.type
          this.newPayment.price = res.amount
        })
    },
    getPaymentTypes() {
      const club = new Club({ id: this.$store.state.club.id })
      club
        .memberships()
        .get()
        .then((res) => {
          this.paymentTypes = [...this.paymentTypes, ...res.data]
        })
      club
        .otherExpenses()
        .get()
        .then((res) => {
          this.paymentTypes = [...this.paymentTypes, ...res.data]
        })
    },
    action() {
      const payment = new Payment(this.newPayment).for(new Club({ id: this.$store.state.club.id }))
      payment
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili uplatu'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/admin/payments'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.$router.push(this.localePath('/admin/payments'))
        })
    },
  },
}
</script>
