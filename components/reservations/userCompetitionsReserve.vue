<template>
  <div>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <transition name="fade">
          <div v-if="userTournaments.length" class="">
            <div class="fw500 is-size-65 has-text-warning m-t-20 m-b-2">{{ $t('turnirskaNatjecanja') }}</div>
            <div
              v-for="item in userTournaments"
              v-show="item.status !== '5'"
              :key="item.id"
              class="is-black-list small-table fw600 flex justify-between m-t-7"
              @click="selectedTournamentId = item.id"
            >
              <div class="flex__column">
                <div class="has-text-white">{{ item.name }}</div>
              </div>
              <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="userLeague.length" class="">
            <div class="fw500 is-size-65 has-text-warning m-t-20 m-b-2">{{ $t('ligakaNatjecanja') }}</div>
            <div
              v-for="item in userLeague"
              :key="item.id"
              class="is-black-list small-table fw600 flex justify-between m-t-7"
              @click="selectedLeagueId = item.id"
            >
              <div class="flex__column">
                <div class="has-text-white">{{ item.name }}</div>
              </div>
              <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
            </div>
          </div>
        </transition>
      </b-tab-item>
      <!--      Liga-->
      <b-tab-item>
        <div class="buttons m-t-30 m-b-20">
          <b-button
            class="softshadow"
            type="is-primary"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click="
              activeTab = 0
              selectedLeagueId = null
              selectedLeague = {}
              selectedTournaments = {}
            "
          >
            {{ $t('nazad') }}
          </b-button>
        </div>
        <div class="relative">
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
              <b-icon
                class="comment-send m-b-20"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-white"
                pack="far"
              ></b-icon>
            </div>
          </transition>
          <div v-if="selectedLeague.classification === 'pyramid'" class="p-b-100 relative">
            <template v-if="userInGroup !== false && userMatchList.length">
              <div class="fw500 is-size-4 has-text-white m-b-2">{{ $t('odaberiMe') }}</div>
              <div
                v-for="(game, index) in userMatchList"
                :key="index"
                class="is-black-list p-t-7 p-b-7 p-l-10 p-r-10 rounded-md m-t-10"
                @click="$emit('liga', game)"
              >
                <div class="activity__box flex align__centar__y">
                  <div class="">
                    <div class="align__centar__y m-b-10">
                      <div v-if="game.players[0].type === 'team'" class="flex align__centar__y">
                        <div
                          v-if="game.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                          class="list__img"
                        >
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[0].players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[0].players[1].image"
                            class="user_image m-l--20 border__white--2"
                            alt=""
                          />
                        </div>
                        <div v-else class="list__img">
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                        </div>
                        <div class="list__content">
                          <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ game.display_name }}</h3>
                        </div>
                      </div>

                      <TennisImage
                        v-else
                        :size="[42, 42]"
                        :src="game.players[0].image"
                        class="user_image-small m-r-10"
                        alt=""
                      />
                      <h3 class="is-size-6 has-text-white fw600">
                        {{ game.players[0].display_name }}
                      </h3>
                    </div>
                    <div class="align__centar__y">
                      <div v-if="game.players[0].type === 'team'" class="flex align__centar__y">
                        <div
                          v-if="game.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                          class="list__img"
                        >
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[1].players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[1].players[1].image"
                            class="user_image m-l--20 border__white--2"
                            alt=""
                          />
                        </div>
                        <div v-else class="list__img">
                          <TennisImage
                            :size="[42, 42]"
                            :src="game.players[1].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                        </div>
                        <div class="list__content">
                          <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ game.display_name }}</h3>
                        </div>
                      </div>

                      <TennisImage
                        v-else
                        :size="[42, 42]"
                        :src="game.players[1].image"
                        class="user_image-small m-r-10"
                        alt=""
                      />
                      <h3 class="is-size-6 has-text-white fw600">{{ game.players[1].display_name }}</h3>
                    </div>
                  </div>
                  <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" pack="fal"></b-icon>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="!loading" class="rounded-md has-text-centered m-t-40 is-black-list p-all-12">
                <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-large m-t-5"> </b-icon>
                <div class="has-text-centered is-size-5 has-text-white fw600">
                  {{ $t('nemateMeevaUNatjecanju', { name: selectedLeague.name }) }}
                </div>
              </div>
            </template>
          </div>
          <!--        If is elo liga-->
          <div v-if="selectedLeague.classification === 'elo'" class="p-b-100 relative">
            <template v-if="filteredList.length" class="">
              <template v-if="!loading">
                <div id="inputsearch" class="search container">
                  <b-field>
                    <b-input
                      ref="filter"
                      v-model="search_term"
                      :placeholder="$t('pronaiProtivnika')"
                      type="search"
                      pack="far"
                      :icon-right="search_term === '' ? 'search' : 'times'"
                      icon-right-clickable
                      @icon-right-click="search_term = ' '"
                    >
                    </b-input>
                  </b-field>
                </div>

                <div class="fw500 is-size-4 has-text-white m-b-10">{{ $t('odaberiIgraa') }}</div>
                <div
                  v-for="player in filteredList"
                  v-show="hideUsersMatches(player)"
                  :key="player.id"
                  class="is-black-list p-t-10 p-b-10 p-l-15 p-r-15 rounded-md m-t-5"
                  @click="$emit('elo', { selectedLeague, player, usersTeam, isDoubles })"
                >
                  <div class="activity__box flex align__centar__y">
                    <div class="">
                      <div class="align__centar__y">
                        <div v-if="selectedLeague.is_doubles" class="flex align__centar__y">
                          <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                            <TennisImage
                              :size="[42, 42]"
                              :src="player.players[0].image"
                              class="user_image border__white--2"
                              alt=""
                            />
                            <TennisImage
                              :size="[42, 42]"
                              :src="player.players[1].image"
                              class="user_image m-l--20 border__white--2"
                              alt=""
                            />
                          </div>
                          <div v-else class="list__img">
                            <TennisImage
                              :size="[42, 42]"
                              :src="player.image"
                              class="user_image border__white--2"
                              alt=""
                            />
                          </div>
                          <div class="list__content">
                            <h3 class="fw600 is-size-55 has-text-white line-height-14">
                              {{ player.display_name }}
                            </h3>
                          </div>
                        </div>
                        <template v-else>
                          <div class="list__img">
                            <TennisImage
                              :size="[42, 42]"
                              :src="player.image"
                              class="user_image border__white--2"
                              alt=""
                            />
                          </div>
                          <div class="list__content">
                            <h3 class="fw600 is-size-55 has-text-white line-height-14">{{ player.display_name }}</h3>
                          </div>
                        </template>
                      </div>
                    </div>
                    <b-icon class="m-l-auto m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <div v-if="!loading" class="rounded-md has-text-centered m-t-40 is-black-list p-all-12">
                <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-large m-t-5"> </b-icon>
                <div class="has-text-centered is-size-5 has-text-white fw600">
                  {{ $t('nemateMeevaUNatjecanju', { name: selectedTournaments.name }) }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </b-tab-item>
      <!--      Kup-->
      <b-tab-item>
        <div class="buttons m-t-30 m-b-20">
          <b-button
            class="softshadow"
            type="is-primary"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click="
              selectedTournamentId = null
              activeTab = 0
            "
          >
            {{ $t('nazad') }}
          </b-button>
        </div>

        <div v-if="games.length" class="relative">
          <transition name="fade">
            <div v-if="loading1" class="align__centar__x loading_z_spinner m-t-30">
              <b-icon
                class="comment-send m-t--30"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-white"
                pack="far"
              ></b-icon>
            </div>
          </transition>
          <template v-if="!loading1">
            <div class="fw500 is-size-4 has-text-white m-b-2">{{ $t('odaberiMe') }}</div>

            <div
              v-for="(game, index) in games"
              :key="index"
              class="is-black-list p-t-7 p-b-7 p-l-10 p-r-10 rounded-md m-t-10"
              @click="$emit('liga', game)"
            >
              <div v-if="game.players.length > 1" class="activity__box flex align__centar__y">
                <div class="">
                  <div class="align__centar__y m-b-10">
                    <div v-if="game.players[0].type === 'team'" class="flex align__centar__y">
                      <div v-if="game.players[0].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[0].players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[0].players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <div class="list__content">
                        <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ game.display_name }}</h3>
                      </div>
                    </div>
                    <TennisImage
                      v-else
                      :size="[42, 42]"
                      :src="game.players[0].image"
                      class="user_image-small m-r-10"
                      alt=""
                    />
                    <h3 class="is-size-6 has-text-white fw600">
                      {{ game.players[0].display_name }}
                    </h3>
                  </div>
                  <!--                  <p>{{ game.players[0].image }}</p>-->
                  <div class="align__centar__y">
                    <div v-if="game.players[0].type === 'team'" class="flex align__centar__y">
                      <div v-if="game.players[1].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[1].players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[1].players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="game.players[1].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <div class="list__content">
                        <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ game.display_name }}</h3>
                      </div>
                    </div>

                    <TennisImage
                      v-else
                      :size="[42, 42]"
                      :src="game.players[1].image"
                      class="user_image-small m-r-10"
                      alt=""
                    />
                    <h3 class="is-size-6 has-text-white fw600">{{ game.players[1].display_name }}</h3>
                  </div>
                </div>
                <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
              </div>
              <template v-else>
                <div v-if="!loading1" class="rounded-md has-text-centered">
                  <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-large m-t-5"> </b-icon>
                  <div class="has-text-centered is-size-5 has-text-white fw600">
                    {{ $t('nemateMeevaUNatjecanju', { name: selectedTournaments.name }) }}
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
        <template v-else>
          <div v-if="!loading2" class="rounded-md has-text-centered m-t-40 is-black-list p-all-12">
            <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-large m-t-5"> </b-icon>
            <div class="has-text-centered is-size-5 has-text-white fw600">
              {{ $t('nemateMeevaUNatjecanju', { name: selectedTournaments.name }) }}
            </div>
          </div>
        </template>
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import Tournament from '@/models/Tournament'
import League from '@/models/League'
import _ from 'lodash'
import Game from '~/models/Game'
import Team from '~/models/Team'

