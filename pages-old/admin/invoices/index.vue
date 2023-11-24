<template>
  <div v-if="true" class="member p-b-500">
    <PageHeader :title="$t('Računi')" />
    <div class="home-menu">
      <div class="home-menu-middle">
        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="list" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('Popis') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(1)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="chart-pie" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('Izvještaji') }}</div>
          </div>
        </div>
      </div>
    </div>

    <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div v-if="true" class="activity x-container p-b-100">
          <div class="buttons m-t-20">
            <b-button
              tag="nuxt-link"
              :to="localePath('/admin/invoices/new')"
              class=""
              type="is-primary"
              pack="fal"
              icon-right="plus"
              rounded
            >
              {{ $t('Izradi novi račun') }}
            </b-button>
          </div>

          <TimeRange class="m-t-10" :default-selected="'this_year'" @timespan="timerange($event)" />
          <div class="divider-line-1 m-t-15"></div>
          <div class="buttons m-t-20 m-b-2">
            <b-button
              :type="{
                'is-small': true,
                noborder: true,
                'is-danger has-text-white': showFilter,
              }"
              :class="{ softshadow: true, 'invert-small-button': showFilter }"
              pack="fal"
              :icon-right="!showFilter ? 'filter' : 'times'"
              rounded
              @click="showFilter = !showFilter"
            >
              {{ $t('filtriraj') }}
            </b-button>
          </div>

          <div v-if="!showFilter" class="divider-line-1 m-t-0" />

          <transition name="fade" mode="out-in">
            <div v-if="showFilter">
              <div class="fw600 has-text-centered w100 has-text-lightblue m-t-5 m-b-10 is-size-6">
                {{ $t('Vrsta plaćanja') }}
              </div>
              <div class="buttons m-t-5 m-b-5">
                <b-button
                  v-for="(item, index) in invoice_type"
                  :key="index"
                  class="m-t-5 m-b-5 m-l-5 m-r-5"
                  :class="{ softshadow: true, 'invert-small-button': selected_invoice_type.name === item.name }"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-primary has-text-white': selected_invoice_type.name === item.name,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="updateType(item)"
                >
                  {{ $t(item.name) }}
                </b-button>
              </div>
              <div class="divider-line-1 m-b-30"></div>
            </div>
          </transition>

          <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10">
            {{ $t('Ukupno računa') }}: {{ invoicesMeta.total }}
          </div>
          <div class="p-b-75 m-t-20 relative">
            <div class="activity x-container m-b--10 p-t-10 p-b-10 statistics_new softshadow">
              <div class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto m-b--20 w100">
                {{ $t('Ukupno računa') }}
              </div>
              <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
                {{ invoicesMeta.total_amount | currency }}
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
              <div class="is-white radius__5 softshadow">
                <div class="bb1-10"></div>
                <div v-for="(item, index) in invoices" :key="index + 'or'" class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
                  <nuxt-link :to="localePath('/admin/invoices/' + item.id)" class="fw600 align__centar__all">
                    <div v-if="item.user.image" class="list__img">
                      <TennisImage :size="[80, 80]" :src="item.user.image" class="user_image" alt="" />
                    </div>
                    <div class="list__content">
                      <div class="align__centar__y">
                        <h4 class="has-text-grey-light fw600 is-size-7">
                          {{ item.created_at | moment('DD.MM.YYYY.' + ' — ' + 'HH:mm') }}
                        </h4>
                      </div>
                      <h4 class="fw600 is-size-5 m-t--2">{{ item.user.display_name }}</h4>
                      <h3 class="fw600 has-text-black80 is-size-65">
                        {{ $t('Način plaćanja') }}:
                        <span class="has-text-lightblue">{{ item.payment_method }}</span>
                      </h3>
                      <div
                        v-if="item.payment_method"
                        class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                      >
                        <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                          {{ item.invoice_number }}
                        </div>
                      </div>
                      <template v-if="item.items.length">
                        <div
                          v-for="product in item.items"
                          :key="product.invoice_id"
                          class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                        >
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-arrow-right" />
                            {{ product.name }}
                          </div>
                        </div>
                      </template>
                    </div>

                    <div class="flex flex__column justify-start m-l-5">
                      <h3 class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">
                        {{ $t('key5', { currency: item.total_amount }) | currency }}
                      </h3>
                      <div class="x-tag m-l-auto nowrap" :class="returnBckg(item)">
                        {{ $t(item.payment_status) }}
                      </div>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap">
                        <span
                          v-for="indicator in item.previous_invoices"
                          :key="indicator"
                          class="school-payment-indicatior"
                          :class="indicator.payment_status === 'PAID' ? 'green' : 'is-red'"
                        ></span>
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <template v-if="!loading && !invoices.length">
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
      </b-tab-item>
      <b-tab-item>
        <invoice-report />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Invoice from '@/models/Invoice'
import PageHeader from '~/components/headers/blankBack'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'InvoiceList',
  components: {
    PageHeader,
    TennisImage,
    TimeRange,
  },
  data() {
    return {
      activeMainTab: 0,
      loading: false,
      invoices: [],
      invoicesMeta: {},
      bottom: false,
      offset: 1,
      reservationTimeRange: '',
      showFilter: false,
      invoice_type: [{ name: 'Sve' }, { name: 'cash' }, { name: 'card' }, { name: 'transaction' }],
      selected_invoice_type: { name: 'Sve' },
      status: [{ name: 'Sve' }, { name: 'Paid' }, { name: 'Draft' }],
      selected_status: { name: 'Sve' },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getInvoices()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.goToTab(0)
    this.getInvoices()
  },
  methods: {
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    updateStatus(item) {
      this.selectedLight = item
      this.offset = 1
    },
    updateType(item) {
      this.selected_invoice_type = item
      this.offset = 1
      this.getInvoices()
    },
    getInvoices() {
      if (this.invoicesMeta.last_page < this.offset) return
      this.loading = true
      const inv = Invoice.page(this.offset)
      inv.where('club', this.club.id)
      if (this.selected_invoice_type.name !== 'Sve') {
        inv.where('payment_method', this.selected_invoice_type.name)
      }
      inv
        .where('active_between', this.reservationTimeRange)

        .params({ include_previous_invoices: true })
        .orderBy('-created_at')
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.invoices = res.data
          } else {
            this.invoices = [...this.invoices, ...res.data]
          }
          this.invoicesMeta = res.meta
          this.page++
          this.loading = false
        })
    },
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
        this.invoicesMeta = []
        this.getInvoices()
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
        this.invoicesMeta = []
        this.getInvoices()
      } else {
        this.reservationTimeRange = item
        this.invoicesMeta = []
        this.getInvoices()
      }
    },
    returnBckg(item) {
      if (item.payment_status === 'DRAFT') {
        return 'is-primary has-text-white'
      } else if (item.payment_status === 'PAID') {
        return 'green has-text-white'
      } else if (item.payment_status === 'UNPAID') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
