<template>
  <div v-if="isAdmin || player.id === user.id" class="home__reservation">
    <PageHeader :title="$t('Rezervacije')"></PageHeader>
    <div v-if="Object.keys(player).length" class="tab__header align__centar__all m-b-10 m-t-20">
      <TennisImage :size="[42, 42]" :src="player.image" class="user_image m-r-10 border__white--2 softshadow2" alt="" />
      <div class="">{{ player.display_name }}</div>
    </div>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="m-t-0">
      <b-tab-item :label="$t('Aktivne')" class="p-b-100">
        <div class="filters container">
          <div class="filter">
            <div class="label m-t-0">{{ $t('odaberiTeren') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalCourtFilter = true">
                {{ courtFilter.selectedId === null ? $t('Prikaži sve') : courtFilter.selectedCourt.name }}
              </b-button>
            </div>
          </div>
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
            :loading="loading"
            @click.stop="isModalActive = true"
          >
            {{ checkedRows.length > 0 ? $t('Obriši') + ' (' + checkedRows.length + ')' : '' }}
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
            <div class="tablelist">
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
                      <div class="fw600 is-size-65 has-text-lightblue m-r-10 nowrap align__centar__x flex__column w100">
                        <span class="is-uppercase">{{
                          $moment(reservations[props.index].from).format('DD.' + 'MM.' + ', ' + 'dddd')
                        }}</span>
                        <span class="fw600 title-num is-size-6">{{
                          $moment(reservations[props.index].from).format('LT') +
                          ' — ' +
                          $moment(reservations[props.index].to).format('LT')
                        }}</span>
                        <span
                          v-if="reservations[props.index].court.club_id !== club.id"
                          class="is-size-65 has-text-black50 is-case-initial has-text-left m-t-0"
                        >
                          • {{ reservations[props.index].court.club.name }}
                        </span>

                        <div class="has-text-black50 m-t-2">
                          {{ $t('Rezervirao') }}:
                          <span class="">{{ reservations[props.index].created_by.display_name }}</span>
                        </div>
                        <div v-if="$store.state.club.id !== 26" class="has-text-black50">
                          {{ $t('klub') }}:
                          <span class="">{{ reservations[props.index].court.club.name }}</span>
                        </div>
                        <div v-if="!isCancelable(props.row)" class="fw600 has-text-danger">
                          {{ $t('Otkazivanje nije moguće') }}
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
      <b-tab-item :label="$t('Prošle')" class="p-b-100">
        <pastReservations />
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalCourtFilter" :width="640" scroll="clip">
      <modal-options
        :title="$t('tereni')"
        :subtitle="$t('Filtriraj rezervacije po terenu')"
        @update="
          courtFilter = $event
          offset = 1
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
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import pastReservations from '~/components/player/pastReservations'
import ModalOptions from '~/components/modal/ModalOptionsReservationCourtFilter'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Reservation',
  components: {
    modalConfirmation,
    ModalOptions,
    PageHeader,
    TennisImage,
    pastReservations,
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
    }
  },
  computed: {
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
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.loadReservations()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getPlayer()
    this.loadReservations()
  },
  methods: {
    isCancelable(item) {
      if (this.$auth.user.is_admin) {
        return true
      }
      if (this.reservations.length && this.memberships.length) {
        const a = this.$moment.utc(item.from)
        const b = this.$moment()
        if (a.diff(b, 'hours') >= this.$auth.user.membership.reservation_cancelable) {
          return true
        } else {
          return false
        }
      }
      return ''
    },
    getPlayer() {
      Player.find(this.$route.params.id).then((res) => {
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
      this.loading = true
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
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadReservations()
          this.loading = false
        })
    },
    loadReservations() {
      if (this.last_page < this.offset) return
      this.loadingActive = true
      Reservation.page(this.offset)
        .where('player', this.$route.params.id)
        .where('court', this.courtFilter.selectedId)
        .where('from', this.today)
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
