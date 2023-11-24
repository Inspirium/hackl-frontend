<template>
  <div class="cups">
    <hero
      :options="heroImage"
      :back="true"
      :second="{
        name: $t('Uredi terene'),
        link: '/admin/courts',
      }"
    >
      <h1 class="has-text-white">{{ court.name ? court.name : $t('Novi teren') }}</h1>
    </hero>
    <div class="activity x-container">
      <div class="tab__navigation m-b-20 m-t--40">
        <div :class="['tab__navigation__arrow__left', activeTab === 0 ? 'inactive' : '']" @click="activeTab--">
          <b-icon icon="chevron-left" pack="fal"> </b-icon>
        </div>
        <div :class="['tab__navigation__arrow__right', nextArrow ? '' : 'inactive']" @click="activeTab++">
          <b-icon icon="chevron-right" pack="fal"> </b-icon>
        </div>
      </div>
      <indicator
        class="m-t--10 m-b-20"
        :options="indicator"
        :active-step="activeStep"
        :active-tab="activeTab"
      ></indicator>

      <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
        <b-tab-item class="has-text-centered">
          <b-field class="has-text-centered m-t-10">
            <b-input
              v-model="court.name"
              wrap="hard"
              custom-class="input__title"
              :placeholder="$t('upiiNazivTerena')"
            ></b-input>
          </b-field>
          <template v-if="court.name">
            <!--            <font-awesome-icon  class="m-t-20"  icon="fa-light fa-exchange" size="is-large"> </font-awesome-icon>-->
            <template v-if="courts.length">
              <div class="fw600 has-text-centered m-b-10 m-t-10 is-size-6 line-height-14">
                {{ $t('akoEliteKopiratiPodatkeDrugogTerenaKlikniNaGumbIzn') }}
                <span class="is-size-6 has-text-danger">{{ $t('kopiranePodatkeMoeteModificirati') }}</span>
              </div>
              <div class="buttons">
                <b-button
                  class="m-t-10 softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="copy"
                  rounded
                  @click="isModaSelectActive = true"
                >
                  {{ $t('kopirajPodatkeDrugogTerena') }}
                </b-button>
              </div>
            </template>
            <div v-if="sports.length" class="activity__reservation">
              <div class="fw600 has-text-centered m-b-15 is-size-4 line-height-19">
                {{ $t('tipTerena2', { name: court.name }) }}
              </div>
              <div class="activity__box action__buttons">
                <div
                  v-for="(sport, key) in sports"
                  :key="'sport' + key"
                  :class="getClassType(sport)"
                  class="action__item__small fw600"
                  @click="selectType(sport)"
                >
                  {{ $t(sport.name) }}
                </div>
              </div>
            </div>
          </template>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">
            {{ $t('jeLiTerenSpremanZaIgru', { name: court.name }) }}
          </div>
          <ValidationProvider name="Funkcija" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="court.is_active" :native-value="true"> {{ $t('spreman') }} </b-radio>
              <b-radio v-model="court.is_active" :native-value="false"> {{ $t('nijeSpreman') }} </b-radio>
            </div>
          </ValidationProvider>
          <div class="fw600 has-text-centered m-b-7 m-t-20 is-size-55 line-height-16">
            {{ $t('prikaiTerenNaStraniciTenisplus') }}
          </div>
          <ValidationProvider name="Prikaz" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="court.show_on_tenisplus" :native-value="true"> {{ $t('da') }} </b-radio>
              <b-radio v-model="court.show_on_tenisplus" :native-value="false">{{ $t('ne') }}</b-radio>
            </div>
          </ValidationProvider>

          <div class="fw600 has-text-centered m-b-15 m-t-20 is-size-55 line-height-16">
            {{ $t('unesiFotografijuTerenaOpcija') }}
          </div>
          <div class="">
            <photoUpload stencil="rectangle-stencil" :aspect-ratio="2.35" @update="court.image = $event"></photoUpload>
          </div>

          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">
            {{ $t('jeLiVanjskiIliUnutranjiTeren', { name: court.name }) }}
          </div>
          <ValidationProvider name="Vrsta terena" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="court.type" native-value="open"> {{ $t('vanjski') }} </b-radio>
              <b-radio v-model="court.type" native-value="closed"> {{ $t('unutarnji') }} </b-radio>
            </div>
          </ValidationProvider>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">
            {{ $t('imaLiTerenReflektore', { name: court.name }) }}
          </div>
          <ValidationProvider name="Vrsta terena" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="court.lights" :native-value="true"> {{ $t('ima') }} </b-radio>
              <b-radio v-model="court.lights" :native-value="false"> {{ $t('nema') }} </b-radio>
            </div>
          </ValidationProvider>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">
            {{ $t('eliteLiPotvrditiRezervacijuTerenaZaNeLanoveKluba') }}
          </div>
          <ValidationProvider name="Vrsta terena" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="court.reservation_confirmation" :native-value="true"> {{ $t('da') }} </b-radio>
              <b-radio v-model="court.reservation_confirmation" :native-value="false">
                {{ $t('ne') }}
              </b-radio>
            </div>
          </ValidationProvider>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">{{ $t('kojaJeVrstaPodloge') }}</div>
          <div class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="surface in surfaces"
                  :key="surface.id"
                  :class="court.surface.id === surface.id ? 'active' : ''"
                  class="action__item__small fw600"
                  @click="court.surface = surface"
                >
                  {{ $t(surface.title) }}
                </div>
              </div>
            </transition>
          </div>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">
            {{ $t('eliteLiOmoguitiRezervacijeTerenaNaPuniSatIli30Minu') }}
          </div>
          <ValidationProvider name="Vrsta terena" class="radio__box" rules="required">
            <div class="block">
              <b-radio v-model="court.reservation_duration" :native-value="30"> {{ $t('30Minuta') }} </b-radio>
              <b-radio v-model="court.reservation_duration" :native-value="60"> {{ $t('naPuniSat') }} </b-radio>
              <b-radio v-model="court.reservation_duration" :native-value="90"> {{ $t('90Minuta') }} </b-radio>
            </div>
          </ValidationProvider>
          <div v-if="court.reservation_duration === 30" class="has-text-centered">
            <img src="/hole_30min.png" class="m-t-30 mw80" alt="" />
            <div class="fw600 has-text-centered m-b-20 m-t-10 is-size-6 line-height-12">
              {{ $t('jeLiMogueRezerviratiTerenADaOstaneRupaOd30Minuta') }}
              <span class="is-size-6 has-text-lightblue">{{ $t('vidiSlikuGore') }}</span>
            </div>
            <ValidationProvider name="Vrsta terena" class="radio__box__center" rules="required">
              <div class="block">
                <b-radio v-model="court.reservation_hole" :native-value="true"> {{ $t('da') }} </b-radio>
                <b-radio v-model="court.reservation_hole" :native-value="false">
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
          </div>
          <div class="buttons m-t-30">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/courts')"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              :class="['m-l-10 fw600', nextArrow ? '' : 'blur_button']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="saveCourt"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <b-steps v-model="activeStep" :has-navigation="false" :animated="true">
            <b-step-item has-navigation="true" step="1" :label="$t('radnoVrijemeICijene')" class="m-t-10">
              <div class="buttons m-t--10">
                <b-button
                  class="softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="copy"
                  rounded
                  @click="
                    isModaSelectActive = true
                    is_copied_working_hours = true
                  "
                >
                  {{ $t('kopirajPodatkeDrugogTerena') }}
                </b-button>
              </div>
              <div class="buttons">
                <b-button
                  class="fw600"
                  type="is-danger"
                  pack="fal"
                  icon-right="plus-circle"
                  rounded
                  @click.prevent="activeStep++"
                >
                  {{ $t('dodaj') }}
                </b-button>
              </div>
              <div class="activity__reservation">
                <div class="activity__box action__buttons m-b-15">
                  <div
                    v-for="item in court.working_hours"
                    :key="item"
                    class="action__item fw600"
                    @click="deleteWorkingHour(item.id)"
                  >
                    {{ item.cron | parseCron('days') }} — {{ item.cron | parseCron('hours') }}
                    <span class="x-tag--medium primary-light m-l-auto m-r-5">{{
                      $t('key5', { currency: item.price }) | currency
                    }}</span>
                    <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                  </div>
                </div>
              </div>
              <div v-if="court.working_hours.length < 1" class="fw600 has-text-centered m-b-15">
                {{ $t('naGumbDodajUnositeRadneDaneTerenaIOdgovarajueCijen') }}
              </div>
              <div v-else class="fw600 has-text-centered m-t-20">
                {{ $t('sviPodaciSuUneseniKlikomNaGumbNieTerenBitiSpremlje') }}
              </div>
            </b-step-item>
            <b-step-item has-navigation="false" step="2" :label="$t('odaberiDane')" class="m-t-10" :clickable="true">
              <div class="activity__reservation">
                <div class="fw600 has-text-centered m-b-15">
                  {{ $t('oznaiteDaneKojiEDijelitiIstuCijenuIRadnoVrijeme') }}
                </div>
                <div class="buttons m-t-20">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="fal"
                    rounded
                    @click="selected_days = ['1', '2', '3', '4', '5', '6', '7']"
                  >
                    {{ $t('odaberiSveDane') }}
                  </b-button>
                </div>

                <div class="activity__box action__buttons">
                  <div
                    v-for="(day, key) in days"
                    :key="'hour' + key"
                    :class="getClassDay(key)"
                    class="action__item__small fw600"
                    @click="selectDay(key)"
                  >
                    {{ day }}
                  </div>
                </div>
              </div>
            </b-step-item>
            <b-step-item step="3" :label="$t('odaberiVrijeme')">
              <div class="activity__reservation">
                <div class="fw600 has-text-centered m-b-15">{{ $t('oznaiteSateKojiEImatiJednakuCijenu') }}</div>
                <div class="activity__box action__buttons">
                  <div
                    v-for="(hour, index) in hours"
                    :key="index"
                    :class="getClassHour(hour)"
                    class="action__item__small fw600"
                    @click="selectHour(hour)"
                  >
                    {{ hour | parseTime() }}
                  </div>
                </div>
              </div>
            </b-step-item>
            <b-step-item step="4" :label="$t('Cijena')">
              <div class="fw600 has-text-centered m-b-15">
                {{
                  $t('upiiteCijenuRezervacijeZa', {
                    expr: court.reservation_duration === 30 ? 'pola sata' : 'sat vremena',
                  })
                }}
              </div>
              <ValidationProvider v-slot="{ errors, valid }" name="Cijena" rules="required">
                <b-field class="login__input__container" :type="valid ? 'is-success' : 'is-danger'" :message="errors">
                  <b-numberinput
                    v-model="price"
                    :placeholder="0"
                    type="is-white"
                    rounded
                    controls-rounded
                  ></b-numberinput>
                </b-field>
              </ValidationProvider>
            </b-step-item>
          </b-steps>
          <div v-if="activeStep !== 0" class="buttons m-t-30">
            <b-button
              class="m-l-10 fw600"
              type="is-danger"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click.prevent="activeStep--"
            >
              {{ $t('nazad') }}
            </b-button>
            <b-button
              v-if="activeStep !== 3"
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click.prevent="activeStep++"
            >
              {{ $t('dalje') }}
            </b-button>
            <b-button
              v-else
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              @click.prevent="submitWorkingHours"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
          <div v-show="activeStep === 0" class="buttons m-t-30">
            <b-button
              :class="['m-l-10 fw600', finalSave ? '' : 'blur_button']"
              type="is-primary"
              size="is-large"
              pack="fal"
              icon-right="check"
              rounded
              @click="finish"
            >
              {{ $t('spremiTeren') }}
            </b-button>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>

    <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
      <modalSelect
        :options="courts"
        :title="$t('popisTerena')"
        :subtitle="$t('Odaberite teren čije podatke želite kopirati')"
        @update="copyData($event)"
      ></modalSelect>
    </b-modal>
  </div>
