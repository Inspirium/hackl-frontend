<template>
  <div class="">
    <div class="has-text-centered fw600 m-b-5 m-t--5 is-size-3">{{ $t('natjecanja') }}</div>
    <div class="home-menu-middle--competition z-2 relative">
      <div class="">
        <nuxt-link :to="localePath('/liga')" class="has-text-black80">
          <img src="liga.svg" class="m-r-10" alt="" />
          <div class="fw600 is-size-55">{{ $t('lige') }}</div>
        </nuxt-link>
      </div>
      <div class="">
        <nuxt-link :to="localePath('/cup')" class="has-text-black80">
          <img src="kup.svg" class="m-r-10" alt="" />
          <div class="fw600 is-size-55">{{ $t('turniri') }}</div>
        </nuxt-link>
      </div>
    </div>
    <div class="m-t-0 m-b-40">
      <div v-if="ligaOpen.length" class="x-container relative m-b-20 z-1">
        <div
          v-if="$store.state.club.id !== 26"
          class="fw600 is-size-6 has-text-centered green has-text-white p-t-5 p-b-5 rounded-top"
        >
          {{ $t('Otvorene prijave za natjecanja') }}
        </div>
        <div v-else class="fw600 is-size-6 has-text-centered green has-text-white p-t-5 p-b-5 rounded-top">
          {{ $t('Istaknuta natjecanja') }}
        </div>
        <div class="is-white rounded-bottom softshadow">
          <div
            v-for="item in ligaOpen"
            v-show="howManyDaysOnboarding(liga)"
            :key="item.id"
            class="table-bott-fat p-b-10 m-t-10 p-l-15 p-r-15"
          >
            <div class="flex align__centar__all">
              <div
                v-if="item.classification === 'pyramid' || item.classification === 'elo'"
                class="w100"
                @click="
                  $router.push(
                    localePath(
                      item.classification === 'elo'
                        ? `/liga/elo/${item.id}/open-onboarding`
                        : `/liga/${item.id}/open-onboarding`
                    )
                  )
                "
              >
                <div class="align__centar__y justify-between flex">
                  <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">
                    {{ item.name }}
                  </h3>
                  <div class="x-tag--small is-primary m-l-auto m-r--5">
                    {{ item.classification === 'elo' ? 'Elo liga' : 'Liga' }}
                  </div>
                </div>

                <div class="flex align__centar__y m-t-4">
                  <div v-if="howManyDaysOnboarding(item)" class="fw600 is-size-65 has-text-black30 m-r-15">
                    {{ $t('prijaveIstiu') }}
                    <span class="has-text-success">{{ $moment().to($moment(item.finish_onboarding)) }}</span>
                  </div>
                  <div v-else class="fw600 is-size-65 has-text-danger m-r-15">
                    {{ $t('vrijemeZaPrijaveJeIsteklo') }}
                  </div>
                  <div class="fw600 is-size-65 has-text-black30 m-r--5 m-l-auto flex align__centar__y">
                    <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                    <img v-if="item.is_doubles" src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
                  </div>
                </div>
                <div
                  v-if="$store.state.club.id === 26"
                  class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                >
                  <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                    <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                    {{ item.club.name }}{{ ' • ' + item.club.city }}
                  </div>
                </div>
              </div>
              <!--              Ako je turnir-->
              <div
                v-if="item.type === 'SingleElimination'"
                class="w100"
                @click="$router.push(localePath(`/cup/${item.id}/open-onboarding`))"
              >
                <div class="align__centar__y justify-between flex">
                  <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">
                    {{ item.name }}
                  </h3>
                  <div class="">
                    <div class="x-tag--small is-primary m-l-auto m-r--5">
                      {{ $t('turnir') }} <span v-if="item.cup_scoring">{{ item.cup_scoring }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex align__centar__y m-t-4">
                  <div v-if="!dateHasPassed(item)" class="fw600 is-size-65 has-text-black30 m-r-15">
                    {{ $t('prijaveIstiu') }}
                    <span class="has-text-success">{{ $moment().to($moment(item.application_deadline)) }}</span>
                  </div>
                  <div v-else class="fw600 is-size-65 has-text-danger m-r-15">
                    {{ $t('vrijemeZaPrijaveJeIsteklo') }}
                  </div>
                  <div class="fw600 is-size-65 has-text-black30 m-r--5 m-l-auto flex align__centar__y">
                    <span class="has-text-black80">{{ item.players_count }}</span>
                    <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                    <img v-if="item.is_doubles" src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
                  </div>
                </div>
                <div
                  v-if="$store.state.club.id === 26"
                  class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                >
                  <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                    <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                    {{ item.club.name }}{{ ' • ' + item.club.city }}
                  </div>
                </div>
              </div>
              <!--            <b-icon class="m-l-auto m-r&#45;&#45;5" icon="chevron-right" size="is-smaller" pack="fal"></b-icon>-->
            </div>
          </div>
        </div>
        <!--        <div v-if="ligaOpen.length > 4" class="buttons m-t-10">-->
        <!--          <b-button-->
        <!--            class="softshadow m-b-10"-->
        <!--            type="is-small noborder"-->
        <!--            pack="fal"-->
        <!--            icon-right="long-arrow-right"-->
        <!--            rounded-->
        <!--            tag="nuxt-link"-->
        <!--            :to="localePath('/liga/')"-->
        <!--          >-->
        <!--            Prikaži više-->
        <!--          </b-button>-->
        <!--        </div>-->
      </div>
      <div v-if="liga.length" class="x-container">
        <div class="fw600 is-size-6 has-text-centered is-primary has-text-white rounded-top p-t-5 p-b-5">
          {{ $t('mojaNatjecanja') }}
        </div>

        <div class="is-white rounded-bottom softshadow">
          <div
            v-for="item in liga"
            v-show="howManyDaysOnboarding(liga)"
            :key="item.id"
            class="table-bott-fat p-b-10 m-t-10 p-l-15 p-r-15"
          >
            <div class="flex align__centar__y">
              <!--              Ako je liga-->
              <div
                v-if="item.classification === 'pyramid' || item.classification === 'elo'"
                class="w100 flex"
                @click="
                  $router.push(
                    item.classification === 'elo'
                      ? localePath(`/liga/elo/${item.id}/`)
                      : localePath(`/liga/${item.id}/`)
                  )
                "
              >
                <div class="align__centar__x flex__column flex">
                  <div class="align__centar__y justify-between flex">
                    <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">
                      {{ item.name }}
                    </h3>
                  </div>
                  <div v-if="true" class="flex align__centar__y m-t-4">
                    <div v-if="userInGroupA(item)" class="fw600 is-size-65 has-text-black50 m-r-5">
                      {{ $t('pozicija2') }} <span class="has-text-lightblue">{{ userInGroupA(item) }}</span>
                    </div>
                    <div v-else class="fw600 is-size-65 has-text-black30 m-r-15">{{ $t('nemateAktivnihMeeva') }}</div>
                    <div v-if="userInGroupA(item, 'points')" class="fw600 is-size-65 has-text-black50">
                      {{ $t('bodova5') }} <span class="has-text-lightblue">{{ userInGroupA(item, 'points') }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex__column align__centar__y m-t-4 m-l-auto">
                  <div class="flex">
                    <div class="x-tag--small is-primary m-l-auto">
                      {{ item.classification === 'elo' ? 'Elo liga' : 'Liga' }}
                    </div>
                    <div v-if="howManyDays(item)" class="x-tag--small is-red m-l-5">
                      {{ howManyDays(item) }}
                    </div>
                  </div>
                  <div class="fw600 is-size-65 has-text-black30 m-t-7 m-l-auto flex align__centar__y">
                    <span class="has-text-black80 is-size-65">{{ item.players.length }}</span>
                    <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                    <img v-if="item.is_doubles" src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
                  </div>
                </div>
              </div>
              <!--              Ako je turnir-->
              <div
                v-if="item.type === 'SingleElimination'"
                class="w100 flex"
                @click="$router.push(localePath(`/cup/${item.id}/`))"
              >
                <div class="flex align__centar__x flex__column">
                  <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">
                    {{ item.name }}
                  </h3>
                  <div v-if="true" class="flex align__centar__y m-t-4">
                    <div v-if="finalStatusInCup(item)" class="fw600 is-size-65 has-text-black50 m-r-15">
                      {{ $t('pozicija2') }} <span class="has-text-lightblue">{{ positionLabel(item) }}</span>
                    </div>
                    <div v-else class="fw600 is-size-65 has-text-lightblue m-r-15">{{ $t('natjecanjeUTijeku') }}</div>
                  </div>
                </div>
                <div class="flex flex__column align__centar__y m-t-4 m-l-auto">
                  <div class="flex">
                    <div class="x-tag--small is-primary">{{ $t('turnir') }}</div>
                    <div v-if="howManyDays(item)" class="x-tag--small is-red m-l-5">
                      {{ howManyDays(item) }}
                    </div>
                  </div>
                  <div class="fw600 is-size-65 has-text-black30 m-t-7 m-l-auto flex align__centar__y">
                    <span class="has-text-black80">{{ item.players_count }}</span>
                    <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                    <img v-if="item.is_doubles" src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
                  </div>
                </div>
              </div>
              <!--            <b-icon class="m-l-auto m-r&#45;&#45;5" icon="chevron-right" size="is-smaller" pack="fal"></b-icon>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Club from '@/models/Club'
import League from '@/models/League'
import Tournament from '@/models/Tournament'
// import moment from 'moment'

export default {
  name: 'HomeMyLiga',
  components: {},
  async fetch() {
    await this.getLeague()
    await this.getLeagueOpen()
    await this.getTournamentOpen()
    await this.getClubs()
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      isCardModalActive: false,
      hasMobileCards: false,
      isBordered: false,
      liga: [],
      liga1: [],
      tournament: [],
      myLiga: null,
      myLigaGroup: null,
      ligaOpen: [],
      loaded: false,
      isPlayerPivot: [],
      clubs: [],
      ligaOpenMeta: {},
      tournamentOpenMeta: {},
    }
  },
  computed: {
    filteredClubs() {
      const obj = {}
      for (let i = 0; i < this.clubs.length; i++) {
        const element = this.clubs[i]
        obj[element.id] = element
      }
      return obj
    },
    checkIfClassic() {
      return this.$store.state.club.type === 'classic'
    },
    user() {
      return this.$store.state.auth.user
    },
    returnstore() {
      return this.$store.state.userCompetitions.competitions
    },
  },
  mounted() {
    if (this.$store.state.userCompetitions.competitionsList.length) {
      this.liga = this.$store.state.userCompetitions.competitionsList
    }
  },
  methods: {
    toStore() {
      this.$store.commit('userCompetitions/setCompetitions', this.liga)
    },
    getClubs() {
      Club.get().then((res) => {
        this.clubs = res.data
      })
    },
    myPosition(liga) {
      if (liga.classification !== 'pyramid') {
        return _.indexOf(liga.groups[this.myLigaGroup].players, this.isPlayerPivot[0]) + 1
      }
      return false
    },
    howManyDays(liga) {
      const time = liga.type === 'SingleElimination' ? liga.active_to : liga.finish_date
      const daysLeft = parseInt(this.$moment(time).diff(this.$moment(), 'days'))
      if (daysLeft < 0) {
        return this.$t('Isteklo')
      }
      if (daysLeft > 0 && daysLeft < 7) {
        return 'Još ' + this.$moment(time).fromNow('String')
      }
      if (daysLeft > 7) {
        return false
      }
      return false
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
    dateHasPassed(liga) {
      const selectedDay = this.$moment.utc(liga.application_deadline)
      const today = this.$moment()
      if (today.isBefore(selectedDay)) {
        return false
      } else {
        return true
      }
    },
    userInGroupA(liga, points) {
      if (liga.classification === 'pyramid' || liga.classification === 'elo') {
        const forDoublesTeam = _.intersectionWith(liga.players, this.user.teams, (a, b) => a.id === b.id)
        const teamId = liga.is_doubles ? forDoublesTeam[0]?.id : this.user.team.id
        let isInGroup = null
        let isGroup = {}
        let myPosition = null
        for (let e = 0; e < liga.groups.length; e++) {
          const y = _.filter(liga.groups[e].players, (item) => {
            return item.id === teamId
          })
          if (y.length > 0) {
            this.myLigaGroup = e
            isGroup = liga.groups[e]
            isInGroup = e
          }
        }
        if (Object.keys(isGroup).length) {
          myPosition = isGroup.players.findIndex((obj) => obj.id === teamId)
        } else {
          return false
        }

        if (points === 'points') {
          return liga.groups[isInGroup].players[myPosition].pivot.score
        } else {
          return myPosition + 1
        }
      }
      return false
    },
    finalStatusInCup(item) {
      const forDoublesTeam = _.intersectionWith(item.players, this.user.teams, (a, b) => a.id === b.id)
      const teamId = item.is_doubles ? forDoublesTeam[0].id : this.user.team.id
      const status = _.filter(item.players, (item) => {
        return item.id === teamId
      })
      if (status[0].pivot.final_status) {
        return status[0].pivot.final_status
      }
      return false
    },
    positionLabel(item) {
      const user = this.finalStatusInCup(item)
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
          return '1/32'
        case 6:
          return '1/64'
        case 7:
          return '1/128'
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
          return 'finish'
      }
      return ''
    },
    status(s) {
      switch (s) {
        case '0': // Kreirana liga
          return 'U izradi'
        case '1': // Ždrijeb
          return 'Ždrijebanje'
        case '2': // Otvorena liga - priprema prijave
          return 'U izradi'
        case '3': // Otvorena liga - otvorene prijave
          return 'Prijave'
        case '4':
          return 'Aktivna'
        case '5':
          return 'Završena'
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
          return 'backgroundColor:#444444'
      }
      return ''
    },
    getLeagueOpen() {
      this.loading1 = true
      const l = League.include('club').whereIn('status', ['3']).limit(4).where('onboarding', 1)
      if (this.$store.state.club.id !== 26) {
        l.where('club', this.$store.state.club.id)
      }
      l.get().then((res) => {
        this.ligaOpen = [...this.ligaOpen, ...res.data]
        this.loading1 = false
      })
    },
    getTournamentOpen() {
      this.loading1 = true
      const t = Tournament.include('club').whereIn('status', ['3']).limit(4).where('onboarding', 1)
      if (this.$store.state.club.id !== 26) {
        t.where('club', this.$store.state.club.id)
      }
      t.get().then((res) => {
        this.ligaOpen = [...this.ligaOpen, ...res.data]
        this.ligaOpenMeta = res.meta
        this.loading1 = false
      })
    },
    getLeague() {
      this.loading1 = true
      const l = League.include('club')
        .whereIn('status', [4])
        .where('player', this.user.id)
        .include(['players', 'groups'])
        .limit(6)

      l.get().then((res) => {
        this.liga = []
        this.liga = res.data
        this.loading1 = false
        this.getTournament()
      })
    },
    getTournament() {
      const t = Tournament.include(['players', 'club'])
        .whereIn('status', ['4'])
        .where('mine', this.user.id)
        .orderBy('-active_to')
        .limit(6)

      t.get().then((res) => {
        this.liga = [...this.liga, ...res.data]
        this.tournamentOpenMeta = res.meta
        this.loaded = true
        this.toStore()
      })
    },
  },
}
</script>
