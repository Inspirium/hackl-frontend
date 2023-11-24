<template>
  <div v-if="Object.keys(invoice).length" class="">
    <div v-if="true" class="member p-b-500">
      <PageHeader :title="$t('Račun')" />
      <div class="flex has-text-white fw600 has-text-centered m-t--2 border-dashed-top">
        <div class="w50 p-all-12 is-primary has-text-white">
          {{ $t(invoice.payment_method) }}
        </div>

        <div :class="returnBckg()" class="w50 p-all-12 align__centar__all border-dashed-left">
          <h4 v-if="invoice.status === 'PAID'" class="has-text-white fw600 is-size-6 flex align__centar__y">
            {{ $t('Plaćeno') }}
            <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-check" />
          </h4>
          <h4 v-else class="has-text-white fw600 is-size-6 flex align__centar__y">
            {{ $t(invoice.payment_status) }}
            <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-times" />
          </h4>
        </div>
      </div>

      <div v-if="Object.keys(invoice).length" class="activity x-container p-b-100">
        <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10">{{ $t('Broj računa') }}:</div>
        <div class="is-text-center fw500 is-size-3 m-l-auto m-r-auto m-t--5">{{ invoice?.invoice_number }}</div>
        <div class="m-t-20 m-b-20 p-x-16">
          <template v-if="invoice.payment_method === 'TRANSACTION'">
            <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status računa') }}</div>

            <div class="activity__reservation w70 m-x-auto">
              <transition name="fade">
                <div class="activity__box action__buttons" :class="loadingUpdate ? 'blur_button' : ''">
                  <div
                    v-for="(item, index) in status"
                    :key="index"
                    :class="invoice.payment_status === item ? returnBckg() : ''"
                    class="action__item__small fw600"
                    @click="invoice.payment_status = item"
                  >
                    {{ $t(item) }}
                  </div>
                </div>
              </transition>
            </div>
          </template>
          <!--          <div v-if="isTouched > 1" class="buttons m-t-20 m-b-0">-->
          <!--            <b-button-->
          <!--              class="softshadow m-b-10"-->
          <!--              type="is-small noborder"-->
          <!--              pack="far"-->
          <!--              icon-right="check"-->
          <!--              rounded-->
          <!--              :loading="loadingUpdate"-->
          <!--              @click="updateInvoice()"-->
          <!--            >-->
          <!--              {{ $t('spremi') }}-->
          <!--            </b-button>-->
          <!--          </div>-->
        </div>

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

                    <template v-if="invoice.items.length">
                      <div
                        v-for="(product, index) in invoice.items"
                        :key="product.invoice_id"
                        class="is-white softshadow radius__5 p-r-10 p-l-10 p-t-5 p-b-5 bb1-10 m-t-10"
                      >
                        <div class="flex flex__column">
                          <div class="fw600 is-size-62 has-text-black50 align__centar__y p-t-3">
                            <span class="m-r-4 has-text-lightblue">{{ $t('Naziv') }}: </span>{{ product.name }}
                          </div>
                          <div
                            v-if="payments[index]?.type_type === 'App\\Models\\Reservation'"
                            class="fw600 is-size-62 has-text-black50 align__centar__y p-t-3 m-t-5 border-color-black10"
                          >
                            <span class="m-r-4 has-text-lightblue">{{ $t('Opis') }}: </span
                            >{{ payments[index].type.court.name }},
                            {{ payments[index].type.from | moment('DD.MM.YYYY.') }},
                            {{ payments[index].type.from | moment('HH:mm') }} —
                            {{ payments[index].type.to | moment('HH:mm') }}
                          </div>
                          <div
                            class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5"
                          >
                            <span class="m-r-4 has-text-lightblue">{{ $t('Iznos') }}: </span
                            >{{ product.total_amount | currency }}
                          </div>
                          <div
                            class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5"
                          >
                            <span class="m-r-4 has-text-lightblue">{{ $t('Količina') }}: </span>{{ product.quantity }}
                          </div>
                          <!--                                              <div class="fw600 is-size-62 has-text-black50 align__centar__y border-color-black10 p-t-3 m-t-5">-->
                          <!--                                                <span class="m-r-4 has-text-lightblue">{{ $t('Vrsta') }}: </span-->
                          <!--                                                >{{ $t(translateType(product.invoiceable_type)) }}-->
                          <!--                                              </div>-->
                        </div>
                      </div>
                    </template>
                    <div class="m-t-20">
                      <div class="flex flex__column align-items-flex-end">
                        <div class="fw600 is-size-62 has-text-black80 align__centar__y p-t-3">
                          <span class="m-r-4 has-text-black50">{{ $t('Osnovica') }}: </span
                          >{{ invoice.amount | currency }}
                        </div>
                        <!--                      <div class="fw600 is-size-62 has-text-black80 align__centar__y border-color-black10 p-t-3 m-t-5">-->
                        <!--                        <span class="m-r-4 has-text-black50"-->
                        <!--                          >{{ $t('PDV') + ' ' + '(' + invoice.taxes.PDV.tax + '%)' }}: </span-->
                        <!--                        >{{ invoice.taxes.PDV.tax_amount | currency }}-->
                        <!--                      </div>-->
                        <template v-if="Object.keys(totalTaxSum).length">
                          <div
                            v-for="(value, name, index) in totalTaxSum"
                            :key="index"
                            class="fw600 is-size-62 has-text-black80 align__centar__y border-color-black10 p-t-3 m-t-5"
                          >
                            <span class="m-r-4 has-text-black50">{{ $t('PDV') + ' ' + '(' + name + '%)' }}: </span
                            >{{ value | currency }}
                          </div>
                        </template>

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
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Invoice from '@/models/Invoice'
import Payment from '@/models/Payment'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Invoice',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      loadingUpdate: false,
      tempPay: false,
      loading: false,
      loadingPayment: false,
      invoice: {},
      invoices: [],
      status: ['PAID', 'UNPAID'],
      isTouched: 0,
      payments: [],
    }
  },
  computed: {
    totalTaxSum() {
      const taxSums = {}

      this.invoice.items.forEach((item) => {
        if (!item.taxes.length) {
          return 0
        }
        const taxAmount = (item.amount - item.amount / (1 + Object.values(item.taxes)[0].tax / 100)) * item.quantity

        if (!taxSums[Object.values(item.taxes)[0].tax]) {
          taxSums[Object.values(item.taxes)[0].tax] = 0
        }

        taxSums[Object.values(item.taxes)[0].tax] += taxAmount
      })

      return taxSums
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
  },
  watch: {
    'invoice.payment_status': {
      immediate: false,
      handler() {
        this.isTouched++
        if (this.isTouched > 1) {
          this.updateInvoice()
        }
      },
    },
  },
  mounted() {
    this.getInvoice()
  },
  methods: {
    updateInvoice() {
      this.loadingUpdate = true
      // this.invoice.payment_status = 'PAID'
      this.invoice
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izmjene'),
            type: 'is-success',
          })
          this.loadingUpdate = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingUpdate = false
        })
    },
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
        this.isTouched = 0
        this.invoice = res
        this.loading = false
        this.getPayment()
      })
    },
    getPayment() {
      this.loadingPayment = true
      const paymentPromises = []
      this.invoice.items.forEach((item) => {
        const paymentPromise = Payment.include(['type'])
          .find(item.invoiceable_id)
          .then((res) => {
            this.payments.push(res)
            this.loadingPayment = false
          })
        paymentPromises.push(paymentPromise)
      })
      Promise.all(paymentPromises)
        .then(() => {
          this.loadingPayment = false
        })
        .catch((error) => {
          console.error('Došlo je do' + error)
          this.loadingPayment = false
        })
    },
    // getInvoices() {
    //   Invoice.get().then((res) => {
    //     this.invoices = res.data
    //   })
    // },
    returnBckg() {
      if (this.invoice.payment_status === 'DRAFT') {
        return 'is-primary has-text-white'
      } else if (this.invoice.payment_status === 'PAID') {
        return 'green has-text-white'
      } else if (this.invoice.payment_status === 'UNPAID') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>
<style scoped></style>
