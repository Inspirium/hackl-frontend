<template>
  <div class="">
    <div :class="{ invert_input_box: invert }">
      <template v-if="!addedNew">
        <div class="label">{{ $t('Pretraži postojeće tvrtke') }}</div>
        <ValidationProvider name="Tvrtka" rules="required">
          <b-field class="">
            <b-autocomplete
              v-model="company"
              rounded
              field="name"
              :data="companies"
              :placeholder="$t('Pronađi tvrtku')"
              clearable
              @select="(option) => (selectedCompany = option)"
            >
              <template #empty>{{ $t('Nema rezultata pretrage') }}</template>
            </b-autocomplete>
          </b-field>
        </ValidationProvider>
      </template>
      <template v-if="selectedCompany">
        <div v-if="Object.keys(selectedCompany).length" class="m-t-20">
          <div :class="{ 'has-text-white': invert }" class="fw600 is-size-4">{{ $t('Odabrana tvrtka') }}:</div>
          <div :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('Ime tvrtke') }}: </span>{{ selectedCompany.name }}
          </div>
          <div :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('OIB') }}: </span>{{ selectedCompany.vat_id }}
          </div>
          <div v-if="selectedCompany.address" :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('Adresa') }}: </span>{{ selectedCompany.address }}
          </div>
          <div v-if="selectedCompany.city" :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('Grad') }}: </span>{{ selectedCompany.city }}
          </div>
          <div
            v-if="selectedCompany.postal_code"
            :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']"
          >
            <span class="fw500 has-text-primary">{{ $t('Poštanski broj') }}: </span>{{ selectedCompany.postal_code }}
          </div>
          <div v-if="selectedCompany.phone" :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('mobitel') }}: </span>{{ selectedCompany.phone }}
          </div>
          <div v-if="selectedCompany.email" :class="[invert ? 'fw500 has-text-black20' : 'fw600 has-text-black80']">
            <span class="fw500 has-text-primary">{{ $t('email') }}: </span>{{ selectedCompany.email }}
          </div>

          <ValidationProvider
            v-if="selectedCompany.email"
            v-slot="{ errors, valid }"
            name="Uvjeti korištenja"
            rules="required"
          >
            <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-checkbox
                v-model="sendinvoice"
                :class="[invert ? 'checkbox-invert' : 'fw600']"
                class="m-t-7"
                name="consent"
                :true-value="true"
                >{{ $t('Pošalji račun na tvrtkim mail') }}
              </b-checkbox>
            </b-field>
          </ValidationProvider>

          <div v-if="user.is_admin" class="m-t-20 m-b-10">
            <b-button
              class="fw600 invert-small-button"
              type="is-danger has-text-white"
              pack="fal"
              size="is-small noborder"
              icon-right="times"
              rounded
              :loading="loadingDelete"
              @click="deleteCompany()"
            >
              {{ $t('Obriši tvrtku') }}
            </b-button>
          </div>
        </div>
      </template>
      <div :class="{ opacity3: invert }" class="divider-line-1 m-t-20 w100"></div>
      <div class="buttons m-t-20 m-b-10">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fal"
          :icon-right="!addNew ? 'plus-circle' : 'minus-circle'"
          rounded
          @click="addNew = !addNew"
        >
          {{ $t('Dodaj novu tvrtku') }}
        </b-button>
      </div>
    </div>
    <div v-if="addNew" :class="{ invert_input_box: invert }">
      <ValidationProvider v-slot="{ errors, valid }" name="Company" rules="required">
        <b-field
          :label="$t('Tvrtka')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.name" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="oib" rules="required">
        <b-field
          :label="$t('oib')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.vat_id" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Address" rules="">
        <b-field
          :label="$t('Adresa')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.address" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Postal number" rules="">
        <b-field
          :label="$t('Poštanski broj')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.postal_code" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="City" rules="">
        <b-field
          :label="$t('Grad')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.city" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Phone" rules="">
        <b-field
          :label="$t('mobitel')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.phone" type="tel" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Email" rules="email">
        <b-field
          :label="$t('emailAdresa')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="business_invoice.email" type="email" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <div v-if="true" class="buttons m-t-30 m-b-5">
        <b-button
          class="fw600 m-t-20 invert-small-button"
          type="is-primary has-text-white"
          pack="fal"
          size="is-small noborder"
          icon-right="check"
          rounded
          :loading="loadingSave"
          @click="saveCompany()"
        >
          {{ $t('spremi') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Company from '~/models/Company'

export default {
  name: 'PaymentCompany',
  components: {},
  props: {
    invert: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      sendinvoice: false,
      loadingSave: false,
      loadingDelete: false,
      addNew: false,
      addedNew: false,
      selected: {},
      countries: [],
      country: '',
      selectedCompany: {},
      companies: [],
      company: '',
      business_invoice: {
        name: '',
        vat_id: '',
        address: '',
        address2: '',
        city: '',
        postal_code: '',
        phone: '',
        email: '',
        country_id: '',
      },
      placeholder: {
        name: '',
        vat_id: '',
        address: '',
        address2: '',
        city: '',
        postal_code: '',
        phone: '',
        email: '',
        country_id: '',
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    company() {
      this.debouncedGetCompany()
    },
    selectedCompany() {
      this.$emit('update', this.selectedCompany)
    },
  },
  created() {
    this.debouncedGetCompany = _.debounce(this.getCompany, 500)
  },
  mounted() {},
  methods: {
    getCompany() {
      const c = Company
      c.where('search', this.company)
        .where('country', this.club.country.id)
        .get()
        .then((res) => {
          this.companies = res.data
        })
    },
    deleteCompany() {
      this.loadingDelete = true
      const l = new Company({ id: this.selectedCompany.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Tvrtka je obrisana'),
            type: 'is-success',
          })
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
    saveCompany() {
      this.loadingSave = true
      const c = new Company(this.business_invoice)
      c.country_id = this.club.country.id
      c.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novu tvrtku'),
            type: 'is-success',
          })
          this.loadingSave = false
          this.selectedCompany = res
          this.business_invoice = this.placeholder
          this.addNew = false
          this.addedNew = true
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingSave = false
        })
    },
  },
}
</script>
