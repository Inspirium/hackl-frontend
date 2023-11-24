<template>
  <div>
    <b-tabs v-model="activeTab" position="is-centered">
      <b-tab-item>
        <hero id="top" :back="true">
          <h1 class="has-text-white navigation__title">
            {{ selected_date | moment('dddd') }}, <span>{{ selected_date | moment('DD.MM.') }}</span>
          </h1>
        </hero>
        <div class="x-container activity p-b-75">
          <div class="tab__navigation m-b-20 m-t--40">
            <div :class="['tab__navigation__arrow__left', inactive ? 'inactive' : '']" @click="prevDay">
              <b-icon v-if="!loading1" icon="chevron-left" pack="fal"></b-icon>
              <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
            </div>
            <div :class="['tab__navigation__arrow__right', inactiveNext ? '' : 'inactive']" @click="nextDay">
              <b-icon v-if="!loading1" icon="chevron-right" pack="fal"> </b-icon>
              <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
            </div>
          </div>
          <template>
            <div class="breadcrumbs-back m-l-auto m-r-auto m-b-20 m-t--20">
              <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
                <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
                <span class="m-r-5">{{ $t('nazad') }}</span>
              </a>
            </div>
          </template>
          <!--          Show club info if court is not in club (for cup and liga when players make reservation)-->
          <template v-if="courts.length">
            <template v-if="courts[0].club_id !== club.id">
              <div
                class="flex align__centar__all m-b-10 m-t-20 cursor"
                @click="$router.push(localePath('/clubs/' + court.club.id))"
              >
                <img
                  v-if="courts[0].club?.logo"
                  :src="courts[0].club?.logo"
                  class="user_image-smallish border__white--2 m-l-1 m-r-10 softshadow"
                  alt=""
                />
                <div class="">
                  <div class="fw600 is-size-12 has-text-black80">{{ courts[0].club?.name }}</div>
                  <div class="fw600 is-size-7 m-t--2 has-text-black50 flex align__centar__y">
                    <font-awesome-icon class="m-r-2 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                    {{ courts[0].club?.city }}, {{ courts[0].club?.address }}
                  </div>
                </div>
              </div>
            </template>
            <div v-if="true" class="buttons m-t-20">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                rounded
                @click="isModalClubActive = true"
              >
                {{ $t('Rezerviraj u drugom klubu') }}
              </b-button>
            </div>
          </template>
          <div class="col">
            <div v-for="court in courts" :key="court.id" class="court activity__box--padding m-b-15">
              <div
                @click.stop="
                  selected_court = court
                  isReservationModal = true
                "
              >
                <court-slot :court="court"></court-slot>
              </div>

              <div class="buttons">
                <b-button
                  class="m-t-15 noborder"
                  type="is-small"
                  rounded
                  @click.stop="
                    selected_court = court
                    isReservationModal = true
                  "
                >
                  {{ $t('rezerviraj') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <b-modal :active.sync="isReservationModal" :width="640" scroll="clip" class="hidescrollbar" @close="getCourts">
          <modalReservation
            :reservations="selected_court.parsed_reservations"
            :court="selected_court"
            :reservation-date="selected_date"
            :selected-terms="selectedTerms"
            :complete-list="completeList"
            :title="$t('rezerviraj')"
            @update="termListUpdate($event)"
          ></modalReservation>
        </b-modal>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersActive" class="hidescrollbar" :width="640" scroll="clip">
      <modalMembers
        :title="$t('poalji')"
        :subtitle="$t('Odaberite igrača kojem želite predložiti odabrane termine')"
        @player="submitMessage($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalClubActive" :width="640" scroll="clip" class="hidescrollbar">
      <modalClub
        :switch-club="false"
        :title="$t('odaberiNoviKlub')"
        style="min-height: 200px"
        @club="changeClub($event)"
      />
    </b-modal>
  </div>
</template>
<script>
import Thread from '@/models/Thread'
import Reservation from '~/models/Reservation'
import Court from '~/models/Court'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'
import modalMembers from '~/components/modal/ModalMembersTerms'
import modalReservation from '~/components/modal/ModalCourtReservationTerm'
import modalClub from '~/components/modal/ModalClubs'

export default {
  name: 'Terms',
  components: {
    hero,
    courtSlot,
    modalReservation,
    modalMembers,
    modalClub,
  },
  async fetch() {
    await this.getCourts()
  },
  data() {
    return {
      activeTab: 0,
      isModalMembersActive: false,
      isReservationModal: false,
      isModalClubActive: false,
      selected_date: this.$moment(),
      inactive: true,
      loading1: true,
      courts: [],
      selected_court: 0,
      selectedTerms: [],
      completeList: [],
      players: [],
      group_name: '',
      selected_times: [],
      selected_times_sorted: [],
      selected_club: {},
    }
  },
  computed: {
    date() {
      return this.$moment(this.selected_date).format('YYYY-MM-DD')
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    inactiveNext() {
      const a = this.$moment(this.selected_date)
      const b = this.$moment()
      if (a.diff(b, 'days') < 7) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    selected_date: {
      handler() {
        this.getCourts()
      },
    },
    selected_times: {
      handler() {
        this.selected_times_sorted = [...this.completeList].sort((a, b) => a.time - b.time)
      },
    },
    completeList: {
      handler() {
        // return to index page if delete all terms
        if (this.completeList.length < 1) {
          this.activeTab = 0
        }
      },
    },
    activeTab: {
      handler() {
        this.scrollToTop()
      },
    },
  },
  methods: {
    changeClub(item) {
      this.selected_club = item
      this.getCourts()
    },
    send() {
      this.loading = true
      this.$root.$loading.start()
      const reservation = new Reservation({
        date: this.date,
        times: this.completeList[0],
        group: {},
        game: this.$route.query.game,
        repeat: null,
        court_id: this.selected_court.id,
      })
      reservation
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste rezervirali teren'),
            type: 'is-success',
          })
          this.loading = false
          this.$root.$loading.finish()
          this.$router.go(-1)
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
          this.$root.$loading.finish()
        })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    deleteTerm(e) {
      this.completeList.splice(e, 1)
    },
    termListUpdate(term) {
      this.completeList.push(term)
      this.send()
    },
    getCourts() {
      this.loading1 = true
      const clubid = Object.keys(this.selected_club).length ? this.selected_club.id : this.$route.query.clubid
      Court.params({ date: this.selected_date.format('YYYY-MM-DD') })
        .where('club_id', clubid)
        .get()
        .then((res) => {
          this.courts = res.data
          this.loading1 = false
        })
    },
    nextDay() {
      this.selected_date = this.$moment(this.selected_date).add(1, 'day')
      if (this.selected_date.isAfter(this.$moment())) {
        this.inactive = false
      }
      this.getCourts()
    },
    prevDay() {
      if (!this.inactive) {
        this.selected_date = this.$moment(this.selected_date).subtract(1, 'day')
        if (this.selected_date.isSame(this.$moment(), 'day')) {
          this.inactive = true
        }
      }
      this.getCourts()
    },
    submitMessage(item) {
      this.isModalMembersActive = false
      this.players.push(item)
      const t = new Thread({ players: [item], message: this.completeList, type: 'terms' })
      t.save().then((res) => {
        this.$router.push(this.localePath(`/messages/${res.id}`))
      })
    },
  },
}
</script>

<style scoped>
.suggest {
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0 2rem;
  text-align: center;
  line-height: 1.7rem;
}
.b-tabs >>> .tabs {
  display: none;
}
</style>
