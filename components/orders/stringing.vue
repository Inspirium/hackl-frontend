<template>
  <div class="m-b-30">
    <div class="">
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
                    >{{ $t('key5', { currency: filteredClubWallet?.amount }) | currency }}
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
        <racquet
          :player="order.client"
          @racquet="
            stringing.racquet = $event
            $emit('racquet', $event)
          "
        />
        <form @submit.prevent="submit">
          <div class="label">{{ $t('vlastitaIca') }}</div>
          <ValidationProvider v-slot="{ errors, valid }" name="Vlastita žica" class="radio__box">
            <div class="block">
              <b-radio v-model="stringing.clients_string" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
                {{ $t('da') }}
              </b-radio>
              <b-radio v-model="stringing.clients_string" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
                {{ $t('ne') }}
              </b-radio>
            </div>
          </ValidationProvider>
          <strings
            v-show="stringing.clients_string === 0"
            @string="
              stringing.strings = $event
              $emit('strings', $event)
            "
          />
        </form>
        <div class="fw600 is-size-3 m-t-20 has-text-centered">{{ $t('Cijena') }}</div>
        <div class="is-primary has-text-white p-t-5 p-b-5 rounded-md m-t-5">
          <div class="fw600 is-size-6 has-text-centered m-b--5">{{ $t('ukupanIznosZaNaplatu') }}</div>
          <div class="fw600 is-size-3 has-text-centered">{{ totalPrice | currency }}</div>
        </div>
      </template>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="sendEmit($event)" />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
// import _ from 'lodash'
import ShopOrder from '~/models/ShopOrder'
import ShopProduct from '~/models/ShopProduct'
import modalMembers from '~/components/modal/ModalMembersAll'
import strings from '~/components/services/strings'
import racquet from '~/components/services/racquet'

export default {
  name: 'Stringing',
  components: {
    TennisImage,
    modalMembers,
    racquet,
    strings,
  },
  data() {
    return {
      isCash: false,
      modalPayment: false,
      isModalMembersActive: false,
      isModalMembersActiveAssignee: false,
      loading: false,
      quantity: 1,
      string: {},
      data: {},
      order: {
        items: [],
        client: {},
      },
      stringing: {
        racquet: {
          name: '',
          string: '',
          tension: null,
          image: '',
        },
        strings: {},
        client: {},
        took_order: {},
        clients_string: 0,
        description: '',
      },
      assignee: {},
      status: ['pending', 'completed', 'canceled'],
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
      const x = this.product.price * this.quantity
      const y = Object.keys(this.stringing.strings).length ? this.stringing.strings.price * this.quantity : 0
      return x + y
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
    'stringing.clients_string': {
      handler() {
        this.$emit('clients_string', this.stringing.clients_string)
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
    sendEmitAssignee(item) {
      this.assignee = item
      this.$emit('assignee', item)
    },
    payNow() {
      this.paying = !this.paying
    },
    getProduct() {
      this.loading = true
      ShopProduct.where('club', this.$store.state.club.id)
        .where('special', 'stringing')
        .get()
        .then((res) => {
          this.product = res.data[0]
          this.loading = false
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
