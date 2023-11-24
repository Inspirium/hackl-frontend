<template>
  <div>
    <PageHeader :title="$t('Shop')" :background="'is-primary'" />
    <div v-if="user.is_admin" class="buttons m-t-30 m-b-0">
      <b-button
        class="fw600"
        type="is-primary"
        pack="fal"
        icon-right="racquet"
        rounded
        @click="$router.push({ path: localePath('/admin/orders/new'), query: { productId: product.id } })"
      >
        {{ $t('novaNarudba') }}
      </b-button>
    </div>
    <div class="x-container p-b-100">
      <div class="m-b-10 m-t-20 has-text-centered">
        <div class="fw600 is-size-3 line-height-22">{{ product.name }}</div>
      </div>
      <!-- eslint-disable-next-line -->
      <div class="fw600 is-size-6" v-html="product.description"></div>
      <div v-if="product.price" class="m-t-10 display-data__box m-t-20">
        <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
        <div class="fw600 is-size-5">{{ $t('key5', { currency: product.price }) | currency }}</div>
      </div>
      <template v-if="product.special && user.is_admin">
        <div v-if="club.payment_online" class="buttons m-t-30 m-b-0">
          <b-button
            class="fw600"
            type="is-primary"
            pack="fal"
            icon-right="cart-plus"
            rounded
            @click="$router.push({ path: localePath('/admin/orders/new'), query: { productId: product.id } })"
          >
            {{ $t('izradiNarudbu') }}
          </b-button>
        </div>
      </template>
      <div v-if="product.main_image" class="align__centar__all flex__column m-t-30">
        <TennisImage :size="[500, 500]" :src="product.main_image.link" class="m-b-15 softshadow radius__12" alt="" />
      </div>
      <div v-if="user.is_admin" class="buttons m-t-30">
        <b-button
          class="softshadow invert-small-button m-r-10"
          type="is-small noborder is-danger has-text-white"
          pack="fal"
          icon-right="times"
          rounded
          @click="deleteProduct()"
        >
          {{ $t('obrii') }}
        </b-button>

        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
          tag="nuxt-link"
          :to="localePath('/shop/' + product.id + '/edit')"
        >
          {{ $t('urediProizvod') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Media from '~/models/Media'
import ShopProduct from '~/models/ShopProduct'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Product',
  components: {
    PageHeader,
    TennisImage,
  },
  async fetch() {
    this.product = await ShopProduct.$find(this.$route.params.id)
  },
  data() {
    return {
      product: {
        id: null,
        name: '',
        description: '',
        price: null,
        tax_percent: 25,
        type: 'simple',
        special: 0,
        image: null,
        image_id: null,
        club_id: null,
      },
      loading: false,
      loadingMedia: false,
      loadingDelete: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    getProduct() {
      ShopProduct.find(this.$route.params.id).then((res) => {
        this.product = res
      })
    },
    deleteProduct() {
      this.loadingDelete = true
      const shopProduct = new ShopProduct({ id: this.product.id })
      shopProduct
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali proizvod'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/shop'))
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    client(item) {
      this.stringing.client = item
    },
    deleteRacquet() {
      this.players_racquets.splice(this.selected_racquet, 1)
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
