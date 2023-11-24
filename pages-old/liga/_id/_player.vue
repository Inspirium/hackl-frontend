<template>
  <div>
    <div v-if="Object.keys(liga).length && Object.keys(playerSelected).length" class="analytics p-b-100">
      <div class="member__info liga__header is-primary">
        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('profilIgraaLige') }}</div>
      </div>
      <hero :options="heroImage" :back="true" class="liga__hero">
        <h1 class="has-text-white">{{ liga.name }}</h1>
      </hero>

      <div class="x-container">
        <div class="analytics_header m-t-20">
          <div class="member__info">
            <div class="title m-b-10 m-t-5" @click="$router.push(localePath('/player/' + playerSelected.id))">
              {{ playerSelected.display_name }}
            </div>
            <div v-if="!liga.is_doubles" class="modal-subtitle">
              {{ $t('godina range', { range: playerSelected.range }) }}
            </div>

            <div class="buttons m-t-10 m-b-0">
              <b-button
                v-if="!liga.is_doubles"
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                icon-right="chevron-right"
                rounded
                @click="
                  $router.push(
                    liga.is_doubles ? '/doubles/' + playerSelected.id : '/player/' + playerSelected.players[0].id
                  )
                "
              >
                {{ $t('idiNaOpiProfiligaca') }}
              </b-button>
              <b-button
                v-else
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                icon-right="chevron-right"
                rounded
                @click="
                  $router.push(
                    liga.is_doubles ? '/doubles/' + playerSelected.id : '/player/' + playerSelected.players[0].id
                  )
                "
              >
                {{ $t('idiNaOpiProfilpara') }}
              </b-button>
            </div>
            <template v-if="!liga.is_doubles">
              <div v-if="user.id !== playerSelected.id" class="buttons m-t-20">
                <b-button
                  :href="'tel:' + playerSelected.players[0].phone"
                  tag="a"
                  class="m-l-10"
                  type="is-danger"
                  pack="far"
                  icon-right="phone"
                  rounded
                >
                  {{ $t('nazovi') }}
                </b-button>
                <b-button
                  class="m-l-10"
                  type="is-primary"
                  pack="fal"
                  icon-right="comments"
                  rounded
                  :loading="loadingMessegas"
                  @click.native.prevent="submitMessage"
                >
                  {{ $t('poaljiPoruku') }}
                </b-button>
              </div>
            </template>
          </div>
        </div>
        <template v-if="liga.is_doubles">
          <div class="member__info m-t-20 m-b-10">
            <div v-if="playerSelected.image === 'https://api.tenis.plus/images/user.svg'" class="">
              <TennisImage
                :size="[180, 180]"
                :src="playerSelected.players[0].image"
                class="user_image-large m-r-5"
                alt=""
              />
              <TennisImage
                :size="[180, 180]"
                :src="playerSelected.players[1].image"
                class="user_image-large m-l--80"
                alt=""
              />
            </div>
            <div v-else class="">
              <TennisImage :size="[180, 180]" :src="playerSelected.image" class="user_image-large" alt="" />
            </div>
            <h2 v-if="playerSelected.rating" class="is-text-center fw600 is-size-5">
              {{ $t('bodova2', { round: Math.round(playerSelected.rating_club) }) }}
            </h2>
            <b-table
              class="softshadow tablelist m-t-20"
              :data="playerSelected.players"
              :mobile-cards="false"
              :bordered="false"
            >
              <b-table-column v-slot="props" cell-class="list__image-col">
                <nuxt-link :to="localePath('/player/' + props.row.id)">
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content has-text-left">
                    <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                    <div class="fw600 is-size-7 has-text-lightblue">{{ props.row.range + ' ' + $t('godina') }}</div>
                  </div>
                  <!--                  TODO - add rating to players (include Teams in doubles)-->
                  <!--                  <b-tag type="is-info">{{ Math.round(props.row.rating_club) }}</b-tag>-->
                </nuxt-link>
              </b-table-column>
            </b-table>

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
        </template>
        <template v-if="!liga.is_doubles">
          <div class="chart__donut__big m-t-10">
            <VueApexCharts height="250" type="donut" :options="options" :series="series"></VueApexCharts>
            <div class="chart__donut__img">
              <TennisImage :size="[200, 200]" :src="playerSelected.image" class="user_image-medium m-r-5" alt="" />
            </div>
          </div>
        </template>
        <div class="m-t-10 has-text-centered">
          <span class="is-size-7 x-tag green nav__notification has-text-white">{{
            $t('pobjeda2', { length: hasWins.length })
          }}</span>
          <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
            $t('poraza', { expr: hasPlayedMatches.length - hasWins.length })
          }}</span>
        </div>

        <div class="member__info">
          <div v-if="userMatchList.length - hasPlayedMatches.length > 0" class="is-size-5 fw600 m-b--10 m-t-5">
            {{ $t('preostaloMeeva', { expr: userMatchList.length - hasPlayedMatches.length }) }}
          </div>
          <div v-else class="is-size-5 fw600 m-b--10 m-t-5">{{ $t('odigraniSuSviMeevi') }}</div>
        </div>

        <div class="statistics_new m-b-10 m-t-30 softshadow">
          <div class="statistic__item">
            <div class="label--center">{{ $t('pozicija3') }}</div>
            <div class="label__num is-size-2 has-text-black50">
              <span class="has-text-black80">{{ hasWins.length }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('bodova7') }}</div>
            <div class="label__num is-size-2 has-text-black50">
              <span class="has-text-black80">{{
                isPlayerPivot[0].pivot.score === null ? 0 : isPlayerPivot[0].pivot.score
              }}</span>
            </div>
          </div>
          <!--        <div class="statistic__item">-->
          <!--          <div class="label--center">ELO bodova</div>-->
          <!--          <div class="label__num is-size-2 has-text-black50">-->
          <!--            <span class="has-text-danger">{{ hasPlayedMatches.length - hasWins.length }}</span>-->
          <!--          </div>-->
          <!--        </div>-->
        </div>
        <!--      <div class="activity__box statistics_new m-b-10">-->
        <!--        <div class="statistic__item">-->
        <!--          <div class="label--center">Ukupno osvojenih bodova</div>-->
        <!--          <div class="label__num is-size-2 has-text-black80">12</div>-->
        <!--        </div>-->
        <!--      </div>-->
        <div v-if="hasPlayedMatches.length" class="statistics_new m-b-10 softshadow 11">
          <div class="statistic__item">
            <div class="label--center">{{ $t('setovi') }}</div>
            <div class="chart__donut">
              <VueApexCharts type="donut" :options="optionsSmall" :series="sets"></VueApexCharts>
            </div>
            <div class="label__num is-size-4 has-text-danger">
              <span class="has-text-darkgreen"
                >{{ liga.groups[userInGroup].stats[isPlayer[0].id].sets.wins
                }}<span class="has-text-black80"> / </span></span
              >{{ liga.groups[userInGroup].stats[isPlayer[0].id].sets.losses }}
            </div>
            <div class="label__num is-size-6" :class="[gemsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']">
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('setRazlika2') }} </span
              >{{ setsDiff > 0 ? '+' : '' }}{{ setsDiff }}
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('gemovi') }}</div>
            <div class="chart__donut">
              <VueApexCharts type="donut" :options="optionsSmall" :series="gems"></VueApexCharts>
            </div>
            <div class="label__num is-size-4 has-text-danger">
              <span class="has-text-darkgreen"
                >{{ liga.groups[userInGroup].stats[isPlayer[0].id].points.wins
                }}<span class="has-text-black80"> / </span></span
              >
              {{ liga.groups[userInGroup].stats[isPlayer[0].id].points.losses }}
            </div>
            <div class="label__num is-size-6" :class="[gemsDiff > 0 ? 'has-text-darkgreen' : 'has-text-danger']">
              <span class="has-text-black50 fw600 is-size-7 is-uppercase">{{ $t('gemRazlika2') }} </span
              >{{ gemsDiff > 0 ? '+' : '' }}{{ gemsDiff }}
            </div>
          </div>
        </div>
        <div class="buttons m-t-10">
          <b-button
            class="softshadow m-t-10 m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath(`/player/${isPlayer[0].id}/stats`)"
          >
            {{ $t('pogledajCjelovituStatitiku') }}
          </b-button>
        </div>
      </div>

      <div class="x-container">
        <div class="fw600 is-size-3 m-t-20 m-b-10">{{ $t('meeviULigi') }}</div>
        <div class="">
          <div v-for="(game, index) in userMatchList.reverse()" :key="index" class="m-b-10">
            <ligaLotEmpty
              v-if="game.result === null"
              :game="game"
              :is-doubles="liga.is_doubles"
              :isligaadmin="isLigaAdmin.length"
              @openIt="
                partner = game.players
                gameid = game.id
                isResultPrepopulatedModalActive = true
              "
              @openItAdmin="openMatchAdmin(game)"
            ></ligaLotEmpty>
            <ligaLotPlayed v-else :is-doubles="liga.is_doubles" :show-date="true" :game="game"></ligaLotPlayed>
          </div>
        </div>
      </div>
      <b-modal :active.sync="isResultPrepopulatedModalActive" :width="640" scroll="clip">
        <modalResult
          :title="$t('upiiRezultatLige')"
          :partner="liga.is_doubles ? partner : selectedResult.players"
          :is-doubles="liga.is_doubles"
          :options="{ prepopulated: true, game_id: gameid, bothPlayers: adminResultPlayers }"
        ></modalResult>
      </b-modal>
      <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
        <modalOptions
          :options="selectedResult"
          :title="$t('opcijeMea')"
          :subtitle="$t('Ako je došlo po problema u dogovoru za meč, imate sljedeće opcije:')"
          @update="weatherSave($event)"
          @result="adminResultInput($event)"
        ></modalOptions>
      </b-modal>
    </div>
    <template v-else>
      <transition name="fade">
        <div class="align__centar__x loading_z_spinner--bottom m-t-20">
          <b-icon
            class="comment-send m-b-20"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import VueApexCharts from 'vue-apexcharts'
