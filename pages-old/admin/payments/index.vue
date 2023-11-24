<template>
  <div class="member">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('acc') }}</h1>
    </hero>
    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">
      <div class="modal-subtitle is-uppercase m-r-10"></div>
      <TennisImage :size="[42, 42]" :src="club.logo" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ club.name }}</div>
    </div>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="m-t-0">
      <b-tab-item :label="$t('klub')" class="p-b-100">
        <div class="has-text-centered fw600 is-size-4 m-l-auto m-r-auto m-b-0 m-t-10">{{ $t('transakcije') }}</div>
        <div class="activity x-container">
          <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-b-15 m-t--10">
            {{ $t('ukupnoTransakcija', { total: walletTransactionMeta.total }) }}
          </div>
          <div class="buttons m-t-5 m-b--10">
            <b-button
              v-for="(item, index) in prepaidType"
              :key="index"
              :class="{ softshadow: true, 'invert-small-button': paymentType === item.name }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': paymentType === item.name,
              }"
              pack="fal"
              rounded
              @click="paymentType = item.name"
            >
              {{ $t(item.name) }}
            </b-button>
          </div>
          <div class="activity x-container m-b--10 m-t-20 p-t-10 p-b-10 statistics_new softshadow">
            <div class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto w100">
              {{ sumTitle }}
            </div>
            <div
              v-if="Object.keys(walletTransactionMeta).length"
              class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t--2 m-b-0"
            >
              {{ sum }}
            </div>
          </div>
          <div class="divider-line-1 m-b-10 m-t-30"></div>
          <div class="x-container">
            <TimeRange @timespan="timerange($event)" />
          </div>
          <b-table :data="walletTransaction" :mobile-cards="false" :bordered="false" class="p-b-75 m-t-20 relative">
            <transition name="fade">
              <div v-if="loading" class="align__centar__x loading_z_spinner m-t-15">
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

            <b-table-column v-slot="props" cell-class="active list__image-col" field="first_name">
              <nuxt-link
                :to="localePath('/admin/payments/' + props.row.id + '/prepaid/edit')"
                class="fw600 align__centar__all"
              >
                <div v-if="props.row.wallet.owner" class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.wallet.owner.image" class="user_image" alt="" />
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
                  {{ props.row.amount > 0 ? $t('uplata') : $t('plaanje') }}
                </div>
              </nuxt-link>
            </b-table-column>
            <template v-if="!loading" #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaTransakcijaPodTimUvjetima') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('korisnici')" class="p-b-100">
        <UserFundList />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import WalletTransaction from '@/models/WalletTransaction'
import hero from '~/components/Hero'
import TimeRange from '~/components/reports/TimeRange'
import UserFundList from '~/components/reports/UserFundList'

export default {
  name: 'ClubPayments',
  components: {
    hero,
    TimeRange,
    UserFundList,
    TennisImage,
  },
  async fetch() {
    await this.getTransactions()
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      walletTransaction: [],
      walletTransactionMeta: {},
      bottom: false,
      page: 1,
      userSaldo: [{ name: 'Prikaži stanje svih korisnika' }],
      prepaidType: [{ name: 'Sve' }, { name: 'Uplate' }, { name: 'Plaćanja' }],
      paymentType: 'Sve',
      paymentTimeRange: 'Sve',
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
    sum() {
      const currency = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
        this.walletTransactionMeta.sum
      )
      return currency
    },
    sumTitle() {
      switch (this.paymentType) {
        case 'Sve':
          return this.$t('stanjeAkontacijskogRauna')
        case 'Uplate':
          return this.$t('Ukupno uplata')
        case 'Plaćanja':
          return this.$t('Ukupno plaćanja')
      }
      return ''
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getTransactions()
      }
    },
    paymentType: {
      immediate: true,
      handler() {
        this.walletTransaction = []
        this.page = 1
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
    timerange(item) {
      if (item === 'Sve') {
        this.walletTransaction = []
        this.page = 1
        this.getTransactions()
      } else if (item === 'Custom') {
        this.paymentTimeRange = item
        this.walletTransaction = []
        this.page = 1
        this.getTransactions()
      }
      this.paymentTimeRange = item
      this.walletTransaction = []
      this.page = 1
      this.getTransactions()
    },
    getTransactions() {
      this.loading = true
      const wt = WalletTransaction.include('user', 'wallet.owner').page(this.page).orderBy('-created_at')
      if (this.paymentType === 'Uplate') {
        wt.where('amount_greater_than', 0)
      } else if (this.paymentType === 'Plaćanja') {
        wt.where('amount_less_than', 0)
      }
      if (this.paymentTimeRange !== 'Sve') {
        wt.where('created_between', this.paymentTimeRange)
      }
      wt.where('club', this.clubId)
        .get()
        .then((res) => {
          this.walletTransaction = [...this.walletTransaction, ...res.data]
          this.walletTransactionMeta = res.meta
          this.page++
          this.loading = false
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
