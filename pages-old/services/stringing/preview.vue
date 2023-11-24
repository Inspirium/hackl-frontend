<template>
  <div>
    <hero :options="heroImage" :back="true">
      <h1 class="has-text-white">{{ $t('uslugaPananja') }}</h1>
    </hero>
    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">
      <div class="modal-subtitle is-uppercase m-r-10"></div>
      <TennisImage :size="[42, 42]" :src="club.logo" class="user_image m-r-10 border__white--2" alt="" />
      <div class="is-text-center fw600 is-size-5">{{ club.name }}</div>
    </div>
    <div v-if="user.is_admin || isCashier" class="buttons m-t-30 m-b-0">
      <b-button
        class="fw600"
        type="is-primary"
        pack="fal"
        icon-right="racquet"
        rounded
        @click="$router.push({ path: localePath('/admin/orders/new'), query: { productId: 'stringing' } })"
      >
        {{ $t('novoPananje') }}
      </b-button>
    </div>

    <div class="x-container p-b-100">
      <div class="m-b-10 m-t-20 has-text-centered">
        <div class="fw600 is-size-3">{{ stringing.name }}</div>
      </div>
      <div class="fw600 is-size-6">{{ stringing.description }}</div>
      <div v-if="stringing.price" class="m-t-10 display-data__box">
        <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
        <div class="fw600 is-size-5">{{ $t('key5', { currency: stringing.price }) | currency }}</div>
      </div>
      <div v-if="stringing.main_image" class="align__centar__all flex__column m-t-30">
        <TennisImage :size="[500, 500]" :src="stringing.main_image.link" class="m-b-15 softshadow radius__12" alt="" />
      </div>
      <strings />

      <div class="divider-line-1 m-b-20" />
      <div v-if="user.is_admin" class="buttons">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
          tag="nuxt-link"
          :to="localePath('/shop/' + stringing.id + '/edit')"
        >
          {{ $t('urediUsluguPananja') }}
        </b-button>
      </div>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('naruitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="client"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalConfirmationActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiReketSIgraogPopisa')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteRacquet()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import strings from '~/components/services/strings'
import hero from '~/components/Hero'
import Media from '~/models/Media'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import ShopProduct from '~/models/ShopProduct'

export default {
  name: 'NewStringing',
  components: {
    hero,
    strings,
    modalMembers,
    modalConfirmation,
    TennisImage,
  },
  async fetch() {
    await this.getProduct()
    await this.getStringing()
  },
  data() {
    return {
      isModalConfirmationActive: false,
      isModalMembersActive: false,
      loading: false,
      loadingMedia: false,
      heroImage: '/stringing.jpg',
      activeTab: 0,
      isCardModalActive: false,
      stringing: {},
      product: {},
      trainers: [],
      new_racquet: false,
      selected_racquet: null,
      strings: [
        { name: 'Obična žica', price: 40, pdv: 25, category: 'string', description: 'Debljina .22mm', image: '' },
        { name: 'Obična2 žica', price: 40, pdv: 15, category: 'string', description: '', image: '/players.svg' },
      ],
      players_racquets: [
        { name: 'Wilson', string: '25 string', tension: 23, image: '/stringing.jpg' },
        { name: 'Head', string: '21 string', tension: 21, image: '' },
        { name: 'Wilson2', string: '23 string', tension: 24, image: '/stringing.jpg' },
      ],
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
      ShopProduct.find(this.$route.query.productId).then((res) => {
        this.product = res
      })
    },
    getStringing() {
      ShopProduct.where('club', this.$store.state.club.id)
        .where('special', 'stringing')
        .get()
        .then((res) => {
          this.stringing = res.data[0]
        })
    },
    client(item) {
      this.stringing.client = item
    },
    deleteRacquet() {
      this.players_racquets.splice(this.selected_racquet, 1)
    },
    saveMedia1(item) {
      this.stringing.image = item
    },
    saveMedia(item) {
      this.stringing.image = item
      this.loadingMedia = true
      const n = new Media({ media: this.stringing.image, title: this.page, description: this.page })
      n.save()
        .then((res) => {
          // this.saveClub(res.link)
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingMedia = false
        })
    },
  },
}
</script>
