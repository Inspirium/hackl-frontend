<template>
  <div class="home p-b-200">
    <PageHeader :title="$t('Radni nalozi')" :background="'is-primary'" />
    <div class="relative p-x-16 m-t-20">
      <div class="buttons m-t-30">
        <b-button
          tag="nuxt-link"
          :to="localePath('/admin/workorders/new')"
          class=""
          type="is-primary"
          pack="fal"
          icon-right="plus"
          rounded
        >
          {{ $t('Novi radni nalog') }}
        </b-button>
      </div>

      <template>
        <div class="fw600 has-text-centered w100 m-t-20 has-text-lightblue is-size-6">
          {{ $t('Prema statusu') }}
        </div>
        <div class="buttons m-t-5 m-b-5">
          <b-button
            v-for="(item, index) in status"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': selectedStatus.name === item.name }"
            :icon-right="selectedStatus.name === item.name ? 'check' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedStatus.name === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="updateStatus(item)"
          >
            {{ $t(item.name) }}
          </b-button>
        </div>

        <div class="x-container">
          <TimeRange :default-selected="'this_year'" @timespan="timerange($event)" />
        </div>

        <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10 has-text-centered m-b-10">
          {{ $t('ukupno') }}: <span class="has-text-lightblue">{{ total }}</span>
        </div>
        <div v-if="orders.length" class="is-white radius__12 overflow-hidden softshadow">
          <div class="bb1-10"></div>
          <div v-for="(item, index) in orders" :key="index + 'or'" class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
            <nuxt-link :to="localePath('/admin/workorders/' + item.id)" class="fw600 align__centar__all">
              <div v-if="item.assigner.image" class="list__img">
                <TennisImage :size="[80, 80]" :src="item.assignee.image" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <div class="align__centar__y">
                  <h4 class="has-text-grey-light fw600 is-size-7">
                    {{ item.created_at | moment('DD.MM.YYYY.') }}
                  </h4>
                </div>
                <h4 class="fw600 is-size-5 m-t--2">{{ item.assignee.display_name }}</h4>
                <h3 class="fw600 has-text-black80 is-size-65">
                  {{ $t('Zadao') }}:
                  <span class="has-text-lightblue">{{ item.assigner.display_name }}</span>
                </h3>
              </div>
              <div class="flex flex__column justify-start">
                <h3 v-if="item.orderable_id" class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">
                  {{ $t('key5', { currency: item.orderable.total }) | currency }}
                </h3>
                <div v-if="item.status" class="x-tag m-l-auto nowrap" :class="returnBckg(item)">
                  {{ $t(item.status) }}
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
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'
import WorkOrder from '~/models/WorkOrder'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'WorkOrders',
  components: {
    PageHeader,
    TennisImage,
    TimeRange,
  },
  data() {
    return {
      orders: [],
      total: 0,
      bottom: false,
      status: [{ name: 'all' }, { name: 'pending' }, { name: 'completed' }, { name: 'cancelled' }],
      selectedStatus: { name: 'all' },
      last_page: 0,
      offset: 1,
      loading: false,
      reservationTimeRange: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getOrders()
      }
    },
  },
  mounted() {
    this.getOrders()
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  created() {
    this.debouncedGetOrders = _.debounce(this.getOrders, 500)
  },
  methods: {
    updateStatus(item) {
      this.selectedStatus = item
      this.offset = 1
      this.getOrders()
    },
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
        this.orders = []
        this.getOrders()
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
        this.orders = []
        this.getOrders()
      } else {
        this.reservationTimeRange = item
        this.orders = []
        this.getOrders()
      }
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
    getOrders() {
      // if (this.last_page < this.offset) return
      this.loading = true
      const wo = WorkOrder.include('assignee', 'assigner', 'order')
      wo.page(this.offset).where('created_between', this.reservationTimeRange)
      if (this.selectedStatus.name !== 'all') {
        wo.where('status', this.selectedStatus.name)
      }
      wo.orderBy('-created_at')
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.orders = res.data
          } else {
            this.orders = [...this.orders, ...res.data]
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
