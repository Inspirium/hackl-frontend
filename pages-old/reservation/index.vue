<template>
  <div class="home__reservation">
    <PageHeader :title="$t('Moje rezervacije')"></PageHeader>
    <div class="fw600 is-size-6 has-text-black80 has-text-centered m-t-15">
      {{ $t('brojAktivnihRezervacija', { length: reservations.length }) }}
    </div>
    <div v-if="reservations.length" class="activity x-container">
      <div class="activity__reservation">
        <transition name="fade">
          <div class="activity__box">
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
                <div class="fw600 is-size-65 has-text-lightblue m-r-10 nowrap align__centar__x flex__column w100">
                  <span class="is-uppercase m-t--12">{{ $moment(reservations[index].from).format('dddd') }}</span>
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
                      <span class="has-text-lightblue">{{ user.membership.reservation_cancelable }} </span
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
                      <span class="has-text-lightblue">{{ user.membership.reservation_cancelable }} </span
                      >{{ $t('prijePoetkaRezervacije') }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </transition>
        <div v-if="reservations.length && isAdmin" class="buttons m-t-10">
          <b-button
            class="softshadow m-t-10 m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/player/' + user.id + '/reservation')"
          >
            {{ $t('Uredi rezervacije') }}
          </b-button>
        </div>
      </div>
    </div>
    <template v-if="!reservations.length">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
          <p class="modal-title">{{ $t('nemaAktivnihRezervacija') }}</p>
        </div>
        <div class="buttons m-t-20 m-b-0">
          <b-button
            class="m-b-15 m-t-10 softshadow"
            type="is-danger"
            pack="fal"
            icon-right="tennis-ball"
            rounded
            tag="nuxt-link"
            :to="localePath('/courts')"
          >
            {{ $t('rezervirajTeren') }}
          </b-button>
        </div>
      </section>
    </template>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEtePonititiRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
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
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembers'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Reservation',
  components: {
    modalConfirmation,
    modalMembers,
    PageHeader,
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
      date: this.$moment(),
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    basicMembership() {
      return this.memberships.filter((item) => {
        return item.basic
      })
    },
    memberships() {
      return this.$store.state.club.memberships
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
        if (a.diff(b, 'hours') >= this.$auth.user.membership.reservation_cancelable || this.$auth.user.is_admin) {
          return true
        } else {
          return false
        }
      }
      return ''
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
    },
    isSelectedReservation(e) {
      if (this.selected_reservation === e) {
        this.selected_reservation = []
      } else {
        this.selected_reservation = e
      }
    },
    loadReservations() {
      Reservation.where('player', this.$auth.user.id)
        .limit(3)
        .$get()
        .then((res) => (this.reservations = res))
    },
    isActive(selected) {
      if (_.includes(this.selected_reservation, selected)) {
        return 'active'
      }
    },
  },
  head() {
    return {
      title: 'Rezervacije',
    }
  },
}
</script>
