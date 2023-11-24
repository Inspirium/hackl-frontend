<template>
  <div class="home__reservation relative">
    <div v-if="reservations.length" class="activity x-container">
      <div class="activity__reservation">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/player/' + user.id + '/reservation')" class="fw600"
            >{{ $t('mojeRezervacije') }}
            <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
          </nuxt-link>
        </div>
        <transition name="fade">
          <div v-if="reservations.length" class="activity__box">
            <div
              v-for="(reservation, index) in reservations"
              :key="reservation.id"
              :class="{
                reservation__item: true,
                active: reservation === selected_reservation,
              }"
              @click="isSelectedReservation(reservation)"
            >
              <div class="reservation__item__content">
                <div class="m-r-10 nowrap align__centar__x flex__column w100">
                  <span class="fw600 is-size-65 has-text-lightblue is-uppercase m-t--12"
                    >{{ $moment(reservations[index].from).format('dddd') }}
                    <span
                      v-if="reservation.court.club_id !== club.id"
                      class="is-size-65 has-text-black50 is-case-initial has-text-right m-t--5"
                    >
                      • {{ reservation.court.club.name }}
                    </span>
                  </span>
                  <span :class="isActive" class="fw600 title-num is-size-6">{{
                    $moment(reservations[index].from).format('Do' + ' MMMM' + ', ' + 'LT')
                  }}</span>
                </div>
                <div
                  :class="reservation.court.surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
                  class="x-tag m-r-10 m-l-10"
                >
                  {{ reservation.court.name }}
                </div>
                <b-icon icon="chevron-down" size="is-smaller" pack="far" class="m-t--3"></b-icon>
              </div>
              <template v-if="isDoubles(reservation)">
                <div class="reservation__partner tablelist">
                  <div v-if="reservation.players.length > 1" class="align__centar__all">
                    <template v-if="!(isDoublesIndex(reservation) === 1 || isDoublesIndex(reservation) === 2)">
                      <div class="list__img">
                        <div
                          v-if="reservation.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                          class="flex"
                        >
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[0].players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[0].players[1].image"
                            class="user_image m-l--20 border__white--2"
                            alt=""
                          />
                        </div>
                        <div v-else class="">
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                        </div>
                      </div>

                      <div class="list__content">
                        <h3>
                          {{ reservation.players[0].display_name }}
                        </h3>
                      </div>
                    </template>
                    <template v-else>
                      <div class="list__img">
                        <div
                          v-if="reservation.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                          class="flex"
                        >
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[1].players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[1].players[1].image"
                            class="user_image m-l--20 border__white--2"
                            alt=""
                          />
                        </div>
                        <div v-else class="">
                          <TennisImage
                            :size="[42, 42]"
                            :src="reservation.players[1].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                        </div>
                      </div>

                      <div class="list__content">
                        <h3>
                          {{ reservation.players[1].display_name }}
                        </h3>
                      </div>
                      <div class="m-t-10" @click.stop="deletePlayer()">
                        <b-icon icon="times" pack="fal" type="is-danger" size="is-small" class="m-l-15" />
                      </div>
                    </template>
                  </div>
                  <div v-else class="buttons">
                    <b-button
                      style="border: none"
                      size="is-small"
                      pack="fal"
                      icon-right="plus-circle"
                      rounded
                      @click.stop="isModalMembersActive = true"
                    >
                      {{ $t('dodajSuigraa') }}
                    </b-button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="reservation__partner tablelist">
                  <template v-if="reservation.players.length > 1">
                    <div class="align__centar__all">
                      <div class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="
                            reservation.players[0].id === $store.state.auth.user.team.id
                              ? reservation.players[1].image
                              : reservation.players[0].image
                          "
                          class="user_image"
                        />
                      </div>
                      <div class="list__content">
                        <h3>
                          {{
                            reservation.players[0].id === $store.state.auth.user.team.id
                              ? reservation.players[1].display_name
                              : reservation.players[0].display_name
                          }}
                        </h3>
                      </div>
                      <div
                        v-if="reservation.players[0].id === $store.state.auth.user.team.id"
                        class="m-t-10"
                        @click.stop="deletePlayer()"
                      >
                        <b-icon icon="times" pack="fal" type="is-danger" size="is-small" class="m-l-15" />
                      </div>
                    </div>
                  </template>
                  <div class="buttons">
                    <b-button
                      v-if="reservation.players.length < 2"
                      style="border: none"
                      size="is-small"
                      pack="fal"
                      icon-right="plus-circle"
                      rounded
                      @click.stop="isModalMembersActive = true"
                    >
                      {{ $t('dodajSuigraa') }}
                    </b-button>
                  </div>
                </div>
              </template>

              <template v-if="isDoubles(reservation)">
                <template v-if="isCancelable(reservation)">
                  <div
                    v-if="
                      reservation.players[0].players[0].id === $store.state.auth.user.id ||
                      reservation.players[0].players[1].id === $store.state.auth.user.id
                    "
                    class="buttons"
                  >
                    <b-button
                      class="m-t-15"
                      type="is-danger"
                      icon-right="minus-circle"
                      pack="fal"
                      rounded
                      size="is-smaller-75"
                      :loading="loading"
                      @click.stop="isModalActive = true"
                      >{{ $t('otkaiRezervaciju') }}</b-button
                    >
                  </div>
                  <div v-else class="buttons">
                    <b-button class="m-t-15" type="is-danger" rounded size="is-smaller">{{
                      $t('otkazatiMoeSamo', { display_name: reservation.players[0].display_name })
                    }}</b-button>
                  </div>
                </template>

                <template v-else>
                  <div class="buttons m-t-5 flex flex__column align__centar__all">
                    <div class="fw600 is-size-6 has-text-danger">{{ $t('nijeMogueOtkazatiRezervaciju') }}</div>
                    <div class="fw600 is-size-7 has-text-black50">
                      {{ $t('(Najkasnije') }}
                      <span class="has-text-lightblue">{{ user.membership?.reservation_cancelable }} </span
                      >{{ $t('prijePoetkaRezervacije') }}
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <template v-if="isCancelable(reservation)">
                  <div v-if="reservation.players[0].id === $store.state.auth.user.team.id" class="buttons">
                    <b-button
                      class="m-t-15"
                      type="is-danger"
                      icon-right="minus-circle"
                      pack="fal"
                      rounded
                      size="is-smaller-75"
                      :loading="loading"
                      @click.stop="isModalActive = true"
                      >{{ $t('otkaiRezervaciju') }}</b-button
                    >
                  </div>
                  <div v-else class="buttons">
                    <b-button class="m-t-15" type="is-danger" rounded size="is-smaller">{{
                      $t('otkazatiMoeSamo', { display_name: reservation.players[0].display_name })
                    }}</b-button>
                  </div>
                </template>

                <template v-else>
                  <div class="buttons m-t-5 flex flex__column align__centar__all">
                    <div class="fw600 is-size-6 has-text-danger">{{ $t('nijeMogueOtkazatiRezervaciju') }}</div>
                    <div class="fw600 is-size-7 has-text-black50">
                      {{ $t('(Najkasnije') }}
                      <span class="has-text-lightblue">{{ user.membership?.reservation_cancelable }} </span
                      >{{ $t('prijePoetkaRezervacije') }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </transition>
        <div v-if="reservations.length >= 3" class="buttons m-t-10">
          <b-button
            class="softshadow m-t-10 m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/player/' + user.id + '/reservation')"
          >
            {{ $t('prikaiSve') }}
          </b-button>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEtePonititiRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
        :ispaid="selected_reservation?.is_paid"
        @update="deleteReservation"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('dodajteSuigraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="selected_reservation"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import Club from '@/models/Club'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembers'

export default {
  name: 'HomeReservation',
  components: {
    modalConfirmation,
    modalMembers,
    TennisImage,
  },
  async fetch() {
    if (this.$auth.loggedIn) {
      await this.loadReservations()
    }
  },
  data() {
    return {
      isModalActive: false,
      isModalMembersActive: false,
      selected_reservation: null,
      reservations: [],
      memberships1: [],
      date: this.$moment(),
      loading: true,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
  },
  methods: {
    isDoubles(reservation) {
      return reservation.players[0].players.length > 1
    },
    isDoublesIndex(reservation) {
      if (reservation.players.length > 1) {
        if (reservation.players[0].players[0].id === this.user.id) {
          return 1
        } else if (reservation.players[0].players[1].id === this.user.id) {
          return 2
        } else if (reservation.players[1].players[0].id === this.user.id) {
          return 3
        } else if (reservation.players[1].players[1].id === this.user.id) {
          return 4
        }
      }
    },
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
    getMembership() {
      const club = new Club(this.$store.state.club)
      club
        .memberships()
        .get()
        .then((res) => {
          this.memberships1 = res.data
        })
    },
    deleteReservation() {
      this.loading = true
      const r = new Reservation(this.selected_reservation)
      r.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste otkazali rezervaciju'),
            type: 'is-success',
          })
          this.loadReservations()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deletePlayer() {
      const r = new Reservation(this.selected_reservation)
      r.players.splice(1, 1)
      r.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili partnera s rezervacije terena'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    isSelectedReservation(e) {
      if (this.selected_reservation === e) {
        this.selected_reservation = []
      } else {
        this.selected_reservation = e
      }
    },
    loadReservations() {
      this.loading = true
      Reservation.where('from', this.today)
        .where('player', this.$auth.user.id)
        .limit(3)
        .$get()
        .then((res) => {
          this.reservations = res
          this.loading = false
        })
    },
    isActive(selected) {
      if (_.includes(this.selected_reservation, selected)) {
        return 'active'
      }
    },
  },
}
</script>
<style scoped>
.modal {
  justify-content: flex-start !important;
}
</style>
