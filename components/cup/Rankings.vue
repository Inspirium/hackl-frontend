<template>
  <div class="">
    <div class="x-container">
      <TimeRange :show="timeRangeShow" :default-selected="'this_year'" @timespan="timerange($event)" />
      <div class="filters container">
        <div class="filter">
          <div class="buttons">
            <b-button
              :type="is_doubles ? 'is-primary' : 'is-danger'"
              pack="fal"
              size="is-smaller"
              :icon-right="!is_doubles ? 'user-friends' : 'user-alt'"
              @click="
                offset2 = 1
                is_doubles = !is_doubles
                score = []
                scoring()
              "
            >
              {{ is_doubles ? $t('Prikaži pojedinačno') : $t('Prikaži parove') }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="score.length" class="flex align__centar__y justify-end m-t-25 p-r-15">
      <div class="fw600 has-text-right is-size-6 m-r-10">Sortiraj:</div>
      <div class="has-text-right sort-button">
        <b-button
          :type="by_average ? 'is-primary' : 'is-light'"
          pack="fas"
          size="is-smaller"
          @click="by_average = !by_average"
        >
          {{ $t('Prosjek bodova') }}
        </b-button>
        <b-button
          :type="!by_average ? 'is-orange' : 'is-light'"
          pack="fas"
          size="is-smaller"
          @click="by_average = !by_average"
        >
          {{ $t('Ukupno bodova') }}
        </b-button>
      </div>
    </div>
    <div class="relative">
      <transition name="fade">
        <div v-if="true" class="relative">
          <div
            v-for="(item, index) in by_average ? sortedData : score"
            :key="item.id + 'score'"
            class="bottom-border-line is-white p-b-10 p-t-10 p-l-10 p-r-10"
          >
            <div class="flex align__centar__y" @click="isOpen === index ? (isOpen = null) : (isOpen = index)">
              <div class="fw600 is-size-4 has-text-white is-primary rank-high m-r-10">
                {{ index + 1 }}
              </div>
              <div class="w100 flex justify-between">
                <div class="flex align__centar__y">
                  <template v-if="is_doubles" class="for-doubles">
                    <div v-if="item.image === 'https://api.tenis.plus/images/user.svg'" class="flex m-r-7">
                      <TennisImage
                        :size="[42, 42]"
                        :src="item.players[0].image"
                        class="user_image-small border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="item.players[1].image"
                        class="user_image-small m-l--16 border__white--2"
                        alt=""
                      />
                    </div>
                    <TennisImage v-else :size="[42, 42]" :src="item.image" class="user_image m-r-7" alt="" />
                  </template>

                  <TennisImage v-else :size="[42, 42]" :src="item.image" class="user_image m-r-7" alt="" />
                  <div class="flex flex__column align__centar__x">
                    <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">{{ item.display_name }}</h3>
                    <div v-if="item.tournament_scores" class="fw600 is-size-65 has-text-black30 m-r-15 m-t-5">
                      {{ $t('odigranihTurnira') }}
                      <span class="has-text-lightblue">{{ item.tournament_scores.length }}</span>
                    </div>
                    <div v-if="item.tournament_scores" class="fw600 is-size-65 has-text-black30 m-r-15 m-t-2">
                      {{ $t('Prosjek bodova') }}
                      <span class="has-text-lightblue">{{
                        Math.round(
                          item.tournament_total_score /
                            (item.tournament_scores.length === 1 ? 2 : item.tournament_scores.length)
                        )
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex__column m-t-4 align__centar__x">
                  <div class="flex flex__column">
                    <transition name="fade">
                      <div
                        :class="!by_average ? 'x-tag--m' : 'x-tag--small'"
                        class="is-orange transition-1 m-l-auto m-t-2"
                      >
                        {{ item.tournament_total_score }}
                      </div>
                    </transition>
                    <div
                      :class="!by_average ? 'x-tag--small' : 'x-tag--m'"
                      class="is-primary transition-1 m-l-auto m-t-2"
                    >
                      {{
                        Math.round(
                          item.tournament_total_score /
                            (item.tournament_scores.length === 1 ? 2 : item.tournament_scores.length)
                        )
                      }}
                    </div>
                  </div>

                  <div
                    v-if="howManyTimesWinner(item)"
                    class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y m-t-4"
                  >
                    <span class="has-text-black80">{{ howManyTimesWinner(item) }}</span>
                    <b-icon class="turnament-players-icon m-l-5" pack="fal" icon="trophy" type="is-black50"></b-icon>
                  </div>
                </div>
              </div>
              <b-icon
                icon="chevron-down"
                size="is-small-9"
                pack="far"
                class="m-t--3 m-l-7"
                :class="[isOpen === index ? 'chevron-animated-open' : 'chevron-animated-close']"
              ></b-icon>
            </div>
            <template v-if="isOpen === index">
              <template v-for="tournament in item.tournament_scores.slice().reverse()">
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
                    </div>
                    <div class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y">
                      <span v-if="tournament.final_score" class="has-text-green m-r-10"
                        >+{{ tournament.final_score }}</span
                      >
                      <span v-if="tournament.final_status" class="has-text-black80 has-text-right"
                        >{{ ranksPositionLabel(tournament.final_status) }}
                      </span>
                      <b-icon
                        class="turnament-players-icon m-l-5"
                        :pack="tournament.final_status === '*' ? 'fas' : 'fal'"
                        icon="trophy"
                        :type="tournament.final_status === '*' ? 'is-primary' : 'is-black50'"
                      >
                      </b-icon>
                    </div>
                  </div>
                </div>
              </template>
              <div class="buttons m-t-10 m-b-2">
                <b-button
                  class="m-l-5 m-t-7 removeborder softshadow"
                  type="is-primary is-smaller-12"
                  pack="fal"
                  rounded
                  size="is-smaller"
                  @click="$router.push(localePath('/player/' + item.players[0].id))"
                  >{{ $t('vidiIgraevProfil') }}
                </b-button>
              </div>
            </template>
          </div>
          <transition name="fade">
            <div v-if="loading" class="align__centar__x m-t-5 loading_z_spinner--bottom">
              <b-icon
                class="comment-send"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-primary"
                pack="far"
              ></b-icon>
            </div>
          </transition>
        </div>
      </transition>
      <template v-if="!score.length && !loading">
        <div class="rounded-md has-text-centered m-t-20">
          <b-icon icon="exclamation-square" pack="fal" type="is-danger" class="is-medium m-t-5"> </b-icon>
          <div class="has-text-centered is-size-5 has-text-black50 fw600">
            {{ $t('nemaPodatakaZaUneseneVrijednosti') }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Tournament from '@/models/Tournament'
import TournamentScore from '@/models/TournamentScore'
import _ from 'lodash'
import TimeRange from '~/components/reports/TimeRange'

export default {
  name: 'Turniri',
  components: {
    TimeRange,
    TennisImage,
  },
  async fetch() {
    await this.getLeagueAdmin()
    await this.getLeagueAdminOnly()
  },
  data() {
    return {
      activeMainTab: 0,
      isModalActive: false,
      isModalPlayerOpen: false,
      heroImage: '/liga.jpg',
      league: [],
      leagueAdmin: [],
      leagueMy: [],
      tournamentAdmin: [],
      selectedLeague: {},
      loading: false,
      loading1: false,
      nomore: false,
      search_term: '',
      nomore1: false,
      nomore2: false,
      total: 0,
      total1: 0,
      last_page: 1,
      last_page1: 1,
      bottom: '',
      bottom1: '',
      bottom2: '',
      offset: 1,
      offset1: 1,
      offset2: 1,
      isOpen: null,
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
      score: [],
      scoreTimeRange: 'this_year',
      is_doubles: false,
      by_average: false,
      test: false,
      selectedCourts: ['otvorene'],
      filters: ['otvorene', 'aktivne', 'završene'],
      tournamentAdminTotal: null,
      location: {
        latitude: 0,
        longitude: 0,
      },
      selectedTour: {},
    }
  },
  computed: {
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    sortedData() {
      return this.score.slice().sort((a, b) => {
        const scoreA = a.tournament_total_score / (a.tournament_scores.length === 1 ? 2 : a.tournament_scores.length)
        const scoreB = b.tournament_total_score / (b.tournament_scores.length === 1 ? 2 : b.tournament_scores.length)

        return scoreB - scoreA // Sort in descending order (highest score first)
      })
    },
  },
  watch: {
    '$route.hash': {
      immediate: true,
      handler(newHash) {
        if (!newHash) {
          this.$router.replace({ hash: '0' })
        } else if (newHash.startsWith('#')) {
          const tab = parseInt(newHash.substring(1))
          if (!isNaN(tab)) {
            if (tab === 4) {
              this.selectedCourts = ['aktivne']
              this.activeMainTab = 0
            } else if (tab === 5) {
              this.selectedCourts = ['završene']
              this.activeMainTab = 0
            } else {
              this.activeMainTab = tab
              window.history.replaceState(null, null, `#${tab}`)
            }
          }
        }
      },
    },
    search_term(term) {
      if (term.length) {
        this.offset = 1
        this.league = []
        this.debouncedGetLeague()
      } else {
        this.getLeague()
      }
    },
    bottom(bottom) {
      if (bottom) {
        switch (this.activeMainTab) {
          case 0:
            this.offset++
            this.getLeague()
            break
          case 1:
            if (!this.loading) {
              this.offset2++
              this.scoring()
            }
            break
          case 2:
            this.offset1++
            this.getLeagueAdmin()
            break
        }
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  created() {
    this.debouncedGetLeague = _.debounce(this.getLeague, 500)
  },
  methods: {
    openPlayersModal(item) {
      this.selectedTour = item
      this.isModalPlayerOpen = true
    },
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    returnBckg(item) {
      if (this.selectedCourts[0] === 'otvorene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #73c03d'
      } else if (this.selectedCourts[0] === 'aktivne' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #209cee'
      } else if (this.selectedCourts[0] === 'završene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #f03a5f'
      } else {
        return 'tra'
      }
    },
    search_icon_click() {
      this.offset = 1
      this.search_term = ''
      this.getLeague()
    },
    noLocation() {
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    selectCourt(item) {
      if (item === 'aktivne') {
        window.history.replaceState(null, null, '#4')
      } else if (item === 'završene') {
        window.history.replaceState(null, null, '#5')
      } else {
        window.history.replaceState(null, null, '#0')
      }
      this.selectedCourts[0] = item
      this.league = []
      this.offset = 1
      this.last_page = 1
      this.getLeague()
    },
    howManyDaysOnboarding(liga) {
      if (liga.application_deadline) {
        if (this.$moment(liga.application_deadline) <= this.$moment()) {
          return false
        }
      } else if (liga.finish_onboarding) {
        if (this.$moment(liga.finish_onboarding) <= this.$moment()) {
          return false
        }
      }
      return 'još ' + this.$moment(liga.active_to).endOf('day').fromNow('String')
    },
    timerange(item) {
      if (item === 'Sve') {
        this.score = []
        this.offset2 = 1
        this.scoring()
      } else if (item === 'Custom') {
        this.scoreTimeRange = item
        this.score = []
        this.offset2 = 1
        this.scoring()
      }
      this.scoreTimeRange = item
      this.score = []
      this.offset2 = 1
      this.scoring()
    },
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
    positionLabel(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return ''
      }
      const user = tr.pivot.final_status
      if (user) {
        if (user === '*') {
          return 'Pobjednik'
        }
        const position = user[0]
        const total = user[2]
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
      }
      return ''
    },
    realPositionLabel(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return false
      }
      const user = tr.pivot.final_status
      return user
    },
    finalScore(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return '0'
      }
      const user = tr.pivot.final_score
      return user
    },
    myFinalRound(cup) {
      if (cup.is_doubles) {
        const userTeam = _.intersectionWith(cup.players, this.user.teams, (a, b) => a.id === b.id)
        const myPosition = cup.players.findIndex((obj) => obj.id === userTeam[0].id)
        return cup.players[myPosition]
      }
      const myPosition = cup.players.findIndex((obj) => obj.id === this.user.team.id)
      return cup.players[myPosition]
    },
    isWinner(item) {
      if (item === null) {
        return 'https://tenis.plus/players.svg'
      }
      return item.image
    },
    getLeague() {
      if (this.last_page < this.offset) return
      this.loading1 = true
      let t = Tournament.include('club', 'players')
      if (this.selectedCourts[0] === 'otvorene') {
        t = t.whereIn('status', ['3'])
      } else if (this.selectedCourts[0] === 'aktivne') {
        t = t.whereIn('status', ['4'])
      } else if (this.selectedCourts[0] === 'završene') {
        t = t.whereIn('status', ['5'])
      }
      if (this.$store.state.club.id !== 26) {
        t = t.where('club', this.$store.state.club.id).orderBy('-active_to')
      } else {
        t = t
          .where('show_on_tenisplus', true)
          .params({
            latitude: this.location.latitude,
            longitude: this.location.longitude,
          })
          .orderBy('distance')
      }
      if (this.selectedCourts[0] === 'završene') {
        t = t.orderBy('-active_to')
      }
      if (this.search_term !== '') {
        t = t.where('name', this.search_term).whereIn('status', ['3', '4', '5']).orderBy('-active_to')
      }
      t.page(this.offset)
        .get()
        .then((res) => {
          if (this.offset > 1) {
            this.league = [...this.league, ...res.data]
          } else {
            this.league = res.data
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading1 = false
        })
    },
    // .where('admins', this.user.id)
    getLeagueAdmin() {
      if (this.last_page1 < this.offset1) return
      Tournament.include(['players', 'club'])
        .whereIn('status', ['3', '4', '5'])

        .where('mine', this.user.id)
        // .where('club', this.$store.state.club.id)
        .page(this.offset1)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.leagueMy = [...this.leagueMy, ...res.data]
          this.total1 = res.meta.total
          this.last_page1 = res.meta.last_page
        })
    },
    getLeagueAdminOnly() {
      Tournament.include('club')
        .whereIn('status', ['1', '2', '3', '4'])
        .where('admins', this.user.id)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.tournamentAdminTotal = res.meta.total
          this.tournamentAdmin = res.data
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    status(s) {
      switch (s) {
        case '0': // Kreirana liga
          return this.$t('U izradi')
        case '1': // Ždrijeb
          return this.$t('Ždrijebanje')
        case '2': // Privatna liga - priprema prijave
          return this.$t('U izradi')
        case '3': // Otvorena liga - otvorene prijave
          return this.$t('Prijave')
        case '4':
          return this.$t('Aktivna')
        case '5':
          return this.$t('Završena')
      }
      return ''
    },
    tagColor(s) {
      switch (s) {
        case '0':
          return 'backgroundColor:#cccccc'
        case '1':
          return 'backgroundColor:#F18F01'
        case '2':
          return 'backgroundColor:#ff3860'
        case '3':
          return 'backgroundColor:#9acd32'
        case '4':
          return 'backgroundColor:#209CEE'
        case '5':
          return 'backgroundColor:#777777'
      }
      return ''
    },
    link(s, tr) {
      switch (s) {
        case '0':
          return tr === 'private' ? 'privat' : 'open'
        case '1':
          return 'liga_create'
        case '2':
          return 'open'
        case '3':
          return 'open-onboarding'
        case '4':
          return ''
        case '5':
          return ''
      }
      return ''
    },
    scoring() {
      this.loading = true
      const ts = TournamentScore.include(['tournament_scores', 'tournament_scores.tournament'])
      if (this.scoreTimeRange !== 'Sve') {
        ts.where('final_between', this.scoreTimeRange)
      }
      ts
        // .where('team', 10)
        // .where('tournament', 1000)
        .where('club', this.$store.state.club.id)
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .page(this.offset2)
        .get()
        .then((res) => {
          if (this.offset2 === 1) {
            this.score = []
            this.score = res
          } else {
            this.score = [...this.score, ...res]
          }
          this.loading = false
        })
    },
  },
  head() {
    return {
      title: 'Turniri',
    }
  },
}
</script>
<style scoped>
.rank-high {
  margin-left: -20px;
}
.table {
  background-color: transparent !important;
}
</style>
