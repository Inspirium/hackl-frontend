<template>
  <div>
    <hero>
      <h1 class="has-text-white">{{ $t('teren2', { name: court.name }) }}</h1>
    </hero>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered">
      <b-tab-item :label="$t('podaci')">
        <div class="x-container registration">
          <div v-if="$auth.user.is_admin" class="buttons">
            <b-button
              class="m-t-30 softshadow"
              type="is-primary"
              pack="fal"
              icon-right="copy"
              rounded
              tag="nuxt-link"
              :to="localePath('/admin/court-new')"
            >
              {{ $t('kopirajPodatkeDrugogTerena') }}
            </b-button>
          </div>
          <form @submit.prevent="submit">
            <ValidationProvider v-slot="{ errors, valid }" name="Naziv terena" rules="required">
              <b-field
                :label="$t('nazivTerena')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="court.name" size="is-medium" :placeholder="$t('upiiNazivTerena')" type="text" rounded>
                </b-input>
              </b-field>
            </ValidationProvider>
            <div class="label">{{ $t('terenUFunkciji') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Funkcija" class="radio__box">
              <div class="block">
                <b-radio v-model="court.is_active" :type="valid ? 'is-success' : 'is-danger'" :native-value="true">
                  {{ $t('uFunkciji') }}
                </b-radio>
                <b-radio v-model="court.is_active" :type="valid ? 'is-success' : 'is-danger'" :native-value="false">
                  {{ $t('nijeUFunkciji') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('vrstaTerena') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Vrsta terena" class="radio__box">
              <div class="block">
                <b-radio v-model="court.type" :type="valid ? 'is-success' : 'is-danger'" native-value="open">
                  {{ $t('otvoren') }}
                </b-radio>
                <b-radio v-model="court.type" :type="valid ? 'is-success' : 'is-danger'" native-value="closed">
                  {{ $t('zatvoren') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('reflektori') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Reflektori" class="radio__box">
              <div class="block">
                <b-radio v-model="court.lights" :type="valid ? 'is-success' : 'is-danger'" :native-value="true">
                  {{ $t('imaReflektore') }}
                </b-radio>
                <b-radio v-model="court.lights" :type="valid ? 'is-success' : 'is-danger'" :native-value="false">
                  {{ $t('nemaReflektore') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('rezervacije') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Rezervacije" class="radio__box">
              <div class="block">
                <b-radio
                  v-model="court.reservation_duration"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :native-value="60"
                >
                  {{ $t('naPuniSat') }}
                </b-radio>
                <b-radio
                  v-model="court.reservation_duration"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :native-value="30"
                >
                  {{ $t('na30Minuta') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('vrstaPodloge') }}</div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="surface in surfaces"
                    :key="surface"
                    :class="court.surface === surface ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="court.surface = surface"
                  >
                    {{ $t(surface.title) }}
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="$auth.user.is_admin" class="buttons">
              <b-button
                class="m-t-15"
                type="is-danger"
                pack="fal"
                icon-right="times-circle"
                rounded
                @click="deleteCourt"
              >
                {{ $t('obriiOvajTeren') }}
              </b-button>
            </div>
            <div class="buttons m-t-40">
              <b-button type="is-danger" rounded @click="activeTab = 0"> {{ $t('odustani') }} </b-button>
              <b-button type="is-primary" rounded :native-type="submit" @click.prevent="submit">
                {{ $t('spremi') }}
              </b-button>
            </div>
          </form>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('cijene')">
        <b-steps v-model="activeStep" :has-navigation="hasNavigation" animated="true">
          <b-step-item
            has-navigation="false"
            step="1"
            :label="$t('popisCijena')"
            class="m-t-10"
            :clickable="isStepsClickable"
          >
            <div class="activity__reservation">
              <div class="activity__box action__buttons">
                <div
                  v-for="hour in court.working_hours"
                  :key="hour"
                  :class="getClassDay(day)"
                  class="action__item__small fw600"
                  @click="selectDay(day)"
                >
                  {{
                    $t('h2', { parseCron: hour.cron | parseCron('days'), parseCron_2: hour.cron | parseCron('hours') })
                  }}
                  <span class="x-tag primary-light m-l-auto m-r-5">{{
                    $t('key5', { currency: hour.price }) | currency
                  }}</span>
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                </div>
              </div>
            </div>
          </b-step-item>
          <b-step-item
            has-navigation="false"
            step="2"
            :label="$t('odaberiDane')"
            class="m-t-10"
            :clickable="isStepsClickable"
          >
            <div class="activity__reservation">
              <div class="activity__box action__buttons">
                <div
                  v-for="(day, index) in days"
                  :key="day"
                  :class="getClassDay(index)"
                  class="action__item__small fw600"
                  @click="selectDay(index)"
                >
                  {{ day }}
                </div>
              </div>
            </div>
          </b-step-item>

          <b-step-item step="3" :label="$t('odaberiVrijeme')">
            <div class="activity__reservation">
              <div class="activity__box action__buttons">
                <div
                  v-for="hour in hours"
                  :key="hour"
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
            <ValidationProvider v-slot="{ errors, valid }" name="Cijena" rules="required">
              <b-field class="login__input__container" :type="valid ? 'is-success' : 'is-danger'" :message="errors">
                <b-numberinput v-model="price" type="is-white" rounded controls-rounded></b-numberinput>
              </b-field>
            </ValidationProvider>
          </b-step-item>

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
              @click.prevent="saveCourt"
            >
              {{ $t('spremi') }}
            </b-button>
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              @click.prevent="submitWorkingHours"
            >
              {{ $t('spremiVrijeme') }}
            </b-button>
          </div>
          <div v-else class="buttons m-t-30">
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="plus-circle"
              rounded
              @click.prevent="activeStep++"
            >
              {{ $t('dodaj') }}
            </b-button>
          </div>
        </b-steps>
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script>
import _ from 'lodash'
import Court from '~/models/Court'
import hero from '~/components/Hero'

export default {
  name: 'AdminCourt',
  components: {
    hero,
  },
  filters: {
    parseTime(hours) {
      return hours + ':00 - ' + (hours + 1) + ':00' + ' h'
    },
  },
  async fetch() {
    await this.getCourt()
    await this.getSurfaces()
  },
  data() {
    return {
      hasNavigation: false,
      activeStep: 0,
      selected_date: this.$moment(),
      surfaces: '',
      court: {
        name: '',
        reservation_duration: null,
        surface: {},
        is_active: true,
        type: '',
        lights: false,
        working_hours: [],
      },
      days: ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'],
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      selected_days: [],
      selected_hours: [],
      price: 0,
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    saveCourt() {
      if (this.$route.params.id) {
        this.$axios.put('admin/court/' + this.$route.params.id, this.court).then((res) => {
          this.submitWorkingHours()
          this.court = res.data
        })
      } else {
        this.$axios.post('admin/court', this.court).then((res) => {
          this.submitWorkingHours()
          this.$router.push(this.localePath('/admin/court/' + res.data.id))
        })
      }
    },
    deleteCourt() {
      const r = new Court(this.court)
      r.delete().then(() => {
        this.$router.push(this.localePath('/admin/courts/'))
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali novi teren'),
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
    selectHour(item) {
      if (_.indexOf(this.selected_hours, item) > -1) {
        this.selected_hours.splice(_.indexOf(this.selected_hours, item), 1)
      } else {
        this.selected_hours.push(item)
      }
    },
    getClassHour(item) {
      return {
        active: _.indexOf(this.selected_hours, item) > -1,
      }
    },
    submitWorkingHours() {
      this.$axios
        .post('admin/court/' + this.court.id + '/hours', {
          days: this.selected_days,
          hours: this.selected_hours,
          price: this.price,
        })
        .then((res) => {
          this.court.working_hours.push(res.data)
          this.selected_days = []
          this.selected_hours = []
          this.price = 0
        })
    },
    getSurfaces() {
      this.$axios.get('surfaces').then((res) => {
        this.surfaces = res.data
      })
    },
    getCourt() {
      Court.find(this.$route.params.id).then((res) => {
        this.court = res
      })
    },
  },
}
</script>
