<template>
  <b-tabs v-model="activeTab" position="is-centered">
    <b-tab-item>
      <hero>
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
      <div class="buttons is-fixed m-t-20">
        <div v-if="completeList.length" class="modal-subtitle is-size-4 fw600 m-r-20 m-b-10">
          {{ $t('termina') }} <span>{{ completeList.length }}</span>
        </div>
        <div v-else class="suggest">{{ $t('predloiTermineKojiTiOdgovaraju') }}</div>
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
      <b-modal :active.sync="isReservationModal" class="hidescrollbar" :width="640" scroll="clip" @close="getCourts">
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
      <hero>
        <h1 class="has-text-white">{{ $t('predloeniTermini') }}</h1>
      </hero>
      <div class="x-container activity">
        <div v-for="(item, index) in completeList" :key="item[0].court + item[0].time">
          <termList :index="index" :complete-list="item" @delete="deleteTerm"></termList>
        </div>
      </div>
      <div class="buttons is-fixed m-t-20">
        <b-button pack="far" type="is-danger" icon-left="arrow-circle-left" rounded @click="activeTab--">
          {{ $t('nazad') }}
        </b-button>
        <b-button pack="far" type="is-primary" icon-right="check" rounded @click="submit">
          {{ $t('poalji') }}
        </b-button>
      </div>
    </b-tab-item>
  </b-tabs>
</template>
<script>
import _ from 'lodash'
import Court from '~/models/Court'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'
import termList from '~/components/terms/TermList'
import modalReservation from '~/components/modal/ModalCourtReservationTerm'

export default {
  name: 'Terms',
  components: {
    hero,
    courtSlot,
    termList,
    modalReservation,
  },
  async fetch() {
    await this.getCourts()
  },
  data() {
    return {
      activeTab: 0,
      isReservationModal: false,
      selected_date: this.$moment(),
      inactive: true,
      courts: [],
      selected_court: 0,
      selectedTerms: [],
      completeList: [],
    }
  },
  computed: {
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
  },
  methods: {
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
    submit() {
      this.$emit('sendList', this.completeList)
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
