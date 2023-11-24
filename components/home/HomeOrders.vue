<template>
  <div v-if="orders.length" class="home">
    <div class="relative p-x-16 m-t-20">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/player/' + user.id + '/orders')" class="fw600"
          >{{ $t('Narudžbe') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>
      <template>
        <div v-for="item in orders" :key="item.id" class="">
          <div v-if="item.items.length" class="">
            <div v-for="(product, index) in item.items" v-show="index < 1" :key="product.id + index">
              <div class="order-list is-white radius__16 softshadow overflow-hidden m-b-10">
                <div class="p-r-15 p-t-15 p-b-10 w100">
                  <div class="flex justify-between align__centar__y m-b-10 m-t--5 p-l-15">
                    <h4 class="has-text-black80 fw600 is-size-65">
                      {{ item.created_at | moment('DD.MM.YYYY. • HH:MM') }}
                    </h4>
                    <h4 v-if="item.work_orders.length" class="has-text-black80 fw600 is-size-65 flex align__centar__y">
                      {{
                        item.work_orders[0].status === 'pending'
                          ? $t('U izradi narudžbe')
                          : item.work_orders[0].status === 'cancelled'
                          ? $t('Otkazano')
                          : $t('Završeno')
                      }}
                      <font-awesome-icon
                        class="m-r--5 m-l-5 iw12"
                        :class="
                          item.work_orders[0].status === 'pending'
                            ? 'has-text-primary'
                            : item.work_orders[0].status === 'cancelled'
                            ? 'has-text-danger'
                            : 'has-text-success'
                        "
                        :icon="
                          item.work_orders[0].status === 'pending'
                            ? 'fa-clock fa-light'
                            : item.work_orders[0].status === 'cancelled'
                            ? 'fa-times fa-light'
                            : 'fa-check fa-light'
                        "
                      />
                    </h4>
                    <!--                    <h4 v-else class="has-text-black80 fw600 is-size-65 flex align__centar__y">-->
                    <!--                      {{ $t('Nije plaćeno') }}-->
                    <!--                      <font-awesome-icon class="m-r&#45;&#45;5 m-l-5 has-text-danger iw12" icon="fa-light fa-times" />-->
                    <!--                    </h4>-->
                  </div>
                  <nuxt-link
                    v-if="product.product"
                    :to="localePath('/player/' + user.id + '/orders/' + item.id)"
                    class="has-text-black50 flex"
                  >
                    <template v-if="Object.keys(product.product.main_image).length">
                      <div class="order-listing-home-img-box m-b-7 mw40 m-r-15 flex">
                        <TennisImage
                          :size="[140, 140]"
                          :src="product.product.main_image.link"
                          class="order-listing-img softshadow"
                        />
                      </div>
                    </template>

                    <div class="shop-meta-content flex__column align__centar__x w100">
                      <div class="fw600 is-size-5 has-text-black80 line-height-14">
                        {{ item.items[0].product.name
                        }}<span
                          v-show="item.items.length > 1"
                          class="fw600 has-text-lightblue is-size-65 relative top--6"
                        >
                          +{{ item.items.length - 1 }}</span
                        >
                      </div>
                      <div class="fw600 is-size-65 has-text-primary m-t-1 p-t-3 p-b-3 flex align__centar__y">
                        {{ $t('ukupno2') }}
                        <span class="has-text-black80 is-size-5 m-l-7">{{
                          $t('key5', { currency: item.total }) | currency
                        }}</span>
                      </div>
                      <div
                        v-if="item.work_orders.length"
                        class="fw600 is-size-65 has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5"
                      >
                        {{ $t('Obradio') }}:
                        <span v-if="item.work_orders[0].assigner" class="has-text-black80">{{
                          item.work_orders[0].assigner.display_name
                        }}</span>
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
            </div>
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
      <transition v-if="loading" name="fade">
        <div class="align__centar__x m-t-30 loading_z_spinner">
          <b-icon
            class="comment-send"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
// import TennisImage from '@/components/TennisImage.vue'
// import _ from 'lodash'
import ShopOrder from '~/models/ShopOrder'

export default {
  name: 'HomeOrders',
  components: {
    // TennisImage,
  },
  async fetch() {
    await this.getOrders()
  },
  data() {
    return {
      orders: [],
      total: null,
      loading: false,
      last_page: null,
      offset: 1,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    getOrders() {
      this.loading = true
      ShopOrder.include(
        'creator',
        'items',
        'buyer',
        'items.product',
        'work_orders',
        'work_orders.assignee',
        'work_orders.assigner'
      )
        .page(this.offset)
        .where('club', this.$store.state.club.id)
        .where('work_order_status', 'pending')
        .where('buyer', this.user.id)
        .limit(3)

        .get()
        .then((res) => {
          this.orders = res.data
          this.total = res.meta.total
          this.loading = false
        })
    },
    returnBckg(item) {
      if (item.status === 'pending') {
        return 'is-primary has-text-white'
      } else if (item.status === 'completed') {
        return 'green has-text-white'
      } else if (item.status === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>
.activity__reservation h4 {
  color: $black60;
}
</style>
