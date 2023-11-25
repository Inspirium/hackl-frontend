<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Nova narudžba')" :background="'is-primary'" />
    <div class="p-x-16 m-t-40">
      <div class="relative">
        <div v-if="product.id !== null" class="m-t-15">
          <div class="product-order-list radius__16 overflow-hidden">
            <nuxt-link :to="localePath('/shop/' + product.id)" class="has-text-black50 flex">
              <div class="shop-listing-img-box m-b-7 mw40 m-r-15">
                <TennisImage
                  v-if="product.main_image"
                  :size="[500, 500]"
                  :src="product.main_image.link"
                  class="shop-listing-img softshadow"
                />
                <div v-else class="shop-img-placeholder radius__16"></div>
              </div>
              <div class="shop-meta-content">
                <div class="fw600 is-size-5 has-text-black80 line-height-14">{{ product.name }}</div>
                <div v-if="product.description" class="fw600 is-size-65 has-text-black50 m-t-7">
                  {{ product.description.substring(0, 120) }}{{ product.description.length > 120 ? '...' : '' }}
                </div>
                <div class="fw600 is-size-6 has-text-primary m-t-1">
                  {{ product.price | currency }}
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <transition v-else name="fade">
          <div class="align__centar__x m-t-100 loading_z_spinner">
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
      </div>
      <template v-if="product.id !== null">
        <orderStringing
          v-if="product.special === 'stringing'"
          @client="order.client = $event"
          @quantity="quantity = $event"
          @racquet="data = $event"
          @assignee="assignee = $event"
          @status="status = $event"
          @clients_string="clients_string = $event"
          @strings="string = $event"
        />

        <orderClassic v-else @client="order.client = $event" @quantity="quantity = $event" />
      </template>
      <!--      hide if not payee-->
      <template v-if="Object.keys(order.client).length">
        <template v-if="club.payment_accontation === 1">
          <div class="fw600 is-size-5 has-text-centered m-b-15 m-t--10">{{ $t('nainPlaanja') }}</div>
          <div v-if="user.is_admin" class="buttons m-b--10">
            <b-button
              v-for="(item, index) in payingMethods"
              :key="index"
              :class="{ softshadow: true, 'invert-small-button': selectedPayingMethods === item }"
              :icon-right="selectedPayingMethods === item ? 'times' : ''"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': selectedPayingMethods === item,
              }"
              pack="fal"
              rounded
              @click="selectedPayingMethods === item ? (selectedPayingMethods = '') : (selectedPayingMethods = item)"
            >
              {{ $t(item) }}
            </b-button>
          </div>
        </template>
        <div class="empty__box m-t-30">
          <div class="">
            <div class="fw600 is-size-3 m-l-5 m-b-7 has-text-centered">{{ $t('Radni nalog') }}</div>
            <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status naloga') }}</div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="(item, index) in status"
                    :key="index"
                    :class="selectedStatus === item ? returnBckg() : ''"
                    class="action__item__small fw600"
                    @click="selectedStatus = item"
                  >
                    {{ $t(item) }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="fw600 is-size-5 m-t-20 has-text-centered">{{ $t('Izvršitelj') }}</div>

          <div class="activity__box action__buttons br100 m-t-10">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(assignee).length" class="align__centar__all w100">
                <TennisImage :size="[42, 42]" :src="assignee.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3>{{ assignee.display_name }}</h3>
                </div>
                <div @click="assignee = {}">
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
                </div>
              </div>
              <div v-else class="activity__header" @click="isModalMembersActiveAssignee = true">
                <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                <div class="list__content">
                  <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj osobu') }}</div>
                </div>
              </div>
            </div>
          </div>
          <ValidationProvider name="Napomena">
            <b-field :label="$t('Opis posla')" class="login__input__container">
              <b-input v-model="order.note" type="textarea" rounded> </b-input>
            </b-field>
          </ValidationProvider>
        </div>
      </template>
      <div v-if="!selectedPayingMethods && Object.keys(order.client).length" class="has-text-centered w100 m-t-30">
        <div class="attention-red has-text-centered fw600 p-all-24 inlineblock">
          {{ $t('Napomena — nije plaćeno') }}
        </div>
      </div>
      <div class="buttons is-fixed m-t-15">
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-danger"
          pack="fal"
          icon-left="times"
          rounded
          tag="nuxt-link"
          :to="localePath('/admin/')"
        >
          {{ $t('odustani') }}
        </b-button>
        <b-button
          class="m-l-5 m-t-20 fw600"
          :type="paying ? 'is-success' : 'is-primary'"
          pack="fal"
          icon-right="check"
          rounded
          native-type="submit"
          :loading="loading"
          @click.prevent="submit"
        >
          {{ paying ? $t('Naplati') : $t('Naruči') }}
        </b-button>
      </div>
    </div>

    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="client" />
    </b-modal>
    <b-modal :active.sync="modalPayment" :width="640" scroll="clip">
      <modalPayment :title="$t('plaanje')" />
    </b-modal>
    <b-modal :active.sync="isModalMembersActiveAssignee" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Izvršitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="assignee = $event"
      />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import ShopOrder from '~/models/ShopOrder'
import PageHeader from '~/components/headers/blankBack'
import orderClassic from '~/components/orders/classic'
import orderStringing from '~/components/orders/stringing'
import ShopProduct from '~/models/ShopProduct'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalPayment from '~/components/modal/ModalPayment'
import WorkOrder from '~/models/WorkOrder'

export default {
  name: 'NewOrder',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
    modalPayment,
    orderClassic,
    orderStringing,
  },
  data() {
    return {
      isCash: false,
      modalPayment: false,
      isModalMembersActive: false,
      isModalMembersActiveAssignee: false,
      loading: false,
      quantity: 1,
      data: {},
      assignee: {},
      order: {
        items: [],
        client: {},
        note: '',
      },
      product: {
        quantity: null,
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
      paying: false,
      clients_string: 0,
      string: {},
      note: '',
      orderId: null,
      selectedStatus: 'pending',
      status: ['pending', 'completed', 'cancelled'],
      payingMethods: ['akontacija', 'gotovina'],
      selectedPayingMethods: '',
      work_order: {
        assignee: {},
        data: {
          clients_string: 0,
          racquet: null,
        },
        status: '',
        note: '',
      },
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
      const x = this.user.wallets.find((item) => {
        return item.club_id === this.club.id
      })
      return x
    },
  },
  mounted() {
    this.getProduct()
    this.assignee = this.user
  },
  methods: {
    payNow() {
      this.paying = !this.paying
    },
    client(item) {
      this.order.client = item
    },
    getProduct() {
      if (this.$route.query.productId !== 'stringing') {
        ShopProduct.find(this.$route.query.productId).then((res) => {
          this.product = res
        })
      } else {
        this.loading = true
        ShopProduct.where('club', this.$store.state.club.id)
          .where('special', 'stringing')
          .get()
          .then((res) => {
            this.product = res.data[0]
            this.loading = false
          })
      }
    },
    newWorkOrder(item) {
      this.loading = true
      Object.keys(this.assignee).length
        ? (this.work_order.assignee = this.assignee)
        : (this.work_order.assignee = this.user)
      this.work_order.status = this.selectedStatus
      this.work_order.note = this.order.note
      if (this.$route.query.productId === 'stringing') {
        this.work_order.data.clients_string = this.clients_string
        this.work_order.data.racquet = this.data
      }
      const workOrder = new WorkOrder(this.work_order).for(new ShopOrder({ id: item.id }))
      workOrder
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili radni nalog'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/admin/orders/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    submit() {
      this.loading = true
      this.product.quantity = this.quantity
      this.product.data = this.data
      this.order.items.push(this.product)
      // If stringing order
      if (this.$route.query.productId === 'stringing') {
        this.product.clients_string = this.clients_string
        if (this.clients_string === 0 && Object.keys(this.string).length) {
          this.string.quantity = 1
          this.order.items.push(this.string)
        }
      }
      const shopOrder = new ShopOrder(this.order)
      shopOrder
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili narudžbu'),
            type: 'is-success',
          })
          this.newWorkOrder(res)
          this.orderId = res.id
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
    returnBckg() {
      if (this.selectedStatus === 'pending') {
        return 'is-primary has-text-white'
      } else if (this.selectedStatus === 'completed') {
        return 'green has-text-white'
      } else if (this.selectedStatus === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>
