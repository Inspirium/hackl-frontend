<template>
  <div class="x-container">
    <div class="buttons m-t-15">
      <b-button
        :class="{ softshadow: true, 'invert-small-button': onlyDebt }"
        :icon-right="onlyDebt ? 'times' : ''"
        :type="{
          'is-small': true,
          noborder: true,
          'is-primary has-text-white': onlyDebt,
        }"
        pack="fal"
        rounded
        @click.prevent="onlyDebtFunc()"
      >
        {{ $t('prikaiSamoDunike') }}
      </b-button>
    </div>
    <template v-if="onlyDebt">
      <div class="divider-line-1 m-b-20 m-t--10"></div>
      <div class="has-text-centered fw600 is-size-4 m-l-auto m-r-auto m-b-0 m-t--10">{{ $t('poaljiPoruku') }}</div>
      <div class="buttons m-t-15">
        <b-button class="softshadow" type="is-small noborder" pack="fal" rounded @click.native.prevent="submitMessage">
          {{ checkedRows.length ? $t('Samo odabranim dužnicima') : $t('Pošalji poruku svim dužnicima') }}
          <span v-if="checkedRows.length" class="has-text-lightblue">({{ checkedRows.length }})</span>
        </b-button>
      </div>
    </template>
    <b-table
      :data="wallet"
      :checked-rows.sync="checkedRows"
      :mobile-cards="false"
      :bordered="false"
      checkbox-type="is-info"
      :checkable="onlyDebt"
      class="p-b-75 relative"
    >
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
        <template v-if="props.row.owner">
          <nuxt-link :to="localePath('/player/' + props.row.owner.id)" class="fw600 align__centar__all">
            <div v-if="props.row.owner" class="list__img" :class="{ 'm-l--16': onlyDebt }">
              <TennisImage :size="[42, 42]" :src="props.row.owner.image" class="user_image" alt="" />
            </div>
            <div class="list__content">
              <h3 class="fw600 is-size-6 has-text-black80 m-r-5">{{ props.row.owner.display_name }}</h3>
            </div>
            <div
              class="fw600 is-size-5 m-l-auto nowrap"
              :class="props.row.amount > 0 ? 'has-text-lightblue' : 'has-text-danger'"
            >
              {{ $t('key5', { currency: props.row.amount }) | currency }}
            </div>
          </nuxt-link>
        </template>
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
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Wallet from '@/models/Wallet'
import Thread from '@/models/Thread'

export default {
  name: 'ClubPaymentsUserFunds',
  components: {
    TennisImage,
  },
  async fetch() {
    await this.getWallet()
  },
  data() {
    return {
      loading: false,
      wallet: [],
      walletMeta: {},
      bottom: false,
      page: 1,
      onlyDebt: false,
      loadingMessegas: false,
      checkedRows: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getWallet()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    onlyDebtFunc() {
      this.onlyDebt = !this.onlyDebt
      this.page = 1
      this.wallet = []
      this.getWallet()
    },
    submitMessage() {
      this.loadingMessegas = true
      const x = []
      for (let i = 0; i < this.checkedRows.length; i++) {
        if (this.checkedRows[i].owner !== null) {
          this.checkedRows[i].owner.type = 'player'
          x.push(this.checkedRows[i].owner)
        }
      }
      const t = new Thread({ players: x, message: this.$t('Informacija o stanju na akontacijskom računu') })
      t.save().then((res) => {
        this.$router.push(this.localePath(`/messages/${res.id}`))
        this.loadingMessegas = false
      })
    },
    getWallet() {
      this.loading = true
      const wt = Wallet.include('owner').page(this.page).orderBy('-amount')
      if (this.onlyDebt) {
        wt.where('amount_less_than', -0.5)
      }
      wt.where('club', this.club.id)
        .get()
        .then((res) => {
          this.wallet = [...this.wallet, ...res.data]
          this.walletMeta = res.meta
          this.page++
          this.loading = false
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
