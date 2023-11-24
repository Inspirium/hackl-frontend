<template>
  <div class="home__reservation">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('popisMeeva') }}</h1>
    </hero>
    <!--    <div class="m-t-20 fw600 is-size-55 has-text-centered">Popis mečeva</div>-->
    <div class="tab__header align__centar__all m-b-10 m-t-20">
      <TennisImage :size="[42, 42]" :src="myTeam.image" class="user_image m-r-10 border__white--2 softshadow2" alt="" />
      <div class="">{{ myTeam.display_name }}</div>
    </div>
    <div v-touch:swipe="swipeHandler" class="x-container">
      <b-tabs v-model="activeTab" position="is-centered">
        <b-tab-item :label="$t('ukupno')">
          <div v-if="Object.keys(player).length" class="modal-subtitle has-text-centered fw400 m-b-20">
            {{ $t('ukupnoMeeva') }}
            <span class="has-text-primary">{{ totalMatches }}</span>
            <div class="m-t-10">
              <span class="is-size-7 x-tag green nav__notification has-text-white">{{ player.winslosses.wins }}</span>
              <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
                player.winslosses.losses
              }}</span>
            </div>
          </div>
          <div v-if="results.length" class="activity__results results">
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
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import Player from '~/models/Player'
import Result from '~/models/Result'
import resultBox from '~/components/ResultBox'
import Team from '~/models/Team'

export default {
  name: 'PlayersResults',
  components: {
    hero,
    resultBox,
    TennisImage,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getPlayer().then((res) => {
        this.player
          .memberships()
          .get()
          .then((res) => {
            this.player_memberships = res
            this.getResults()
            this.getMyTeam()
          })
        this.$root.$loading.finish()
      })
    })
  },
  data() {
    return {
      courtFilter: {
        selectedId: null,
        selectedCourt: {},
      },
      isModalActive: false,
      isModalCourtFilter: false,
      isModalMembersActive: false,
      reservations: [],
      checkedRows: [],
      checkboxPosition: 'left',
      date: this.$moment(),
      loading: false,
      player: {},
      myTeam: {},
      nomore: false,
      total: 0,
      last_page: 1,
      bottom: '',
      offset: null,
      results: [],
      results_page: 1,
      results_total_pages: 1,
      totalMatches: 0,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      activeTab: 0,
    }
  },
  computed: {
    memberships() {
      return this.$store.state.club.memberships
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getResults()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getResults, 500)
  },
  methods: {
    getResults() {
      if (Object.keys(this.player).length) {
        Result.where('team', this.player.id)
          .page(this.results_page)
          .get()
          .then((res) => {
            this.results = [...this.results, ...res.data]
            this.totalMatches = res.meta.total
            this.meta = res.meta
            this.results_total_pages = res.meta.last_page
            this.results_page++
            this.getVSResults()
          })
      }
    },
    getVSResults() {
      if (this.player.id !== this.$auth.user.id) {
        Result.where('players', this.player.id + ',' + this.$auth.user.id)
          .page(this.my_results_page)
          .get()
          .then((res) => {
            this.my_results = [...this.my_results, ...res.data]
            this.my_results_total_pages = res.meta.last_page
            this.my_results_page++
          })
      }
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    async getPlayer() {
      let id
      if (this.$route.params.id) {
        id = this.$route.params.id
      } else {
        id = this.user.id
      }
      this.player = await Player.include('memberships').params({ wins: true }).$find(id)
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    getMyTeam() {
      Team.find(this.$route.params.id).then((res) => {
        this.myTeam = res
      })
    },
  },
}
</script>