export default {
  name: 'UserCompetitionsReservation',
  components: {
    TennisImage,
  },
  props: {
    reservation: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async fetch() {
    await this.getMyTournaments()
    await this.getMyLeagues()
    await this.getMyTeams()
  },
  data() {
    return {
      activeTab: 0,
      userTournaments: [],
      selectedTournaments: {},
      selectedTournamentId: null,
      userLeagueRaw: [],
      selectedLeague: {},
      selectedLeagueId: null,
      players: [],
      myTeams: [],
      loading: false,
      loading1: false,
      loading2: false,
      loadingMyLeagues: false,
      totalTournaments: 0,
      totalLiga: 0,
      userHaveCompetition: false,
      search_term: '',
      games: [],
    }
  },
  computed: {
    userLeague() {
      return this.userLeagueRaw.filter((item) => {
        return item.classification === 'pyramid' && item.status === '4'
      })
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    userInGroup() {
      if (!this.selectedLeague.is_doubles) {
        for (let i = 0; i < this.selectedLeague.number_of_groups; i++) {
          const y = _.filter(this.selectedLeague.groups[i].players, (item) => {
            return item.id === this.user.team.id
          })
          if (y.length > 0) {
            return i
          }
        }
      } else {
        for (let i = 0; i < this.selectedLeague.number_of_groups; i++) {
          const y = _.filter(this.selectedLeague.groups[i].players, (item) => {
            return item.players[0].id === this.user.id || item.players[1].id === this.user.id
          })
          if (y.length > 0) {
            return i
          }
        }
      }
      return false
    },
    userMatchList() {
      if (this.userInGroup !== false) {
        if (!this.selectedLeague.is_doubles) {
          return _.filter(this.selectedLeague.groups[this.userInGroup].games, (item) => {
            return item.players[0].id === this.user.team.id || item.players[1].id === this.user.team.id
          })
        } else {
          return _.filter(this.selectedLeague.groups[this.userInGroup].games, (item) => {
            return (
              item.players[0].players[0].id === this.user.id ||
              item.players[0].players[1].id === this.user.id ||
              item.players[1].players[0].id === this.user.id ||
              item.players[1].players[1].id === this.user.id
            )
          })
        }
      }
      return false
    },
    filteredList() {
      return this.selectedLeague.players.filter((player) => {
        return player.display_name.toString().toLowerCase().includes(this.search_term.toLowerCase())
      })
    },
    usersTeam() {
      if (this.selectedLeague.is_doubles) {
        const result = _.intersectionWith(this.selectedLeague.players, this.myTeams, (a, b) => a.id === b.id)
        return result
      }
      return 'Not doubles'
    },
    isDoubles() {
      return this.selectedLeague.is_doubles || this.selectedTournaments.is_doubles
    },
  },
  watch: {
    userHaveCompetition() {
      if (this.userHaveCompetition) {
        this.$emit('competition')
      }
    },
    selectedLeagueId(item) {
      if (item) {
        this.getLeague()
        this.activeTab = 1
      }
    },
    selectedTournamentId(item) {
      if (item) {
        this.getTournaments()
        this.getGames()
        this.activeTab = 2
      }
    },
  },
  methods: {
    hideUsersMatches(player) {
      if (this.selectedLeague.is_doubles) {
        return this.usersTeam[0].id !== player.id
      }
      return player.id !== this.user.team.id
    },
    getMyTeams() {
      Team.where('number_of_players', 2)
        .where('players', this.user.id)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.myTeams = res.data
          } else {
            this.myTeams = [...this.myTeams, ...res.data]
          }
        })
    },
    getMyTournaments() {
      Tournament.whereIn('status', ['4'])
        .where('mine', this.user.id)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.userTournaments = res.data
          this.totalTournaments = res.meta.total
          if (this.userTournaments.length) {
            this.userHaveCompetition = true
          }
        })
    },
    getTournaments() {
      if (Object.keys(this.$store.state.userCompetitions.competitions).length) {
        this.selectedTournaments = this.$store.state.userCompetitions.competitions[this.selectedTournamentId]
      } else {
        this.loading1 = true
        Tournament.include(['rounds', 'rounds.games'])
          .find(this.selectedTournamentId)
          .then((res) => {
            this.selectedTournaments = res
            this.loading1 = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
              duration: 3000,
            })
            this.loading1 = false
          })
      }
    },
    getGames() {
      this.loading2 = true
      const t = new Tournament({ id: this.selectedTournamentId })
      Game.where('player', this.user.id)
        .where('not_played', true)
        .for(t)
        .get()
        .then((res) => {
          this.games = res.data
          this.loading2 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loading2 = false
        })
    },
    getMyLeagues() {
      this.loadingMyLeagues = true
      League.whereIn('status', ['4'])
        .where('player', this.user.id)
        .orderBy('-finish_date')
        .get()
        .then((res) => {
          this.userLeagueRaw = res.data
          this.totalLiga = res.meta.total
          if (this.userLeague.length) {
            this.userHaveCompetition = true
          }
          this.loadingMyLeagues = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loadingMyLeagues = false
        })
    },
    getLeague() {
      if (Object.keys(this.$store.state.userCompetitions.competitions).length) {
        this.selectedLeague = this.$store.state.userCompetitions.competitions[this.selectedLeagueId]
      } else {
        this.loading = true
        League.include(['players', 'groups', 'groups.games'])
          .find(this.selectedLeagueId)
          .then((res) => {
            this.selectedLeague = res
            this.loading = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
              duration: 3000,
            })
            this.loading = false
          })
      }
    },
  },
}
</script>
