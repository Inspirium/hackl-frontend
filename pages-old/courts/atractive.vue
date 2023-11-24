<template>
  <div class="home__reservation">
    <PageHeader :title="$t('Zahtijev za rezervaciju')"></PageHeader>

    <div class="tab__header align__centar__all m-b-10 m-t-20">
      <TennisImage :size="[42, 42]" :src="player.image" class="user_image m-r-10 border__white--2 softshadow2" alt="" />
      <div class="fw600 is-size-4">{{ player.display_name }}</div>
    </div>
    <template v-if="isReservationBooked">
      <div class="x-container">
        <div class="m-t-5 m-b-5 fw600 is-size-65 has-text-black50 has-text-centered">
          {{ $t('korisnikImaPopunjeneSveAtraktivneTermineKojeMuLans') }}
          <div class="is-size-55 has-text-black80 m-t-7">{{ $t('eliteLiMuOmoguitiSljedeuRezervaciju') }}</div>
        </div>
      </div>
      <div class="x-container m-t-5">
        <div class="activity__box">
          <div class="tablelist">
            <b-table :data="reservations" :checked-rows.sync="checkedRows" :bordered="false" :mobile-cards="false">
              <b-table-column v-slot="props" cell-class="list__image-col flex align__centar__y">
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
                <b-tag :type="props.row.court ? 'is-info' : 'is-danger'"
                  >{{ props.row.court ? props.row.court.name : 'Obrisan teren' }}
                </b-tag>
              </b-table-column>
            </b-table>
          </div>
        </div>
      </div>
      <div class="buttons m-t-15">
        <b-button
          class="m-t-10 m-b-10 softshadow invert-small-button"
          type="is-small noborder is-danger has-text-white"
          pack="fal"
          icon-right="times-circle"
          rounded
          :loading="loading"
          @click.stop="isModalActive = true"
        >
          {{ $t('ne') }}
        </b-button>
        <b-button
          class="softshadow m-t-10 m-b-10"
          type="is-small noborder"
          icon-right="check-circle"
          pack="fal"
          rounded
          @click="selectAll()"
        >
          {{ $t('da') }}
        </b-button>
      </div>
      <div class="m-t-25 m-b-5 fw600 is-size-55 has-text-centered">
        {{ $t('ostaleRezervacije') }}
        <span v-if="total" class="has-text-lightblue">{{ $t('key6', { total: total }) }}</span>
      </div>
      <div class="x-container p-b-100">
        <div class="activity__box">
          <div class="tablelist">
            <b-table :data="reservations" :checked-rows.sync="checkedRows" :bordered="false" :mobile-cards="false">
              <b-table-column v-slot="props" cell-class="list__image-col flex align__centar__y">
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
    </template>
    <template v-else>
      <section class="section has-text-centered m-t-20">
        <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"></b-icon>
        <div class="fw600 is-size-4 line-height-19 has-text-centered has-text-black50 m-b-10 m-t-0">
          {{ $t('naalostTerminJeUMeuvremenuRezerviran') }}
        </div>
      </section>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'AtractiveTerms',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      reservations: [],
      loading: false,
      player: {},
      isReservationBooked: false,
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
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getPlayer()
    this.loadReservations()
  },
  methods: {
    getPlayer() {
      Player.find(2).then((res) => {
        this.player = res
      })
    },
    loadReservations() {
      if (this.last_page < this.offset) return
      Reservation.where('player', 2)
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
  },
}
</script>
