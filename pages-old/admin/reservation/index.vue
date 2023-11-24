<template>
  <div v-if="true" class="home__reservation">
    <PageHeader :title="$t('Rezervacije')"></PageHeader>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="m-t-0">
      <b-tab-item v-if="true" :label="$t('lanovi')" class="p-b-100">
        <adminReservationsUser />
      </b-tab-item>
      <b-tab-item :label="$t('Kategorije')" class="p-b-100">
        <div class="filters container">
          <div class="filter">
            <div class="fw600 has-text-centered w100 m-b-10 has-text-lightblue is-size-6">
              {{ $t('Filtriraj po terenu') }}
            </div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalCourtFilter = true">
                {{ courtFilter.selectedId === null ? $t('Prikaži sve') : courtFilter.selectedCourt.name }}
              </b-button>
            </div>
          </div>
        </div>
        <div class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">
          {{ $t('Filtriraj po kategoriji') }}
        </div>

        <div v-if="category.length" class="buttons m-t-15 m-b-5">
          <b-button
            v-for="(item, index) in category"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': selectedCategory === item.name }"
            :icon-right="selectedCategory === item.name ? 'times' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedCategory === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="updateCategory(item)"
          >
            {{ item.name }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t-5"></div>
        <div class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">
          {{ $t('Filtriraj po vremenu') }}
        </div>
        <div class="buttons m-t-15">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedTime === 'future' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedTime === 'future',
            }"
            pack="fal"
            rounded
            @click="
              selectedTime = 'future'
              loadReservations()
            "
          >
            {{ $t('Prikaži aktivne') }}
          </b-button>

          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedTime === 'past' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedTime === 'past',
            }"
            pack="fal"
            rounded
            @click="
              selectedTime = 'past'
              loadReservations()
            "
          >
            {{ $t('Unesi raspon') }}
          </b-button>
        </div>
        <div v-if="selectedTime === 'past'" class="x-container m-t--16 m-b-10">
          <TimeRange :default-selected="'this_month'" @timespan="timerange($event)" />
        </div>
        <div class="divider-line-1 m-t-0"></div>
        <div class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">
          {{ $t('Pretraži') }}
        </div>
        <div class="search container m-t-10 p-t-0">
          <b-field>
            <b-input
              id="inputsearch"
              v-model="search_term"
              :placeholder="$t('Pretraži po imenu')"
              type="search"
              pack="far"
              :icon-right="search_icon"
              icon-right-clickable
              @icon-right-click="search_term = ''"
            >
            </b-input>
          </b-field>
        </div>

        <div v-if="total" class="buttons m-t-10">
          <b-button class="softshadow m-t-10 m-b-10" type="is-small noborder" pack="fal" rounded @click="selectAll()">
            {{ reservations.length === checkedRows.length ? $t('Poništi') : $t('Označi sve') }}
          </b-button>
          <b-button
            :class="{ blur_button: checkedRows.length === 0 }"
            class="m-t-10 m-b-10 softshadow invert-small-button"
            type="is-small noborder is-danger has-text-white"
            pack="fal"
            icon-right="times-circle"
            rounded
            :loading="loadingDelete"
            @click.stop="isModalActive = true"
          >
            {{ $t('Obriši') + ' ' + ' (' + checkedRows.length + ')' }}
          </b-button>
        </div>
        <div v-if="reservations.length > 0" class="m-t-15 m-b-5 fw600 is-size-4 has-text-centered">
          {{ $t('Ukupno rezervacija') }}:
          <span v-if="total" class="has-text-lightblue">{{ total }}</span>
        </div>
        <!--        <div v-if="reservations.length > 0" class="m-b-10 fw600 is-size-6 has-text-centered">-->
        <!--          {{ $t('Ukupno sati') }}:-->
        <!--          <span v-if="reservationMeta.total_minutes" class="has-text-lightblue"-->
        <!--            >{{ reservationMeta.total_minutes / 60 }} {{ $t('h') }}</span-->
        <!--          >-->
        <!--        </div>-->
        <div class="x-container p-b-100 relative">
          <div class="activity__box">
            <div class="tablelist" :class="{ blur_button: loadingActive }">
              <b-table
                :data="reservations"
                :checkbox-position="checkboxPosition"
                :checked-rows.sync="checkedRows"
                :bordered="false"
                :mobile-cards="false"
                checkbox-type="is-info"
                checkable
              >
                <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
                  <a @click="selectIt(props.row)">
                    <div class="list__content">
                      <div class="fw600 is-size-65 m-r-10 align__centar__x flex__column w100">
                        <span class="has-text-lightblue"
                          >{{ $moment(reservations[props.index].from).format('Do' + 'MM' + ', ' + 'ddd') }} •
                          {{
                            $moment(reservations[props.index].from).format('LT') +
                            ' — ' +
                            $moment(reservations[props.index].to).format('LT')
                          }}</span
                        >
                        <span class="fw600 has-text-black80 is-size-6"
                          >{{ props.row.category.name }} {{ props.row.name ? '— ' + props.row.name : '' }}</span
                        >
                        <div class="has-text-black50 m-t-2">
                          {{ $t('Rezervirao') }}:
                          <span class="">{{ reservations[props.index].created_by.display_name }}</span>
                        </div>
                      </div>
                    </div>
                    <b-tag v-if="props.row.court" type="is-info">{{ props.row.court.name }}</b-tag>
                    <b-tag v-else type="is-danger">{{ $t('Obrisan teren') }}</b-tag>
                  </a>
                </b-table-column>
                <template v-if="!reservations.length && !loadingActive">
                  <div class="has-text-centered m-t-20">
                    <b-icon icon="calendar-times" size="is-medium" type="is-danger" pack="fal"></b-icon>
                    <div class="m-t-5 m-b-5 fw600 is-size-6 has-text-centered">{{ $t('nemaRezervacija') }}</div>
                  </div>
                </template>
              </b-table>
            </div>
          </div>
          <template v-if="loadingActive">
            <transition name="fade">
              <div class="align__centar__x loading_z_spinner--bottom m-t-20">
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
        </div>
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalCourtFilter" :width="640" scroll="clip">
      <modal-options
        :title="$t('tereni')"
        :subtitle="$t('Filtriraj rezervacije po terenu')"
        @update="
          courtFilter = $event
          offset = 1
          reservations = []
          loadReservations()
        "
      ></modal-options>
    </b-modal>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('jesteLiSigurni')"
        :subtitle="$t('Potvrdom ćete obrisati sve označene rezervaciju')"
        @update="deleteReservation"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import adminReservationsUser from '~/components/court/adminReservationsUser'
