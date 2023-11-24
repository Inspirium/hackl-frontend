<template>
  <div v-if="Object.keys(stats).length && totals.total > 0 && true">
    <div v-if="showTitle" class="activity__header--center m-b-10">
      <div class="fw600 is-size-35 has-text-centered">{{ $t('meusobniOmjer') }}</div>
    </div>

    <div class="activity__box p-t-15 p-l-15 p-r-15 p-b-15">
      <div v-if="totals.total" class="">
        <div v-if="result.players.length > 1">
          <div class="comments__box">
            <div class="flex justify-between flex1 relative">
              <div :class="{ result__score: true, 'm-b-5': true }">
                <nuxt-link :to="localePath(resultItem.players[0].link)" class="flex__column align__centar__y">
                  <TennisImage
                    :size="[130, 130]"
                    :src="resultItem.players[0].image"
                    class="user_image-mediumlarge"
                    alt=""
                  />
                  <div class="fw600 has-text-black30 m-t-10 letter-spacing-3 is-uppercase">
                    {{ resultItem.players[0].first_name }}
                  </div>
                  <div class="fw600 is-size-4 has-text-black80 m-t--5">{{ resultItem.players[0].last_name }}</div>
                </nuxt-link>
              </div>
              <div v-if="Object.keys(stats).length" class="versus-score-box">
                <div :class="whoWon === 0 ? 'versus-score-winner' : 'versus-score'" class="is-black10 has-text-black80">
                  {{ stats[resultItem.players[0].id].wins }}
                </div>
                <div class="versus-separator"></div>
                <div :class="whoWon === 1 ? 'versus-score-winner' : 'versus-score'" class="is-primary has-text-white">
                  {{ stats[resultItem.players[1].id].wins }}
                </div>
              </div>
              <div :class="{ result__score: true }">
                <nuxt-link :to="localePath(resultItem.players[1].link)" class="flex__column align__centar__y">
                  <TennisImage
                    :size="[130, 130]"
                    :src="resultItem.players[1].image"
                    class="user_image-mediumlarge"
                    alt=""
                  />
                  <div class="fw600 has-text-black30 is-uppercase letter-spacing-3 m-t-10">
                    {{ resultItem.players[1].first_name }}
                  </div>
                  <div class="fw600 is-size-4 has-text-black80 m-t--5">{{ resultItem.players[1].last_name }}</div>
                </nuxt-link>
              </div>
            </div>
          </div>
          <div class="versus-statis-line m-t-5 m-b-5">
            <div class="flex flex1 justify-between align__centar__y w100">
              <div class="is-size-6 fw600">{{ winProbabilitiy[0] }}%</div>
              <div class="label--versus">{{ $t('vjerojatnostPobjede') }}</div>
              <div class="is-size-6 fw600">{{ winProbabilitiy[1] }}%</div>
            </div>
            <div class="flex">
              <div class="probability-win-box is-black10" :style="`width: ${winProbabilitiy[0]}%`"></div>
              <div class="probability-win-box is-primary" :style="`width: ${winProbabilitiy[1]}%`"></div>
            </div>
          </div>
          <div class="versus-statis-line m-t-5 m-b-5">
            <div class="flex flex1 justify-between align__centar__y w100">
              <div class="is-size-4 fw500">{{ resultItem.players[0].rank_club }}.</div>
              <div class="label--versus">{{ $t('rankUKlubu') }}</div>
              <div class="is-size-4 fw500">{{ resultItem.players[1].rank_club }}.</div>
            </div>
          </div>
          <div class="divider-line-1 m-t-0"></div>
          <div class="versus-statis-line m-t-5 m-b-5">
            <div class="flex flex1 justify-between align__centar__y w100">
              <div class="is-size-4 fw500">{{ resultItem.players[0].score_club }}</div>
              <div class="label--versus">{{ $t('eloBodovi') }}</div>
              <div class="is-size-4 fw500">{{ resultItem.players[1].score_club }}</div>
            </div>
          </div>
          <div class="divider-line-1 m-t-0"></div>
          <div class="versus-statis-line m-t-5 m-b-5">
            <div class="flex flex1 justify-between align__centar__y w100">
              <trend :player="resultItem.players[0].id" :limit="10" class="m-b-5 m-t-5 vstrend-left w100"> </trend>
              <div class="label--versus p-l-20 p-r-20">{{ $t('trend') }}</div>
              <trend :player="resultItem.players[1].id" :limit="10" class="m-b-5 m-t-5 vstrend-right w100"> </trend>
            </div>
          </div>
          <div class="divider-line-1 m-t-0"></div>

          <div class="versus-statis-line m-t-5 m-b-5">
            <div class="flex flex1 justify-between align__centar__y w100">
              <!-- eslint-disable vue/no-v-html -->
              <div class="is-size-6 fw600 has-text-green has-text-left" v-html="calculateDiff(0)"></div>
              <div class="label--versus p-l-20 p-r-20">
                {{ $t('moguiDobitakgubitakEloBodovaUSluajuPobjedeIliPoraz') }}
              </div>
              <div class="is-size-6 fw600 has-text-green has-text-right" v-html="calculateDiff(1)"></div>
              <!-- eslint-enable vue/no-v-html -->
            </div>
          </div>

          <div class="divider-line-1 m-t-0"></div>
          <div class="buttons m-t-30 m-b--10">
            <b-button
              class="softshadow invert-small-button"
              :type="
                !show_details
                  ? 'is-primary is-small noborder has-text-white'
                  : 'is-danger is-small noborder has-text-white'
              "
              pack="fal"
              :icon-right="!show_details ? 'plus' : 'minus'"
              rounded
              @click="show_details = !show_details"
            >
              {{ !show_details ? $t('Prikaži detaljnu statistiku') : $t('Sakriji detaljnu statistiku') }}
            </b-button>
          </div>

          <template v-if="show_details">
            <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">
              {{ $t('meusobniOgledi') }}
            </div>
            <div class="statistics_new m-b-20 is-bckg border-radius-0">
              <div class="statistic__item">
                <div class="label--versus">{{ $t('meeva') }}</div>
                <div class="label__num is-size-3 has-text-black50 border-white">
                  <span class="has-text-black80">{{ totals.total }}</span>
                </div>
              </div>
              <div class="statistic__item">
                <div class="label--versus">{{ $t('natjecanja') }}</div>
                <div class="label__num is-size-3 has-text-black50 border-white">
                  <span class="has-text-black80">{{ totals.competition }}</span>
                </div>
              </div>
              <div class="statistic__item">
                <div class="label--versus">{{ $t('prijateljski') }}</div>
                <div class="label__num is-size-3 has-text-black50 border-white">
                  <span class="has-text-black80">{{ totals.friendly }}</span>
                </div>
              </div>
            </div>

            <div class="versus-statis-line">
              <div class="label--center">{{ $t('setovi') }}</div>
              <div class="flex flex1 w100 m-t--2 relative">
                <div
                  class="versus-stats-value-left is-bckg"
                  :style="precentage(stats[resultItem.players[1].id].sets, stats[resultItem.players[0].id].sets)"
                >
                  {{ stats[resultItem.players[0].id].sets }}
                </div>
                <div class="versus-separator-half"></div>
                <div
                  class="versus-stats-value-right is-primary has-text-white has-text-right"
                  :style="precentage(stats[resultItem.players[0].id].sets, stats[resultItem.players[1].id].sets)"
                >
                  {{ stats[resultItem.players[1].id].sets }}
                </div>
              </div>
            </div>
            <div class="versus-statis-line m-t-15">
              <div class="label--center">{{ $t('gemovi') }}</div>
              <div class="flex flex1 w100 m-t--2">
                <div
                  class="versus-stats-value-left is-bckg"
                  :style="precentage(stats[resultItem.players[1].id].points, stats[resultItem.players[0].id].points)"
                >
                  {{ stats[resultItem.players[0].id].points }}
                </div>
                <div class="versus-separator-half"></div>
                <div
                  class="versus-stats-value-right is-primary has-text-white has-text-right"
                  :style="precentage(stats[resultItem.players[0].id].points, stats[resultItem.players[1].id].points)"
                >
                  {{ stats[resultItem.players[1].id].points }}
                </div>
              </div>
            </div>
            <div class="versus-statis-line m-t-15">
              <div class="label--center">Tie-break</div>
              <div class="flex flex1 w100 m-t--2">
                <div
                  class="versus-stats-value-left is-bckg"
                  :style="
                    precentage(stats[resultItem.players[1].id].tie_breaks, stats[resultItem.players[0].id].tie_breaks)
                  "
                >
                  {{ stats[resultItem.players[0].id].tie_breaks }}
                </div>
                <div class="versus-separator-half"></div>
                <div
                  class="versus-stats-value-right is-primary has-text-white has-text-right"
                  :style="
                    precentage(stats[resultItem.players[0].id].tie_breaks, stats[resultItem.players[1].id].tie_breaks)
                  "
                >
                  {{ stats[resultItem.players[1].id].tie_breaks }}
                </div>
              </div>
            </div>

            <div v-if="false" class="versus-statis-line m-t-15">
              <div class="label--center w80 m-x-auto line-height-11">
                {{ $t('brojUkupnihPobjedaAkoJeDobivenPrviSet') }}
              </div>
              <div class="versus-statis-line m-t-5">
                <div class="flex flex1 w100 m-t--2">
                  <div
                    class="versus-stats-value-left is-bckg"
                    :style="
                      precentage(
                        stats[resultItem.players[1].id].first_set_wins,
                        stats[resultItem.players[0].id].first_set_wins
                      )
                    "
                  >
                    {{ stats[resultItem.players[0].id].first_set_wins }}
                  </div>
                  <div class="versus-separator-half"></div>
                  <div
                    class="versus-stats-value-right is-primary has-text-white has-text-right"
                    :style="
                      precentage(
                        stats[resultItem.players[0].id].first_set_wins,
                        stats[resultItem.players[1].id].first_set_wins
                      )
                    "
                  >
                    {{ stats[resultItem.players[1].id].first_set_wins }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="true" class="statistics_new m-b-10 m-t-20 p-all-0">
              <div class="label--center w80 m-x-auto line-height-11">
                {{ $t('vjerojatnostPobjedeAkoJeOsvojenPrviSet') }}
              </div>
              <div class="statistic__item">
                <div class="chart__donut">
                  <VueApexCharts type="donut" :options="optionsSmall" :series="firstSets1"></VueApexCharts>
                </div>
                <div class="label__num-v1 is-size-6">
                  <span class="has-text-black50 fw600 is-size-7 is-uppercase flex align__centar__all"
                    >{{ $t('osvojenihPrvihSetovaukupnoMeeva') }}
                  </span>
                </div>

                <div class="label__num-v1 fw600 is-size-4 has-text-danger">
                  <span class="has-text-darkgreen"
                    >{{ stats[resultItem.players[0].id].first_set_wins
                    }}<span class="has-text-black80"> / {{ stats[resultItem.players[0].id].wins }}</span></span
                  >
                </div>
              </div>
              <div class="statistic__item">
                <div class="chart__donut">
                  <VueApexCharts type="donut" :options="optionsSmall" :series="firstSets2"></VueApexCharts>
                </div>
                <div class="label__num-v1 is-size-6">
                  <span class="has-text-black50 fw600 is-size-7 line-height-8 is-uppercase flex align__centar__all"
                    >{{ $t('osvojenihPrvihSetovaukupnoMeeva') }}
                  </span>
                </div>
                <div class="label__num-v1 fw600 is-size-4 has-text-danger">
                  <span class="has-text-darkgreen"
                    >{{ stats[resultItem.players[1].id].first_set_wins
                    }}<span class="has-text-black80"> / {{ stats[resultItem.players[1].id].wins }}</span></span
                  >
                </div>
              </div>
            </div>
            <template v-if="my_results.length">
              <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">
                {{ $t('meusobniOgledi') }}
              </div>
              <div class="results">
                <div v-for="(game, index) in my_results" :key="index" class="m-b-10">
                  <div class="activity__results">
                    <div class="activity__box">
                      <div class="results__list">
                        <resultBox v-if="game.result !== null" :show-date="true" :game="game"></resultBox>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="my_results.length" class="buttons m-t-20">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="long-arrow-right"
                    rounded
                    tag="nuxt-link"
                    :to="localePath('/team/' + resultItem.players[1].id + '/results')"
                  >
                    {{ $t('vieRezultata') }}
                  </b-button>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import TennisImage from '@/components/TennisImage.vue'
import Result from '~/models/Result'
import resultBox from '~/components/versusLotPlayed'
import trend from '~/components/stats/trend'

export default {
  name: 'PlayersVsStats',
  components: {
    VueApexCharts,
    trend,
    resultBox,
    TennisImage,
  },
  props: {
    resultItem: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      result: this.resultItem,
      attenders_expand: false,
      results: [],
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      show_details: false,
      stats: [],
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
      totals: {
        friendly: 0,
        competition: 0,
        total: 0,
      },
    }
  },
  computed: {
    winProbabilitiy() {
      let final0 = null
      let final1 = null
      // const positionPlayerOne = this.resultItem.players[0]
      // const positionPlayerTwo = this.resultItem.players[1]
      const p1wins = this.stats[this.resultItem.players[0].id].wins
      const p2wins = this.stats[this.resultItem.players[1].id].wins
      const player1 = this.resultItem.players[0].rating
      const player2 = this.resultItem.players[1].rating
      const diff = player1 - player2
      let p0 = 1 - 1 / (1 + 10 ** (diff / 400.0))
      p0 = Math.round(p0 * 100)
      const p1 = 100 - p0
      const VersusPointsForFirstPlayer = (p1wins / (p1wins + p2wins)) * 100
      const VersusPointsForSecondPlayer = (p2wins / (p1wins + p2wins)) * 100
      final0 = Math.round(p0 + VersusPointsForFirstPlayer) / 2
      final1 = Math.round(p1 + VersusPointsForSecondPlayer) / 2
      return [final0, final1]
    },
    firstSets1() {
      return [
        this.stats[this.resultItem.players[0].id].wins - this.stats[this.resultItem.players[0].id].first_set_wins,
        this.stats[this.resultItem.players[0].id].first_set_wins,
      ]
    },
    firstSets2() {
      return [
        this.stats[this.resultItem.players[1].id].wins - this.stats[this.resultItem.players[1].id].first_set_wins,
        this.stats[this.resultItem.players[1].id].first_set_wins,
      ]
    },
    firstSetsDiff1() {
      if (this.stats[this.resultItem.players[0].id].wins >= this.stats[this.resultItem.players[0].id].first_set_wins) {
        return this.stats[this.resultItem.players[0].id].first_set_wins
      }
      return this.stats[this.resultItem.players[0].id].wins
    },
    firstSetsDiff2() {
      if (this.stats[this.resultItem.players[1].id].wins >= this.stats[this.resultItem.players[1].id].first_set_wins) {
        return this.stats[this.resultItem.players[1].id].first_set_wins
      }
      return this.stats[this.resultItem.players[1].id].wins
    },
    whoWon() {
      if (this.stats[this.resultItem.players[0].id].wins > this.stats[this.resultItem.players[1].id].wins) {
        return 0
      }
      if (this.stats[this.resultItem.players[0].id].wins < this.stats[this.resultItem.players[1].id].wins) {
        return 1
      }
      if (this.stats[this.resultItem.players[0].id].wins === this.stats[this.resultItem.players[1].id].wins) {
        return 2
      }
      return null
    },
    user() {
      return this.$store.state.auth.user
    },
    userWatching() {
      return this.resultItem.watchers.filter((item) => {
        return item.id === this.user.id
      })
    },
  },
  mounted() {
    this.getVSStats()
    this.getVSMatches()
  },
  methods: {
    getVSMatches() {
      Result.where('players', this.resultItem.players[0].id + ',' + this.resultItem.players[1].id)
        .limit(3)
        .get()
        .then((res) => {
          this.my_results = res.data
        })
    },
    calculateDiff(player) {
      const rating1 = Math.round(this.resultItem.players[player === 0 ? 0 : 1].rating)
      const rating2 = Math.round(this.resultItem.players[player !== 0 ? 0 : 1].rating)
      const r1 = Math.pow(10, rating1 / 400)
      const r2 = Math.pow(10, rating2 / 400)
      const e1 = r1 / (r1 + r2)
      const win = Math.round(32 * (1 - e1))
      const lose = Math.round(32 * -e1)
      return '<div class="score_win">' + '+' + win + '</div><div class="score_lose m-t--5">' + lose + '</div>'
    },
    precentage(one, two) {
      const sum = one + two
      let precentTwo = (two / sum) * 100
      precentTwo = isNaN(precentTwo) ? 50 : precentTwo
      return 'width:' + precentTwo + '%'
    },
    getVSStats() {
      Result.where('playersStats', this.resultItem.players[1].id + ',' + this.resultItem.players[0].id)
        .get()
        .then((res) => {
          this.stats = res[0].stats
          this.totals = res[0].totals
          if (res[0].totals.total === 0) {
            this.$emit('hideVsStats')
          }
        })
    },
  },
}
</script>
