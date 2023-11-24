<template>
  <div v-if="invoices.length" class="">
    <div class="activity__header--center m-b-5 m-t-20">
      <nuxt-link :to="localePath('/player/' + player.id + '/invoices')" class="fw600"
        >{{ $t('Računi') }}
        <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        <div class="modal-subtitle has-text-centered fw400 m-b-10 m-t--5">
          {{ $t('Ukupno računa') }}
          <span class="has-text-primary is-size-5">{{ invoicesMeta.total }}</span>
        </div>
      </nuxt-link>
    </div>
    <div class="is-white radius__5 softshadow">
      <div class="bb1-10"></div>
      <div v-for="(item, index) in invoices" :key="index + 'or'" class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
        <nuxt-link
          :to="localePath('/player/' + $route.params.id + '/invoices/' + item.id)"
          class="fw600 align__centar__all"
        >
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
          </div>
        </nuxt-link>
      </div>
    </div>
    <div v-if="false" class="buttons m-t-10">
      <b-button
        class="softshadow m-t-10 m-b-10"
        type="is-small noborder"
        pack="fal"
        icon-right="long-arrow-right"
        rounded
        tag="nuxt-link"
        :to="localePath('/player/' + player.id + '/payments')"
      >
        {{ $t('prikaiVie') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import Invoice from '@/models/Invoice'

export default {
  name: 'WidgetInvoices',
  components: {},
  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      invoices: [],
      loading: false,
      invoicesMeta: {},
    }
  },
  computed: {},
  mounted() {
    this.getInvoices()
  },
  methods: {
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
    getInvoices() {
      this.loading = true
      const inv = Invoice.where('user', this.$route.params.id).limit(3)
      if (this.$store.state.club.id !== 26) {
        inv.where('club', this.$store.state.club.id)
      }
      inv

        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.invoices = res.data
          this.invoicesMeta = res.meta
          this.loading = false
        })
    },
  },
}
</script>
