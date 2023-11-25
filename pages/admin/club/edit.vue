<script src="../../../store/userPreference.js"></script>
<template>
  <div class="">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>

    <div class="p-l-15 p-r-15 registration p-b-500">
      <b-tabs v-model="activeTab" size="is-medium" position="is-centered">
        <b-tab-item :label="$t('podaci')">
          <div class="form-group align__centar__y flex__column">
            <form class="p-b-100 w100" @submit.prevent="submit">
              <div class="m-t-20">
                <cropper
                  ref="cropper"
                  class="cropper"
                  stencil-component="circle-stencil"
                  :src="crop_image"
                  :canvas="{
                    width: 1024,
                    height: 1024,
                    maxHeight: 1024,
                    maxWidth: 1024,
                  }"
                  :stencil-props="{
                    aspectRatio: 1,
                  }"
                  @change="change"
                ></cropper>
                <b-button
                  v-show="crop_image"
                  class="m-t-10 center--transform"
                  type="is-primary"
                  icon-right="check"
                  pack="fal"
                  rounded
                  :loading="loading"
                  @click="crop"
                >
                  {{ $t('spremiSliku') }}
                </b-button>
                <div v-show="clubUpdate.logo" class="align__centar__all flex__column">
                  <img :src="clubUpdate.logo" class="user_image-large m-b-15" alt="" />
                  <b-button class="is-smaller" type="is-danger" rounded @click="reset">
                    {{ $t('ukloniSliku') }}
                  </b-button>
                </div>
                <div
                  v-show="clubUpdate.logo === null && crop_image === null"
                  class="user_image-large align__centar__all flex__column buttons center--transform"
                  @click="$refs.file.click()"
                >
                  <b-icon class="" icon="camera" size="is-large" type="is-lightblue" pack="fal"> </b-icon>
                  <b-button class="is-smaller m-t-10" type="is-primary" rounded> {{ $t('postaviSliku') }} </b-button>
                  <span class="button hide">
                    <input ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
                    {{ $t('uploadImage') }}
                  </span>
                </div>
              </div>
              <ValidationProvider v-slot="{ errors, valid }" name="Naziv kluba" rules="required">
                <b-field
                  :label="$t('nazivKluba')"
                  size="is-medium"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.name" :placeholder="$t('upiiNazivKluba')" type="text" rounded> </b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors, valid }" name="Email" rules="required|email">
                <b-field
                  :label="$t('email')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.email" placeholder="E-mail" type="email" rounded> </b-input>
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

              <!--              <div class="label">{{ $t('Grad') }}</div>-->
              <!--              <ValidationProvider name="Grad" rules="required">-->
              <!--                <b-field class="">-->
              <!--                  <b-autocomplete-->
              <!--                    v-model="city"-->
              <!--                    rounded-->
              <!--                    field="name"-->
              <!--                    :data="cities"-->
              <!--                    :placeholder="$t('Odaberi grad')"-->
              <!--                    clearable-->
              <!--                    @select="(option) => (selected = option)"-->
              <!--                  >-->
              <!--                    <template #empty>{{ $t('Nema rezultata pretrage') }}</template>-->
              <!--                  </b-autocomplete>-->
              <!--                </b-field>-->
              <!--              </ValidationProvider>-->
              <ValidationProvider v-slot="{ errors, valid }" name="Adresa" rules="required">
                <b-field
                  :label="$t('adresa')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.address" :placeholder="$t('upiiAdresuKluba')" type="text" rounded>
                  </b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" name="Regija" rules="required">
                <b-field
                  :label="$t('regija')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.county" :placeholder="$t('regija')" type="text" rounded> </b-input>
                </b-field>
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors, valid }" name="Mjesto" rules="required">
                <b-field
                  :label="$t('mjesto3')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.city" :placeholder="$t('mjesto3')" type="text" rounded> </b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors, valid }" name="Mobitel" rules="required">
                <b-field
                  :label="$t('mobitel')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.phone" :placeholder="$t('upiiBrojMobitela')" type="tel" rounded>
                  </b-input>
                </b-field>
              </ValidationProvider>
              <div class="label">{{ $t('opis') }}</div>
              <tinymce-editor v-model="clubUpdate.description" class="" />
              <ValidationProvider v-slot="{ errors, valid }" name="longitude" rules="required">
                <b-field
                  label="Longitude"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.longitude" type="number" rounded> </b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors, valid }" name="latitude" rules="required">
                <b-field
                  label="latitude"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input v-model="clubUpdate.latitude" type="number" rounded> </b-input>
                </b-field>
              </ValidationProvider>

              <div class="activity__header--center m-b--10 m-t-40">
                <div class="fw600 is-size-35 has-text-centered">{{ $t('drutveneMree') }}</div>
              </div>
              <template v-if="true">
                <ValidationProvider name="Facebook">
                  <b-field :label="$t('facebook')" class="login__input__container">
                    <b-input
                      v-model="clubUpdate.social.facebook"
                      :placeholder="$t('facebookAdresa')"
                      type="number|text"
                      rounded
                    >
                    </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="Instagram">
                  <b-field :label="$t('instagram')" class="login__input__container">
                    <b-input
                      v-model="clubUpdate.social.instagram"
                      :placeholder="$t('instagramAdresa')"
                      type="text"
                      rounded
                    >
                    </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="Twitter">
                  <b-field :label="$t('twitter')" class="login__input__container">
                    <b-input v-model="clubUpdate.social.twitter" :placeholder="$t('twitterAdresa')" type="text" rounded>
                    </b-input>
                  </b-field>
                </ValidationProvider>
              </template>
              <div class="activity__header--center m-b--10 m-t-40">
                <div class="fw600 is-size-35 has-text-centered">{{ $t('Poslovni podaci') }}</div>
              </div>
              <template v-if="true">
                <ValidationProvider name="subject_name">
                  <b-field :label="$t('subject_name')" class="login__input__container">
                    <b-input v-model="business_data.subject_name" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="subject_address">
                  <b-field :label="$t('subject_address')" class="login__input__container">
                    <b-input v-model="business_data.subject_address" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="bank_account">
                  <b-field :label="$t('bank_account')" class="login__input__container">
                    <b-input v-model="business_data.bank_account" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="subject_number">
                  <b-field :label="$t('subject_number')" class="login__input__container">
                    <b-input v-model="business_data.subject_number" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="oib">
                  <b-field :label="$t('oib')" class="login__input__container">
                    <b-input v-model="business_data.oib" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider name="swift_code">
                  <b-field :label="$t('swift_code')" class="login__input__container">
                    <b-input v-model="business_data.swift_code" type="text" rounded> </b-input>
                  </b-field>
                </ValidationProvider>
                <div class="label">{{ $t('Porez') }}</div>
                <div v-if="clubUpdate.tax_class" class="m-l-15 fw600 is-size-5 m-b-10">
                  {{ clubUpdate.tax_class?.name }} -
                  <span class="has-text-lightblue">{{ clubUpdate.tax_class.rate }}%</span>
                </div>
                <ValidationProvider name="Porez" rules="required">
                  <b-dropdown>
                    <template #trigger="{ active }">
                      <b-button
                        :label="$t('Odaberi vrstu poreza')"
                        type="is-primary"
                        rounded
                        :icon-right="active ? 'chevron-up' : 'chevron-down'"
                      />
                    </template>

                    <b-dropdown-item
                      v-for="item of taxes"
                      :key="item.id"
                      aria-role="listitem"
                      @click="clubUpdate.tax_class = item"
                      >{{ item.name }}</b-dropdown-item
                    >
                  </b-dropdown>
                </ValidationProvider>
              </template>
            </form>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('postavke')" class="p-b-100">
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('statusKluba') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.is_active" :native-value="true"> {{ $t('aktivan') }} </b-radio>
                <b-radio v-model="clubUpdate.is_active" :native-value="false"> {{ $t('neaktivan') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">
              {{ $t('akoOznaiteDaKlubNijeAktivanKlupskaAplikacijaVieNee') }}
            </div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('vrstaAplikacije') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.type" :native-value="'classic'"> {{ $t('klubska') }} </b-radio>
                <b-radio v-model="clubUpdate.type" :native-value="'tournament'"> {{ $t('turnirska') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">
              {{ $t('turnirskaVerzijaOnemoguujeNekeZnaajkeTeJePrilagoen') }}
            </div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('direktnaRezervacijaTerena') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.validate_user" :native-value="0"> {{ $t('bezPotvrde') }} </b-radio>
                <b-radio v-model="clubUpdate.validate_user" :native-value="1"> {{ $t('sPotvrdom') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">
              {{ $t('sPotvrdomNoviEKorisniciPrvoMoratiBitiPotvreniOdStr') }}
            </div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('prikazImenaNaRezervacijama') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.hide_personal_data" :native-value="true"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.hide_personal_data" :native-value="false">
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">{{ $t('imenaLanovaNaRezervacijamaMoguBitiSkrivenaIliJavna') }}</div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('prikazRangLjestvice') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.hide_ranks" :native-value="true"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.hide_ranks" :native-value="false"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">{{ $t('prikazKlupskeEloRangLjestvice') }}</div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('Natjecanja za članove') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.show_competitions" :native-value="true"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.show_competitions" :native-value="false"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">{{ $t('Natjecanja za članove - objašnjenje') }}</div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('akontacijskoPlaanje') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.payment_accontation" :native-value="1"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.payment_accontation" :native-value="0">
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">{{ $t('akontacijskiRaunOmoguujeStvaranjeKlupskogNovanikaZ') }}</div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('kartinoPlaanje') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.payment_online" :native-value="1"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.payment_online" :native-value="0"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-10 m-b-20">{{ $t('omoguujeKartinoPlaanjeLanovimaKluba') }}</div>
          </div>
          <div class="">
            <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('Indikator rezervacije izvana') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="clubUpdate.is_w2p" :native-value="true"> {{ $t('da') }} </b-radio>
                <b-radio v-model="clubUpdate.is_w2p" :native-value="false"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
          </div>
          <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('Sportovi') }}</div>
          <div v-if="sports.length && clubUpdate.id !== ''" class="activity__reservation">
            <div class="activity__box action__buttons">
              <div
                v-for="(sport, index) in sports"
                :key="index"
                :class="{ active: clubUpdate.sports.filter((item) => item.id === sport.id).length }"
                class="action__item__small fw600"
                @click="selectType(sport)"
              >
                {{ sport.name }}
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('Lokacije')">
          <admin-locations />
        </b-tab-item>
        <b-tab-item :label="'Vimeo'">
          <div>
            <div class="buttons m-t-20">
              <b-button
                :href="vimeoLink"
                tag="a"
                class="softshadow m-l-10"
                type="is-small noborder"
                pack="far"
                icon-right="video"
                rounded
              >
                {{ $t('Spoji Vimeo') }}
              </b-button>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
      <div v-show="crop_image === null && activeTab !== 2" class="buttons is-fixed z30 m-t-15">
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-danger"
          pack="fal"
          icon-left="times"
          rounded
          tag="nuxt-link"
          :to="localePath('/admin/')"
        >
          {{ $t('odustani') }}
        </b-button>
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-primary"
          pack="fal"
          icon-right="check"
          rounded
          native-type="submit"
          @click.prevent="submit"
        >
          {{ $t('spremi') }}
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Club from '~/models/Club'
import City from '~/models/City'
import Country from '~/models/Country'
import TaxClass from '~/models/TaxClass'
import Sport from '@/models/Sport'

export default {
  name: 'ClubEdit',
  components: {
    Cropper,
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      player: {},
      crop_image: null,
      clubUpdate: {
        id: '',
        name: '',
        description: '',
        logo: '',
        new_logo: null,
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        address: '',
        city: '',
        phone: '',
        county: '',
        validate_user: 0,
        latitude: null,
        longitude: null,
        is_active: false,
        hide_personal_data: false,
        hide_ranks: false,
        show_competitions: true,
        payment_accontation: 0,
        payment_online: 0,
        is_w2p: 0,
        type: 'classic',
        tax_class: {},
        sports: [],
        social: {
          facebook: '',
          twitter: '',
          instagram: '',
        },
        business_data: {
          subject_name: '',
          subject_address: '',
          bank_account: '',
          subject_number: '',
          oib: '',
          swift_code: '',
        },
      },
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      business_data: {
        bank_account: '',
        subject_number: '',
        oib: '',
        swift_code: '',
      },
      selected: {},
      city: '',
      cities: [],
      country: '',
      countries: [],
      taxes: [],
      sports: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    vimeoLink() {
      const clientID = '3cf682f84ce4b2c5ecb806929ea1baa0fd4639c9'
      return `https://api.vimeo.com/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=https://api.tenis.plus/v2/club/social/vimeo&state={"club":${this.clubUpdate.id}}&scope=private upload`
    },
  },
  watch: {
    city() {
      this.debouncedGetCity()
    },
    country() {
      this.debouncedGetCountry()
    },
  },
  created() {
    this.debouncedGetCity = _.debounce(this.getCity, 500)
    this.debouncedGetCountry = _.debounce(this.getCountry, 500)
  },
  mounted() {
    this.getClub()
    this.getCity()
    this.getCountry()
    this.getTaxes()
    this.getSports()
  },
  methods: {
    selectType(item) {
      const index = this.clubUpdate.sports.findIndex((selectedItem) => selectedItem.id === item.id)
      if (index > -1) {
        this.clubUpdate.sports.splice(index, 1)
      } else {
        this.clubUpdate.sports.push(item)
      }
    },
    getSports() {
      Sport.get().then((res) => {
        this.sports = res
      })
    },
    getTaxes() {
      TaxClass.where('country', 1)
        .get()
        .then((res) => {
          this.taxes = res.data
        })
    },
    getCity() {
      const c = City
      c.where('name', this.city)
        .where('country', 1)
        .include('country')
        .get()
        .then((res) => {
          this.cities = res.data
        })
    },
    getCountry() {
      const c = Country
      c.where('name', this.country)
        .get()
        .then((res) => {
          this.countries = res.data
        })
    },
    getClub() {
      Club.include(['country', 'tax_class', 'sports'])
        .find(this.$store.state.club.id)
        .then((res) => {
          _.merge(this.clubUpdate, res)
          this.country = res.country.name
          if (res.business_data) {
            this.business_data = res.business_data
          }
          console.log(res)
          if (res.social === null) {
            this.clubUpdate.social = {
              facebook: '',
              twitter: '',
              instagram: '',
            }
          }
        })
    },
    reset() {
      this.clubUpdate.logo = null
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.clubUpdate.new_logo = canvas.toDataURL()
      this.clubUpdate.logo = canvas.toDataURL()
      this.crop_image = null
    },
    uploadImage(event) {
      this.$root.$loading.start()
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.crop_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
        this.$root.$loading.finish()
      }
    },
    submit() {
      this.loading = true
      this.$root.$loading.start()
      if (Object.keys(this.selected).length) {
        this.clubUpdate.country = { id: this.selected.id }
      }
      this.clubUpdate.business_data = this.business_data
      const club = new Club(this.clubUpdate)
      club
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili podatke'),
            type: 'is-success',
          })
          this.loading = false
          this.$store.dispatch('club/init_club', { force: true })
          this.$root.$loading.finish()
          this.getClub()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
          this.$root.$loading.finish()
        })
    },
    change({ coordinates, canvas }) {},
    clearPass() {
      this.clubUpdate.new_password = ''
      this.clubUpdate.new_password_confirmation = ''
    },
  },
}
</script>
<style scoped>
.cropper {
  height: auto;
  margin: 0 auto;
  width: 80vw;
}
</style>
