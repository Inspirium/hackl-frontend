<template>
  <div class="analytics p-b-100">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('profil') }}</h1>
    </hero>
    <template v-if="Object.keys(playerSelected).length && !playerProfiler">
      <div class="profile-edit-page">
        <profile
          :player="playerSelected.team"
          :is-reprofile="playerProfile"
          @close="$router.push({ path: localePath('/player/' + $route.params.id), query: { profile: true } })"
        ></profile>
      </div>
    </template>
    <template v-if="playerProfiler">
      <div class="profile-edit-page x-container">
        <profileDisplay :player="playerSelected" :profiler="playerProfiler"></profileDisplay>
      </div>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import hero from '~/components/Hero'
import Player from '~/models/Player'
import profile from '~/components/stats/profile'
import PlayerProfile from '~/models/PlayerProfile'
import profileDisplay from '~/components/stats/profileDisplay'

export default {
  name: 'PlayerStats',
  components: {
    hero,
    profile,
    profileDisplay,
  },
  async fetch() {
    await this.getPlayer()
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
      heroImage: '/liga.jpg',
      sending: false,
      playerProfile: [],
    }
  },
  computed: {
    playerProfiler() {
      if (this.$route.query.profiledBy !== undefined) {
        return +this.$route.query.profiledBy
      } else {
        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    async getPlayer() {
      this.playerSelected = await Player.params({ stats: true }).$find(this.$route.params.id)
      this.getPlayerProfile()
    },
    getPlayerProfile() {
      PlayerProfile.where('player', this.playerSelected.id)
        .where('owner', this.user.id)
        .include('owner')
        .get()
        .then((res) => {
          this.playerProfile = res.data
        })
    },
  },
}
</script>
