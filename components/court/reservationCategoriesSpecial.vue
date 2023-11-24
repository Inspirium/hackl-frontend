<template>
  <div>
    <b-tabs v-model="activeTabStrings" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item>
        <div v-if="category.length" class="tablelist">
          <div class="fw600 is-size-55 m-t-20 m-b-5">{{ $t('popisKategorijaTermina') }}</div>
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="(item, index) in category"
                :key="item.id"
                class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation"
                :class="{ selected_payee: selected_category === index }"
                @click="sendEmit(item, index)"
              >
                <div class="fw600 align__centar__all">
                  <div class="list__content">
                    <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>
                    <h3 class="fw600 m-t--2 has-text-black80 is-size-65">{{ item.description }}</h3>
                    <div class="has-text-black80 fw600 is-size-65 m-l-auto nowrap">
                      {{ $t('boja') }} <span :style="`backgroundColor: ${item.color}`" class="color-indicator"></span>
                    </div>
                    <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                      {{ $t('oznaka') }}
                      <span :class="item.is_paid ? 'has-text-lightblue' : 'has-text-danger'">{{
                        item.is_paid ? 'Plaćeno' : 'Nije plaćeno'
                      }}</span>
                    </div>
                  </div>
                  <div class="" @click="action(index)">
                    <b-icon
                      :icon="selected_category === index ? 'user-edit' : 'times-circle'"
                      :type="selected_category === index ? 'is-white' : 'is-danger'"
                      :size="selected_category === index ? 'is-medium' : ''"
                      pack="fal"
                      class="m-r-10"
                    >
                    </b-icon>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="buttons m-t-20">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fas"
              icon-right="plus"
              rounded
              @click="
                activeTabStrings = 1
                isEditing = false
                Object.assign(newCategory, newCategoryPlaceholder)
              "
            >
              {{ $t('unesiKategoriju') }}
            </b-button>
          </div>
        </div>

        <div v-else class="flex flex__column align__centar__y m-t-30">
          <template v-if="true">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <div class="fw600 is-size-5 has-text-centered m-b-10 m-t-5">{{ $t('nemateUnesenihPosebnihTermina') }}</div>
            <div class="buttons m-t-10">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                @click="activeTabStrings = 1"
              >
                {{ $t('unesiNovuKategoriju') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="">
          <div class="fw600 is-size-5 has-text-centered has-text-lightblue m-t-20 m-b--10">
            {{ isEditing ? $t('Uredi kategoriju') : $t('Unesi novu kategoriju') }}
          </div>

          <div class="">
            <div class="label">{{ $t('atraktivniTermini') }}</div>
            <ValidationProvider name="Reservation" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="newCategory.is_attractive" :native-value="1"> {{ $t('da') }} </b-radio>
                <b-radio v-model="newCategory.is_attractive" :native-value="0"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
          </div>

          <template v-if="!newCategory.is_attractive">
            <ValidationProvider v-slot="{ errors, valid }" name="Naziv kategorije" rules="required">
              <b-field
                :label="$t('nazivKategorije')"
                class="login__input__container"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="newCategory.name"
                  :placeholder="$t('upiiNazivKategorije')"
                  type="text"
                  rounded
                ></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="Opis kategorije">
              <b-field :label="$t('opisKategorije')" class="login__input__container has-text-white">
                <b-input
                  v-model="newCategory.description"
                  :placeholder="$t('upiiOpisKategorije')"
                  type="text"
                  rounded
                ></b-input>
              </b-field>
            </ValidationProvider>
            <div class="">
              <div class="label">{{ $t('oznaiTerminePlaene') }}</div>
              <ValidationProvider name="Freeze" rules="required" class="radio__box">
                <div class="block">
                  <b-radio v-model="newCategory.is_paid" :native-value="1"> {{ $t('da') }} </b-radio>
                  <b-radio v-model="newCategory.is_paid" :native-value="0"> {{ $t('ne') }} </b-radio>
                </div>
              </ValidationProvider>
            </div>
            <b-field :label="$t('odaberiBoju')" class="colorpicker-round">
              <b-colorpicker v-model="newCategory.color" class="radius__full" value="'#DCE0B5'" />
            </b-field>

            <div class="divider-line-1 m-t-15" />
            <div class="fw600 is-size-5 has-text-centered has-text-black80 m-t-20 m-b--10">
              {{ $t('tkoMoeRezerviratiTermine') }}
            </div>

            <div class="buttons m-t-30">
              <b-button
                v-for="(categorya, index) in [
                  'Svi',
                  'Sudionik lige',
                  'Sudionik turnira',
                  'Škola tenisa',
                  'Vrsta članstva',
                  'Tip korisnika',
                ]"
                :key="index"
                :class="{ softshadow: true, 'invert-small-button': selected_type === categorya }"
                :type="{
                  'is-mini': true,
                  noborder: true,
                  'is-primary has-text-white': selected_type === categorya,
                }"
                rounded
                @click="selected_type = categorya"
              >
                {{ categorya }}
              </b-button>
            </div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="(item, index) in selectedTypeReservation"
                    :key="index"
                    :class="selected_selected_type_reservation === item ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="selected_selected_type_reservation = item"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </transition>
            </div>
          </template>
          <div class="buttons m-t-40 m-b-5">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click="activeTabStrings = 0"
            >
              {{ $t('nazad') }}
            </b-button>
            <b-button
              v-if="isEditing"
              class="softshadow m-t-10 m-b-20 invert-small-button"
              type="is-small noborder is-danger has-text-white"
              pack="fal"
              icon-right="times"
              rounded
              @click="isModalConfirmationActive = true"
            >
              {{ $t('obrii') }}
            </b-button>

            <b-button
              class="softshadow m-t-10 m-b-20 invert-small-button"
              type="is-small noborder is-primary has-text-white"
              pack="fal"
              icon-right="check"
              rounded
              @click="submit()"
            >
              {{ $t('spremiKategoriju') }}
            </b-button>
          </div>

          <b-steps
            v-model="activeStepAttractive"
            :has-navigation="false"
            :animated="true"
            class="hide_step_navigation_impt"
          >
            <b-step-item has-navigation="false" step="1" class="m-t--20">
              <div class="divider-line-1 m-t-15" />
              <div class="activity__reservation p-b-75">
                <div class="fw600 is-size-5 has-text-centered has-text-black80 m-b-15 m-t-15">
                  {{ $t('unesiteRasponeDanaIVremena') }}
                </div>
                <div class="activity__box action__buttons m-b-15">
                  <div
                    v-for="(item, index) in court.working_hours"
                    v-show="item.membership_id === null"
                    :key="index"
                    class="action__item fw600"
                  >
                    {{ item.cron | parseCron('days') }}, {{ item.cron | parseCron('hours') }}
                    <div
                      class="m-l-auto"
                      @click="
                        itemId = item.id
                        isModalActive = true
                      "
                    >
                      <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                    </div>
                  </div>
                </div>
                <div class="buttons">
                  <b-button
                    class="softshadow"
                    type="is-small noborder"
                    pack="fas"
                    icon-right="plus"
                    rounded
                    @click.prevent="activeStepAttractive++"
                  >
                    {{ $t('unesiAtraktivneTermine') }}
                  </b-button>
                </div>
              </div>
            </b-step-item>
            <b-step-item
              has-navigation="false"
              step="2"
              :label="$t('odaberiDane')"
              class="m-t-10 x-container"
              :clickable="true"
            >
              <div class="activity__reservation">
                <div class="fw600 has-text-centered m-b-15">
                  {{ $t('oznaiteDaneKojiEDijelitiIstiRasponAtraktivnihTermi') }}
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
                    :key="key"
                    :class="getClassDay(key)"
                    class="action__item__small fw600"
                    @click="selectDay(key)"
                  >
                    {{ day }}
                  </div>
                </div>
              </div>
            </b-step-item>

            <b-step-item step="3" :label="$t('odaberiVrijeme')" class="x-container">
              <div class="activity__reservation">
                <div class="fw600 has-text-centered m-b-15">{{ $t('oznaiteAtraktivneTermine') }}</div>
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

            <div v-if="activeStepAttractive !== 0" class="buttons m-t-30 is-fixed">
              <b-button
                class="m-l-10 fw600"
                type="is-danger"
                pack="fal"
                icon-left="chevron-left"
                rounded
                @click.prevent="activeStepAttractive--"
              >
                {{ $t('nazad') }}
              </b-button>
              <b-button
                v-if="activeStepAttractive !== 2"
                class="m-l-10 fw600"
                type="is-primary"
                pack="fal"
                icon-right="chevron-right"
                rounded
                @click.prevent="activeStepAttractive++"
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

              <div class="buttons m-t-30">
                <b-button
                  class="m-l-10 fw600"
                  type="is-primary"
                  pack="fal"
                  icon-right="check"
                  rounded
                  @click.prevent="activeStepAttractive++"
                >
                  {{ $t('spremiPosebanTermin') }}
                </b-button>
              </div>
            </div>
          </b-steps>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiKategoriju')"
          :subtitle="$t('Potvrdom će kategorija biti obrisana')"
          @update="deleteProduct()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Club from '@/models/Club'
