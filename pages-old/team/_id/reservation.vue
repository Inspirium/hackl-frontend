<template>
  <div class="home__reservation">
    <PageHeader :title="$t('Rezervacije')"></PageHeader>
    <div class="m-t-15 m-b-5 fw600 is-size-55 has-text-centered">
      {{ $t('popisRezervacija') }}
      <span v-if="total" class="has-text-lightblue">{{ $t('key6', { total: total }) }}</span>
    </div>
    <div class="tab__header align__centar__all m-b-10">
      <TennisImage :src="player.image" :size="[42, 42]" class="user_image m-r-10 border__white--2 softshadow2" alt="" />
      <div class="">{{ player.display_name }}</div>
    </div>
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
        {{ reservations.length === checkedRows.length ? 'Poništi' : 'Označi sve' }}
      </b-button>
      <b-button
        class="m-t-10 m-b-10 softshadow invert-small-button"
        type="is-small noborder is-danger has-text-white"
        pack="fal"
        :icon-right="checkedRows.length === 0 ? 'times-circle' : ''"
        rounded
        :loading="loading"
        @click.stop="isModalActive = true"
      >
        {{ $t('obriiOznaeno', { expr: checkedRows.length > 0 ? '(' + checkedRows.length + ')' : '' }) }}
      </b-button>
    </div>

    <div class="x-container p-b-100">
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
                      $moment(reservations[props.index].from).format('Do' + 'MM' + ', ' + 'dddd')
                    }}</span>
                    <span class="fw600 title-num is-size-6">{{
                      $moment(reservations[props.index].from).format('LT') +
                      ' — ' +
                      $moment(reservations[props.index].to).format('LT')
                    }}</span>
                  </div>
                </div>
                <b-tag :type="props.row.court ? 'is-info' : 'is-danger'">{{
                  props.row.court ? props.row.court.name : 'Obrisan teren'
                }}</b-tag>
              </a>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaRezervacija') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </div>
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
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
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
      checkedRows: [],
      checkboxPosition: 'left',
      date: this.$moment(),
      loading: false,
      player: {},
      nomore: false,
      total: 0,
      last_page: 1,
      bottom: '',
      offset: 1,
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
  },
  watch: {
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.loadReservations()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
    this.getPlayer()
    this.loadReservations()
  },
  methods: {
    // async getPlayer() {
    //   this.player = await Player.$find(this.$route.params.id)
    //   this.loadReservations()
    // },

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
      Reservation.page(this.offset)
        .where('player', this.$route.params.id)
        .where('court', this.courtFilter.selectedId)
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
          this.offset++
          this.total = res.meta.total
          this.last_page = res.meta.last_page
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
