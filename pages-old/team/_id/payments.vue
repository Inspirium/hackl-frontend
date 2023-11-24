<template>
  <div v-if="walletTransaction.length" class="member">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('plaanja') }}</h1>
    </hero>
    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">
      <div class="modal-subtitle is-uppercase m-r-10"></div>
      <TennisImage :size="[42, 42]" :src="player.image" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ player.display_name }}</div>
    </div>
    <div class="activity x-container m-b--20">
      <div class="has-text-centered fw600 is-size-6 has-text-black50 m-l-auto m-r-auto m-b--20">
        {{ $t('stanjeNaRaunu2') }}
      </div>
      <div class="has-text-centered fw600 is-size-1 m-l-auto m-r-auto m-t-10 m-b-0">
        {{ $t('key5', { currency: funds.amount }) | currency }}
      </div>

      <div class="buttons m-b-20">
        <b-button
          class="fw600 button__white softshadow"
          type="is-green"
          pack="fal"
          icon-right="plus-circle"
          rounded
          @click="isModalPrepaidActive = true"
        >
          {{ $t('uplata') }}
        </b-button>
        <b-button
          class="fw600"
          type="is-danger"
          pack="fal"
          icon-right="minus-circle"
          rounded
          @click="isModalPrepaidPaymentActive = true"
        >
          {{ $t('plaanje') }}
        </b-button>
      </div>
    </div>
    <div class="divider-line-1 m-b-20 m-t--15"></div>
    <div class="has-text-centered fw600 is-size-4 m-l-auto m-r-auto m-b-0 m-t--10">{{ $t('transakcije') }}</div>
    <!--<div v-if="false" class="filters--two container">
      <div class="filter">
        <div class="label m-t-0">Period</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalRoleActive = true">
            {{ filterRoleDisplay }}
          </b-button>
        </div>
      </div>
      <div class="filter">
        <div class="label m-t-0">Tip uplate</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalPaymentTypeActive = true">
            {{ filterPrepaidType }}
          </b-button>
        </div>
      </div>
    </div>-->
    <div class="activity x-container">
      <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-b-15 m-t--10">
        {{ $t('ukupnoTransakcija', { total: walletTransactionMeta.total }) }}
      </div>
      <b-table :data="walletTransaction" :mobile-cards="false" :bordered="false" class="p-b-75">
        <b-table-column v-slot="props" cell-class="active list__image-col" field="first_name">
          <nuxt-link
            :to="localePath('/admin/payments/' + props.row.id + '/prepaid/edit')"
            class="fw600 align__centar__all"
          >
            <div class="list__img">
              <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
            </div>
            <div class="list__content">
              <div class="align__centar__y">
                <h4 class="has-text-grey-light fw600 is-size-7">
                  {{ props.row.created_at | moment('DD.MM.YYYY.') }}
                </h4>
              </div>
              <h4 class="fw600 is-size-5 m-t--2">{{ $t('key5', { currency: props.row.amount }) | currency }}</h4>
              <h3 class="fw600 has-text-lightblue is-size-65">
                {{ props.row.note }}
              </h3>
            </div>
            <div class="x-tag m-l-auto nowrap" :class="props.row.amount > 0 ? 'is-primary' : 'is-red'">
              {{ props.row.amount > 0 ? $t('Uplata') : $t('Plaćanje') }}
            </div>
          </nuxt-link>
        </b-table-column>
      </b-table>
    </div>
    <b-modal :active.sync="isModalPaymentTypeActive" :width="640" scroll="clip">
      <modalOptions
        :confirm="false"
        :send-object="true"
        :options="prepaidType"
        :title="$t('lanstva')"
        :subtitle="$t('Filtrirajte po sljedećim članstvima')"
        @update="modalPrepaidType"
      ></modalOptions>
    </b-modal>

    <b-modal :active.sync="isModalPrepaidActive" :width="640" scroll="clip">
      <modalPaymentPrepaid
        :title="$t('uplata')"
        :subtitle="$t('Unesi podatke o iznosu')"
        :label="$t('uplata')"
        :user="player"
        type="payment"
        @update="
          getFunds()
          getTransactionsRefresh()
        "
      ></modalPaymentPrepaid>
    </b-modal>
    <b-modal :active.sync="isModalPrepaidPaymentActive" :width="640" scroll="clip">
      <modalPaymentPrepaid
        :title="$t('plaanjeRauna')"
        :subtitle="$t('Unesi podatke o plaćanju računa')"
        :label="$t('iznosRauna')"
        :user="player"
        type="paying"
        @update="
          getFunds()
          getTransactionsRefresh()
        "
      ></modalPaymentPrepaid>
    </b-modal>

    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('trajnoObriiKorisnika')"
        :subtitle="$t('Nakon brisanja korisnika svi podaci će biti obrisani')"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import WalletTransaction from '@/models/WalletTransaction'
import Wallet from '@/models/Wallet'
import hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalPaymentPrepaid from '~/components/modal/ModalPaymentPrepaid'
import modalOptions from '~/components/modal/ModalOptions'
import Player from '~/models/Player'

export default {
  name: 'PlayerPayments',
  components: {
    hero,
    modalOptions,
    modalConfirmation,
    modalPaymentPrepaid,
    TennisImage,
  },
  async fetch() {
    await this.getPlayer()
    await this.getFunds()
  },
  data() {
    return {
      isModalPrepaidActive: false,
      isModalPrepaidPaymentActive: false,
      isModalPaymentTypeActive: false,
      filterPrepaidType: 'Sve',
      isModalDeleteActive: false,
      player: {},
      loading: false,
      filterRoleDisplay: 'Sve',
      transaction: {
        player: {},
        note: '',
        amount: null,
        wallet: {},
      },
      funds: 0,
      walletTransaction: [],
      walletTransactionMeta: {},
      bottom: false,
      page: 1,
    }
  },
  computed: {
    clubId() {
      return this.club.id
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
    prepaidType() {
      return [{ name: 'Sve' }, { name: 'Uplate' }, { name: 'Plaćanja' }]
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom && Object.keys(this.player).length) {
        this.getTransactions()
      }
    },
    player: {
      handler() {
        this.getTransactions()
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    async getFunds() {
      if (this.player.wallets.length) {
        this.funds = await Wallet.where('club', this.$store.state.club.id)
          .include('transactions')
          .$find(this.player.wallets[0].id)
      }
    },
    getTransactions() {
      WalletTransaction.where('wallet', this.player.wallets[0].id)
        .page(this.page)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.walletTransaction = [...this.walletTransaction, ...res.data]
          this.walletTransactionMeta = res.meta
          this.page++
        })
    },
    getTransactionsRefresh() {
      WalletTransaction.where('wallet', this.player.wallets[0].id)
        .page(1)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.walletTransaction = res.data
        })
    },
    modalPrepaidType(data) {
      this.filterPrepaidType = data.name
    },
    async getPlayer() {
      let id
      if (this.$route.params.id) {
        id = this.$route.params.id
      } else {
        id = this.user.id
      }
      this.player = await Player.include('wallets').$find(id)
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
