<template>
  <div v-if="showWidget" class="">
    <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('ponudaKluba') }}</div>
    <div class="home-menu-middle">
      <div v-if="totalProducts" class="">
        <nuxt-link :to="localePath('/shop')" class="has-text-black50">
          <font-awesome-icon class="m-b-5" icon="fa-light fa-basket-shopping" />
          <div class="nav__menu">{{ $t('proizvodi') }}</div>
        </nuxt-link>
      </div>
      <div v-if="totalServices" class="">
        <nuxt-link :to="localePath('/services')" class="has-text-black50">
          <font-awesome-icon class="m-b-5" icon="fa-light fa-lightbulb-on" />
          <div class="nav__menu">{{ $t('usluge') }}</div>
        </nuxt-link>
      </div>
      <div v-if="totalStringing" class="">
        <nuxt-link :to="localePath('/services/stringing/preview')" class="has-text-black50">
          <font-awesome-icon class="m-b-5" icon="fa-light fa-racquet" />
          <div class="nav__menu">{{ $t('Špananje') }}</div>
        </nuxt-link>
      </div>
      <div v-if="totalTrainers" class="">
        <nuxt-link :to="localePath('/trainer')" class="has-text-black50">
          <font-awesome-icon class="m-b-5" icon="fa-light fa-graduation-cap" />
          <div class="nav__menu">{{ $t('treneri') }}</div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import ShopProduct from '~/models/ShopProduct'
import Trainer from '~/models/Trainer'

export default {
  name: 'HomeShop',
  components: {},
  async fetch() {
    await this.getProducts()
    await this.getServices()
    await this.getStringing()
    await this.getTrainers()
  },
  data() {
    return {
      totalProducts: null,
      totalServices: null,
      totalStringing: null,
      totalTrainers: null,
      trainers: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    clubStriging() {
      return this.$store.state.club.online_payment
    },
    isAdmin() {
      return this.user.is_admin
    },
    showWidget() {
      return this.totalProducts || this.totalServices || this.totalStringing || this.trainers.length
    },
  },
  methods: {
    getProducts() {
      ShopProduct.where('special', null)
        .where('club', this.$store.state.club.id)
        .where('status', 'active')
        .get()
        .then((res) => {
          this.totalProducts = res.meta.total
        })
    },
    getServices() {
      ShopProduct.where('special', 'service')
        .where('club', this.$store.state.club.id)
        .where('status', 'active')
        .get()
        .then((res) => {
          this.totalServices = res.meta.total
        })
    },
    getStringing() {
      ShopProduct.where('special', 'stringing')
        .where('club', this.$store.state.club.id)
        .where('status', 'active')
        .get()
        .then((res) => {
          this.totalStringing = res.meta.total
        })
    },
    getTrainers() {
      Trainer.where('available', true)
        .where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.totalTrainers = res.meta.total
        })
    },
  },
}
</script>
