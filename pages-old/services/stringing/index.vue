<template>
  <div class="member">
    <hero :options="heroImage" :back="true">
      <h1 class="has-text-white">{{ $t('Špananje') }}</h1>
    </hero>
    <!--    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">-->
    <!--      <div class="modal-subtitle is-uppercase m-r-10"></div>-->
    <!--      <img :src="club.logo" class="user_image m-r-10 border__white&#45;&#45;2" alt="" />-->
    <!--      <div class="is-text-center fw600 is-size-5">{{ club.name }}</div>-->
    <!--    </div>-->
    <div class="home-menu">
      <div class="home-menu-middle is-tab-menu">
        <div v-if="true" :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="activeMainTab = 0">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="list-check" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('Narudžbe') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="activeMainTab = 1">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="circle-info" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('info') }}</div>
          </div>
        </div>

        <div :class="[activeMainTab === 2 ? 'active-menu-item' : 'menu-item']" @click="activeMainTab = 2">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="chart-mixed" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('statistika') }}</div>
          </div>
        </div>
      </div>
    </div>

    <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="m-t-0 hide_tab_navigation_impt">
      <b-tab-item :label="$t('Narudžbe')" class="p-b-100">
        <div v-if="Object.keys(stringing).length" class="activity x-container p-b-100">
          <div class="buttons m-t-0 m-b-30">
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

          <TimeRange class="m-t--15" :default-selected="'this_year'" @timespan="timerange($event, 'narudzbe')" />

          <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10">
            {{ $t('ukupnoPananja', { total: total }) }}
          </div>
          <div class="p-b-75 m-t-20 relative">
            <div class="activity x-container m-b--10 p-t-10 p-b-10 statistics_new softshadow">
              <div class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto m-b--20 w100">
                {{ $t('ukupnoPrihodaOdPanjanja') }}
              </div>
              <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
                {{ order_totals | currency }}
              </div>
            </div>
            <transition name="fade">
              <div v-if="loading" class="align__centar__x loading_z_spinner m-t-100">
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

            <template>
              <div v-if="orders.length" class="is-white radius__5 softshadow">
                <div class="bb1-10"></div>
                <div v-for="(item, index) in orders" :key="index + 'or'" class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
                  <nuxt-link :to="localePath('/admin/orders/' + item.id)" class="fw600 align__centar__all">
                    <div v-if="item.buyer.image" class="list__img">
                      <TennisImage :size="[80, 80]" :src="item.buyer.image" class="user_image" alt="" />
                    </div>
                    <div class="list__content">
                      <div class="align__centar__y">
                        <h4 class="has-text-grey-light fw600 is-size-7">
                          {{ item.created_at | moment('DD.MM.YYYY.') }}
                        </h4>
                      </div>
                      <h4 class="fw600 is-size-5 m-t--2">{{ item.buyer.display_name }}</h4>
                      <h3 class="fw600 has-text-black80 is-size-65">
                        {{ $t('Zadužen') }}:
                        <span class="has-text-lightblue">{{ item.work_orders[0]?.assignee?.display_name }}</span>
                      </h3>
                    </div>
                    <div class="flex flex__column justify-start">
                      <h3 class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">
                        {{ $t('key5', { currency: item.total }) | currency }}
                      </h3>
                      <div v-if="item.work_orders.length" class="x-tag m-l-auto nowrap" :class="returnBckg(item)">
                        {{ $t(item.work_orders[0].status) }}
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <template v-if="!loading && !orders.length">
                <section class="section has-text-centered m-t-20">
                  <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                  <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
                    {{ $t('nemaPodataka') }}
                  </div>
                </section>
              </template>
            </template>
          </div>
        </div>
        <div v-else class="w100 m-x-auto has-text-centered">
          <div v-if="user.is_admin" class="buttons m-t-20">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="racquet"
              rounded
              tag="nuxt-link"
              :to="localePath('/shop/new')"
            >
              {{ $t('Izradi uslugu') }}
            </b-button>
          </div>
          <b-icon icon="circle-info" type="is-primary" size="is-medium" pack="fal"> </b-icon>
          <p class="fw600 is-size-65 w50 m-x-auto">{{ $t('Upozorenje za španjanje') }}</p>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div v-if="Object.keys(stringing).length" class="p-l-15 p-r-15">
          <div v-if="user.is_admin" class="buttons m-t-20">
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
          <div class="divider-line-1 m-t-20" />
          <div class="activity__header m-t-10">
            <div class="fw600 is-size-3">{{ $t('podaciOPananju') }}</div>
          </div>
          <div class="fw600 is-size-6 m-t-15">{{ stringing.description }}</div>
          <div v-if="stringing.price" class="m-t-20 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
            <div class="fw600 is-size-5">{{ $t('key5', { currency: stringing.price }) | currency }}</div>
          </div>
          <div v-if="stringing.main_image" class="align__centar__all flex__column m-t-30">
            <TennisImage
              :size="[500, 500]"
              :src="stringing.main_image.link"
              class="m-b-15 softshadow radius__12"
              alt=""
            />
          </div>
          <div class="divider-line-1 m-t-20"></div>
          <strings />
        </div>
        <div v-else class="w100 m-x-auto has-text-centered">
          <div v-if="user.is_admin" class="buttons m-t-20">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="racquet"
              rounded
              tag="nuxt-link"
              :to="localePath('/shop/new')"
            >
              {{ $t('Izradi uslugu') }}
            </b-button>
          </div>
          <b-icon icon="circle-info" type="is-primary" size="is-medium" pack="fal"> </b-icon>
          <p class="fw600 is-size-65 w50 m-x-auto">{{ $t('Upozorenje za španjanje') }}</p>
        </div>
      </b-tab-item>
      <b-tab-item class="p-b-100">
        <b-tabs
          v-if="Object.keys(stringing).length"
          v-model="activeTab"
          size="is-medium"
          position="is-centered"
          class="m-t--15 p-b-100 show_tab_navigation"
        >
          <b-tab-item :label="$t('korisnici')" class="p-b-100">
            <div class="x-container">
              <TimeRange :default-selected="'this_year'" @timespan="timerange($event, 'korisnici')" />
            </div>
            <div class="activity x-container relative">
              <template>
                <div v-if="orderBuyers.length" class="is-white radius__5 softshadow">
                  <div class="bb1-10"></div>
                  <div
                    v-for="(item, index) in orderBuyers"
                    :key="index + 'ob'"
                    class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10"
                  >
                    <nuxt-link :to="localePath('/player/' + item.id)" class="fw600 align__centar__all">
                      <div v-if="item.image" class="list__img">
                        <TennisImage :size="[42, 42]" :src="item.image" class="user_image" alt="" />
                      </div>
                      <div class="list__content">
                        <h4 class="fw600 is-size-55 m-t--2">{{ item.display_name }}</h4>
                        <div class="fw600 is-size-65 has-text-black30 align__centar__y flex">
                          <b-icon
                            icon="racquet"
                            pack="far"
                            size="is-small-10 top-5"
                            class="relative has-text-black30"
                          ></b-icon>

                          <span class="m-r-4 has-text-primary">{{ item.orders_count }} </span
                          ><span class="has-text-black30">{{ $t('pananja') }}</span>
                        </div>
                      </div>
                      <div class="fw600 has-text-black80 is-size-5 m-l-auto nowrap">
                        {{ item.orders_total | currency }}
                      </div>
                    </nuxt-link>
                  </div>
                </div>
                <template v-if="loading && !orderBuyers.length">
                  <transition name="fade">
                    <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
                </template>
              </template>
            </div>
          </b-tab-item>
          <b-tab-item :label="$t('paneri')" class="p-b-100">
            <div class="x-container">
              <TimeRange :default-selected="'this_year'" @timespan="timerange($event, 'spaneri')" />
            </div>
            <div class="activity x-container relative">
              <template>
                <div v-if="orderAssigners.length" class="is-white radius__5 softshadow">
                  <div class="bb1-10"></div>
                  <div
                    v-for="(item, index) in orderAssigners"
                    :key="index + 'wt'"
                    class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10"
                  >
                    <nuxt-link :to="localePath('/player/' + item.id)" class="fw600 align__centar__all">
                      <div v-if="item.image" class="list__img">
                        <TennisImage :size="[80, 80]" :src="item.image" class="user_image" alt="" />
                      </div>
                      <div class="list__content">
                        <h4 class="fw600 is-size-5 m-t--2">{{ item.display_name }}</h4>
                        <div class="fw600 is-size-65 has-text-black30 align__centar__y flex">
                          <b-icon
                            icon="racquet"
                            pack="far"
                            size="is-small-10 top-5"
                            class="relative has-text-black30"
                          ></b-icon>

                          <span class="m-r-4 has-text-primary">{{ item.work_orders_count }} </span
                          ><span class="has-text-black30">{{ $t('pananja') }}</span>
                        </div>
                      </div>
                      <!--                      <div class="fw600 has-text-black80 m-l-auto nowrap">-->
                      <!--                        {{ '590,00 EUR' }}-->
                      <!--                      </div>-->
                    </nuxt-link>
                  </div>
                </div>
                <template v-if="loading && !orderAssigners.length">
                  <transition name="fade">
                    <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
                </template>
                <template v-if="!loading && !orderAssigners.length">
                  <section class="section has-text-centered m-t-10">
                    <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                    <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
                      {{ $t('nemaPodataka') }}
                    </div>
                  </section>
                </template>
              </template>
            </div>
          </b-tab-item>
        </b-tabs>
        <div v-else class="w100 m-x-auto has-text-centered">
          <div v-if="user.is_admin" class="buttons m-t-20">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="racquet"
              rounded
              tag="nuxt-link"
              :to="localePath('/shop/new')"
            >
              {{ $t('Izradi uslugu') }}
            </b-button>
          </div>
          <b-icon icon="circle-info" type="is-primary" size="is-medium" pack="fal"> </b-icon>
          <p class="fw600 is-size-65 w50 m-x-auto">{{ $t('Upozorenje za španjanje') }}</p>
        </div>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import TimeRange from '~/components/reports/TimeRange'
