<template>
  <div class="analytics p-b-100">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('statistikaIgraa') }}</h1>
    </hero>

    <div v-if="Object.keys(playerSelected).length" class="x-container">
      <div class="analytics_header m-t-20">
        <div class="member__info">
          <div class="title m-b-5 m-t-5" @click="$router.push(localePath('/player/' + playerSelected.id))">
            {{ playerSelected.display_name }}
          </div>
          <div class="modal-subtitle">{{ $t('godina range', { range: playerSelected.players[0].range }) }}</div>
        </div>
      </div>
      <div class="chart__donut__big m-t-10">
        <VueApexCharts height="250" type="donut" :options="options" :series="series"></VueApexCharts>
        <div class="chart__donut__img">
          <TennisImage :size="[200, 200]" :src="playerSelected.image" class="user_image-medium m-r-5" alt="" />
        </div>
      </div>
      <template>
        <div class="member__info">
          <div class="is-size-5 fw600 m-b--10 m-t-5">
            {{ $t('ukupnoMeeva3', { total: playerSelected.stats.total.total }) }}
          </div>
        </div>

        <div class="m-t-10 has-text-centered">
          <span class="is-size-7 x-tag green nav__notification has-text-white">{{
            $t('pobjeda', { wins: playerSelected.stats.stats.wins })
          }}</span>
          <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
            $t('poraza', { expr: playerSelected.stats.total.total - playerSelected.stats.stats.wins })
          }}</span>
        </div>
        <trend :player="playerSelected.id" class="m-b-15">
          <slot>
            <div class="label--center m-t-15 m-b-10">{{ $t('trendPobjedaIPoraza') }}</div>
          </slot>
        </trend>
        <!--        <div class="statistics_new m-b-10 m-t-15 p-b-10 softshadow">-->
        <!--          <div class="statistic__item trend-box">-->
        <!--            <div class="label&#45;&#45;center m-b-10">Trend pobjeda i poraza</div>-->
        <!--            <trend :player="playerSelected.id">-->
        <!--              <slot>asdasdasd</slot>-->
        <!--            </trend>-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="statistics_new m-b-10 m-t-10 softshadow">
          <div class="statistic__item">
            <div class="label--center">{{ $t('rankUKlubu') }}</div>
            <div class="label__num is-size-2 has-text-black50">
              <span class="has-text-black80">{{ playerSelected.rank_club }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('eloBodovi') }}</div>
            <div class="label__num is-size-2 has-text-black50">
              <span class="has-text-black80">{{ Math.round(playerSelected.rating_club) }}</span>
            </div>
          </div>
        </div>
        <!--      <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">-->
        <!--        mečevi-->
        <!--      </div>-->
        <div class="statistics_new is-bckg border-radius-0">
          <div class="statistic__item">
            <div class="label--versus">{{ $t('meeva') }}</div>
            <div class="label__num is-size-3 has-text-black50 border-white">
              <span class="has-text-black80">{{ playerSelected.stats.total.total }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--versus">{{ $t('natjecanja') }}</div>
            <div class="label__num is-size-3 has-text-black50 border-white">
              <span class="has-text-black80">{{ playerSelected.stats.total.competition }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--versus">{{ $t('prijateljski') }}</div>
            <div class="label__num is-size-3 has-text-black50 border-white">
              <span class="has-text-black80">{{ playerSelected.stats.total.friendly }}</span>
            </div>
          </div>
        </div>
        <div class="statistics_new m-b-10 softshadow">
          <div class="statistic__item">
            <div class="label--center">{{ $t('setovi') }}</div>
            <div class="chart__donut">
              <VueApexCharts type="donut" :options="optionsSmall" :series="sets"></VueApexCharts>
            </div>
            <div class="label__num-v1 fw600 is-size-6 has-text-black80">
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('ukupno2') }} </span
              >{{ playerSelected.stats.total.sets }}
            </div>
            <div class="label__num-v1 fw600 is-size-4 has-text-danger">
              <span class="has-text-darkgreen"
                >{{ playerSelected.stats.stats.sets }}<span class="has-text-black80"> / </span></span
              >{{ playerSelected.stats.total.sets - playerSelected.stats.stats.sets }}
            </div>
            <div
              class="label__num-v1 fw600 is-size-6"
              :class="[setsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']"
            >
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('setRazlika2') }} </span
              >{{ setsDiff > 0 ? '+' : '' }}{{ setsDiff }}
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('gemovi') }}</div>
            <div class="chart__donut">
              <VueApexCharts type="donut" :options="optionsSmall" :series="gems"></VueApexCharts>
            </div>

            <div class="label__num-v1 fw600 is-size-6 has-text-black80">
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('ukupno2') }} </span
              >{{ playerSelected.stats.total.points }}
            </div>

            <div class="label__num-v1 fw600 is-size-4 has-text-danger">
              <span class="has-text-darkgreen"
                >{{ playerSelected.stats.stats.points }}<span class="has-text-black80"> / </span></span
              >{{ playerSelected.stats.total.points - playerSelected.stats.stats.points }}
            </div>
            <div
              class="label__num-v1 fw600 is-size-6"
              :class="[setsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']"
            >
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('gemRazlika2') }} </span
              >{{ gemsDiff > 0 ? '+' : '' }}{{ gemsDiff }}
            </div>
          </div>
        </div>
        <div class="statistics_new 111 m-b-10 softshadow">
          <div v-if="playerSelected.stats.total.tie_breaks > 0" class="statistic__item">
            <div class="label--center">Tie-break</div>
            <div class="chart__donut">
              <VueApexCharts type="donut" :options="optionsSmall" :series="tie"></VueApexCharts>
            </div>
            <div class="label__num-v1 fw600 is-size-6 has-text-black80">
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('ukupno2') }} </span
              >{{ playerSelected.stats.total.tie_breaks }}
            </div>
            <div class="label__num-v1 fw600 is-size-4 has-text-danger">
              <span class="has-text-darkgreen"
                >{{ playerSelected.stats.stats.tie_breaks }}<span class="has-text-black80"> / </span></span
              >{{ playerSelected.stats.total.tie_breaks - playerSelected.stats.stats.tie_breaks }}
            </div>
            <div
              class="label__num-v1 fw600 is-size-6"
              :class="[setsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']"
            >
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('tiebreakRazlika') }} </span
              >{{ tieDiff > 0 ? '+' : '' }}{{ tieDiff }}
            </div>
          </div>
          <div class="statistic__item">
            <template v-if="playerSelected.stats.stats.first_set_wins > 0">
              <div class="label--center w80 m-x-auto line-height-11">
                {{ $t('vjerojatnostPobjedeAkoJeOsvojenPrviSet') }}
              </div>

              <div class="statistic__item">
                <div class="chart__donut">
                  <VueApexCharts type="donut" :options="optionsSmall" :series="firstSets1"></VueApexCharts>
                </div>
                <div class="label__num-v1 is-size-6">
                  <span class="has-text-black50 fw600 is-size-7 is-uppercase flex line-height-11"
                    >{{ $t('osvojenihPrvihSetovaMeeva') }}
                  </span>
                </div>

                <div class="label__num-v1 fw600 is-size-4 has-text-danger">
                  <span class="has-text-darkgreen"
                    >{{ playerSelected.stats.stats.first_set_wins
                    }}<span class="has-text-black80"> / {{ playerSelected.stats.stats.wins }}</span></span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>

        <!--        <div class="versus-statis-line m-t-15">-->
        <!--          <div class="label&#45;&#45;center w80 m-x-auto line-height-11">Postotak pobjeda ako je dobiven prvi set</div>-->
        <!--          <div class="versus-statis-line m-t-5">-->
        <!--            <div class="flex flex1 w100 m-t&#45;&#45;2">-->
        <!--              <div class="versus-stats-value-left versus-stats-value-right green" :style="precentageSecond()">-->
        <!--                {{ precentageSecond(1) }}-->
        <!--              </div>-->
        <!--              <div class=""></div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </template>
    </div>
    <template v-if="results.length">
      <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">
        {{ $t('posljednjiSusreti') }}
      </div>
      <div class="x-container results">
        <div v-for="(game, index) in results" :key="index" class="m-b-10">
          <div class="activity__results">
            <div class="activity__box">
              <div class="results__list">
                <resultBox v-if="game.result !== null" :show-date="true" :game="game"></resultBox>
              </div>
            </div>
          </div>
        </div>
        <div v-if="results.length" class="buttons m-t-10">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/team/' + playerSelected.id + '/results')"
          >
            {{ $t('vieRezultata') }}
          </b-button>
        </div>
      </div>
    </template>

    <b-modal :active.sync="isResultPrepopulatedModalActive" :width="640" scroll="clip">
      <modalResult
        :title="$t('upiiRezultatLige')"
        :partner="selectedPartner"
        :options="{ prepopulated: true, game_id: gameid }"
      ></modalResult>
    </b-modal>
    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="selectedResult"
        :title="$t('opcijeMea')"
        :subtitle="$t('Ako je došlo po problema u dogovoru za meč, imate sljedeće opcije:')"
        @update="weatherSave($event)"
      ></modalOptions>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import TennisImage from '@/components/TennisImage.vue'
