<template>
  <div class="ranglist">
    <hero :page="'rankings'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('rangLjestvica') }}</h1>
    </hero>
    <div class="home-menu">
      <div class="home-menu-middle">
        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <img src="/kup.svg" class="custom-icon" alt="" />
            <div class="is-size-6 fw600">{{ $t('ELO ljestvica') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(1)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="trophy" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('turniri') }}</div>
          </div>
        </div>
      </div>
    </div>
    <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div class="filters--two container">
          <div class="filter">
            <div class="label m-t-0">{{ $t('dob') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalAgeActive = true">
                {{ $t(filterAgeDisplay) }}
              </b-button>
            </div>
          </div>
          <div class="filter">
            <div class="label m-t-0">{{ $t('vrstaLjestvice') }}</div>
            <div class="buttons">
              <b-button
                v-if="is_doubles"
                :type="!is_doubles ? 'is-primary' : 'is-danger'"
                pack="fal"
                :icon-right="is_doubles ? 'user-friends' : 'user-alt'"
                @click="
                  is_doubles = !is_doubles
                  offset = 1
                  getPlayers()
                "
              >
                {{ $t('parovi') }}
              </b-button>
              <b-button
                v-else
                :type="!is_doubles ? 'is-primary' : 'is-danger'"
                pack="fal"
                :icon-right="is_doubles ? 'user-friends' : 'user-alt'"
                @click="
                  is_doubles = !is_doubles
                  offset = 1
                  getPlayers()
                "
              >
                {{ $t('pojedinci') }}
              </b-button>
            </div>
          </div>
        </div>

        <div class="tablelist">
          <div v-if="!is_doubles" class="my-rank">
            <h5>{{ $t('mojaPozicija') }}</h5>
            <div class="list__image-col softshadow">
              <nuxt-link :to="localePath('/player/' + user.id)">
                <div class="rank">{{ $store.state.club.id === 26 ? myTeam.rank_global : myTeam.rank_club }}.</div>
                <div v-if="Object.keys(myTeam).length" class="list__img">
                  <TennisImage :size="[42, 42]" :src="myTeam.image" class="user_image" alt="" />
                </div>
                <div class="list__content m-r-auto">
                  <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ myTeam.display_name }}</div>
                  <div class="fw600 is-size-7 has-text-black50">{{ $t('godina range', { range: user.range }) }}</div>
                </div>
                <div class="fw600 is-size-5 has-text-primary m-l-auto flex align__centar__y line-height-14">
                  {{ $store.state.club.id === 26 ? Math.round(myTeam.rating) : Math.round(myTeam.rating_club) }}
                </div>
              </nuxt-link>
            </div>
          </div>
          <div v-else class="my-rank">
            <h5>{{ $t('teniskiParovi') }}</h5>
            <div class="buttons m-t-10">
              <b-button
                class="softshadow m-b-20"
                type="is-small noborder"
                pack="fal"
                icon-right="user-friends"
                rounded
                @click="$router.push(localePath('/doubles/new'))"
              >
                {{ $t('izradiNoviTeniskiPar') }}
              </b-button>
            </div>
          </div>
          <!--      Universal club-->
          <div v-if="$store.state.club.id === 26" class="">
            <h6 class="fw600 flex align__centar__all">
              {{ $t('ukupnoIgraa') }}
              <span>{{ total }}</span>
            </h6>
          </div>
          <div class="relative">
            <template v-if="club_players.length">
              <div
                v-for="(players, index) in club_players"
                :key="players.id"
                class="bottom-border-line p-t-10 m-b-1"
                :class="isOpen === index ? 'is-white is-open' : 'is-white p-b-10'"
              >
                <div
                  class="flex align__centar__y open-header relative p-l-15 p-r-10"
                  :class="isOpen === index ? 'softshadow' : ''"
                  @click="openMe(index, players)"
                >
                  <div class="transition fw500 is-size-5 has-text-white is-primary m-r-7 rank-high">
                    {{ $t('key3', { expr: index + 1 }) }}
                  </div>
                  <transition name="slide-fade">
                    <template v-if="is_doubles && true" class="for-doubles">
                      <div v-if="players.image === 'https://api.tenis.plus/images/user.svg'" class="flex min-w-65">
                        <TennisImage
                          :size="[42, 42]"
                          :src="players.players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="players.players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="flex min-w-65">
                        <TennisImage :size="[42, 42]" :src="players.image" class="user_image border__white--2" alt="" />
                      </div>
                    </template>

                    <TennisImage
                      v-else
                      :size="[72, 72]"
                      :src="players.image"
                      class="softshadow2 m-r-7 transition"
                      :class="isOpen === index ? 'user_image-medium border__white--2' : 'user_image'"
                      alt=""
                    />
                  </transition>

                  <div class="w100 title-open">
                    <div class="align__centar__y justify-between flex" :class="is_doubles ? 'm-l-10' : ''">
                      <h3
                        class="transition is-size-55 has-text-black80 fw600 align__centar__all"
                        :class="isOpen === index ? 'm-b-10' : ''"
                      >
                        {{ players.display_name }}
                      </h3>
                      <div
                        class="fw600 is-size-5 has-text-primary m-l-auto flex align__centar__y line-height-14 down-line"
                      >
                        {{ $store.state.club.id === 26 ? players.score : players.score_club }}
                      </div>
                    </div>
                    <div class="flex align__centar__y down-line">
                      <div
                        v-if="players.players.length"
                        :class="is_doubles ? 'm-l-10' : ''"
                        class="fw600 is-size-7 has-text-black50"
                      >
                        {{ $t('godina range', { range: players.range }) }}
                      </div>
                      <div
                        v-if="players.stats.total.total"
                        class="fw600 is-size-65 has-text-black30 flex align__centar__all m-l-7"
                      >
                        <b-icon
                          icon="racquet"
                          pack="far"
                          size="is-small-10 top-5"
                          class="relative"
                          :class="[
                            players.stats.total.total > 100
                              ? players.stats.total.total > 200
                                ? 'has-text-danger'
                                : 'has-text-lightblue'
                              : 'has-text-black50',
                          ]"
                        ></b-icon>

                        <span
                          :class="[
                            players.stats.total.total > 100
                              ? players.stats.total.total > 200
                                ? 'has-text-danger'
                                : 'has-text-lightblue'
                              : 'has-text-black50',
                          ]"
                          class="m-r-4"
                          >{{ players.stats.total.total }}</span
                        >
                      </div>
                      <!-- eslint-disable vue/no-v-html -->
                      <div
                        class="score m-l-auto"
                        :style="players.id !== $auth.user.team.id ? '' : 'opacity: 0'"
                        v-html="calculateDiff(players.score_club)"
                      ></div>
                      <!-- eslint-enable vue/no-v-html -->
                    </div>
                  </div>
                  <!--              <div class="fw500 is-size-4 has-text-black80m-l-auto flex align__centar__y">-->
                  <!--                {{ players.rating }}-->
                  <!--              </div>-->
                  <b-icon
                    icon="chevron-down"
                    size="is-small-9"
                    pack="far"
                    class="m-t--3 m-l-7 chevrone-open"
                    :class="[isOpen === index ? 'chevron-animated-open' : 'chevron-animated-close']"
                  ></b-icon>
                </div>
                <template v-if="isOpen === index">
                  <div :class="isOpen === index ? 'is-bckg is-open' : 'is-white'">
                    <div class="p-l-20 p-r-20">
                      <div class="">
                        <div class="">
                          <div class="flex align__centar__y m-t-4 p-t-10">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">
                              {{ $t('mogunostDobitkagubitkaBodova') }}
                            </div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <!-- eslint-disable vue/no-v-html -->
                              <span class="has-text-black80" v-html="calculateDiff(players.score)"></span>
                              <!-- eslint-enable vue/no-v-html -->
                            </div>
                          </div>
                        </div>
                        <div class="border-color-black10 m-t-7">
                          <div class="flex align__centar__y m-t-4">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('ukupnoMeeva') }}</div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <span class="has-text-black80">{{ players.stats.total.total }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="border-color-black10 m-t-7">
                          <div class="flex align__centar__y m-t-4">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('klub') }}</div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <span class="has-text-black80">{{ players.stats.total.total }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-if="!is_doubles" class="border-color-black10 m-t-7">
                          <div class="flex align__centar__y m-t-4">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('starost') }}</div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <span class="has-text-black80">{{ $t('godina range', { range: players.range }) }}</span>
                            </div>
                          </div>
                        </div>
                        <template v-if="$store.state.club.id !== 26">
                          <div class="border-color-black10 m-t-7">
                            <div class="flex align__centar__y m-t-4">
                              <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('klupskiElo') }}</div>
                              <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                                <span class="has-text-black80">{{
                                  $t('bodova3', { score_club: players.score_club })
                                }}</span>
                              </div>
                            </div>
                          </div>

                          <div class="border-color-black10 m-t-7">
                            <div class="flex align__centar__y m-t-4">
                              <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('klubskiPoredak') }}</div>
                              <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                                <span class="has-text-black80">{{
                                  $t('mjesto2', { rank_club: players.rank_club })
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </template>

                        <div class="border-color-black10 m-t-7">
                          <div class="flex align__centar__y m-t-4">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('globalniElo') }}</div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <span class="has-text-black80">{{ $t('bodova', { score: players.score }) }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="border-color-black10 m-t-7">
                          <div class="flex align__centar__y m-t-4">
                            <div class="fw600 is-size-65 has-text-black80 m-r-15">{{ $t('globalniPoredak') }}</div>
                            <div class="fw600 is-size-6 has-text-black30 m-l-auto flex align__centar__y">
                              <span class="has-text-black80">{{
                                $t('mjesto', { rank_global: players.rank_global })
                              }}</span>
                            </div>
                          </div>
                        </div>
                        <!--                  <div class="border-color-black10 m-t-7">-->
                        <!--                    <div class="flex align__centar__y m-t-4">-->
                        <!--                      <div class="fw600 is-size-65 has-text-black80 m-r-15">Ukupno odigranih turnira</div>-->
                        <!--                      <div class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y">-->
                        <!--                        <span class="has-text-black80">40 x </span>-->
                        <!--                        <b-icon class="turnament-players-icon m-l-5" pack="fal" icon="trophy" type="is-black50">-->
                        <!--                        </b-icon>-->
                        <!--                      </div>-->
                        <!--                    </div>-->
                        <!--                  </div>-->
                        <div class="border-color-black10 m-t-7"></div>
                      </div>
                      <div class="home-menu m-t-20">
                        <div class="home-menu-middle radius__5 softshadow">
                          <div :class="[activeTab === 0 ? 'active-menu-item' : 'menu-item']" @click="activeTab = 0">
                            <div class="has-text-black50 flex flex__column align__centar__y">
                              <b-icon class="m-b-5" pack="fal" size="is-small-13" icon="chart-line" type="is-black50">
                              </b-icon>
                              <div class="nav__menu">{{ $t('statistika') }}</div>
                            </div>
                          </div>
                          <div
                            v-if="showProfile"
                            :class="[activeTab === 1 ? 'active-menu-item' : 'menu-item']"
                            @click="activeTab = 1"
                          >
                            <div class="has-text-black50 flex flex__column align__centar__y" @click="activeTab = 1">
                              <b-icon class="m-b-5" pack="fal" size="is-small-13" icon="street-view" type="is-black50">
                              </b-icon>
                              <div class="nav__menu">{{ $t('profil') }}</div>
                            </div>
                          </div>

                          <div
                            v-if="showVsStats && playersForVsRecord"
                            :class="[activeTab === 2 ? 'active-menu-item' : 'menu-item']"
                            @click="activeTab = 2"
                          >
                            <div class="has-text-black50 flex flex__column align__centar__y">
                              <b-icon
                                class="m-b-5"
                                pack="fal"
                                size="is-small-13"
                                icon="arrow-down-left-and-arrow-up-right-to-center"
                                type="is-black50"
                              >
                              </b-icon>
                              <div class="nav__menu">{{ $t('meusobno') }}</div>
                            </div>
                          </div>
                          <div :class="[activeTab === 3 ? 'active-menu-item' : 'menu-item']" @click="activeTab = 3">
                            <div class="has-text-black50 flex flex__column align__centar__y" @click="activeTab = 3">
                              <b-icon
                                class="m-b-5"
                                pack="fal"
                                icon="racquet"
                                type="is-black50"
                                size="is-small-13"
                              ></b-icon>
                              <div class="nav__menu">{{ $t('meevi') }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation">
                        <b-tab-item>
                          <trend :player="selectedPlayer.id" class="m-b-15">
                            <slot>
                              <div class="label--center m-t-15 m-b-10">{{ $t('trendPobjedaIPoraza') }}</div>
                            </slot>
                          </trend>
                          <playersStats :team="selectedPlayer.id" :show-title="false" class="m-t-30"></playersStats>
                        </b-tab-item>
                        <b-tab-item>
                          <profileDisplay
                            v-if="showProfile"
                            :player="selectedPlayer"
                            @hideProfile="showProfile = false"
                          ></profileDisplay>
                        </b-tab-item>
                        <b-tab-item>
                          <playersVsStats
                            v-if="showVsStats && playersForVsRecord"
                            :result-item="playersForVsRecord"
                            class="m-t-20 m-b-30"
                            :show-title="false"
                            @hideVsStats="showVsStats = false"
                          ></playersVsStats>
                        </b-tab-item>
                        <b-tab-item>
                          <lastMatches class="m-b-20 m-t-15" :team="selectedPlayer.id"></lastMatches>
                        </b-tab-item>
                      </b-tabs>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <transition name="fade">
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
            </transition>
          </div></div
      ></b-tab-item>
      <b-tab-item>
        <cup-Rankings></cup-Rankings>
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalAgeActive" :width="640" scroll="clip">
      <modal-range
        :title="$t('dob')"
        :subtitle="$t('Filtriraj popis prema dobi igrača')"
        :suffix="$t('godina')"
        @update="updateAge"
      ></modal-range>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import modalRange from '~/components/modal/ModalSelectRange'
// import Player from '~/models/Player'
import Team from '~/models/Team'
import playersVsStats from '~/components/stats/PlayersVsStats'
import trend from '~/components/stats/trend'
import playersStats from '~/components/stats/Stats'
import lastMatches from '~/components/stats/LastMatches'
import profileDisplay from '~/components/stats/profileDisplay'

export default {
  name: 'Rankings',
  components: {
    hero,
    trend,
    modalRange,
    playersStats,
    profileDisplay,
    playersVsStats,
    lastMatches,
    TennisImage,
  },
  async fetch() {
    await this.getPlayers()
  },
  data() {
    return {
      heroImage: '/hero_ranks.jpg',
      club_players: [],
      activeMainTab: 0,
      activeTab: 0,
      offset: 1,
      bottom: false,
      nomore: false,
      loading: false,
      total: 0,
      search_term: '',
      isModalTypeActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterTypeDisplay: 'Pojedinci',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      is_doubles: 0,
      options: [{ name: 'Pojedinci' }, { name: 'Parovi' }],
      isOpen: null,
      selectedPlayer: {},
      myTeam: {},
      showVsStats: true,
      showProfile: true,
    }
  },
  computed: {
    playersForVsRecord() {
      if (this.user.team.id === this.selectedPlayer.id) {
        return false
      }
      return { players: [this.myTeam, this.selectedPlayer] }
    },
    filterDoubles() {
      return this.is_doubles === 0 ? 'Pojedinci' : 'Parovi'
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.offset = 1
        this.debouncedGetPlayers()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getPlayers()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
    this.getMyTeams()
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    openMe(index, player) {
      if (index === this.isOpen) {
        this.isOpen = null
        this.selectedPlayer = {}
        this.activeTab = 0
      } else {
        this.isOpen = index
        this.selectedPlayer = player
        this.activeTab = 0
        this.showProfile = true
        this.showVsStats = true
      }
    },
    getPlayers() {
      if (this.last_page < this.offset) return
      this.loading = true
      const t = Team.params({ stats: true })
        .page(this.offset)
        .where('age', this.ageRange.join(','))
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .orderBy('rank')
      if (this.$store.state.club.id !== 26) {
        t.where('club', this.$store.state.club.id)
      }
      t.get().then((res) => {
        if (this.offset === 1) {
          this.club_players = res.data
        } else {
          this.club_players = [...this.club_players, ...res.data]
        }
        this.total = res.meta.total
        this.last_page = res.meta.last_page
        this.loading = false
      })
    },
    getMyTeams() {
      Team.where('number_of_players', 1)
        .where('players', this.user.id)
        .get()
        .then((res) => {
          this.myTeam = res.data[0]
        })
    },
    calculateDiff(player) {
      const rating1 = Math.round(this.user.team.score_club)
      const rating2 = player
      const r1 = Math.pow(10, rating1 / 400)
      const r2 = Math.pow(10, rating2 / 400)
      const e1 = r1 / (r1 + r2)
      const win = Math.round(32 * (1 - e1))
      const lose = Math.round(32 * -e1)
      return (
        '<span class="score_win">' +
        '+' +
        win +
        '</span><span class="has-text-grey-lighter"> |</span><span class="score_lose"> ' +
        lose +
        '</span>'
      )
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    updateAge(data) {
      this.offset = 1
      this.filterAgeDisplay = data.label
      this.ageRange = data.range
      this.getPlayers()
    },
  },
  head() {
    return {
      title: 'Rang ljestvica',
    }
  },
}
</script>
<style scoped>
.activity__header--center {
  display: none;
  opacity: 0;
}
.home-menu-middle > div {
  padding: 0.5rem !important;
}
</style>