import strings from '~/components/services/strings'
import ShopOrder from '~/models/ShopOrder'
import OrderBuyers from '~/models/OrderBuyers'
import ShopProduct from '~/models/ShopProduct'
import OrderAssigners from '~/models/OrderAssigners'

export default {
  name: 'Stringing',
  components: {
    hero,
    TimeRange,
    strings,
    TennisImage,
  },
  data() {
    return {
      heroImage: '/stringing.jpg',
      activeMainTab: 0,
      activeTab: 0,
      loading: false,
      walletTransaction: [],
      walletTransactionMeta: {},
      bottom: false,
      newStringingImage: '',
      page: 1,
      stringing: {},
      userSaldo: [{ name: 'Prikaži stanje svih korisnika' }],
      prepaidType: [{ name: 'Sve' }, { name: 'Nezavršeno' }],
      orderTimeRange: 'Sve',
      orderBuyersTimeRange: 'Sve',
      orderAssignersTimeRange: 'Sve',
      newString: {
        name: '',
        description: '',
        price: null,
        tax: null,
      },
      strings: [
        {
          name: 'Obična žica',
          price: 40,
          pdv: 25,
          category: 'string',
          description: 'Debljina 299mm',
          image: '/players.svg',
        },
        { name: 'Obična2 žica', price: 40, pdv: 15, category: 'string', description: '', image: '/players.svg' },
      ],
      orders: [],
      orderBuyers: [],
      orderAssigners: [],
      offsetOrderBuyers: 1,
      offsetOrder: 1,
      offsetOrderAssigners: 1,
      total: 0,
      last_page: 0,
      order_totals: 0,
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
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offsetOrder++
        this.getOrders()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getOrderBuyers()
    this.getStringing()
    this.getOrderAssigners()
  },
  methods: {
    returnBckg(item) {
      if (item.work_orders[0].status === 'pending') {
        return 'is-primary has-text-white'
      } else if (item.work_orders[0].status === 'completed') {
        return 'green has-text-white'
      } else if (item.work_orders[0].status === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
    timerange(item, type) {
      if (type === 'korisnici') {
        this.orderBuyers = []
        this.offsetOrderBuyers = 1
        this.orderBuyersTimeRange = item
        this.getOrderBuyers()
      } else if (type === 'narudzbe') {
        this.orders = []
        this.offsetOrder = 1
        this.orderTimeRange = item
        this.getOrders()
      } else if (type === 'spaneri') {
        this.orderAssigners = []
        this.offsetOrderAssigners = 1
        this.orderAssignersTimeRange = item
        this.getOrderAssigners()
      }
    },
    getOrders() {
      this.loading = true
      const so = ShopOrder.include('creator', 'buyer', 'work_orders', 'work_orders.assignee')
        .page(this.offsetOrder)
        .params({ totals: 1 })
      if (this.orderTimeRange !== 'Sve') {
        so.where('created_between', this.orderTimeRange)
      }
      so.where('club', this.$store.state.club.id)
        .where('special', 'stringing')
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.orders = res.data
          } else {
            this.orders = [...this.orders, ...res.data]
          }
          this.total = res.meta.total
          this.order_totals = res.meta.order_totals
          this.last_page = res.meta.last_page
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    getOrderBuyers() {
      this.loading = true
      const ob = OrderBuyers.page(this.offsetOrderBuyers).where('special', 'stringing')
      if (this.orderBuyersTimeRange !== 'Sve') {
        ob.where('created_between', this.orderBuyersTimeRange)
      }
      ob.get().then((res) => {
        this.orderBuyers = res
        this.loading = false
      })
    },
    getOrderAssigners() {
      this.loading = true
      const oa = OrderAssigners.page(this.offsetOrderAssigners).where('special', 'stringing')
      if (this.orderAssignersTimeRange !== 'Sve') {
        oa.where('created_between', this.orderAssignersTimeRange)
      }
      oa.get().then((res) => {
        this.orderAssigners = res
        this.loading = false
      })
    },
    getStringing() {
      ShopProduct.where('club', this.$store.state.club.id)
        .where('special', 'stringing')
        .get()
        .then((res) => {
          if (res.data[0] !== undefined) {
            this.stringing = res.data[0]
          }
        })
    },
    saveStringing() {
      this.loading = true
      const shopProduct = new ShopProduct(this.stringing)
      shopProduct.image = this.image_id
      shopProduct
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili proizvod'),
            type: 'is-success',
          })
          this.loading = false
          this.touched = 0
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
<style scoped>
.section {
  padding: 1rem;
}
</style>
