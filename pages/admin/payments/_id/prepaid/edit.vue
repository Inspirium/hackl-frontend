<template>
  <div>
    <PageHeader :title="$t('Uredi plaćanje')" :background="'is-primary'"></PageHeader>
    <div
      v-if="Object.keys(payer).length"
      class="align__centar__all has-text-white p-t-10 p-b-10"
      :class="walletTransaction.amount > 0 ? 'is-primary' : 'is-red'"
    >
      <div class="modal-subtitle is-uppercase m-r-10">{{ walletTransaction.amount > 0 ? 'Uplata:' : 'Plaćanje:' }}</div>
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
      <div class="has-text-centered fw600 is-size-1 m-l-auto m-r-auto m-t--10 m-b-0">
        {{ price }}
      </div>
      <div class="has-text-centered fw600 is-size-6 has-text-lightblue m-b-10">
        {{ walletTransaction.note }}
      </div>
    </div>
    <!--    <div class="buttons m-t-30">-->
    <!--      <b-button-->
    <!--        :class="['fw600', 'm-b-10']"-->
    <!--        type="is-danger"-->
    <!--        pack="fal"-->
    <!--        icon-right="times"-->
    <!--        rounded-->
    <!--        @click="deletePayment"-->
    <!--      >-->
    <!--        Obriši uplatu-->
    <!--      </b-button>-->
    <!--    </div>-->
    <div class="divider-line-1"></div>
    <div class="modal-subtitle has-text-centered is-uppercase m-t-10">
      {{ walletTransaction.amount > 0 ? 'Uplatu izvršio:' : 'Plaćanje izvršio:' }}
    </div>
    <div v-if="Object.keys(payer).length" class="align__centar__all p-t--10 p-b-10">
      <TennisImage :size="[42, 42]" :src="payee.image" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ payee.display_name }}</div>
    </div>

    <div class="buttons m-t-30">
      <b-button
        :class="['m-l-10', 'fw600']"
        type="is-primary"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click="$router.go(-1)"
      >
        {{ $t('nazad') }}
      </b-button>
      <!--          <b-button class="fw600" type="is-primary" pack="fal" icon-right="check" rounded @click.prevent="action()">-->
      <!--            Spremi-->
      <!--          </b-button>-->
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import WalletTransaction from '@/models/WalletTransaction'
import Wallet from '@/models/Wallet'
import TennisImage from '@/components/TennisImage.vue'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'PaymentEdit',
  components: {
    PageHeader,
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
      isModalActive: false,
      isModalConfirmation: false,
      heroImage: '/hero_court.jpg',
      payer: {},
      payee: {},
      wallet: {},
      walletTransaction: {},
    }
  },
  computed: {
    price() {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
        this.walletTransaction.amount
      )
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
