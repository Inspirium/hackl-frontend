<template>
  <div v-if="score.length">
    <template v-if="score[0].tournament_scores">
      <div v-if="score[0].tournament_scores.length">
        <div class="x-container">
          <TimeRange v-if="false" class="m-b-20" :show="timeRangeShow" @timespan="timerange($event)" />
        </div>
        <div v-if="showTitle" class="activity__header--center m-b-10 m-t-30">
          <nuxt-link :to="localePath('/cup/')" class="fw600 has-text-centered"
            >{{ $t('turniri') }}
            <!--        <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>-->
            <div class="fw600 is-size-6 has-text-centered has-text-black50">{{ $t('posljednjihGodinuDana') }}</div>
          </nuxt-link>
        </div>
        <div
          v-for="(item, index) in score"
          :key="item.id"
          class="softshadow2 radius__5 bottom-border-line is-white p-b-10 p-t-10 p-l-10 p-r-15"
        >
          <div class="flex align__centar__y" @click="isOpen === index ? (isOpen = null) : (isOpen = index)">
            <!--        <div class="fw600 is-size-4 has-text-white is-primary rank-high m-r-10">{{ index + 1 }}.</div>-->
            <div class="w100 flex justify-between">
              <div class="flex flex__column align__centar__x">
                <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">{{ item.display_name }}</h3>
                <div class="fw600 is-size-65 has-text-black30 m-r-15 m-t-5">
                  {{ $t('odigranihTurnira') }}
                  <span class="has-text-lightblue">{{ score[0].tournament_scores.length }}</span>
                </div>
              </div>
              <div class="flex flex__column align__centar__x">
                <div class="x-tag--m is-orange m-l-auto">{{ item.tournament_total_score }}</div>
                <div
                  v-if="howManyTimesWinner(item)"
                  class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y m-t-4"
                >
                  <span class="has-text-black80">{{ howManyTimesWinner(item) }}</span>
                  <b-icon class="turnament-players-icon m-l-5" pack="fal" icon="trophy" type="is-black50"></b-icon>
                </div>
              </div>
            </div>
          </div>
          <template>
            <template v-for="tournament in item.tournament_scores">
              <div
                v-if="tournament.tournament"
                :key="tournament.id + 't'"
                class="border-color-black10 m-t-7"
                @click="$router.push(localePath(tournament.tournament.link))"
              >
                <div class="flex align__centar__y m-t-4">
                  <div class="fw600 is-size-65 has-text-black80 m-r-15">
                    <span class="fw600 has-text-primary">{{ tournament.tournament.name }}</span>
                    <span v-if="tournament.tournament.data.cup_scoring" class="has-text-black30 m-r-5"
                      >({{ tournament.tournament.data.cup_scoring }})</span
                    >
                    <div class="">
                      <div class="fw600 is-size-65 has-text-black30 m-t-2 m-l-auto flex align__centar__y">
                        <b-icon
                          class="turnament-players-icon m-r-5"
                          :pack="tournament.final_status === '*' ? 'fas' : 'fal'"
                          icon="trophy"
                          :type="tournament.final_status === '*' ? 'is-primary' : 'is-black50'"
                        >
                        </b-icon>

                        <span class="has-text-black80">{{ ranksPositionLabel(tournament.final_status) }} </span>
                      </div>
                    </div>
                  </div>
                  <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                    <span v-if="tournament.final_score" class="has-text-green m-l-10"
                      >+{{ tournament.final_score }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import TournamentScore from '@/models/TournamentScore'
import Team from '~/models/Team'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'TournamentScore',
  components: {
    TimeRange,
  },
  props: {
    team: {
      type: Number,
      required: true,
      default: null,
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      activeTab: 0,
      loading: false,
      score: [],
      timeRangeShow: {
        day: false,
        yesterday: false,
        week: false,
        last_week: false,
        month: true,
        last_month: true,
        last_365: true,
        this_year: true,
        last_year: true,
        custom: true,
      },
      isOpen: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.getTournamentScoring()
  },
  methods: {
    howManyTimesWinner(item) {
      let agg = 0
      if (item.tournament_scores === undefined) {
        return []
      }
      for (let i = 0; i < item.tournament_scores.length; i++) {
        if (item.tournament_scores[i].tournament) {
          if (item.tournament_scores[i].tournament.winner_user) {
            if (item.tournament_scores[i].tournament.winner_user.id === item.id) {
              agg++
            }
          }
        }
      }
      return agg
    },
    ranksPositionLabel(item) {
      if (item === '*') {
        return 'Pobjednik'
      }
      if (item === null) {
        return 'Prvo kolo'
      }
      const position = item[0]
      const total = item[2]
      const currentTotal = total - position
      switch (currentTotal) {
        case 0:
          return 'Finale'
        case 1:
          return 'Polufinale'
        case 2:
          return 'Četvrtfinale'
        case 3:
          return 'Osmina finala'
        case 4:
          return 'Šesnaestina finala'
        case 5:
          return '1/32 finala'
        case 6:
          return '1/64 finala'
        case 7:
          return '1/128 finala'
      }
    },
    getTournamentScoring() {
      TournamentScore.include(['tournament_scores', 'tournament_scores.tournament'])
        .where('team', this.team)
        // .where('tournament', 1000)
        // .where('final_between', '2022-10-01,2022-11-01')
        // .where('club', 1)
        .get()
        .then((res) => {
          this.score = res
        })
    },
    getTeam() {
      this.loading = true
      Team.params({ wins: true, stats: true })
        .where('numbers_of_players', 1)
        .$find(this.team)
        .then((res) => {
          this.playerSelected = res
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
  },
}
</script>
