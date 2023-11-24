<template>
  <div class="">
    <hero>
      <h1 class="has-text-white">{{ $t('Porez') }}</h1>
    </hero>
    <div class="p-x-16">
      <div class="m-t-20">
        <div class="fw600 is-size-4 has-text-centered has-text-black80 subscription-title m-b--10">
          {{ $t('Novi porez') }}
        </div>

        <ValidationProvider v-slot="{ errors, valid }" name="Naziv poreza" rules="required">
          <b-field
            :label="$t('Naziv')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newTax.name" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>

        <div class="label">{{ $t('Država') }}</div>

        <ValidationProvider name="Država" rules="required">
          <b-field class="">
            <b-autocomplete
              v-model="country"
              rounded
              field="name"
              :data="countries"
              :placeholder="$t('Odaberi državu')"
              clearable
              @select="(option) => (selected = option)"
            >
              <template #empty>{{ $t('Nema rezultata pretrage') }}</template>
            </b-autocomplete>
          </b-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors, valid }" name="Iznos poreza" rules="required">
          <b-field
            :label="$t('Iznos poreza')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newTax.rate" type="number" rounded></b-input>
          </b-field>
        </ValidationProvider>
      </div>
      <div class="buttons m-t-30 m-b-5">
        <b-button
          class="softshadow m-t-10 m-b-20 invert-small-button"
          type="noborder is-small is-primary has-text-white"
          pack="fal"
          icon-right="check"
          rounded
          :loading="loading"
          @click="submit()"
        >
          {{ $t('Spremi porez') }}
        </b-button>
      </div>
      <div class="divider-line-1 m-t-10 m-b-20"></div>
      <div class="">
        <div class="fw600 is-size-4 has-text-centered has-text-black80 subscription-title m-b-10">
          {{ $t('Lista poreza') }}
        </div>
        <div class="activity relative">
          <template>
            <div v-if="taxes.length" class="is-white radius__5 softshadow">
              <div class="bb1-10"></div>
              <div v-for="(item, index) in taxes" :key="index + 'ob'" class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10">
                <span class="fw600 align__centar__all">
                  <div class="list__content">
                    <h4 class="fw600 is-size-55 m-t--2">{{ item.name }}</h4>
                    <div class="fw600 has-text-black80 is-size-6 m-l-auto nowrap">{{ item.rate }} %</div>
                    <div class="fw600 is-size-65 has-text-black30 align__centar__y flex">
                      <span class="m-r-5">Zemlja: </span>
                      <span class="m-r-4 has-text-primary"> {{ item.country_id }} </span>
                    </div>
                  </div>

                  <div :class="[{ blur_button: loadingDelete }]" @click="deleteTax(item.id)">
                    <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                  </div>
                </span>
              </div>
            </div>
            <template v-if="loading && !taxes.length">
              <transition name="fade">
                <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import _ from 'lodash'
import hero from '~/components/Hero'
import TaxClass from '~/models/TaxClass'
import Country from '~/models/Country'

export default {
  name: 'Taxes',
  components: {
    hero,
  },
  data() {
    return {
      taxes: [],
      newTax: {
        name: '',
        rate: null,
        country_id: null,
      },
      loading: false,
      loadingDelete: false,
      country: '',
      countries: [],
      selected: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    country() {
      this.debouncedGetCountry()
    },
  },
  mounted() {
    this.getTaxes()
    this.getCountry()
  },
  created() {
    this.debouncedGetCountry = _.debounce(this.getCountry, 500)
  },
  methods: {
    getCountry() {
      const c = Country
      c.where('name', this.country)
        .get()
        .then((res) => {
          this.countries = res.data
        })
    },
    getTaxes() {
      this.loading = true
      TaxClass.get().then((res) => {
        this.taxes = res.data
        this.loading = false
      })
    },
    deleteTax(id) {
      this.loadingDelete = true
      const tc = new TaxClass({ id })
      tc.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali'),
            type: 'is-success',
          })
          this.getTaxes()
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
    submit() {
      this.loading = true
      this.newTax.country_id = this.selected.id
      const tc = new TaxClass(this.newTax)
      tc.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izmjene'),
            type: 'is-success',
          })
          this.loading = false
          this.getTaxes()
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
