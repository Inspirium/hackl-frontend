<template>
  <div>
    <template v-if="activeTab === 0">
      <div class="buttons m-t-30 m-b-2">
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
    </template>
    <template>
      <div id="tu" class="buttons m-t-20 m-b-10">
        <b-button
          v-if="activeTab === 1"
          class="fw600 softshadow"
          type="is-white"
          pack="fal"
          icon-left="chevron-left"
          rounded
          @click="resetOnBack()"
        >
          {{ $t('nazad') }}
        </b-button>
      </div>
      <div v-if="activeTab === 0" class="buttons m-t-0 m-b-20">
        <b-button
          class="fw600"
          :class="invoices.length ? '' : ' blur_button'"
          type="is-primary"
          pack="fal"
          :loading="loadingApprove"
          rounded
          @click="approveInvoices()"
        >
          {{ $t('Pošalji račune') }}
        </b-button>
      </div>
    </template>
    <template v-if="activeTab === 0">
      <div class="divider-line-1 m-t-10"></div>
      <template v-show="true">
        <div class="buttons m-t-20">
          <b-button
            class="softshadow invert-small-button"
            :class="invoices.length ? '' : ' blur_button'"
            type="noborder is-small is-danger has-text-white"
            pack="fal"
            icon-right="times-circle"
            rounded
            :loading="loadingAll"
            @click="isModalConfirmationAllActive = true"
          >
            {{ $t('Obriši sve') }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t--10"></div>
      </template>
      <div class="search container m-t-10 p-t-0">
        <b-field>
          <b-input
            id="inputsearch"
            v-model="search_term"
            :placeholder="$t('Pretraži')"
            type="search"
            pack="far"
            :icon-right="search_icon"
            icon-right-clickable
            @icon-right-click="search_term = ''"
          >
          </b-input>
        </b-field>
      </div>
    </template>
    <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation_impt p-b-150">
      <b-tab-item>
        <div class="p-x-16">
          <div class="relative z--2">
            <div class="activity x-container m-b--10 p-t-5 p-b-20 statistics_new softshadow">
              <div class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-10">
                {{ $t('Ukupno računa za slanje') }}: {{ invoicesMeta.total }}
              </div>
              <div class="divider-line-1 w100 m-t-10 m-b-10"></div>
              <template v-if="Object.keys(invoicesMeta).length">
                <div class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto m-b--20 w100">
                  {{ $t('Ukupan iznos') }}:
                </div>
                <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
                  {{ invoicesMeta.total_amount | currency }}
                </div>
              </template>
            </div>
          </div>
          <div class="activity__box action__buttons z-2">
            <div
              v-for="(item, index) in invoices"
              :key="item.id + index"
              class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation has-text-left"
              @click.stop="
                selectedPlayer = item.user
                selected_invoice = item
                activeTab = 1
              "
            >
              <div class="fw600 align__centar__all">
                <div class="list__content">
                  <template v-if="false">
                    <div
                      v-if="item.active_subscription?.status !== 'active' || item.active_subscription?.is_paused === 1"
                      class="inlineblock is-size-7 x-tag is-red nav__notification has-text-white m-b-5"
                    >
                      {{ $t('paused') }}
                    </div>
                  </template>
                  <div v-if="true" class="flex align__centar__y">
                    <TennisImage
                      :size="[42, 42]"
                      :src="item.user?.image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                    <div class="">
                      <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.user.display_name }}</h4>
                      <h4 v-if="false" class="fw600 is-size-65 has-text-danger m-t--2">
                        {{ $t('Nema Članarine') }}
                      </h4>
                    </div>
                  </div>
                  <template v-if="true">
                    <!--                    TODO: Add last five payments indicator-->
                    <!--                    <div class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap">-->
                    <!--                      {{ $t('Računi') }}:-->
                    <!--                      <span v-for="indicator in 5" :key="indicator" class="school-payment-indicatior green"></span>-->
                    <!--                    </div>-->
                    <div class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap">
                      {{ $t('Datum') }}:
                      <span class="has-text-lightblue">{{ item.created_at | moment('DD.MM.') }}</span>
                    </div>
                    <div v-if="typeName(item)" class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap">
                      {{ $t('Tip') }}:
                      <span class="has-text-lightblue">{{ typeName(item) }}, {{ item.items[0].name }}</span>
                    </div>
                    <template>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ item.description }}
                      </div>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ $t('Cijena') }}:
                        <span :class="item.payment_amount ? 'has-text-lightblue' : 'has-text-danger'">{{
                          item.payment_amount | currency
                        }}</span>
                      </div>
                    </template>
                  </template>
                </div>
                <div class="action m-l-auto">
                  <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner--bottom m-t-50">
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
      </b-tab-item>
      <b-tab-item>
        <div class="p-x-16">
          <div class="fw600 is-size-3 has-text-centered has-text-black80">{{ $t('Uredi predračun') }}</div>
          <div class="flex align__centar__all m-t-10">
            <TennisImage
              v-if="selectedPlayer.image"
              :size="[80, 80]"
              :src="selectedPlayer.image"
              class="user_image m-r-10 border__white"
              alt=""
            />
            <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ selectedPlayer.display_name }}</h4>
          </div>
          <template>
            <div class="divider-line-1 m-t-20"></div>
            <div class="buttons m-t-30 m-b-10">
              <b-button
                class="softshadow invert-small-button"
                type="noborder is-small is-danger has-text-white"
                pack="fal"
                icon-right="times-circle"
                rounded
                :loading="loadingDelete"
                @click="isModalConfirmationActive = true"
              >
                {{ $t('Obriši predračun') }}
              </b-button>
            </div>
            <div v-for="(item, index) in selected_invoice.items" :key="item.id" class="">
              <div class="divider-line-1 m-t-20"></div>
              <h4 class="fw600 is-size-6 has-text-black80 m-t-20 has-text-centered">
                {{ item.name }} <span class="has-text-lightblue"> ({{ item.amount | currency }})</span>
              </h4>
              <ValidationProvider name="Cijena Članarine">
                <b-field :label="$t('Prilagođena cijena')" class="login__input__container has-text-white">
                  <b-input
                    v-model="selected_invoice.items[index].amount"
                    :placeholder="item.amount | currency"
                    type="number"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
            </div>

            <div class="buttons m-t-30 m-b-5">
              <transition name="fade" mode="out-in">
                <b-button
                  class="softshadow m-t-10 m-b-20 invert-small-button"
                  type="noborder is-small is-primary has-text-white"
                  pack="fal"
                  icon-right="check"
                  rounded
                  :loading="loadingSave"
                  @click="saveInvoice()"
                >
                  {{ $t('spremi') }}
                </b-button>
              </transition>
            </div>
          </template>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="sendEmit($event)" />
    </b-modal>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('Jeste li sigurni?')"
          :subtitle="$t('Potvrdom će predračun biti obrisan i neće neće se poslati klijentu')"
          @update="deleteInvoice()"
        ></modalConfirmation>
      </b-modal>
      <b-modal :active.sync="isModalConfirmationAllActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('Jeste li sigurni?')"
          :subtitle="$t('Potvrdom će svi predračun biti obrisani.')"
          @update="deleteAll()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembersAll'
