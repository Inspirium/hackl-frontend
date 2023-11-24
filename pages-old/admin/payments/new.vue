<template>
  <div>
    <hero :options="heroImage">
      <nuxt-link :to="localePath('/admin/payments')" class="hero__navigation">
        <h1 class="has-text-white m-l--20">
          <span
            ><b-icon
              icon="long-arrow-left"
              class="m-r-20"
              style="display: inline-block"
              size="is-navigation"
              type="is-white"
              pack="fal"
            >
            </b-icon></span
          >{{ $t('plaanja') }}
        </h1>
      </nuxt-link>
    </hero>
    <indicator class="m-t-20 m-b-40" :options="indicator" :active-step="1" :active-tab="activeTab"></indicator>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="m-t--40 hide_tab_navigation">
      <b-tab-item>
        <div class="x-container registration">
          <div class="fw600 has-text-centered m-b-5 m-t-15 is-size-5 line-height-16">
            {{ $t('odaberiteJednogIliVieLanova') }}
          </div>
          <membersSearch @update="playerList"></membersSearch>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="x-container registration">
          <div :class="['fw600', 'has-text-centered', 'm-b-15', 'm-t-20', 'is-size-5', 'line-height-16']">
            {{ newPayment.type !== null ? $t('Odabrana vrsta uplate:') : $t('Upiši iznos članarine:') }}
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
                $t('key5', { currency: newPayment.type.price }) | currency
              }}</span>
              <span @click=";(newPayment.type = null), (newPayment.price = null)">
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
              </span>
            </div>
          </div>
          <template v-if="newPayment.type">
            <div class="content has-text-grey has-text-centered m-t-10">
              <b-icon icon="bell-on" size="is-large" pack="fal"> </b-icon>
            </div>
            <div class="fw600 has-text-centered m-t--30 m-b-15">{{ $t('postaviPodsjetnikZaPlaanje') }}</div>
            <div v-if="newPayment.reminder !== 0" class="align__centar__all m-b-20">
              <div class="fw600 has-text-centered m-b-5 is-size-5 reminder__select">
                {{ newPayment.reminder === 1 ? $t('Svaki mjesec') : $t('Svake godine') }}
              </div>
              <span @click="newPayment.reminder = 0">
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
              </span>
            </div>
            <div class="buttons m-b-0">
              <b-button
                :class="['softshadow']"
                type="is-small noborder__small"
                rounded
                @click="newPayment.reminder = 1"
              >
                {{ $t('svakiMjesec') }}
              </b-button>
              <b-button
                :class="['softshadow']"
                type="is-small noborder__small"
                rounded
                @click="newPayment.reminder = 12"
              >
                {{ $t('svakuGodinu') }}
              </b-button>
            </div>
          </template>
          <template v-else>
            <div class="fw600 has-text-centered m-b--10 m-t-20 is-size-5 line-height-16">
              {{ $t('iliOdaberiteTipTroka') }}
            </div>
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
                  :class="['action__item__small', 'fw600', newPayment.type === type ? 'active' : '']"
                  @click="prepaymentType(type)"
                >
                  <div>{{ type.name }}</div>
                  <span class="x-tag primary-light m-l-auto m-r-5">{{ type.price | currency }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </b-tab-item>
    </b-tabs>
    <div v-if="!isModalActive" class="buttons is-fixed m-t-30">
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
        v-if="activeTab === 0"
        :class="['fw600', newPayment.playerList.length ? '' : 'blur_button']"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        @click.prevent="activeTab++"
      >
        {{ $t('dalje') }}
      </b-button>
      <b-button
        v-else
        :class="['fw600', newPayment.price ? '' : 'blur_button']"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
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
import Club from '@/models/Club'
import Payment from '@/models/Payment'
import hero from '~/components/Hero'
import modalPaymentType from '~/components/modal/ModalPaymentType'
import membersSearch from '~/components/membersSearch'
import indicator from '~/components/Indicator'

export default {
  name: 'PaymentNew',
  components: {
    hero,
    modalPaymentType,
    membersSearch,
    indicator,
  },
  async fetch() {
    await this.getPaymentTypes()
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
    action() {
      this.loading = true
      const payment = new Payment(this.newPayment).for(new Club({ id: this.$store.state.club.id }))
      payment
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili uplatu'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/admin/payments'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.$router.push(this.localePath('/admin/payments'))
          this.loading = false
        })
    },
  },
}
</script>