</template>
<script>
import _ from 'lodash'
import WorkingHours from '@/models/WorkingHours'
import Sport from '@/models/Sport'
import hero from '~/components/Hero'
import photoUpload from '~/components/photoUpload'
import indicator from '~/components/Indicator'
import Court from '~/models/Court'
import modalSelect from '~/components/modal/ModalSelectCourtCopyData'

export default {
  name: 'NewCourt',
  components: {
    hero,
    photoUpload,
    modalSelect,
    indicator,
  },
  filters: {
    parseTime(hours) {
      return hours + ':00 - ' + (hours + 1) + ':00' + ' h'
    },
    parseCron(value, type) {
      const cron = value.split(' ')
      if (type === 'days') {
        if (cron[4] === '*') {
          return 'Svaki dan'
        }
        return cron[4]
          .replace('0', 'Ned')
          .replace('1', 'Pon')
          .replace('2', 'Uto')
          .replace('3', 'Sri')
          .replace('4', 'Čet')
          .replace('5', 'Pet')
          .replace('6', 'Sub')
          .replace('7', 'Ned')
      }
      if (type === 'hours') {
        const hours = cron[1].split('-')
        return hours[0] + ':00 - ' + hours[1] + ':00'
      }
      return value
    },
  },
  async fetch() {
    await this.getSurfaces()
    await this.getCourts()
    await this.getSports()
  },
  data() {
    return {
      indicator: {
        tabs: 8,
        steps: 3,
      },
      heroImage: '/hero_courts.jpg',
      isModaSelectActive: false,
      isModalConfirmation: false,
      hasNavigation: false,
      activeStep: 0,
      activeTab: 0,
      selected_date: this.$moment(),
      surfaces: '',
      courts: [],
      name: '',
      id: null,
      is_copied_working_hours: false,
      court: {
        name: '',
        reservation_duration: null,
        reservation_hole: true,
        reservation_confirmation: false,
        show_on_tenisplus: true,
        surface: {},
        is_active: true,
        order: 0,
        type: '',
        image: '',
        lights: '',
        working_hours: [],
        sports: [],
      },
      days: { 1: 'Ponedjeljak', 2: 'Utorak', 3: 'Srijeda', 4: 'Četvrtak', 5: 'Petak', 6: 'Subota', 7: 'Nedjelja' },
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      selected_days: [],
      selected_hours: [],
      selected_types: [],
      sports: [],
      price: null,
      disabled: true,
    }
  },
  computed: {
    nextArrow() {
      if (this.activeTab === 0 && this.court.name) {
        return true
      }
      if (this.activeTab === 1) {
        return true
      }
      if (this.activeTab === 2 && this.court.type) {
        return true
      }
      if (this.activeTab === 3 && this.court.lights !== '') {
        return true
      }
      if (this.activeTab === 4 && this.court.reservation_confirmation !== '') {
        return true
      }
      if (this.activeTab === 5 && Object.keys(this.court.surface).length) {
        return true
      }
      if (this.activeTab === 6 && this.court.reservation_duration) {
        return true
      }
      if (this.activeTab === 7) {
        return false
      } else {
        return false
      }
    },
    finalSave() {
      if (this.activeTab === 7 && this.court.working_hours.length) {
        return true
      } else {
        return false
      }
    },
    club() {
      return this.$store.state.club
    },
    sortedSelectedHours() {
      return _.sortBy(this.selected_hours)
    },
  },
  methods: {
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    copyData(data) {
      if (this.is_copied_working_hours) {
        Object.assign(this.court.working_hours, data.working_hours)
        const court = new Court(this.court)
        const hours = new WorkingHours({ working_hours: this.court.working_hours }).for(court)
        hours
          .save()
          .then(() => {
            this.getCourt()
            this.selected_days = []
            this.selected_hours = []
            this.price = 0
            this.activeStep = 0
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste unijeli cijene'),
              type: 'is-success',
            })
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
      this.$buefy.toast.open({
        message: this.$t('Uspješno ste kopirali podatke terena') + ' ' + '"' + data.name + '"',
        type: 'is-success',
      })
      this.disabled = false
      this.id = this.court.id
      this.name = this.court.name
      Object.assign(this.court, data)
      this.court.id = this.id
      this.court.name = this.name
    },
    getCourt() {
      Court.find(this.court.id).then((res) => {
        this.court = res
      })
    },
    getCourts() {
      Court.get().then((res) => {
        this.courts = res.data
      })
    },
    getSports() {
      Sport.get().then((res) => {
        this.sports = res
      })
    },
    saveCourt() {
      const court = new Court(this.court)
      court.save().then((res) => {
        this.court = res
        this.activeTab++
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste spremili novi teren. Unesite radno vrijeme i cijene'),
          type: 'is-success',
        })
      })
    },
    selectDay(item) {
      if (_.indexOf(this.selected_days, item) > -1) {
        this.selected_days.splice(_.indexOf(this.selected_days, item), 1)
      } else {
        this.selected_days.push(item)
      }
    },
    getClassDay(item) {
      return {
        active: _.indexOf(this.selected_days, item) > -1,
      }
    },
    selectType(item) {
      if (_.indexOf(this.court.sports, item) > -1) {
        this.court.sports.splice(_.indexOf(this.court.sports, item), 1)
      } else {
        this.court.sports.push(item)
      }
    },
    getClassType(item) {
      return {
        active: _.indexOf(this.court.sports, item) > -1,
      }
    },
    selectHour(item) {
      const inRangeSelectedHour = _.inRange(
        item,
        this.sortedSelectedHours[0],
        this.sortedSelectedHours[this.sortedSelectedHours.length - 1]
      )
      if (inRangeSelectedHour) {
        this.selected_hours.pop()
      }
      if (_.indexOf(this.selected_hours, item) > -1) {
        this.selected_hours.splice(_.indexOf(this.selected_hours, item), 1)
      } else {
        this.selected_hours.push(item)
      }
    },
    getClassHour(item) {
      const inRangeSelectedHour = _.inRange(
        item,
        this.sortedSelectedHours[0],
        this.sortedSelectedHours[this.sortedSelectedHours.length - 1]
      )
      return {
        active: _.indexOf(this.selected_hours, item) > -1 || inRangeSelectedHour,
      }
    },
    finish() {
      this.$router.push(this.localePath('/admin/courts'))
      this.$buefy.toast.open({
        message: this.$t('Uspješno ste spremili teren'),
        type: 'is-success',
      })
    },
    submitWorkingHours() {
      const court = new Court(this.court)
      const hours = new WorkingHours({
        days: this.selected_days,
        hours: this.selected_hours,
        price: this.price,
      }).for(court)
      hours
        .save()
        .then(() => {
          this.getCourt()
          this.selected_days = []
          this.selected_hours = []
          this.price = 0
          this.activeStep = 0
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli cijene'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    deleteWorkingHour(id) {
      const court = new Court(this.court)
      const hours = new WorkingHours({ id }).for(court)
      hours
        .delete()
        .then(() => {
          // TODO: refactor
          this.court.working_hours = _.filter(this.court.working_hours, (h) => {
            return h.id !== id
          })
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali unos'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    getSurfaces() {
      this.$axios.get('surfaces').then((res) => {
        this.surfaces = res.data
      })
    },
  },
}
</script>