import Invoice from '~/models/Invoice'

export default {
  name: 'GeneratedInvoicesPending',
  components: {
    modalMembers,
    modalConfirmation,
  },
  props: {
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showFilter: true,
      loading: false,
      loadingAll: false,
      loadingDelete: false,
      loadingSave: false,
      loadingApprove: false,
      isLoaded: null,
      loadingMedia: false,
      search_term: '',
      activeTab: 0,
      total: 0,
      bottom: false,
      offset: 1,
      category: [],
      subscriptions: [],
      selected_invoice: {},
      selected_subscriptions: null,
      selected_subscriptions_delete: null,
      isModalConfirmationActive: false,
      isModalConfirmationAllActive: false,
      isEditing: false,
      reservationsHistory: [],
      selectedPlayer: {},
      reservationTimeRange: '',
      userSuscription: {
        price: null,
        is_paused: false,
      },
      isModalMembersActive: false,
      loadingInvoices: false,
      invoices: [],
      invoicesMeta: {},
      invoice_type: [
        { name: 'Sve' },
        { name: 'App\\Models\\UserSubscription' },
        { name: 'App\\Models\\UserMembership' },
      ],
      selected_invoice_type: { name: 'Sve' },
    }
  },
  computed: {
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    reservationsHistoryReverse() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.reservationsHistory.reverse().slice(0, 10)
    },
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        this.invoices = []
        this.offset = 1
        this.debouncedGetInvoices()
      }
      if (this.search_term === '') {
        this.invoices = []
        this.offset = 1
        this.getInvoices()
      }
    },
    activeTab() {
      if (this.activeTab === 1) {
        this.$emit('isEditing', true)
        this.scrollToTop()
      } else {
        this.$emit('isEditing', false)
      }
    },
    bottom(bottom) {
      if (bottom && this.invoicesMeta.last_page >= this.offset) {
        this.getInvoices()
      }
    },
  },
  mounted() {
    this.getInvoices()
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    window.addEventListener('scroll', this.handleScroll)
  },
  created() {
    this.debouncedGetInvoices = _.debounce(this.getInvoices, 500)
  },
  methods: {
    typeName(item) {
      if (!item.items.length) {
        return ''
      }
      switch (item.items[0].invoiceable_type) {
        case 'App\\Models\\UserSubscription':
          return this.$t('Članarina za školu tenisa')
        case 'App\\Models\\UserMembership':
          return this.$t('Članarina za klub')
        case 'App\\Models\\League\\Group':
          return this.$t('Liga')
        case 'App\\Notifications\\NewReservation':
          return this.$t('Rezervacija')
      }
    },
    updateType(item) {
      this.invoices = []
      this.offset = 1
      this.selected_invoice_type = item
      this.getInvoices()
    },
    approveInvoices() {
      const inv = this.invoices
      this.loadingApprove = true
      this.$axios
        .post('v2/invoice/send', { invoices: inv })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste odobrili račune'),
            type: 'is-success',
          })
          this.loadingApprove = false
          this.$router.push(this.localePath('/admin/invoices'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingApprove = false
          this.getInvoices()
        })
    },
    getInvoices() {
      if (this.invoicesMeta.last_page < this.offset) return
      this.loading = true
      const inv = Invoice.page(this.offset)
      inv.where('club', this.club.id).where('pending', true).where('display_name', this.search_term)
      if (this.selected_invoice_type.name !== 'Sve') {
        inv.where('item_type', this.selected_invoice_type.name)
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
          this.offset++
          this.loading = false
          this.loadingInvoices = false
        })
    },
    saveInvoice() {
      this.loadingSave = true
      const inv = new Invoice(this.selected_invoice)
      inv
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.offset = 1
          this.invoices = []
          this.activeTab = 0
          this.getInvoices()
          this.loadingSave = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingSave = false
        })
    },
    deleteInvoice() {
      this.loadingDelete = true
      const inv = new Invoice(this.selected_invoice)
      inv
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali'),
            type: 'is-success',
          })
          this.offset = 1
          this.invoices = []
          this.activeTab = 0
          this.getInvoices()
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    deleteAll() {
      this.loadingAll = true
      Invoice.when(this.selected_invoice_type.name !== 'Sve', (query, value) => query.where('item_type', value))
        .deleteMany()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali'),
            type: 'is-success',
          })
          this.offset = 1
          this.invoices = []
          this.activeTab = 0
          this.getInvoices()
          this.loadingAll = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingAll = false
        })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    resetOnBack() {
      this.$emit('reload')
      this.selectedPlayer = {}
      this.selected_invoice = {}
      this.activeTab = 0
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
<style scoped>
.cropper {
  width: 100vw;
}
</style>
