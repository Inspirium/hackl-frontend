<template>
  <div v-if="Object.keys(invoice).length" class="member p-b-500">
    <PageHeader :title="$t('Račun')" />
    <div class="flex has-text-white fw600 has-text-centered m-t--2 border-dashed-top">
      <div class="w50 p-all-12 is-primary has-text-white">
        {{ $t(invoice.payment_method) }}
      </div>

      <div :class="returnBckg(invoice)" class="w50 p-all-12 align__centar__all border-dashed-left">
        <h4 v-if="invoice.status === 'PAID'" class="has-text-white fw600 is-size-6 flex align__centar__y">
          {{ $t('Plaćeno') }}
          <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-check" />
        </h4>
        <h4 v-else class="has-text-white fw600 is-size-6 flex align__centar__y">
          {{ $t(invoice.status) }}
          <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-times" />
        </h4>
      </div>
    </div>
    <div v-if="Object.keys(invoice).length" class="activity x-container p-b-100">
      <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10">{{ $t('Broj računa') }}:</div>
      <div class="is-text-center fw500 is-size-3 m-l-auto m-r-auto m-t--5">{{ invoice?.invoice_number }}</div>
      <div class="p-b-75 m-t-20 relative">
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
          <div class="radius__5">
            <div class="bb1-10"></div>
            <div class="">
              <span class="fw600 align__centar__all">
                <div class="list__content">
                  <div class="flex align__centar__y">
                    <div v-if="invoice.user.image" class="list__img">
                      <TennisImage :size="[80, 80]" :src="invoice.user.image" class="user_image" alt="" />
                    </div>
                    <h4 class="fw600 is-size-5 m-t--2">{{ invoice.user.display_name }}</h4>
                  </div>
                  <h3 class="fw600 has-text-lightblue is-size-65 m-t-5 p-t-3 border-color-black10">
                    {{ $t('Način plaćanja') }}:
                    <span class="has-text-black80">{{ invoice.payment_method }}</span>
                  </h3>
                  <h3 class="fw600 has-text-lightblue is-size-65 m-t-5 p-t-3 border-color-black10">
                    {{ $t('Odgovorna osoba') }}:
                    <span class="has-text-black80">{{ invoice.operator.display_name }}</span>
                  </h3>
                  <h3 class="fw600 has-text-lightblue is-size-65 m-t-5 p-t-3 border-color-black10">
                    {{ $t('Vrijeme izdavanja') }}:
                    <span class="has-text-black80">{{
                      invoice.created_at | moment('DD.MM.YYYY.' + ' — ' + 'HH:mm')
                    }}</span>
                  </h3>
                  <div class="flex align__centar__y m-b-5 m-t-20">
                    <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-arrow-right" />
                    <div class="is-size-6">Popis proizvoda ili usluga</div>
                  </div>

                  <div
                    v-if="invoice.items.length"
                    class="is-white softshadow radius__5 p-r-10 p-l-10 p-t-5 p-b-5 bb1-10"
                  >
                    <div v-for="product in invoice.items" :key="product.invoice_id" class="flex flex__column">
                      <div class="fw600 is-size-62 has-text-black50 align__centar__y p-t-3">
                        <span class="m-r-4 has-text-lightblue">{{ $t('Naziv') }}: </span>{{ product.name }}
                      </div>
                      <div class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5">
                        <span class="m-r-4 has-text-lightblue">{{ $t('Iznos') }}: </span
                        >{{ product.total_amount | currency }}
                      </div>
                      <div class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5">
                        <span class="m-r-4 has-text-lightblue">{{ $t('Količina') }}: </span>{{ product.quantity }}
                      </div>
                      <div class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5">
                        <span class="m-r-4 has-text-lightblue">{{ $t('Vrsta') }}: </span
                        >{{ $t(translateType(product.invoiceable_type)) }}
                      </div>
                    </div>
                  </div>
                  <div class="m-t-20">
                    <div class="flex flex__column align-items-flex-end">
                      <div class="fw600 is-size-62 has-text-black80 align__centar__y p-t-3">
                        <span class="m-r-4 has-text-black50">{{ $t('Osnovica') }}: </span
                        >{{ invoice.amount | currency }}
                      </div>
                      <div class="fw600 is-size-62 has-text-black80 align__centar__y border-color-black10 p-t-3 m-t-5">
                        <span class="m-r-4 has-text-black50"
                          >{{ $t('PDV') + ' ' + '(' + invoice.taxes.PDV.tax + '%)' }}: </span
                        >{{ invoice.taxes.PDV.tax_amount | currency }}
                      </div>
                      <div
                        class="fw600 has-text-black80 align__centar__y is-white radius__5 softshadow has-text-black80 m-t-10 flex align__centar__all radius__5 p-t-7 p-b-7 p-l-10 p-r-10"
                      >
                        <span class="m-r-7 is-size-62 has-text-black50">{{ $t('Ukupno') }}: </span
                        ><span class="is-size-5">{{ invoice.total_amount | currency }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="buttons m-t-50">
                    <b-button
                      class="softshadow m-b-10"
                      type="is-primary"
                      pack="fal"
                      icon-right="file-pdf"
                      size="is-medium"
                      rounded
                      tag="a"
                      target="_blank"
                      :href="'https://api.tenis.plus/v2/invoice/' + $route.params.id + '/pdf'"
                    >
                      {{ $t('Preuzmi PDF računa') }}
                    </b-button>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Invoice from '@/models/Invoice'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Invoice',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      tempPay: false,
      loading: false,
      invoice: {},
      invoices: [],
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
  mounted() {
    // this.getInvoice()
    this.getInvoice()
  },
  methods: {
    translateType(item) {
      switch (item) {
        case 'App\\Models\\UserSubscription':
          return 'Članarina'
        case 'App\\Models\\CourtReservation':
          return 'Teren'
      }
    },
    getInvoice() {
      this.loading = true
      Invoice.find(this.$route.params.id).then((res) => {
        this.invoice = res
        this.loading = false
      })
    },
    // getInvoices() {
    //   Invoice.get().then((res) => {
    //     this.invoices = res.data
    //   })
    // },
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
  },
}
</script>
<style scoped></style>
