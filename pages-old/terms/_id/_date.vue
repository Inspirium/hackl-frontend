<template>
  <div class="container">
    <hero>
      <h1 class="has-text-white">{{ $t('tereni') }}</h1>
    </hero>
    <div v-if="court.id" class="x-container activity">
      <div class="court activity__box--padding">
        <court-slot :court="court"></court-slot>
      </div>
    </div>
    <!-- Table list -->
    <div class="x-container activity">
      <div class="align__centar__x">
        <div class="fw600 is-size-3 m-t--30 m-b-5 has-text-centered">{{ $t('raspored') }}</div>
      </div>
      <div class="activity__box">
        <transition-group name="list">
          <div
            v-for="(one, index) in court.parsed_reservations"
            :key="one.id + index"
            :class="['court-timeslot', one.id === 0 ? '' : 'reserved']"
          >
            <div class="court-item">
              <div class="court-time-range">
                {{ one.time | parseTime(true) }}<br />
                {{ (one.time + (court.reservation_duration / 30) * 50) | parseTime(true) }}
              </div>
              <div class="list-user">
                <template v-if="one.players[0]">
                  <router-link :to="localePath('/player/' + one.players[0].id)" class="court-user">
                    <TennisImage :size="[42, 42]" class="user_image-small m-l-5 m-r-5" :src="one.players[0].image" />
                    <div class="heading-mid align-self-center fw500">
                      {{ one.players[0].display_name }}
                    </div>
                  </router-link>
                </template>
                <template v-if="one.players[1]">
                  <router-link :to="localePath('/player/' + one.players[1].id)" class="court-user">
                    <TennisImage
                      :size="[42, 42]"
                      class="user_image-small m-l-5 m-r-5 m-t-5"
                      :src="one.players[1].image"
                    />
                    <div class="heading-mid align-self-center fw500">
                      {{ one.players[1].display_name }}
                    </div>
                  </router-link>
                </template>
              </div>
              <div class="action m-l-auto m-b-5">
                <!--Admin-only-->
                <!--                <b-button-->
                <!--                  v-if="$auth.user.is_admin"-->
                <!--                  type="is-success"-->
                <!--                  class="m-l-5"-->
                <!--                  icon-left="percentage"-->
                <!--                  pack="far"-->
                <!--                  rounded-->
                <!--                  size="is-smaller"-->
                <!--                  @click.prevent="addPlayerModal(one.id)"-->
                <!--                  >Promo</b-button-->
                <!--                >-->
                <b-button
                  v-if="one.id && canAddPlayer(one)"
                  type="is-primary"
                  class="m-l-5 m-b-5"
                  icon-left="smile"
                  pack="fal"
                  rounded
                  size="is-smaller"
                  @click.prevent="addPlayerModal(one)"
                  >{{ $t('dodajIgraa') }}</b-button
                >
                <b-button
                  v-if="(one.id && canCancel(one)) || (admin && one.id !== 0)"
                  type="is-danger"
                  icon-left="minus-circle"
                  pack="fal"
                  rounded
                  size="is-smaller"
                  @click.prevent="
                    cancel_term = one
                    isModalDeleteActive = true
                  "
                  >{{ $t('otkai') }}</b-button
                >
                <div v-if="!one.players[0]" class="activity__header m-l-5" @click.prevent="isReservationModal = true">
                  <b-button type="is-primary" icon-left="plus-circle" pack="fal" rounded size="is-smaller">{{
                    $t('rezerviraj')
                  }}</b-button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <b-modal :active.sync="isAddPlayerModal">
      <modalMembers
        :title="$t('dodajteSuigraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="reservation"
      />
    </b-modal>
    <!--    novi modali-->
    <b-modal :active.sync="isReservationModal" :width="640" scroll="clip" @close="getCourt">
      <modalReservation
        :title="$t('rezervacija')"
        :reservations="court.parsed_reservations"
        :court="court"
      ></modalReservation>
    </b-modal>
    <b-modal
      :active.sync="isModalDeleteActive"
      :width="640"
      class="modal__confirmation"
      scroll="clip"
      @close="getCourt"
    >
      <modalConfirmation
        :title="$t('ukloniRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="cancelTerm"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import Court from '~/models/Court'
import modalReservation from '~/components/modal/ModalCourtReservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembers'
import hero from '~/components/Hero'
import CourtSlot from '~/components/court/CourtSlot'
import Reservation from '~/models/Reservation'

export default {
  name: 'Court',
  components: {
    CourtSlot,
    hero,
    modalReservation,
    modalConfirmation,
    modalMembers,
    TennisImage,
  },
  async fetch() {
    await this.getCourt()
  },
  data() {
    return {
      isAddPlayerModal: false,
      isReservationModal: false,
      isModalDeleteActive: false,
      court: {
        parsed_reservations: [],
      },
      cancel_term: 0,
      reservation: 0,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    date() {
      if (this.$route.params.date) {
        return this.$route.params.date
      }
      return this.$moment().format('YYYY-MM-DD')
    },
  },
  methods: {
    canCancel(reservation) {
      if (this.$auth.user.is_admin) {
        return true
      }
      if (this.user.id === reservation.players[0].id) {
        const hour = reservation.time / 100
        const date = this.$moment(this.$route.params.date)
        date.add(hour, 'h')
        const now = this.$moment().add(5, 'h')
        return now.isBefore(date)
      }
      return false
    },
    canAddPlayer(reservation) {
      return this.user.id === reservation.players[0].id && reservation.players.length < 2
    },
    addPlayerModal(reservation) {
      this.reservation = reservation
      this.isAddPlayerModal = true
    },
    async getCourt() {
      this.court = await Court.params({ date: this.$route.params.date }).find(this.$route.params.id)
    },
    cancelTerm() {
      if (this.cancel_term) {
        const r = new Reservation(this.cancel_term)
        r.delete()
        this.getCourt()
      }
    },
  },
}
</script>