import ModalOptions from '~/components/modal/ModalOptionsReservationCourtFilter'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'
import ReservationCategory from '~/models/ReservationCategory'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'Reservation',
  components: {
    modalConfirmation,
    ModalOptions,
    PageHeader,
    adminReservationsUser,
    TimeRange,
  },
  data() {
    return {
      courtFilter: {
        selectedId: null,
        selectedCourt: {},
      },
      isModalActive: false,
      isModalCourtFilter: false,
      isModalMembersActive: false,
      reservations: [],
      reservationMeta: {},
      pastReservations: [],
      pastReservationsMeta: {},
      checkedRows: [],
      checkboxPosition: 'left',
      date: this.$moment(),
      loading: false,
      loadingDelete: false,
      loadingPast: false,
      loadingActive: false,
      player: {},
      nomore: false,
      total: 0,
      last_page: 1,
      bottom: '',
      offset: 1,
      activeTab: 0,
      reservationTimeRange: '',
      category: [],
      selectedCategory: 'all',
      search_term: '',
      selectedTime: 'future',
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
    basicMembership() {
      return this.memberships.filter((item) => {
        return item.basic
      })
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
  },
  watch: {
    search_term(term) {
      this.nomore = false
      if (term.length) {
        this.offset = 1
        this.debouncedGetPlayers()
      } else {
        this.loadReservations()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.loadReservations()
      }
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.loadReservations, 500)
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getPlayer()
    this.loadReservations()
    this.getReservation()
  },
  methods: {
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
        this.pastReservations = []
        this.loadReservations()
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
        this.pastReservations = []
        this.loadReservations()
      } else {
        this.reservationTimeRange = item
        this.pastReservations = []
        this.loadReservations()
      }
    },
    updateCategory(item) {
      this.selectedCategory !== item.name ? (this.selectedCategory = item.name) : (this.selectedCategory = 'all')
      this.search_term = ''
      this.offset = 1
      this.reservations = []
      this.loadReservations()
    },
    getReservation() {
      this.loading = true
      ReservationCategory.get().then((res) => {
        this.category = res.data
      })
    },
    getPlayer() {
      Player.find(2).then((res) => {
        this.player = res
      })
    },
    selectIt(item) {
      if (_.includes(this.checkedRows, item)) {
        this.checkedRows.splice(_.indexOf(this.item, item), 1)
      } else {
        this.checkedRows.push(item)
      }
    },
    selectAll() {
      if (this.reservations.length === this.checkedRows.length) {
        this.checkedRows = []
      } else {
        this.checkedRows = this.reservations
      }
    },
    deleteReservation() {
      this.loadingDelete = true
      this.$axios
        .post('v2/reservation/deleteMany', { reservations: this.checkedRows })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali rezervacije'),
            type: 'is-success',
          })
          this.offset = 1
          this.loadReservations()
          this.checkedRows = []
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadReservations()
          this.loadingDelete = false
        })
    },
    loadReservations() {
      if (this.last_page < this.offset) return
      this.loadingActive = true
      const r = Reservation.page(this.offset)
      if (this.selectedTime === 'past') {
        r.where('active_between', this.reservationTimeRange)
      } else {
        r.where('from', this.today)
      }
      r.where('court', this.courtFilter.selectedId)
        .where('category', this.selectedCategory)
        .where('name', this.search_term)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.reservations = res.data
          } else {
            this.reservations = [...this.reservations, ...res.data]
          }
          if (res.meta.last_page === this.offset) {
            this.nomore = true
          }
          this.total = res.meta.total
          this.reservationMeta = res.meta
          this.last_page = res.meta.last_page
          this.loadingActive = false
        })
        .catch(() => {
          this.loadingActive = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
