<template>
  <div class="">
    <div class="activity x-container">
      <div class="fw600 is-size-5 has-text-centered">{{ $t('naruitelj') }}</div>
      <div class="activity__box action__buttons br100 m-t-10">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(order.client).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="order.client.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <h3>{{ order.client.display_name }}</h3>
              <template v-if="club.payment_accontation === 1">
                <h4 v-if="filteredClubWallet" class="flex align__centar__y m-t-3 is-size-65">
                  {{ $t('stanje2') }}
                  <span
                    class="m-l-5"
                    :class="[
                      filteredClubWallet?.amount > 0
                        ? 'has-text-black80'
                        : 'has-text-danger is-white rounded-md p-l-5 p-r-5',
                    ]"
                    >{{ $t('key5', { currency: filteredClubWallet.amount }) | currency }}
                  </span>
                </h4>
              </template>
            </div>
            <div
              @click="
                order.client = {}
                sendEmit({})
              "
            >
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActive = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('dodajNaruitelja') }}</div>
            </div>
          </div>
        </div>
      </div>
      <!--      hide if not payee-->
      <template v-if="Object.keys(order.client).length">
        <ValidationProvider name="Broj artikala" rules="required">
          <div class="fw600 is-size-5 has-text-centered m-b-5 m-t-15">{{ $t('brojArtikala') }}</div>
          <b-field>
            <b-numberinput
              v-model="quantity"
              :placeholder="$t('nema')"
              min="1"
              max="30"
              type="is-white"
              controls-rounded
              rounded
            ></b-numberinput>
          </b-field>
        </ValidationProvider>
        <div class="is-primary has-text-white p-t-5 p-b-5 rounded-md m-t-20">
          <div class="fw600 is-size-6 has-text-centered m-b--5">{{ $t('ukupanIznosZaNaplatu') }}</div>
          <div class="fw600 is-size-3 has-text-centered">
            {{ $t('key5', { currency: totalPrice }) | currency }}
          </div>
        </div>
      </template>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="sendEmit" />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
// import _ from 'lodash'
import ShopOrder from '~/models/ShopOrder'
import ShopProduct from '~/models/ShopProduct'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'NewOrder',
  components: {
    TennisImage,
    modalMembers,
  },
  data() {
    return {
      isCash: false,
      modalPayment: false,
      isModalMembersActive: false,
      loading: false,
      quantity: 1,
      data: {},
      order: {
        items: [],
        client: {},
      },
      product: {
        quantity: null,
        id: null,
        name: '',
        description: '',
        price: null,
        data: {},
        tax_percent: 25,
        type: 'simple',
        special: 0,
        image: null,
        image_id: null,
        club_id: null,
      },
      paying: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    totalPrice() {
      return this.product.price * this.quantity
    },
    filteredClubWallet() {
      const x = this.order.client.wallets.find((item) => {
        return item.club_id === this.club.id
      })
      return x
    },
  },
  watch: {
    quantity: {
      handler() {
        this.$emit('quantity', this.quantity)
      },
    },
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    sendEmit(item) {
      this.order.client = item
      this.$emit('client', item)
    },
    payNow() {
      this.paying = !this.paying
    },
    getProduct() {
      ShopProduct.find(this.$route.query.productId).then((res) => {
        this.product = res
      })
    },
    submit() {
      this.loading = true
      this.order.items.push(this.product)
      this.order.items[0].push(this.data)
      this.order.items[0].quantity = this.quantity
      const shopOrder = new ShopOrder(this.order)
      shopOrder
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili narudžbu'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/shop'))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