import League from '@/models/League'
import hero from '~/components/Hero'
import ligaLotEmpty from '~/components/liga/LigaLotEmpty'
import ligaLotPlayed from '~/components/liga/LigaLotPlayed'
import Team from '~/models/Team'
import modalResult from '~/components/modal/ModalResult'
import modalOptions from '~/components/liga/ModalMatchAdminOptions'

export default {
  // TODO: add team rating_club or add to player object on players of the doubles - 119
  name: 'LigaPlayer',
  components: {
    VueApexCharts,
    ligaLotEmpty,
    ligaLotPlayed,
    modalOptions,
    modalResult,
    hero,
    TennisImage,
  },
  async fetch() {
    await this.getPlayer()
    await this.getLeague()
  },
  data() {
    return {
      adminResultPlayers: [],
      partner: [],
      gameid: null,
      selectedResult: {},
      isMatchOptionsModal: false,
      loadingMessegas: false,
      isResultPrepopulatedModalActive: false,
      playerSelected: {},
      heroImage: '/liga.jpg',
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
      liga: {},
    }
  },
  computed: {
    player() {
      return this.$store.state.auth.user
    },
    user() {
      return this.$store.state.auth.user
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.user.id
      })
    },
    userInGroup() {
      for (let i = 0; i < this.liga.groups.length; i++) {
        const y = _.filter(this.liga.groups[i].players, (item) => {
          return item.id === this.isPlayer[0].id
        })
        if (y.length > 0) {
          return i
        }
      }
      return false
    },
    userMatchList() {
      return _.filter(this.liga.groups[this.userInGroup]?.games, (item) => {
        return item.players[0]?.id === this.playerSelected.id || item.players[1]?.id === this.playerSelected.id
      })
    },
    hasPlayedMatches() {
      return _.filter(this.userMatchList, (item) => {
        return item.result !== null
      })
    },
    hasWins() {
      return _.filter(this.hasPlayedMatches, (item) => {
        return (
          (item.result.winner === false && this.isPlayer[0].id === item.result.players[0].id) ||
          (item.result.winner === true && this.isPlayer[0].id === item.result.players[1].id)
        )
      })
    },
    hasLosses() {
      return _.filter(this.hasPlayedMatches, (item) => {
        return (
          (item.result.winner === false && this.isPlayer[0].id === item.result.players[1].id) ||
          (item.result.winner === true && this.isPlayer[0].id === item.result.players[0].id)
        )
      })
    },
    isPlayer() {
      return _.filter(this.liga.players, (item) => {
        return this.playerSelected.id === item.id
      })
    },
    series() {
      return [this.hasLosses.length, this.hasWins.length]
    },
    sets() {
      return [
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].sets.losses,
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].sets.wins,
      ]
    },
    gems() {
      return [
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].points.losses,
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].points.wins,
      ]
    },
    setsDiff() {
      return (
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].sets.wins -
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].sets.losses
      )
    },
    gemsDiff() {
      return (
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].points.wins -
        this.liga.groups[this.userInGroup].stats[this.isPlayer[0].id].points.losses
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
    isUserInTeam() {
      if (this.liga.is_doubles) {
        return _.filter(this.playerSelected.players, (item) => {
          return item.players[0].id === this.user.id || item.players[1].id === this.user.id
        })
      } else {
        return []
      }
    },
  },
  mounted() {
    if (Object.keys(this.$store.state.userCompetitions.selectedLiga).length) {
      this.liga = this.$store.state.userCompetitions.selectedLiga
    }
  },
  methods: {
    adminResultInput(item) {
      this.adminResultPlayers = item
      this.isResultPrepopulatedModalActive = true
    },
    submitMessage() {
      this.loadingMessegas = true
      const x = this.isPlayer[0].players[0]
      x.type = 'player'
      Thread.whereIn('players_exact', [this.user.id, this.isPlayer[0].players[0].id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [x] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessegas = false
        })
        .catch(() => {
          this.loadingMessegas = false
        })
    },
    openMatchAdmin(item) {
      this.selectedResult = item
      this.gameid = item.id
      this.partner = item.players
      this.isMatchOptionsModal = true
    },
    async getPlayer() {
      this.playerSelected = await Team.$find(this.$route.params.player)
    },
    getLeague() {
      // this.$root.$loading.start()
      League.include(['players', 'admins', 'groups', 'groups.games'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          // this.$root.$loading.finish()
        })
    },
    isActive(selected) {
      if (_.includes(this.selectedReservation, selected)) {
        return 'active'
      }
    },
  },
}
</script>
