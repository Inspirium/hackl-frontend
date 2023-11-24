<template>
  <div v-if="true" class="member p-b-500">
    <PageHeader :title="$t('Računi u najavi')" />

    <div v-if="false" class="activity x-container">
      <TimeRange class="m-t-15" :default-selected="'this_year'" @timespan="timerange($event)" />
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
    </div>
    <billsNewList />
  </div>
</template>

<script>
// import _ from 'lodash'
import Invoice from '@/models/Invoice'
import PageHeader from '~/components/headers/blankBack'
import TimeRange from '~/components/reports/TimeRange'
import billsNewList from '~/components/subscriptions/billsNewList'

export default {
  name: 'InvoiceList',
  components: {
    PageHeader,
    TimeRange,
    billsNewList,
  },
  data() {
    return {
      loading: false,
      invoices: [],
      invoicesMeta: {},
      bottom: false,
      offset: 1,
      reservationTimeRange: '',
      showFilter: false,
      invoice_type: [{ name: 'Sve' }, { name: 'cash' }, { name: 'card' }],
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
  },
  methods: {
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
      inv.where('club', this.club.id).where('pending', true)
      if (this.selected_invoice_type.name !== 'Sve') {
        inv.where('payment_method', this.selected_invoice_type.name)
      }
      inv
        .where('active_between', this.reservationTimeRange)
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
