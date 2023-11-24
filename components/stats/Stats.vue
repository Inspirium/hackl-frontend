<template>
  <div v-if="Object.keys(playerSelected).length">
    <div v-if="loading" class="align__centar__x loading_z_spinner">
      <b-icon
        class="comment-send m-b-20"
        custom-class="rotating"
        icon="spinner"
        size="is-large"
        type="is-primary"
        pack="far"
      ></b-icon>
    </div>

    <template v-if="playerSelected.stats.total.total">
      <div v-if="showTitle" class="activity__header--center m-b-10 m-t-30">
        <nuxt-link :to="localePath('/team/' + playerSelected.id + '/stats')" class="fw600"
          >{{ $t('statistika') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>

      <div class="m-t-0 has-text-centered">
        <span class="is-size-7 x-tag green nav__notification has-text-white">{{
          $t('pobjeda', { wins: playerSelected.stats.stats.wins })
        }}</span>
        <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
          $t('poraza', { expr: playerSelected.stats.total.total - playerSelected.stats.stats.wins })
        }}</span>
      </div>
      <div class="statistics_new m-b-10 m-t-15 softshadow">
        <div v-if="$store.state.club.id !== 26" class="statistic__item">
          <div class="label--center">{{ $t('rankUKlubu') }}</div>
          <div class="label__num is-size-2 has-text-black50">
            <span class="has-text-black80">{{ playerSelected.rank_club }}</span>
          </div>
        </div>
        <div v-else class="statistic__item">
          <div class="label--center">{{ $t('Globalni rank') }}</div>
          <div class="label__num is-size-2 has-text-black50">
            <span class="has-text-black80">{{ playerSelected.rank_global }}</span>
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
          <div class="label__num-v1 fw600 is-size-6" :class="[setsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']">
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
          <div class="label__num-v1 fw600 is-size-6" :class="[setsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']">
            <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('gemRazlika2') }} </span
            >{{ gemsDiff > 0 ? '+' : '' }}{{ gemsDiff }}
          </div>
        </div>
      </div>
      <div class="buttons m-t-20">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="long-arrow-right"
          rounded
          tag="nuxt-link"
          :to="localePath('/team/' + playerSelected.id + '/stats')"
        >
          {{ $t('vieStatistike') }}
        </b-button>
      </div>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import Team from '~/models/Team'

export default {
  name: 'PlayerStats',
  components: {
    VueApexCharts,
  },
  props: {
    team: {
      type: Number,
      required: true,
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
      loading: true,
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
      playerSelected: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
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
  },
  mounted() {
    this.getTeam()
  },
  methods: {
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
