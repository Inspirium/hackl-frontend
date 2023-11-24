<template>
  <div class="ranglist">
    <hero :page="'rankings'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('multitimovi') }}</h1>
    </hero>
    <div class="filters container">
      <div class="filter">
        <div class="label m-t-0">{{ $t('vrstaLjestvice') }}</div>
        <div class="buttons">
          <b-button
            :type="!is_doubles ? 'is-primary' : 'is-danger'"
            pack="fal"
            :icon-right="is_doubles ? 'user-friends' : 'user-alt'"
            @click="
              is_doubles = !is_doubles
              offset = 1
              getPlayers()
            "
          >
            {{ is_doubles ? 'Parovi' : 'Pojedinci' }}
          </b-button>
        </div>
      </div>
    </div>

    <div class="tablelist">
      <div v-if="is_doubles" class="my-rank">
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
      <div class="relative">
        <template v-if="club_players.length">
          <div
            v-for="(players, index) in club_players"
            :key="players.id"
            is-bckg
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
                </div>
                <div class="flex align__centar__y down-line">
                  <div
                    v-if="players.players.length"
                    :class="is_doubles ? 'm-l-10' : ''"
                    class="fw600 is-size-7 has-text-black50"
                  >
                    {{ $t('godina range', { range: players.players[0].range }) }}
                  </div>
                </div>
              </div>
              <div class="m-l-auto club-logo-list-display" style="transition: 0.3s all">
                <div
                  v-for="clubIn in players.club_member"
                  :key="clubIn.id"
                  style="transition: 0.3s all"
                  class="flex justify-content-end"
                >
                  <div style="transition: 0.3s all" class="fw600 is-size-7 has-text-black50 name m-r-10">
                    {{ clubIn.name }}
                  </div>
                  <TennisImage
                    :size="[42, 42]"
                    style="transition: 0.3s all"
                    :src="clubIn.logo"
                    class="user_image-small border__white softshadow"
                    alt=""
                  />
                </div>
              </div>

              <b-icon
                icon="chevron-down"
                size="is-small-9"
                pack="far"
                class="m-t--3 m-l-7 chevrone-open"
                :class="[isOpen === index ? 'chevron-animated-open' : 'chevron-animated-close']"
              ></b-icon>
            </div>
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
      </div>
    </div>
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

export default {
  name: 'MultiTeam',
  components: {
    hero,
    modalRange,
    TennisImage,
  },
  async fetch() {
    await this.getPlayers()
  },
  data() {
    return {
      heroImage: '/hero_ranks.jpg',
      club_players: [],
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
      const x = { players: [this.myTeam, this.selectedPlayer] }
      x.players[0].team = x.players[0]
      x.players[1].team = x.players[1]
      return x
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
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
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
      Team.page(this.offset)
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .where('multiple_clubs', 1)
        .get()
        .then((res) => {
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
