<template>
  <div class="mh200" :class="loading ? 'h200' : ''">
    <div v-if="Object.keys(tournamentFull).length" class="draw-header-title">{{ tournamentFull.name }}</div>
    <!--    <div class="">-->
    <!--      <div class="tab__navigation justify-content-start fixed m-b-20 m-t-75 m-l-15">-->
    <!--        <div class="tab__navigation__arrow__left m-r-10 m-t-7">-->
    <!--          <b-icon v-if="!loading" icon="chevron-left" pack="fal"></b-icon>-->
    <!--          <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>-->
    <!--        </div>-->
    <!--        <div class="tab__navigation__arrow__right m-t-7">-->
    <!--          <b-icon v-if="!loading" icon="chevron-right" pack="fal"> </b-icon>-->
    <!--          <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <transition v-if="loading" name="fade">
      <div class="relative">
        <div class="align__centar__x m-t-100 loading_z_spinner">
          <b-icon
            class="comment-send"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </div>
    </transition>

    <div class="">
      <div v-if="tournamentRounds.length && !loading" class="draw-table p-x-16">
        <div v-for="(item, round) in tournamentRounds" :key="item.id" class="p-t-100 draw-column flex flex__column">
          <div v-for="(game, index) in tournamentRounds[round].games" :key="game.id + index" class="draw-box">
            <div class="draw-item m-t-5 m-b-5">
              <cupLotEmptyDraw
                v-if="game.result === null"
                :game="game"
                :is-doubles="!!tournamentFull.is_doubles"
                :is-finish="tournamentFull.status === '5'"
                :is-first-round="round === 0"
              ></cupLotEmptyDraw>
              <cupLotPlayedDraw
                v-else
                :game="game"
                :is-doubles="!!tournamentFull.is_doubles"
                :show-date="true"
              ></cupLotPlayedDraw>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import Result from '~/models/Result'
// import TennisImage from '@/components/TennisImage.vue'

// import Team from '@/models/Team'
// import _ from 'lodash'
import TournamentRound from '@/models/TournamentRound'
import Tournament from '@/models/Tournament'

export default {
  name: 'Draw',
  components: {
    // TennisImage,
  },
  props: {
    tournament: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      search_term: '',
      loading: false,
      tournamentRounds: [],
      tournamentFull: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {
    tournament: {
      immediate: true,
      handler() {
        this.checkIfTournamentRound()
        // this.getTournamentRounds()
      },
    },
    search_term(term) {
      if (term.length) {
        this.debouncedGetPlayers()
      }
    },
  },
  methods: {
    checkIfTournamentRound() {
      console.log(this.tournament)
      console.log(this.tournament.rounds === undefined)
      if (this.tournament.rounds === undefined) {
        this.tournamentFull = this.tournament
        this.getTournamentRounds()
      } else {
        this.getTournament()
      }
    },
    getTournamentRounds() {
      if (!Object.keys(this.tournament).length) {
        return
      }
      this.loading = true

      const roundPromises = []
      console.log(this.tournamentFull)
      // Iterate through each round in the tournament.rounds array
      this.tournamentFull.rounds.forEach((round) => {
        // Create a promise to fetch the tournament round for the current round
        const roundPromise = TournamentRound.include(['games'])
          .params({ seed: 1 })
          .find(round.id)
          .then((res) => {
            // Push the fetched tournament round to an array
            this.tournamentRounds.push(res)
          })
          .catch((error) => {
            // Handle any errors here
            console.error(`Error fetching tournament round: ${error}`)
          })

        // Add the promise to the array of promises
        roundPromises.push(roundPromise)
      })

      // Use Promise.all to wait for all round promises to resolve
      Promise.all(roundPromises)
        .then(() => {
          // All tournament rounds have been fetched
          this.loading = false
          this.tournamentRounds.sort((a, b) => a.order - b.order)
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(`Error fetching tournament rounds: ${error}`)
          this.loading = false
        })
    },
    getTournament() {
      Tournament.include(['admins', 'players', 'rounds', 'documents', 'thread'])
        .find(this.tournament.id)
        .then((res) => {
          this.tournamentFull = res
          this.getTournamentRounds()
        })
    },
  },
}
</script>
