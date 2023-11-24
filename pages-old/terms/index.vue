<template>
  <div>
    <b-tabs v-model="activeTab" position="is-centered">
      <b-tab-item>
        <hero id="top">
          <h1 class="has-text-white navigation__title">
            {{ selected_date | moment('dddd') }},
            <span>{{ selected_date | moment('DD.MM.') }}</span>
          </h1>
        </hero>
        <div class="x-container activity p-b-75">
          <div class="tab__navigation m-b-20 m-t--40">
            <div :class="['tab__navigation__arrow__left', inactive ? 'inactive' : '']" @click="prevDay">
              <b-icon icon="chevron-left" pack="fal"></b-icon>
            </div>
            <div class="tab__navigation__arrow__right" @click="nextDay">
              <b-icon icon="chevron-right" pack="fal"> </b-icon>
            </div>
          </div>

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
                  {{ $t('predloiTermine') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isReservationModal" class="buttons is-fixed m-t-20">
          <div v-if="completeList.length" class="modal-subtitle is-size-4 fw600 m-r-20 m-b-10">
            {{ $t('termina') }} <span>{{ completeList.length }}</span>
          </div>
          <div v-else v-show="!isReservationModal" class="suggest" @click="scrollToTop">
            {{ $t('predloiTermineKojiTiOdgovaraju') }}
          </div>
          <b-button
            v-if="completeList.length"
            pack="far"
            type="is-primary"
            icon-right="arrow-circle-right"
            rounded
            @click="activeTab++"
          >
            {{ $t('dalje') }}
          </b-button>
        </div>
        <b-modal :active.sync="isReservationModal" :width="640" class="hidescrollbar" scroll="clip" @close="getCourts">
          <modalReservation
            :reservations="selected_court.parsed_reservations"
            :court="selected_court"
            :reservation-date="selected_date"
            :selected-terms="selectedTerms"
            :complete-list="completeList"
            :title="$t('predloiTermin')"
            @update="termListUpdate($event)"
          ></modalReservation>
        </b-modal>
      </b-tab-item>
      <b-tab-item>
        <hero id="top">
          <h1 class="has-text-white">{{ $t('predloeniTermini') }}</h1>
        </hero>
        <div class="x-container activity min-height-100">
          <div v-for="(item, index) in completeList" :key="item[0].court + item[0].time">
            <termList :index="index" :complete-list="item" @delete="deleteTerm"></termList>
          </div>
        </div>
        <div class="buttons is-fixed m-t-20">
          <b-button pack="far" type="is-danger" icon-left="arrow-circle-left" rounded @click="activeTab--">
            {{ $t('nazad') }}
          </b-button>
          <b-button pack="far" type="is-primary" icon-right="check" rounded @click="isModalMembersActive = true">
            {{ $t('poalji') }}
          </b-button>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Prijedlog termina')"
        :subtitle="$t('Odaberite igrača kojem želite predložiti odabrane termine')"
        :loading="loading"
        :is-player="true"
        @player="submitMessage($event)"
      ></modalMembers>
    </b-modal>
  </div>
</template>
<script>
import _ from 'lodash'
import Thread from '@/models/Thread'
import Court from '~/models/Court'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'
import termList from '~/components/terms/TermList'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalReservation from '~/components/modal/ModalCourtReservationTerm'

export default {
  name: 'Terms',
  components: {
    hero,
    courtSlot,
    termList,
    modalReservation,
    modalMembers,
  },
  async fetch() {
    await this.getCourts()
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      isModalMembersActive: false,
      isReservationModal: false,
      selected_date: this.$moment(),
      inactive: true,
      courts: [],
      selected_court: 0,
      selectedTerms: [],
      completeList: [],
      players: [],
      group_name: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
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
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    deleteTerm(e) {
      this.completeList.splice(e, 1)
    },
    termListUpdate(term) {
      if (_.indexOf(this.completeList, term) > -1) {
      } else {
        this.completeList.push(term)
      }
    },
    getCourts() {
      Court.params({ date: this.selected_date.format('YYYY-MM-DD') })
        .get()
        .then((res) => {
          this.courts = res.data
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
      this.loading = true
      this.isModalMembersActive = false
      this.players.push(item)
      const t = new Thread({ players: [item], message: this.completeList, type: 'terms' })
      t.save().then((res) => {
        this.$router.push(this.localePath(`/messages/${res.id}`))
        this.loading = false
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
