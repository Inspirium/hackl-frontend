<template>
  <div class="p-b-100">
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
    <div v-if="!repeated" class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">
      {{ $t('Filtriraj po igraču') }}
    </div>
    <div v-if="!repeated" class="p-x-16">
      <div class="activity__box action__buttons br100 m-t-10">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(selectedPlayer).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="selectedPlayer.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <div class="fw600 has-text-black80 is-size-55">{{ selectedPlayer.display_name }}</div>
            </div>
            <div @click="deleteplayer()">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActive = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('Pronađi člana') }}</div>
            </div>
          </div>
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
        :loading="loadingDelete"
        @click.stop="isModalActive = true"
      >
        {{ checkedRows.length > 0 ? $t('Obriši') + ' (' + checkedRows.length + ')' : '' }}
      </b-button>
    </div>
    <div
      v-if="reservations.length > 0"
      :class="repeated ? 'is-size-6' : 'is-size-4'"
      class="m-t-15 m-b-5 fw600 has-text-centered"
    >
      {{ $t('Ukupno rezervacija') }}:
      <span v-if="total" class="has-text-lightblue">{{ total }}</span>
    </div>
    <!--        <div v-if="reservations.length > 0" class="m-b-10 fw600 is-size-6 has-text-centered">-->
    <!--          {{ $t('Ukupno sati') }}:-->
    <!--          <span v-if="reservationMeta.total_minutes" class="has-text-lightblue"-->
    <!--            >{{ reservationMeta.total_minutes / 60 }} {{ $t('h') }}</span-->
    <!--          >-->
    <!--        </div>-->
    <div class="x-container p-b-100 relative m-t-15">
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
                  <div class="fw600 is-size-65 has-text-lightblue m-r-10 align__centar__x flex__column w100">
                    <span class="is-uppercase">{{
                      $moment(reservations[props.index].from).format('Do' + 'MM' + ', ' + 'dddd')
                    }}</span>
                    <span class="fw600 title-num is-size-6">{{
                      $moment(reservations[props.index].from).format('LT') +
                      ' — ' +
                      $moment(reservations[props.index].to).format('LT')
                    }}</span>
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
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('Pronađi člana')" :show-tennis-school="false" :is-player="true" @player="sendplayer" />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import ModalOptions from '~/components/modal/ModalOptionsReservationCourtFilter'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'UserReservations',
  components: {
    modalConfirmation,
    TennisImage,
    ModalOptions,
    modalMembers,
  },
  props: {
    repeated: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      courtFilter: {
        selectedId: null,
        selectedCourt: {},
      },
      total: 0,
      offset: 1,
      loadingDelete: false,
      loadingActive: false,
      reservationMeta: false,
      isModalActive: false,
      isModalCourtFilter: false,
      isModalMembersActive: false,
      last_page: 1,
      nomore: false,
      reservations: [],
      checkedRows: [],
      bottom: '',
      checkboxPosition: 'left',
      selectedPlayer: {},
    }
  },
  computed: {
    today() {
      return this.$moment().format('YYYY-MM-DD')
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
    // this.getPlayer()
    this.loadReservations()
  },
  methods: {
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
    sendplayer(item) {
      this.offset = 1
      this.selectedPlayer = item
      this.reservations = []
      this.loadReservations()
    },
    deleteplayer() {
      this.selectedPlayer = {}
      this.reservations = []
      this.loadReservations()
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
      const playerId = this.selectedPlayer?.id ? this.selectedPlayer.id : null
      const r = Reservation.page(this.offset)
      if (this.repeated) {
        r.where('series', this.repeated)
      }
      r.where('court', this.courtFilter.selectedId)
        .where('player', playerId)
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
