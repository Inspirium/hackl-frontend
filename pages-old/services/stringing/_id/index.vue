<template>
  <div>
    <PageHeader
      :title="stringing.is_paid ? $t('Plaćeno!') : $t('Špananje')"
      :background="stringing.is_paid ? 'green' : 'is-primary'"
    >
      <p class="has-text-centered fw600 is-size-5 has-text-white m-l-auto m-r-auto">
        {{ $t('status', { status: status }) }}
      </p>
    </PageHeader>

    <div v-if="Object.keys(payer).length" class="align__centar__all has-text-white p-t-10 p-b-10 badge-acrylic">
      <div class="modal-subtitle is-uppercase m-r-10">{{ $t('naruitelj2') }}</div>
      <TennisImage :size="[42, 42]" :src="payer.image" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ payer.display_name }}</div>
    </div>
    <div class="x-container">
      <h4 class="has-text-black50 has-text-centered fw600 is-size-5 m-t-10">
        {{ walletTransaction.created_at | moment('DD.MM.YYYY.') }}
      </h4>
      <!--      <div class="has-text-centered fw600 is-size-6 has-text-black50 m-l-auto m-r-auto m-b&#45;&#45;20 m-t-5">-->
      <!--        Iznos transakcije-->
      <!--      </div>-->
      <div class="has-text-centered fw600 is-size-1 m-l-auto m-r-auto m-t--10">
        {{ price }}
      </div>
      <div class="divider-line-1"></div>
      <template>
        <div class="fw600 is-size-65 has-text-black80 is-uppercase m-t-15 m-b-7">{{ $t('podaciOReketu') }}</div>
        <div class="is-white radius__12 softshadow overflow-hidden">
          <div class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation">
            <div class="fw600 align__centar__all">
              <div v-if="stringing.racquet.image" class="list__img">
                <TennisImage :size="[42, 42]" :src="stringing.racquet.image" class="user_image" alt="" />
              </div>
              <div v-else class="">
                <b-icon
                  icon="racquet"
                  pack="far"
                  size="is-medium m-r-15 m-l-5 top-5"
                  class="relative has-text-black30"
                ></b-icon>
              </div>
              <div class="list__content">
                <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ stringing.racquet.name }}</h4>
                <h3 class="fw600 m-t--2 has-text-lightblue is-size-65">
                  {{ $t('ica', { string: stringing.racquet.string }) }}
                </h3>
                <div class="has-text-black80 fw600 is-size-65 m-l-auto nowrap">
                  {{ $t('kilaaKg', { tension: stringing.racquet.tension }) }}
                </div>
              </div>
              <div v-if="stringing.clients_string" class="x-tag is-red m-r-5">{{ $t('vlastitaIca') }}</div>
            </div>
          </div>
        </div>
      </template>
      <div class="has-text-centered fw600 is-size-6 has-text-lightblue m-t-15 m-b-15">
        {{ stringing.description }}
      </div>
      <div class="divider-line-1"></div>
      <div class="fw600 is-size-65 has-text-black80 is-uppercase m-t-15 m-b-7">{{ $t('podaciOPaneru') }}</div>
      <div class="activity__box action__buttons br100">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(stringing.client).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="stringing.client.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <h3>{{ stringing.client.display_name }}</h3>
              <h4>{{ $t('godina range', { range: stringing.client.range }) }}</h4>
            </div>
            <div @click="stringing.client = {}">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActive = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('dodajPanera') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="stringing.is_paid">
      <div class="divider-line-1 m-t-20"></div>

      <div class="modal-subtitle has-text-centered is-uppercase m-t-20">{{ $t('plaanjeIzvrio') }}</div>
      <div v-if="Object.keys(payer).length" class="align__centar__all p-t--10 p-b-10">
        <TennisImage :size="[42, 42]" :src="payee.image" class="user_image m-r-10 border__white--2" alt="" />
        <div class="is-text-center fw600 is-size-5">{{ payee.display_name }}</div>
      </div>
    </template>
    <div class="divider-line-1 m-t-20"></div>

    <div class="buttons m-t-30">
      <b-button
        class="softshadow invert-small-button"
        type="is-small noborder is-danger has-text-white"
        pack="fal"
        icon-right="times-circle"
        rounded
      >
        {{ $t('stornirajPananje') }}
      </b-button>
    </div>
    <div class="divider-line-1"></div>
    <div class="buttons m-t-30">
      <b-button :class="['m-l-10', 'fw600']" type="is-primary" pack="fal" rounded @click="$router.go(-1)">
        {{ $t('oznaiZavrenim') }}
      </b-button>
      <b-button :class="['m-l-10', 'fw600', 'green']" type="is-success" pack="fal" rounded @click="$router.go(-1)">
        {{ $t('Naplati') }}
      </b-button>
      <!--          <b-button class="fw600" type="is-primary" pack="fal" icon-right="check" rounded @click.prevent="action()">-->
      <!--            Spremi-->
      <!--          </b-button>-->
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('naruitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="stringing.stringer = $event"
      ></modalMembers>
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import WalletTransaction from '@/models/WalletTransaction'
import Wallet from '@/models/Wallet'
import Player from '~/models/Player'
import modalMembers from '~/components/modal/ModalMembersAll'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Stringing',
  components: {
    PageHeader,
    modalMembers,
    TennisImage,
  },
  async fetch() {
    await this.getTransactions()
  },
  data() {
    return {
      indicator: {
        tabs: 2,
      },
      isModalMembersActive: false,
      isModalConfirmation: false,
      heroImage: '/hero_court.jpg',
      payer: {},
      payee: {},
      wallet: {},
      walletTransaction: {},
      stringing: {
        racquet: {
          name: 'Wilson',
          string: '25 string',
          tension: 23,
          image: '/stringing.jpg',
        },
        price: 150,
        client: {},
        took_order: this.user,
        stringer: this.user,
        payment_reciever: this.user,
        clients_string: 0,
        strings: '',
        description: 'Donio je svoje žice i želi da mu Marko špana',
        status: 'pending',
        is_paid: false,
      },
    }
  },
  computed: {
    price() {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.stringing.price)
    },
    status() {
      if (this.stringing.status === 'pending') {
        return 'u izradi'
      } else if (this.stringing.status === 'finish') {
        return 'završeno'
      }
      return ''
    },
  },
  watch: {
    walletTransaction: {
      handler() {
        this.getPayee()
        this.getWallet()
      },
    },
    wallet: {
      handler() {
        this.getPayer()
      },
    },
  },
  methods: {
    async getTransactions() {
      this.walletTransaction = await WalletTransaction.$find(this.$route.params.id)
    },
    async getPayee() {
      this.payee = await Player.$find(this.walletTransaction.user_id)
    },
    async getWallet() {
      this.wallet = await Wallet.$find(this.walletTransaction.wallet_id)
    },
    async getPayer() {
      this.payer = await Player.$find(this.wallet.owner_id)
    },
  },
}
</script>
