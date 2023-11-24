<template>
  <div v-if="true" class="member">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div v-if="Object.keys(player).length" class="activity x-container m-t--10">
      <div class="member__info">
        <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="">
          <TennisImage :size="[180, 180]" :src="player.players[0].image" class="user_image-large m-r-5" alt="" />
          <TennisImage :size="[180, 180]" :src="player.players[1].image" class="user_image-large m-l--80" alt="" />
        </div>
        <div v-else class="">
          <TennisImage :size="[180, 180]" :src="player.image" class="user_image-large" alt="" />
        </div>

        <div class="modal-subtitle m-t-5">{{ $t('teniskiPar') }}</div>
        <div class="title m-b-5">{{ player.display_name }}</div>
        <h2 v-if="player.rating" class="is-text-center fw600 is-size-5">
          {{ $t('bodova2', { round: Math.round(player.rating) }) }}
        </h2>

        <b-table class="softshadow tablelist m-t-20" :data="player.players" :mobile-cards="false" :bordered="false">
          <b-table-column v-slot="props" cell-class="list__image-col">
            <nuxt-link :to="localePath('/player/' + props.row.id)">
              <div class="list__img">
                <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
              </div>
              <div class="list__content has-text-left">
                <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                <!--                <div class="fw600 is-size-7 has-text-lightblue">{{ props.row.range + ' ' + $t('godina') }}</div>-->
              </div>
              <!--                  TODO - add rating to players (include Teams in doubles)-->
              <!--              <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>-->
              <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
            </nuxt-link>
          </b-table-column>
          <template v-if="!loading" #empty>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                <p class="modal-title">{{ $t('nemaTeniskihParova') }}</p>
              </div>
            </section>
          </template>
        </b-table>

        <div v-if="user.is_admin || checkIfEdit(player.players)" class="buttons m-t-20">
          <b-button
            tag="nuxt-link"
            :to="localePath(player.id + '/edit')"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-edit"
            rounded
          >
            {{ $t('urediPar') }}
          </b-button>
        </div>
        <div v-if="user.id !== player.id" class="buttons m-t-20">
          <b-button
            class="m-l-10"
            type="is-primary"
            pack="fal"
            icon-right="comments"
            rounded
            @click.native.prevent="submitMessage"
          >
            {{ $t('poaljiGrupnuPoruku') }}
          </b-button>
        </div>
      </div>
      <template>
        <template v-if="reservations.length && (isAdmin || (player.id === user.id && reservations.length))">
          <div class="activity__header--center m-b-10 m-t-20">
            <nuxt-link :to="localePath(player.id + '/reservation')" class="fw600"
              >{{ $t('rezervacije') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>
          <div class="activity__box">
            <div class="tablelist">
              <b-table :data="reservations" :checked-rows.sync="checkedRows" :bordered="false" :mobile-cards="false">
                <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
                  <nuxt-link :to="localePath('/')">
                    <div class="list__content m-l-15">
                      <div class="fw600 is-size-65 has-text-lightblue m-r-10 nowrap align__centar__x flex__column w100">
                        <span class="is-uppercase">{{
                          $moment(reservations[props.index].from).format('Do' + 'MM' + ', ' + 'dddd')
                        }}</span>
                        <span class="fw600 title-num is-size-6">{{
                          $moment(reservations[props.index].from).format('LT') +
                          ' — ' +
                          $moment(reservations[props.index].to).format('LT')
                        }}</span>
                      </div>
                    </div>
                    <b-tag :type="props.row.court ? 'is-info' : 'is-danger'">{{
                      props.row.court ? props.row.court.name : 'Obrisan teren'
                    }}</b-tag>
                  </nuxt-link>
                </b-table-column>
                <template #empty>
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                      <p class="modal-title">{{ $t('nemaRezervacija') }}</p>
                    </div>
                  </section>
                </template>
              </b-table>
            </div>
          </div>
          <div v-if="reservations.length" class="buttons m-t-10">
            <b-button
              class="softshadow m-t-10 m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="long-arrow-right"
              rounded
              tag="nuxt-link"
              :to="localePath(player.id + '/reservation')"
            >
              {{ $t('urediRezervacije') }}
            </b-button>
          </div>
        </template>
        <template v-if="false">
          <template v-if="player.stats.total.total > 0">
            <div class="activity__header--center m-b-10 m-t-20">
              <nuxt-link :to="localePath($route.params.id + '/stats')" class="fw600"
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
              <div class="statistic__item">
                <div class="label--center">{{ $t('rankUKlubu') }}</div>
                <div class="label__num is-size-2 has-text-black50">
                  <span class="has-text-black80">{{ playerSelected.rank_club }}</span>
                </div>
              </div>
              <div class="statistic__item">
                <div class="label--center">{{ $t('eloBodovi') }}</div>
                <div class="label__num is-size-2 has-text-black50">
                  <span class="has-text-black80">{{ Math.round(playerSelected.rating) }}</span>
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
            <div class="buttons m-t-10">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                icon-right="long-arrow-right"
                rounded
                tag="nuxt-link"
                :to="localePath(player.id + '/stats')"
              >
                {{ $t('vieStatistike') }}
              </b-button>
            </div>
          </template>
        </template>
        <template v-if="results.length">
          <div class="activity__header--center m-b-0 m-t-20">
            <nuxt-link :to="localePath($route.params.id + '/results')" class="fw600"
              >{{ $t('rezultati') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>

          <div v-touch:swipe="swipeHandler">
            <b-tabs v-model="activeTab" position="is-centered">
              <b-tab-item :label="$t('ukupno')">
                <div v-if="Object.keys(player).length" class="modal-subtitle has-text-centered fw400 m-b-20">
                  {{ $t('ukupnoMeeva') }}
                  <span class="has-text-primary">{{ totalMatches }}</span>
                  <div class="m-t-10">
                    <span class="is-size-7 x-tag green nav__notification has-text-white">{{
                      player.winslosses.wins
                    }}</span>
                    <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
                      player.winslosses.losses
                    }}</span>
                  </div>
                </div>
                <div class="activity__results results">
                  <div class="activity__box">
                    <div class="results__list">
                      <div v-for="result in results" :key="result.id">
                        <resultBox :result="result"> </resultBox>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item v-if="player.id !== $auth.user.id && my_results.length" :label="$t('meusobno')">
                <div class="modal-subtitle has-text-centered fw400 m-b-20">
                  {{ $t('ukupnoMeeva') }}
                  <span class="has-text-primary">{{ my_results.length }}</span>
                </div>
                <div class="activity__results results">
                  <div class="activity__box">
                    <div class="results__list">
                      <div v-for="result in my_results" :key="result.id">
                        <resultBox :result="result"> </resultBox>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
          <div v-if="results.length" class="buttons m-t--10">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="long-arrow-right"
              rounded
              tag="nuxt-link"
              :to="localePath(player.id + '/results')"
            >
              {{ $t('sviRezultati') }}
            </b-button>
          </div>
        </template>
        <template v-else>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"> </b-icon>
              <p class="has-text-centerd fw600 m-t-7">
                {{ $t('zaPrikazPopisaRezultataIStatistikeMorateImatiUnese') }}
              </p>
              <div class="buttons m-t-10">
                <b-button
                  class="softshadow m-b-10"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="tennis-ball"
                  rounded
                  tag="nuxt-link"
                  :to="localePath('/result')"
                >
                  {{ $t('unesiRezultat') }}
                </b-button>
              </div>
            </div>
          </section>
        </template>
      </template>
    </div>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('trajnoObriiKorisnika')"
        :subtitle="$t('Nakon brisanja korisnika svi podaci će biti obrisani')"
        @update="deletePlayer()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalRemoveUserFromClubActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('uklanjanjeKorisnikaIzKluba')"
        :subtitle="$t('Nakon potvrde korisnik neće biti više član kluba')"
        @update="removeFromClub()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalRemoveUserFromClubActiveSelf" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('brisanjeProfila')"
        :subtitle="$t('Nakon potvrde više nećete imati profil')"
        @update="deletePlayer()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import VueApexCharts from 'vue-apexcharts'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBox'
import Player from '~/models/Player'
import Result from '~/models/Result'
import Team from '~/models/Team'

export default {
  // TODO: add team rating_club or add to player object on players of the doubles - 37
  name: 'Doubles',
  components: {
    VueApexCharts,
    modalConfirmation,
    resultBox,
    TennisImage,
  },
  async fetch() {
    if (this.$auth.loggedIn) {
      await this.loadReservations()
    }
    await this.$nextTick(() => {
      this.getPlayer().then((res) => {
        this.getResults()
        this.getVSResults()
        this.$root.$loading.finish()
      })
    })
  },
  data() {
    return {
      isModalClubActive: false,
      isModalRemoveUserFromClubActiveSelf: false,
      isModalRemoveUserFromClubActive: false,
      bottom: false,
      activeTab: 0,
      isCardModalActive: false,
      isModalDeleteActive: false,
      total_user_reservation: 1221,
      is_admin: {
        admin: [],
        winslosses: [],
        is_admin: false,
      },
      player: {},
      player_memberships: [],
      reservations: [],
      checkboxPosition: 'left',
      checkedRows: [],
      results: [],
      results_page: 1,
      results_total_pages: 1,
      totalMatches: 0,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      meta: '',
      memberships: [],
      loading: false,
      loadingClub: false,
      loadingAdmin: false,
      test1: '',
      test2: '',
      test3: '',
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
      test: '',
      updateMemberData: { member: [], applicant: [], blocked: [] },
      payments: [],
      paymentsMeta: {},
      funds: {},
      isModalPrepaidActive: false,
      isModalPrepaidPaymentActive: false,
      firstTransaction: false,
    }
  },
  computed: {
    playerSelected() {
      return this.player
    },

    check() {
      if (this.user.id === 2) {
        return false
      }
      if (Object.keys(this.player).length && this.clubId !== null) {
        return this.player.club_member[this.clubId.toString()].type
      }
      return false
    },
    clubId() {
      return this.club.id
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
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
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getMore()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    checkIfEdit(players) {
      if (players[0].id === this.user.id || players[1].id === this.user.id) {
        return true
      }
      return false
    },
    precentageSecond(item) {
      const test = this.playerSelected.stats.total.total
        ? Math.round((this.playerSelected.stats.stats.first_set_wins / this.playerSelected.stats.stats.wins) * 100)
        : 0
      return item === 1 ? test + '%' : 'width:' + test + '%'
    },
    removeFromClub() {
      this.loading = true
      this.$root.$loading.start()
      this.$axios
        .put('v2/club/member', { delete: [this.player] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se uklonili korisnika iz kluba'),
            type: 'is-success',
          })
          this.loading = false
          this.$root.$loading.finish()
          this.$router.push(this.localePath('/player'))
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
    isCancelable(item) {
      if (this.reservations.length && this.$store.state.club.memberships.length) {
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
    loadReservations() {
      Reservation.where('player', this.$route.params.id)
        .limit(3)
        .$get()
        .then((res) => (this.reservations = res))
    },
    async getPlayer() {
      let id
      if (this.$route.params.id) {
        id = this.$route.params.id
      } else {
        id = this.user.id
      }
      this.player = await Team.params({ wins: true, stats: true }).$find(id)
    },
    deletePlayer() {
      const p = new Player({ id: this.player.id })
      p.delete()
        .then(() => {
          this.$router.push(this.localePath('/player/'))
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali profil'),
            type: 'is-success',
          })
          this.$auth.logout()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    submitMessage() {
      // console.log(this.user.id + '-' + this.player.id)
      // Thread.whereIn('players_exact', [this.user.id, this.player.id])
      //   .get()
      //   .then((res) => {
      //     if (res.data.length) {
      //       this.$router.push(`/messages/${res.data[0].id}`)
      //     } else {
      //       const t = new Thread({ players: [this.player] })
      //       t.save().then((res) => {
      //         this.$router.push(`/messages/${res.id}`)
      //       })
      //     }
      //   })
    },
    submitMessage1() {
      Thread.whereIn('players_exact', [this.user.id, this.player.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.player] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    getMore() {
      if (this.activeTab === 0 && this.results_total_pages >= this.results_page) {
        this.getResults()
      }
      if (this.activeTab === 1 && this.my_results_total_pages >= this.my_results_page) {
        this.getVSResults()
      }
    },
    getResults() {
      Result.where('team', this.player.id)
        .limit(3)
        .get()
        .then((res) => {
          this.results = res.data
          this.totalMatches = res.meta.total
          this.meta = res.meta
        })
    },
    getVSResults() {
      // TODO: remove this
      if (this.player.id !== this.$auth.user.team.id) {
        Result.where('players', this.player.id + ',' + this.$auth.user.team.id)
          .page(this.my_results_page)
          .get()
          .then((res) => {
            this.my_results = [...this.my_results, ...res.data]
            this.my_results_total_pages = res.meta.last_page
            this.my_results_page++
          })
      }
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
