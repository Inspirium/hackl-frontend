<template>
  <div class="p-b-300">
    <hero :options="heroImage" :back="true">
      <h1 class="has-text-white">{{ $t('uslugaPananja') }}</h1>
    </hero>
    <div class="is-primary has-text-white p-t-10 p-b-10">
      <div class="align__centar__all">
        <TennisImage :size="[42, 42]" :src="clubStringing.logo" class="user_image m-r-10 border__white--2" alt="" />
        <div class="is-text-center fw600 is-size-5">
          {{ clubStringing.name }}
          <div class="is-text-center fw600 m-t--3 is-size-65">
            {{ clubStringing.city }}, {{ clubStringing.address }}
          </div>
        </div>
      </div>
    </div>
    <div class="x-container">
      <div class="m-b-10 m-t-20 has-text-centered">
        <div class="fw600 is-size-3">{{ stringing.name }}</div>
      </div>
      <!-- eslint-disable-next-line -->
      <div class="has-text-left fw600 is-size-6 content-tiny" v-html="stringing.description"></div>
      <div v-if="stringing.price" class="display-data__box m-t-20">
        <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
        <div class="fw600 is-size-5">{{ $t('key5', { currency: stringing.price }) | currency }}</div>
      </div>
      <div v-if="stringing.main_image" class="align__centar__all flex__column m-t-30">
        <TennisImage :size="[500, 500]" :src="stringing.main_image.link" class="m-b-15 softshadow radius__12" alt="" />
      </div>
      <div v-if="strings.length" class="tablelist">
        <div class="fw600 is-size-55 m-t-20 m-b-5">{{ $t('popisDostupnihIca') }}</div>
        <transition name="fade">
          <div class="activity__box action__buttons">
            <div v-for="item in strings" :key="item.id" class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation">
              <div class="fw600 align__centar__all">
                <div v-if="item.main_image.link" class="list__img">
                  <TennisImage :size="[42, 42]" :src="item.main_image.link" class="user_image" alt="" />
                </div>
                <div v-else class="">
                  <b-icon
                    icon="reel"
                    pack="far"
                    size="is-medium m-r-15 m-l-5 top-5"
                    class="relative has-text-black30"
                  ></b-icon>
                </div>
                <div class="list__content">
                  <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>
                  <h3 class="fw600 m-t--2 has-text-black80 is-size-65">{{ item.description }}</h3>
                  <div class="has-text-lightblue fw600 is-size-65 m-l-auto nowrap">
                    {{ $t('key5', { currency: item.price }) | currency }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="p-x-16">
      <div class="fw600 is-size-55 m-t-20 m-b-5">{{ $t('Podaci o klubu') }}</div>
      <div class="fw600 is-size-6 m-t-10 p-t-5 p-b-5 has-text-black80 border-color-black10 flex align__centar__y">
        <font-awesome-icon class="m-r-7 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
        {{ clubStringing.city }}, {{ clubStringing.address }}
      </div>
      <div class="fw600 is-size-6 m-t-5 p-t-5 p-b-5 has-text-black80 border-color-black10 flex align__centar__y">
        <font-awesome-icon class="m-r-7 has-text-lightblue iw08" icon="fa-light fa-phone" />
        {{ clubStringing.phone }}
      </div>
      <div class="fw600 is-size-6 m-t-5 p-t-5 p-b-5 has-text-black80 border-color-black10 flex align__centar__y">
        <font-awesome-icon class="m-r-7 has-text-lightblue iw08" icon="fa-light fa-paper-plane" />
        {{ clubStringing.email }}
      </div>
    </div>
    <div class="buttons m-t-40">
      <b-button
        :href="'tel:' + clubStringing.phone"
        tag="a"
        class="m-l-10"
        type="is-danger"
        pack="far"
        icon-right="phone"
        rounded
      >
        {{ $t('nazovi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'
import hero from '~/components/Hero'
import ShopProduct from '~/models/ShopProduct'

export default {
  name: 'StringingGlobalPreview',
  components: {
    hero,
    TennisImage,
  },
  async fetch() {
    await this.getProduct()
  },
  data() {
    return {
      loading: false,
      heroImage: '/stringing.jpg',
      activeTab: 0,
      isCardModalActive: false,
      stringing: {},
      product: {},
      clubStringing: {},
      strings: [],
      loadingMessage: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
  },
  methods: {
    getProduct() {
      ShopProduct.include('club')
        .find(this.$route.params.id)
        .then((res) => {
          this.stringing = res
          this.getStringing()
          this.getClub()
        })
    },
    getClub() {
      Club.find(this.stringing.club_id).then((res) => {
        this.clubStringing = res
      })
    },
    getStringing() {
      this.loading = true
      const sp = ShopProduct
      sp.where('special', '')
        .where('club', this.stringing.club_id)
        .where('category', 3)
        .limit(50)
        .get()
        .then((res) => {
          this.strings = res.data
          this.loading = false
        })
    },
  },
}
</script>