import Tournament from '@/models/Tournament'
import League from '@/models/League'
import _ from 'lodash'
import WorkingHours from '@/models/WorkingHours'
import WorkingHoursCategory from '~/models/WorkingHoursCategory'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import Media from '~/models/Media'
import Court from '~/models/Court'

export default {
  name: 'ReservationCategories',
  components: {
    modalConfirmation,
  },
  filters: {
    parseTime(hours) {
      return hours + ':00 - ' + (hours + 1) + ':00' + ' h'
    },
  },
  props: {
    court: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isModaSelectActive: false,
      isModalActive: false,
      activeStepAttractive: 0,
      hasNavigation: false,
      loading: false,
      loadingDelete: false,
      isLoaded: null,
      loadingMedia: false,
      activeTabStrings: 0,
      total: 0,
      category: [],
      selected_category: null,
      selected_type: 'Svi',
      selected_days: [],
      selected_hours: [],
      selected_selected_type_reservation: '',
      isModalConfirmationActive: false,
      newCategory: {
        name: '',
        description: '',
        color: '#DCE0B5',
        is_paid: 0,
        type: '',
        is_attractive: 0,
        selected_type: {},
      },
      newCategoryPlaceholder: {
        name: '',
        description: '',
        color: '#DCE0B5',
        is_paid: 0,
        type: '',
        is_attractive: 0,
        selected_type: {},
      },
      isEditing: false,
      memberships: [],
      tournament: [],
      league: [],
      type: [{ name: 'Administrator' }, { name: 'Trener' }],
      days: { 1: 'Ponedjeljak', 2: 'Utorak', 3: 'Srijeda', 4: 'Četvrtak', 5: 'Petak', 6: 'Subota', 7: 'Nedjelja' },
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      selectedCourt: {},
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    color() {
      return this.newCategory.color.toString('hex')
    },
    selectedTypeReservation() {
      switch (this.selected_type) {
        case 'Svi':
          return []
        case 'Sudionik lige':
          return this.league
        case 'Sudionik turnira':
          return this.tournament
        case 'Škola tenisa':
          return []
        case 'Vrsta članstva':
          return this.memberships.memberships
        case 'Tip korisnika':
          return this.type
      }
      return []
    },
    sortedSelectedHours() {
      return _.sortBy(this.selected_hours)
    },
  },
  watch: {},
  mounted() {
    this.getCategories()
    this.getClubs()
    this.getLeague()
    this.getTournament()
    this.getCourt()
  },
  methods: {
    getLeague() {
      const l = League.whereIn('status', ['0', '1', '2', '3', '4']).where('club', this.$store.state.club.id)
      l.get().then((res) => {
        this.league = res.data
      })
    },
    getTournament() {
      Tournament.whereIn('status', ['0', '1', '2', '3', '4'])
        .where('club', this.$store.state.club.id)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.tournament = res.data
        })
    },
    getClubs() {
      Club.include('memberships')
        .find(this.$store.state.club.id)
        .then((res) => {
          this.memberships = res
        })
    },
    action(index) {
      // if selected then edit category
      if (index !== this.selected_category) {
        this.isModalConfirmationActive = true
        this.selected_category = index
      } else {
        this.selected_category = index
        this.isEditing = true
        this.newCategory = this.category[this.selected_category]
        this.activeTabStrings = 1
      }
    },
    sendEmit(item, index) {
      this.selected_category = index
      this.$emit('string', item)
    },
    saveMedia(item) {
      this.newCategory.image = item
      this.loadingMedia = true
      const n = new Media({
        media: this.newCategory.image,
        title: this.newCategory.name ? this.newCategory.name : 'Fotografija proizvoda',
        description: this.newCategory.description ? this.newCategory.description : 'Fotografija proizvoda',
      })
      n.save()
        .then((res) => {
          this.newCategory.image_id = res.id
          this.loadingMedia = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingMedia = false
        })
    },
    getCategories() {
      this.loading = true
      const whc = WorkingHoursCategory
      whc.get().then((res) => {
        this.category = res.data
        this.loading = false
      })
    },
    deleteProduct() {
      this.loadingDelete = true
      const whc = new WorkingHoursCategory({ id: this.category[this.selected_category].id })
      whc
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali posebni termin'),
            type: 'is-success',
          })
          this.getCategories()
          this.loadingDelete = false
          this.activeTabStrings = 0
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
      const whc = new WorkingHoursCategory(this.newCategory)
      whc.club_id = this.club.id
      whc.color = this.color
      if (whc.is_attractive) {
        whc.name = 'Atraktivni termini'
      }
      whc
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili proizvod'),
            type: 'is-success',
          })
          this.getCategories()
          this.activeTabStrings = 0
          this.loading = false
          Object.assign(this.newCategory, this.newCategoryPlaceholder)
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    getCourt() {
      Court.find(this.$route.params.id).then((res) => {
        this.selectedCourt = res
      })
    },
    submitWorkingHours() {
      const court = new Court(this.selectedCourt)
      const hours = new WorkingHours({
        days: this.selected_days,
        hours: this.selected_hours,
        price: this.price,
        category: { id: this.category[this.selected_category].id },
      }).for(court)
      hours
        .save()
        .then(() => {
          this.getCourts()
          this.selected_days = []
          this.selected_hours = []
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli posebne termine'),
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
    getClassDay(item) {
      return {
        active: _.indexOf(this.selected_days, item) > -1,
      }
    },
    selectDay(item) {
      if (_.indexOf(this.selected_days, item) > -1) {
        this.selected_days.splice(_.indexOf(this.selected_days, item), 1)
      } else {
        this.selected_days.push(item)
      }
    },
  },
}
</script>
<style scoped>
.cropper {
  width: 100vw;
}
</style>