import resultBox from '~/components/versusLotPlayed'
import hero from '~/components/Hero'
import Result from '~/models/Result'
import Team from '~/models/Team'
import modalResult from '~/components/modal/ModalResult'
import modalOptions from '~/components/liga/ModalMatchAdminOptions'
import trend from '~/components/stats/trend'

export default {
  name: 'PlayerStats',
  components: {
    VueApexCharts,
    modalOptions,
    modalResult,
    resultBox,
    trend,
    hero,
    TennisImage,
  },
  data() {
    return {
      results: [],
      partner: [],
      gameid: null,
      selectedResult: {},
      isMatchOptionsModal: false,
      isResultPrepopulatedModalActive: false,
      playerSelected: {},
      sending: false,
      options: {
        colors: ['#ff3860', '#9acd32'],
        chartOptions: {
          chart: {
            id: 'liga-statistika',
            type: 'pie',
            width: '10%',
            parentHeightOffset: 150,
          },
        },
        stroke: {
          show: false,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          formatter(val, opts) {
            return Math.round(val) + '%'
          },
          offsetY: 0,
          offsetX: 0,
          style: {
            fontSize: '20px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
            color: '#444444',
          },
          background: {
            enabled: true,
            foreColor: '#444444',
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0,
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 55,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '2%',
              background: 'transparent',
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: '20px',
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 600,
                  offsetY: -10,
                  color: '#444444',
                  formatter(val) {
                    return val
                  },
                },
                value: {
                  show: false,
                  fontSize: '22px',
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 500,
                  color: undefined,
                  offsetY: 16,
                  formatter(val) {
                    return val
                  },
                },
                total: {
                  show: false,
                  showAlways: false,
                  label: 'Ukupno',
                  fontSize: '30px',
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 600,
                  color: '#373d3f',
                  formatter(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  },
                },
              },
            },
          },
        },
      },
      optionsSmall: {
        colors: ['#ff3860', '#9acd32'],
        chartOptions: {
          chart: {
            id: 'liga-statistika',
            type: 'pie',
            width: '100%',
            parentHeightOffset: 0,
          },
        },
        stroke: {
          show: false,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
          },
          formatter(val, opts) {
            return Math.round(val) + '%'
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.2,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '0%',
              background: 'transparent',
            },
          },
        },
      },
    }
  },
  computed: {
    firstSets1() {
      return [
        this.playerSelected.stats.stats.wins - this.playerSelected.stats.stats.first_set_wins,
        this.playerSelected.stats.stats.first_set_wins,
      ]
    },
    player() {
      return this.$store.state.auth.user
    },
    user() {
      return this.$store.state.auth.user
    },
    hasPlayedMatches() {
      return _.filter(this.userMatchList, (item) => {
        return item.result !== null
      })
    },
    isPlayer() {
      return _.filter(this.liga.players, (item) => {
        return this.playerSelected.id === item.id
      })
    },
    hasWins() {
      return this.playerSelected.stats.stats.wins
    },
    hasLosses() {
      return this.playerSelected.stats.total.total - this.playerSelected.stats.stats.wins
    },
    series() {
      return [this.hasLosses, this.hasWins]
    },
    sets() {
      return [
        this.playerSelected.stats.total.sets - this.playerSelected.stats.stats.sets,
        this.playerSelected.stats.stats.sets,
      ]
    },
    tie() {
      return [
        this.playerSelected.stats.total.tie_breaks - this.playerSelected.stats.stats.tie_breaks,
        this.playerSelected.stats.stats.tie_breaks,
      ]
    },
    gems() {
      return [
        this.playerSelected.stats.total.points - this.playerSelected.stats.stats.points,
        this.playerSelected.stats.stats.points,
      ]
    },
    firstSet() {
      return [
        this.playerSelected.stats.stats.wins - this.playerSelected.stats.stats.first_set_wins,
        this.playerSelected.stats.stats.first_set_wins,
      ]
    },
    setsDiff() {
      return (
        this.playerSelected.stats.stats.sets -
        (this.playerSelected.stats.total.sets - this.playerSelected.stats.stats.sets)
      )
    },
    gemsDiff() {
      return (
        this.playerSelected.stats.stats.points -
        (this.playerSelected.stats.total.points - this.playerSelected.stats.stats.points)
      )
    },
    tieDiff() {
      return (
        this.playerSelected.stats.stats.tie_breaks -
        (this.playerSelected.stats.total.tie_breaks - this.playerSelected.stats.stats.tie_breaks)
      )
    },
    firstSetDiff() {
      return (
        this.playerSelected.stats.stats.first_set_wins -
        (this.playerSelected.stats.stats.wins - this.playerSelected.stats.stats.first_set_wins)
      )
    },
    selectedPartner() {
      return _.filter(this.partner, (item) => {
        return item.id !== this.$store.state.auth.user.id
      })
    },
    isPlayerPivot() {
      return _.filter(this.liga.groups[this.userInGroup].players, (item) => {
        return item.id === this.playerSelected.id
      })
    },
    myPosition() {
      return _.indexOf(this.liga.groups[this.userInGroup].players, this.isPlayerPivot[0]) + 1
    },
  },
  mounted() {
    this.getTeam()
    this.getVSResults()
  },
  methods: {
    getVSResults() {
      Result.where('player', this.$route.params.id)
        .limit(3)
        .get()
        .then((res) => {
          this.results = res.data
        })
    },
    precentage(one, two) {
      const sum = one + two
      let precentTwo = (two / sum) * 100
      precentTwo = isNaN(precentTwo) ? 50 : precentTwo
      return 'width:' + precentTwo + '%'
    },
    precentageSecond(item) {
      const test = this.playerSelected.stats.total.total
        ? Math.round((this.playerSelected.stats.stats.first_set_wins / this.playerSelected.stats.stats.wins) * 100)
        : 0
      return item === 1 ? test + '%' : 'width:' + test + '%'
    },
    openMatchAdmin(item) {
      this.selectedResult = item
      this.isMatchOptionsModal = true
    },
    getTeam() {
      this.loading = true
      Team.params({ wins: true, stats: true })
        .where('numbers_of_players', 1)
        .$find(this.$route.params.id)
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
