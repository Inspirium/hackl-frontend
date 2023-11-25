<template>
  <div class="p-b-300">
    <PageHeader :title="$t('Novi račun')" :background="'is-primary'" />
    <div class="p-x-16">
      <template v-if="business_data.length > 1">
        <div class="label--center m-t-20">{{ $t('Odaberi poslovnu jedinicu') }}</div>
        <div class="buttons m-t-10 m-b-5">
          <b-button
            v-for="(item, index) in business_data"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': invoice.business_unit.name === item.name }"
            :icon-right="invoice.business_unit.name === item.name ? 'check' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': invoice.business_unit.name === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="selectBusinessUnit(item)"
          >
            {{ item.name }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t-10"></div>
      </template>
      <template>
        <div class="buttons m-t-20">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': invoice.payment_method === 'TRANSACTION' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': invoice.payment_method === 'TRANSACTION',
            }"
            pack="fal"
            rounded
            @click.prevent="invoice.payment_method = 'TRANSACTION'"
          >
            {{ $t('Transakcijski račun') }}
          </b-button>

          <b-button
            :class="{ softshadow: true, 'invert-small-button': invoice.payment_method === 'CASH' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': invoice.payment_method === 'CASH',
            }"
            pack="fal"
            rounded
            @click.prevent="invoice.payment_method = 'CASH'"
          >
            {{ $t('gotovina') }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t--10"></div>
      </template>

      <template>
        <div class="has-text-centered m-t-15 m-b-20">
          <div class="label--center m-b-10">{{ $t('Želite li R1 račun?') }}</div>
          <div class="radio__box--smaller">
            <div class="block">
              <b-radio v-model="is_business_invoice" type="is-danger" :native-value="false">
                {{ $t('ne') }}
              </b-radio>
              <b-radio v-model="is_business_invoice" type="is-success" :native-value="true">
                {{ $t('da') }}
              </b-radio>
            </div>
          </div>
        </div>
        <payment-company v-if="is_business_invoice" :invert="false" @update="updateCompany($event)" />
        <div class="divider-line-1 m-t-20"></div>
      </template>
      <template v-if="!is_business_invoice">
        <div class="fw600 is-size-5 m-t-20 has-text-centered">{{ $t('Odaberi postojećeg korisnika') }}</div>
        <div class="activity__box action__buttons br100 m-t-10">
          <div class="action__item__small fw600 br100">
            <div v-if="Object.keys(assignee).length" class="align__centar__all w100">
              <TennisImage :size="[42, 42]" :src="assignee.image" class="user_image m-r-10 m-l--5" alt="" />
              <div class="list__content">
                <h3>{{ assignee.display_name }}</h3>
              </div>
              <div
                @click="
                  assignee = {}
                  invoice.user = { id: 0 }
                "
              >
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
              </div>
            </div>
            <div v-else class="activity__header" @click="isModalMembersActive = true">
              <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
              <div class="list__content">
                <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj osobu') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!Object.keys(assignee).length" class="fw600 is-size-5 m-t-20 has-text-centered">
          {{ $t('Ili upiši novog korisnika') }}
        </div>
      </template>
      <ValidationObserver v-slot="{ invalid }">
        <form class="p-b-150 m-t-10 registration" @submit.prevent="submit(invalid)">
          <div class="">
            <template v-if="!is_business_invoice">
              <ValidationProvider
                v-if="!Object.keys(assignee).length"
                v-slot="{ errors, valid }"
                name="Ime i prezime"
                rules="required"
              >
                <b-field
                  :label="$t('Ime i prezime')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="invoice.user.name" type="text" rounded></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-if="!Object.keys(assignee).length"
                v-slot="{ errors, valid }"
                name="Adresa"
                rules="required"
              >
                <b-field
                  :label="$t('Adresa')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="invoice.user.address" type="text" rounded></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-if="!Object.keys(assignee).length"
                v-slot="{ errors, valid }"
                name="Grad"
                rules="required"
              >
                <b-field
                  :label="$t('Grad')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="invoice.user.city" type="text" rounded></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-if="!Object.keys(assignee).length"
                v-slot="{ errors, valid }"
                name="postal_code"
                rules="required"
              >
                <b-field
                  :label="$t('Poštanski broj')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="invoice.user.postal_code" type="text" rounded></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                v-if="!Object.keys(assignee).length"
                v-slot="{ errors, valid }"
                name="country"
                rules="required"
              >
                <b-field
                  :label="$t('Država')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="invoice.user.country" type="text" rounded></b-input>
                </b-field>
              </ValidationProvider>
            </template>
            <div class="divider-line-1 m-t-10"></div>
            <div class="fw600 is-size-3 m-t-20 m-b--10 has-text-centered">{{ $t('Stavke računa') }}</div>
            <div v-for="(invoiceItem, index) in invoice.items" :key="index" class="">
              <ValidationProvider name="Naziv">
                <b-field :label="$t('Naziv')" class="login__input__container has-text-white">
                  <b-input
                    v-model="invoiceItem.name"
                    :placeholder="$t('Upiši opis')"
                    rules="required"
                    type="text"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider name="Iznos">
                <b-field :label="$t('Cijena')" class="login__input__container has-text-white">
                  <b-input
                    v-model="invoiceItem.amount"
                    :placeholder="$t('Upiši ukupan iznos')"
                    rules="required"
                    min="0"
                    type="number"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider name="Količina" rules="required">
                <div class="label">{{ $t('Količina') }}</div>
                <!--            <div class="fw600 is-size-5 m-t-20 m-b&#45;&#45;10 has-text-centered">{{ $t('Količina') }}</div>-->
                <b-field>
                  <b-numberinput
                    v-model="invoiceItem.quantity"
                    min="1"
                    max="30"
                    rules="required"
                    type="is-white"
                    controls-rounded
                    rounded
                  ></b-numberinput>
                </b-field>
              </ValidationProvider>
              <div class="label">{{ $t('Porez') }}</div>
              <ValidationProvider name="Tax" rules="required" class="radio__box">
                <div class="block">
                  <b-radio v-for="taxItem in taxes" :key="taxItem.id" v-model="invoiceItem.tax" :native-value="taxItem">
                    {{ taxItem.rate }}%
                  </b-radio>
                </div>
              </ValidationProvider>
              <div class="buttons m-t-30">
                <b-button
                  v-if="invoice.items.length > index && invoice.items.length > 1"
                  class="softshadow invert-small-button"
                  type="is-small noborder is-danger has-text-white"
                  pack="fas"
                  icon-right="times"
                  rounded
                  @click="deleteItem(index)"
                >
                  {{ $t('Obriši stavku') }}
                </b-button>

                <b-button
                  v-if="invoice.items.length === index + 1"
                  class="softshadow"
                  type="is-small noborder"
                  pack="fas"
                  icon-right="plus"
                  rounded
                  @click="addItem(index)"
                >
                  {{ $t('Dodaj stavku') }}
                </b-button>
              </div>
            </div>

            <div v-if="true">
              <div class="divider-line-1 m-t-20"></div>
              <div class="is-primary has-text-white p-t-5 p-b-5 rounded-md m-t-40">
                <div class="fw600 is-size-6 has-text-centered m-b--5">{{ $t('ukupanIznosZaNaplatu') }}</div>
                <div class="fw600 is-size-3 has-text-centered">
                  {{ calculateTotalAmount | currency }}
                </div>
              </div>
              <div class="m-t-20">
                <div class="flex flex__column align-items-flex-end">
                  <div class="fw600 is-size-62 has-text-black80 align__centar__y p-t-3">
                    <span class="m-r-4 has-text-black50">{{ $t('Osnovica') }}: </span
                    >{{ (calculateTotalAmount - taxSumWhole) | currency }}
                  </div>
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
                    ><span class="is-size-5">{{ calculateTotalAmount | currency }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </ValidationObserver>
      <div class="buttons is-fixed m-t-15">
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-danger"
          pack="fal"
          icon-left="times"
          rounded
          tag="nuxt-link"
          :to="localePath('/admin/invoices/')"
        >
          {{ $t('odustani') }}
        </b-button>
        <b-button
          class="m-l-5 m-t-20 fw600"
          pack="fal"
          type="is-primary"
          icon-right="check"
          rounded
          native-type="submit"
          :loading="loading"
          @click.prevent="submit"
        >
          {{ $t('Naplati') }}
        </b-button>
      </div>

      <div v-if="true" class="p-b-150">
        <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
          <modalMembers
            :title="$t('naruitelj')"
            :show-tennis-school="false"
            :is-player="true"
            @player="
              assignee = $event
              invoice.user = $event
            "
          />
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import Invoice from '@/models/Invoice'
import PageHeader from '~/components/headers/blankBack'
import modalMembers from '~/components/modal/ModalMembersAll'
import TaxClass from '~/models/TaxClass'
import BusinessUnit from '~/models/BusinessUnit'

export default {
  name: 'NewInvoice',
  components: {
    PageHeader,
    modalMembers,
  },
  data() {
    return {
      paymentMethod: 'cash',
      payment_methods: [{ name: 'cash' }, { name: 'transaction' }],
      isModalMembersActive: false,
      is_business_invoice: false,
      loading: false,
      taxes: [],
      assignee: {},
      invoice: {
        // user object from database, or new data which will be saved
        // if new data, leave id 0
        user: {
          id: 0,
          name: '',
          address: '',
          address2: '',
          city: '',
          postal_code: '',
          state: '',
          country: '',
        },
        business_unit: {
          id: 0,
        },
        // company object from database, for VAT purposes
        company: {
          id: 0,
        },
        items: [
          // multiple items on one invoice
          {
            name: '',
            amount: null,
            quantity: 1,
            tax: '',
          },
        ],
        payment_method: 'TRANSACTION',
        payment_status: 'UNPAID',
        note: '',
        internal_note: '',
      },
      placeholder: {
        name: '',
        amount: null,
        quantity: 1,
        tax: 0,
      },
      business_data: [],
    }
  },
  computed: {
    calculateTotalAmount() {
      return this.invoice.items.reduce((total, item) => total + item.amount * item.quantity, 0)
    },
    taxSumWhole() {
      let sum = 0

      this.invoice.items.forEach((item) => {
        sum += item.amount - item.amount / (1 + item.tax.rate / 100)
      })

      return sum
    },
    totalTaxSum() {
      const taxSums = {}

      this.invoice.items.forEach((item) => {
        const taxAmount = (item.amount - item.amount / (1 + item.tax.rate / 100)) * item.quantity

        if (!taxSums[item.tax.rate]) {
          taxSums[item.tax.rate] = 0
        }

        taxSums[item.tax.rate] += taxAmount
      })

      return taxSums
    },
    total() {
      return this.invoice.amount * this.invoice.quantity
    },
    preTaxPrice() {
      return this.total / (1 + this.invoice.tax_percent / 100)
    },
    taxAmount() {
      return this.total - this.preTaxPrice
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    is_business_invoice() {
      if (this.is_business_invoice === false) {
        this.invoice.company = { id: 0 }
      }
    },
    'invoice.payment_method'() {
      this.invoice.payment_status = 'PAID'
    },
  },
  mounted() {
    this.getTaxes()
    this.getBusinessUnit()
  },
  methods: {
    selectBusinessUnit(item) {
      this.invoice.business_unit = item
    },
    getBusinessUnit() {
      BusinessUnit.where('club', this.club.id)
        .get()
        .then((res) => {
          this.business_data = res.data
          this.invoice.business_unit = res.data[0]
        })
    },
    deleteItem(index) {
      this.invoice.items.splice(index, 1)
    },
    addItem() {
      this.invoice.items.push({ ...this.placeholder })
    },
    updateCompany(item) {
      if (item === null) {
        this.invoice.company = { id: 0 }
      } else {
        this.invoice.company = item
      }
    },
    getTaxes() {
      this.loading = true
      TaxClass.get().then((res) => {
        this.taxes = res.data
        this.placeholder.tax = res.data[0]
        this.invoice.items[0].tax = res.data[0]
        this.loading = false
      })
    },
    submit(invalid) {
      if (!invalid) {
        this.$buefy.toast.open({
          message: this.$t('Forma nije ispravno popunjena'),
          type: 'is-danger',
        })
        return
      }
      this.loading = true
      const invoice = new Invoice(this.invoice)
      invoice
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili račun'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/player/' + this.invoice.user.id + '/invoices/' + res.uuid))
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
