<script src="../../../store/userCompetitions.js"></script>
<template>
  <div class="ligatv">
    <div v-if="Object.keys(liga).length && true">
      <!--    Prikaži ako si admin ili liga admin-->
      <div class="liga__active__header">
        <div class="member__info liga__header is-primary">
          <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
            {{ $t('ligaSeIgraJo', { howManyDays: howManyDays }) }}
          </div>
        </div>
        <hero :back="true" class="liga__hero">
          <h1 class="has-text-white">{{ liga.name }}</h1>
        </hero>
      </div>
      <section class="flex align__centar__all w100 m-t-20">
        <div class="liga__new__settings__group">
          <div class="fw600 is-size-1 m-l-30 m-r-30 has-text-black50">
            <span class="is-size-6">{{ $t('ukupnoOdigranoMeeva') }}:</span>
            <span class="has-text-primary is-size-2">{{ totalUnplayedMatchesInLiga.length }}</span
            ><span class="is-size-5">/{{ totalMatchesInLiga }}</span>
          </div>
        </div>
      </section>
      <div class="buttons m-t-15 m-b--10 reztvbt">
        <b-button class="softshadow" type="is-small noborder" pack="fal" rounded @click="showResults = !showResults">
          {{ $t('Prikaz rezultata') }}
        </b-button>
      </div>

      <div class="members p-x-16">
        <div class="p-b-100 flex flex-wrap align__centar__x">
          <div
            v-for="(group, indexGroup) in liga.groups"
            :key="indexGroup"
            ref="groupItem"
            class="m-t--10 liga__create__box m-r-15 m-l-15"
          >
            <div class="activity__header m-t-30">
              <div class="fw600 is-size-3">
                {{ group.name }}
              </div>
            </div>
            <template>
              <div
                v-if="liga.groups[indexGroup].games.length"
                class="fw600 m-b-15 is-size-55 liga-progress__label w100 m-b-10 m-t--10 rounded-md has-text-white flex"
                :style="{ 'background-image': backgroundImage(indexGroup) }"
              >
                <div
                  v-for="index in liga.groups[indexGroup].games.length - 1"
                  :key="index"
                  class="liga-progress__separator"
                ></div>
              </div>

              <div v-if="showGroupSettings !== indexGroup" class="activity__box action__buttons liga__group__list">
                <div class="liga__legend__status w100">
                  <div class="liga__legend__status_box m-l-auto">
                    <div class="liga__matches">{{ $t('meevi') }}</div>
                    <div class="liga__gems">{{ $t('gemRazlika') }}</div>
                    <div class="liga__sets">{{ $t('setRazlika') }}</div>
                    <div class="liga__points">{{ $t('bodovi') }}</div>
                  </div>
                </div>
                <div
                  v-for="(player, index) in group.players"
                  :key="index"
                  class="action__item__small--liga p-r-10"
                  :class="[
                    index < group.move_up ? 'move__up--true' : '',
                    index > group.players.length - (group.move_down + 1) ? 'move__down--true' : '',
                  ]"
                >
                  <nuxt-link
                    v-if="true"
                    :to="localePath('/liga/' + $route.params.id + '/' + player.id)"
                    class="align__centar__y"
                  >
                    <div class="rank fw600">{{ $t('key3', { expr: index + 1 }) }}</div>
                    <div class="list__img">
                      <template v-if="liga.is_doubles" class="for-doubles">
                        <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="flex">
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
                      </template>

                      <TennisImage v-else :size="[42, 42]" :src="player.image" class="user_image-small" alt="" />
                    </div>
                    <div class="list__content">
                      <h3 class="fw600 has-text-black80 is-size-6">{{ player.display_name }}</h3>
                    </div>
                    <div v-if="group.stats[player.id] !== undefined" class="liga__legend">
                      <div class="liga__matches">
                        {{ group.stats[player.id].matches.total }}
                      </div>
                      <div
                        class="liga__gems"
                        :class="[
                          setGems(player.id, indexGroup) === 0
                            ? 'has-text-black80'
                            : setGems(player.id, indexGroup) > 0
                            ? 'has-text-success'
                            : 'has-text-danger',
                        ]"
                      >
                        {{ setGems(player.id, indexGroup) > 0 ? '+' : '' }}{{ setGems(player.id, indexGroup) }}
                      </div>
                      <div
                        class="liga__sets"
                        :class="[
                          setStats(player.id, indexGroup) === 0
                            ? 'has-text-black80'
                            : setStats(player.id, indexGroup) > 0
                            ? 'has-text-success'
                            : 'has-text-danger',
                        ]"
                      >
                        {{ setStats(player.id, indexGroup) > 0 ? '+' : '' }}{{ setStats(player.id, indexGroup) }}
                      </div>
                      <div class="liga__points">
                        {{ player.pivot.score !== null ? player.pivot.score : 0 }}
                      </div>
                    </div>
                  </nuxt-link>

                  <div v-else class="activity__header p-t-5 p-b-5" @click="insertPlayer(indexGroup, index)">
                    <div class="rank fw600 m-r-15">{{ $t('key3', { expr: index + 1 }) }}</div>
                    <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                    <div class="list__content">
                      <h3 class="has-text-black50 fw600">{{ $t('dodajIgraa') }}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="liga__group__settings">
                <!--                  Ljestvica-->
                <section class="is-red rounded-md p-t-10 p-b-5 m-b--10">
                  <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                    {{ $t('odigraniMeevi') }}
                  </div>
                  <div class="liga__new__settings__group">
                    <div class="fw600 is-size-1 m-l-30 m-r-30 has-text-white">
                      {{ liga.groups[indexGroup].games.length - totalUnplayedMatchesInGroup(indexGroup).length }}/{{
                        liga.groups[indexGroup].games.length
                      }}
                    </div>
                  </div>
                  <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                    {{
                      Math.round(
                        ((liga.groups[indexGroup].games.length - totalUnplayedMatchesInGroup(indexGroup).length) /
                          liga.groups[indexGroup].games.length) *
                          100
                      )
                    }}%
                  </div>
                </section>
                <div class="buttons m-t-30">
                  <b-button
                    class="softshadow"
                    type="is-small noborder"
                    pack="fal"
                    rounded
                    @click="hideEmptyLots = !hideEmptyLots"
                  >
                    {{ hideEmptyLots ? $t('Prikaži samo odigrane mečeve') : $t('Prikaži sve mečeve') }}
                  </b-button>
                </div>
                <div v-for="game in group.games" :key="game.id" class="m-b-10">
                  <ligaLotEmpty
                    v-if="game.result === null && hideEmptyLots"
                    :game="game"
                    :is-doubles="liga.is_doubles"
                    :isligaadmin="isLigaAdmin.length"
                    @openIt="
                      partner = game.players
                      gameid = game.id
                      isResultPrepopulatedModalActive = true
                      adminResultPlayers = game.players
                    "
                    @openItAdmin="
                      partner = game.players
                      openMatchAdmin(game)
                      gameid = game.id
                    "
                    @openItReservation="
                      openReservation(game)
                      gameid = game.id
                    "
                  ></ligaLotEmpty>
                  <ligaLotPlayed
                    v-if="game.result !== null"
                    :game="game"
                    :show-date="true"
                    :is-doubles="liga.is_doubles"
                  ></ligaLotPlayed>
                </div>
              </div>
            </template>
            <div v-show="showResults" class="fw600 is-size-6 m-t-10 m-b-5">{{ $t('meevi') }}</div>
            <div v-for="game in group.games" v-show="showResults" :key="game.id" class="m-b-10">
              <ligaLotEmpty
                v-if="game.result === null && hideEmptyLots"
                :game="game"
                :is-doubles="liga.is_doubles"
                :isligaadmin="isLigaAdmin.length"
                @openIt="
                  partner = game.players
                  gameid = game.id
                  isResultPrepopulatedModalActive = true
                  adminResultPlayers = game.players
                "
                @openItAdmin="
                  partner = game.players
                  openMatchAdmin(game)
                  gameid = game.id
                "
                @openItReservation="
                  openReservation(game)
                  gameid = game.id
                "
              ></ligaLotEmpty>
              <ligaLotPlayed
                v-if="game.result !== null"
                :game="game"
                :show-date="true"
                :is-doubles="liga.is_doubles"
              ></ligaLotPlayed>
            </div>
          </div>
        </div>
      </div>

      <b-modal :active.sync="isModalAddPlayerToGroupActive" :width="640" scroll="clip" class="modal__members">
        <modalMembers
          :show-tennis-school="false"
          :is-doubles="!!liga.is_doubles"
          :title="$t('dodajteNoveIgraeUGrupu')"
          @player="addNewPlayer($event)"
        ></modalMembers>
      </b-modal>
      <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
        <modalMembers
          :show-tennis-school="false"
          :is-doubles="!!liga.is_doubles"
          :title="$t('dodajteNoveIgraeULigu')"
          @player="liga.players.push($event)"
        ></modalMembers>
      </b-modal>
      <b-modal :active.sync="isModalAddInterestedPlayerActive" :width="640" scroll="clip" class="modal__members">
        <modalMembers
          :show-tennis-school="false"
          :is-doubles="!!liga.is_doubles"
          :title="$t('dodajteNoveIgraeULigu')"
          @player="addInterestedPlayer($event)"
        ></modalMembers>
      </b-modal>

      <b-modal :active.sync="isResultPrepopulatedModalActive" :width="640" scroll="clip">
        <modalResult
          :title="$t('upiiRezultatLige')"
          :partner="liga.is_doubles ? partner : selectedPartner"
          :is-doubles="liga.is_doubles"
          :options="{ prepopulated: true, game_id: gameid, bothPlayers: adminResultPlayers }"
        ></modalResult>
      </b-modal>

      <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
        <modalOptions
          :options="selectedResult"
          :title="$t('opcijeMea')"
          :subtitle="$t('Ako je došlo po problema u dogovoru za meč, imate sljedeće opcije:')"
          @update="getLeague()"
          @result="adminResultInput($event)"
        ></modalOptions>
      </b-modal>
    </div>
    <section v-if="!Object.keys(liga).length && loadingLiga" class="p-l-15 p-r-15 m-t-30">
      <div class="align__centar__x m-t-30 loading_z_spinner--bottom">
        <b-icon
          class="comment-send"
          custom-class="rotating"
          icon="spinner"
          size="is-large"
          type="is-primary"
          pack="far"
        ></b-icon>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Player from '@/models/Player'
import TextMessage from '@/components/messages/textMessage'
import TermMessage from '@/components/messages/termsMessage'
import ImageMessage from '@/components/messages/imageMessage'
import Thread from '@/models/Thread'
import League from '@/models/League'
import LeagueGroup from '@/models/LeagueGroup'
import hero from '~/components/Hero'
import adminEdit from '~/components/liga/adminEdit'
import modalResult from '~/components/modal/ModalResult'
import modalMembers from '~/components/modal/ModalMembersAll'
import ligaLotEmpty from '~/components/liga/LigaLotEmpty'
import ligaLotPlayed from '~/components/liga/LigaLotPlayed'
import modalOptions from '~/components/liga/ModalMatchAdminOptions'
import membersSearch from '~/components/membersSearchWithEdit'
import doubles from '~/components/liga/doubles'

export default {
  name: 'Liga',
  layout: 'noBackFull',
  components: {
    modalMembers,
    modalResult,
    ligaLotEmpty,
    membersSearch,
    ligaLotPlayed,
    modalOptions,
    adminEdit,
    hero,
    ImageMessage,
    TermMessage,
    TextMessage,
    doubles,
    TennisImage,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      bla: '',
      activeTabResult: 0,
      activeTab: 0,
      activeTabLiga: 0,
      showResults: false,
      isMatchOptionsModal: false,
      loadingMessagesLiga: false,
      loadingMessagesLigaGroup: false,
      loadingMessage: false,
      heroImage: '/liga.jpg',
      showGroupinfo: null,
      showGroupSettings: null,
      isModalAddPlayerToGroupActive: false,
      isModalAddInterestedPlayerActive: false,
      isResultPrepopulatedModalActive: false,
      partner: [],
      adminResultPlayers: [],
      gameid: null,
      isModalMembersActive: false,
      isModalAddPlayerActive: false,
      isModaSelectActive: false,
      selectedResult: {},
      playerList: [],
      selectedPlayer: [],
      selectedPlayerforMatchList: {},
      selectedPlayerIndex: {},
      selectedGroup: null,
      selectedIndex: null,
      draggingRow: null,
      draggingRowIndex: null,
      droppedOnRowIndex: null,
      messages: [],
      thread: [],
      messagesLiga: [],
      threadLiga: [],
      liga: {},
      test: [],
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loadingCycle: false,
      loadingFreeze: false,
      loadingUnFreeze: false,
      loadingLiga: false,
      hideEmptyLots: true,
      showDoublesIntrestedBox: false,
      finishDateEdited: false,
      show_details: false,
      hasShowedIntrestdTeam: [],
      new_finish_date: null,
      groupCustomPoints: false,
      adminAsPlayer: {},
    }
  },
  computed: {
    singleInLiga() {
      return this.liga.players.filter((item) => {
        return item.id === this.user.team.id
      })
    },
    playersInterestedList() {
      let playersInGroups = []
      for (let i = 0; i < this.liga.groups.length; i++) {
        playersInGroups = [...playersInGroups, ...this.liga.groups[i].players]
      }
      const results = this.liga.players.filter(({ id: id1 }) => !playersInGroups.some(({ id: id2 }) => id2 === id1))
      return results
    },
    totalUnplayedMatchesInLiga() {
      let notPlayed = []
      let notPlayedNum = []
      for (let i = 0; i < this.liga.groups.length; i++) {
        notPlayed = _.filter(this.liga.groups[i].games, (item) => {
          return item.played_at !== null
        })
        notPlayedNum = [...notPlayed, ...notPlayedNum]
      }
      return notPlayedNum
    },
    totalPlayedMatchesInLiga() {
      return this.totalMatchesInLiga - this.totalUnplayedMatchesInLiga.length
    },
    totalMatchesInLiga() {
      let matches = null
      let matchesNum = null
      for (let i = 0; i < this.liga.groups.length; i++) {
        matches = this.liga.groups[i].games.length
        matchesNum = matches + matchesNum
      }
      return matchesNum
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin && this.user.admin.includes(this.liga.club_id)
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.user.id
      })
    },
    userInGroup() {
      for (let i = 0; i < this.liga.number_of_groups; i++) {
        const y = _.filter(this.liga.groups[i].players, (item) => {
          return item.id === this.user.team.id
        })
        if (y.length > 0) {
          return i
        }
      }
      return false
    },
    userInGroupSingleAndDouble() {
      if (this.userInGroup !== false) {
        return true
      }
      if (this.userInGroupDoubles() !== false) {
        return true
      }
      return false
    },
    hasDatePassed() {
      const a = this.$moment.utc(this.liga.finish_date)
      const b = this.$moment()
      if (a.diff(b, 'hours') >= 0) {
        return false
      } else {
        return true
      }
    },
    howManyDays() {
      return this.$moment(this.liga.finish_date).endOf('day').fromNow('String')
    },
    selectedPartner() {
      return _.filter(this.partner, (item) => {
        return item.id !== this.$store.state.auth.user.id
      })
    },
    userMatchList() {
      if (this.userInGroup !== false) {
        return _.filter(this.liga.groups[this.userInGroup]?.games, (item) => {
          return item.players[0]?.id === this.user.team.id || item.players[1]?.id === this.user.team.id
        })
      }
      return []
    },
    userMatchListDoubles() {
      if (this.liga.is_doubles && this.userInGroupDoubles() !== false) {
        return _.filter(this.liga.groups[this.userInGroupDoubles()].games, (item) => {
          return (
            item.players[0].players[0].id === this.user.id ||
            item.players[0].players[1].id === this.user.id ||
            item.players[1].players[0].id === this.user.id ||
            item.players[1].players[1].id === this.user.id
          )
        })
      } else {
        return []
      }
    },
    notPlayedList() {
      if (this.userInGroup === null) {
        return
      }
      return _.filter(this.liga.groups[this.userInGroup].games, (item) => {
        return item.result === null && (item.players[0].id === this.user.id || item.players[1].id === this.user.id)
      })
    },
    tes1t() {
      return _.filter(this.liga.groups[0].players, (p) => {
        return p.players[0].id !== this.user.id
      })
    },
    freezedSingle() {
      if (!this.liga.is_doubles && this.singleInLiga.length) {
        for (let i = 0; i < this.liga.groups.length; i++) {
          const y = _.filter(this.liga.groups[i].players, (item) => {
            return item.id === this.singleInLiga[0].id
          })
          if (y.length > 0) {
            return y[0].pivot.freeze
          }
        }
      }
      return false
    },
    freezedDoubles() {
      if (this.liga.is_doubles && this.liga.freeze) {
        const p = this.userInGroupDoubles()
        for (let i = 0; i < this.liga.groups[p].players.length; i++) {
          const doublesTeam = _.intersectionWith(this.liga.groups[p].players, this.user.teams, (a, b) => a.id === b.id)
          return doublesTeam[0].pivot.freeze !== null
        }
      }
      return false
    },
    freezedSingleAndDoubles() {
      return this.freezedSingle || this.freezedDoubles
    },
    userInGroupDoubles1() {
      if (!this.liga.is_doubles) {
        return false
      }
      for (let i = 0; i < this.liga.number_of_groups; i++) {
        for (let p = 0; p < this.liga.groups[i].players.length; p++) {
          const y = _.filter(this.liga.groups[i].players[p].players, (item) => {
            return item.id === this.user.id
          })
          if (y.length > 0) {
            return i
          }
        }
      }
      return false
    },
  },
  mounted() {
    if (Object.keys(this.$store.state.userCompetitions.competitions).length) {
      this.liga = this.$store.state.userCompetitions.competitions[this.$route.params.id]
    }
    if (Object.keys(this.$store.state.userCompetitions.selectedLiga).length) {
      if (this.$store.state.userCompetitions.selectedLiga.id == this.$route.params.id) {
        this.liga = this.$store.state.userCompetitions.selectedLiga
      }
    }
    this.$echo.channel('league.' + this.$route.params.id).listen('LeagueUpdate', (e) => {
      this.getLeague()
    })
  },
  methods: {
    submitMessageInfo() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.adminAsPlayer.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.adminAsPlayer] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessage = false
        })
        .catch(() => {
          this.loadingMessage = false
        })
    },
    getAdmin() {
      Player.find(this.liga.admins[0].id).then((res) => {
        this.adminAsPlayer = res
      })
    },
    toStore() {
      this.$store.commit('userCompetitions/setSelectedLiga', this.liga)
    },
    freezeList(players) {
      return players.filter((item) => {
        return item.pivot.freeze
      })
    },
    checkIfShowedInteres(teams) {
      const teamsList = []
      teamsList.push(teams)
      const result = _.intersectionWith(teamsList[0], this.playersInterestedList, (a, b) => a.id === b.id)
      this.hasShowedIntrestdTeam = result
      return result
    },
    openReservation(game) {
      this.$router.push({
        path: this.localePath('/courts/reservation'),
        query: { game: game.id, clubid: this.liga.club_id },
      })
    },
    userInGroupDoubles() {
      if (!this.liga.is_doubles) {
        return false
      }
      for (let i = 0; i < this.liga.number_of_groups; i++) {
        for (let p = 0; p < this.liga.groups[i].players.length; p++) {
          const y = _.filter(this.liga.groups[i].players[p].players, (item) => {
            return item.id === this.user.id
          })
          if (y.length > 0) {
            return i
          }
        }
      }
      return false
    },
    ifPlayerIsFrosen(player) {
      if (this.liga.is_doubles) {
        return this.usersTeam()
      } else {
        return this.user.team.id === player.id
      }
    },
    usersTeam() {
      if (this.liga.is_doubles) {
        const result = _.intersectionWith(this.liga.players, this.user.teams, (a, b) => a.id === b.id)
        return result
      }
      return false
    },
    showInterest(doubles) {
      this.loading1 = true
      this.loading6 = true
      const l = new League({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [doubles || this.$store.state.auth.user] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Prijavili ste interes za ovo natjecanje'),
            type: 'is-success',
            duration: 3000,
          })
          this.loading1 = false
          this.loading6 = false
          this.getLeague()
          this.hasShowedIntrestdTeam = [doubles]
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading1 = false
          this.loading6 = false
        })
    },
    removeInteres(id) {
      this.loading3 = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Interes za ligu je uklonjen'),
            type: 'is-success',
          })
          this.loading3 = false
          this.getLeague()
          this.hasShowedIntrestdTeam = []
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading3 = false
        })
    },
    addInterestedPlayer(item) {
      this.loading2 = true
      const l = new League({ id: this.liga.id })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u ligu'),
            type: 'is-success',
            duration: 500,
          })
          this.getLeague()
          this.loading2 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading2 = false
        })
    },
    deletePlayer(playerId) {
      const l = new LeagueGroup({ id: this.liga.groups[this.selectedGroup].id })
      const p = new Player({ id: playerId }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno se uklonili igrača iz grupe'),
            type: 'is-success',
          })
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    addFreeze(indexGroup) {
      this.loadingFreeze = true
      this.show_details = true
      const l = new LeagueGroup({ id: this.liga.groups[indexGroup].id })
      const d = this.usersTeam()
      const player = this.liga.is_doubles ? d[0] : this.$store.state.auth.user.team
      l.players()
        .attach({ freeze: [player] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste zamrznuli status'),
            type: 'is-success',
          })
          this.getLeague()
          this.loadingFreeze = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loadingFreeze = false
        })
    },
    unFreeze(player, indexGroup) {
      this.loadingUnFreeze = true
      this.show_details = false
      const l = new LeagueGroup({ id: this.liga.groups[indexGroup].id })
      const p = new Player(player).for(l)
      p.config({
        data: {
          freeze: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Zamrznuli ste svoj status u ligi'),
            type: 'is-success',
          })
          this.loadingUnFreeze = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loadingUnFreeze = false
        })
    },
    addNewPlayer(item) {
      this.loading1 = true
      const l = new League({ id: this.liga.id })
      const lg = new LeagueGroup({ id: this.liga.groups[this.selectedGroup].id })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          lg.save()
          lg.players()
            .attach({ players: [item] })
            .then(() => {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste dodali igrače u grupu'),
                type: 'is-success',
                duration: 500,
              })
              this.loading1 = false
              this.getLeague()
            })
            .catch(() => {
              this.$buefy.toast.open({
                message: this.$t('Došlo je do greške'),
                type: 'is-danger',
                duration: 2500,
              })
              this.loading1 = false
            })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading1 = false
        })
    },
    goToMyGroup() {
      this.$refs.groupItem[this.userInGroup].scrollIntoView({ behavior: 'smooth' })
    },
    backgroundImage(indexGroup) {
      const matches = this.liga.groups[indexGroup].games.length
      const unplayedMatches = this.totalUnplayedMatchesInGroup(indexGroup).length
      // const playedMatches = matches - this.totalUnplayedMatchesInGroup(indexGroup).length
      const precent = Math.round(((matches - unplayedMatches) / matches) * 100)
      const bckg = `linear-gradient(to right, #73c03d ${precent}%, #f8f9fb ${precent}%)`
      return bckg
    },
    adminResultInput(item) {
      this.adminResultPlayers = item
      this.partner = item
      this.isResultPrepopulatedModalActive = true
    },
    goBackCycle() {
      this.loadingCycle = true
      League.include([
        'players',
        'admins',
        'groups',
        'parent',
        'child',
        'groups.games',
        'documents',
        'thread',
        'groups.thread',
      ])
        .find(this.liga.parent.id)
        .then((res) => {
          this.loadingCycle = false
          this.liga = res
          this.getMessages()
          this.getMessagesLiga()
        })
        .catch((res) => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingCycle = false
        })
    },
    goForwardCycle() {
      this.loadingCycleFw = true
      League.include([
        'players',
        'admins',
        'groups',
        'parent',
        'child',
        'groups.games',
        'documents',
        'thread',
        'groups.thread',
      ])
        .find(this.liga.child.id)
        .then((res) => {
          this.loadingCycleFw = false

          this.liga = res
          this.getMessages()
          this.getMessagesLiga()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingCycleFw = false
        })
    },
    setStats(player, indexGroup) {
      const path = this.liga.groups[indexGroup].stats[player].sets
      return path.wins - path.losses
    },
    setGems(player, indexGroup) {
      const path = this.liga.groups[indexGroup].stats[player].points
      return path.wins - path.losses
    },
    totalUnplayedMatchesInGroup(groupIndex) {
      const tbd = _.filter(this.liga.groups[groupIndex].games, (item) => {
        return item.played_at === null
      })
      return tbd
    },

    editLink() {
      this.$router.push(this.localePath('/liga/' + this.liga.id + '/edit'))
    },
    submitMessage(groupIndex) {
      this.loadingMessagesLigaGroup = true
      const t = new Thread({
        id: this.liga.groups[groupIndex].thread.id,
        message: this.$t('Teniska liga') + ' ' + this.liga.name + ' ' + this.$t('možete razmijenjivati poruke'),
        title: this.liga.name + '-' + this.liga.id + '-' + this.liga.groups[groupIndex].id,
      })
      t.save()
        .then((res) => {
          this.$router.push(this.localePath(`/messages/${res.id}`))
          this.loadingMessagesLigaGroup = false
        })
        .catch(() => {
          this.loadingMessagesLigaGroup = false
        })
    },
    finishLiga() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 5,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je zaključena'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/' + this.$route.params.id + '/finish'))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
    submitMessageLiga() {
      this.loadingMessagesLiga = true
      const t = new Thread({
        id: this.liga.thread.id,
        message: this.$t('Teniska liga') + ' ' + this.liga.name,
        title: this.liga.name,
      })
      t.save()
        .then((res) => {
          this.$router.push(this.localePath(`/messages/${res.id}`))
          this.loadingMessagesLiga = false
        })
        .catch(() => {
          this.loadingMessagesLiga = false
        })
    },
    getMessages() {
      if (this.userInGroup === false) return
      const th = new Thread({ id: this.liga.groups[this.userInGroup].thread.id })
      th.messages()
        .limit(3)
        .get()
        .then((res) => {
          this.messages = res.data.reverse()
        })
    },
    getMessagesLiga() {
      if (this.liga.thread === null) return
      this.thread = new Thread({ id: this.liga.thread.id })
      this.thread
        .messages()
        .limit(3)
        .get()
        .then((res) => {
          this.messagesLiga = res.data.reverse()
        })
    },
    openMatchAdmin(item) {
      this.selectedResult = item
      this.partner = item.players
      this.gameid = item.id
      this.isMatchOptionsModal = true
    },
    openSettings(group, indexGroup) {
      if (this.showGroupSettings !== indexGroup) {
        this.showGroupSettings = indexGroup
        this.$nextTick(() => {
          this.$refs.groupItem[indexGroup].scrollIntoView({ behavior: 'smooth' })
        })
      } else {
        this.showGroupSettings = null
      }
    },
    openInfo(group, indexGroup) {
      if (this.showGroupinfo !== indexGroup) {
        this.showGroupinfo = indexGroup
      } else {
        this.showGroupinfo = null
      }
    },
    getLeague() {
      if (this.loadingLiga) {
        return
      }
      this.loadingLiga = true
      League.include([
        'players',
        'admins',
        'groups',
        'parent',
        'child',
        'groups.games',
        'documents',
        'thread',
        'groups.thread',
      ])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.getMessages()
          this.getMessagesLiga()
          this.loadingLiga = false
          this.toStore()
          this.getAdmin()
        })
        .catch(() => {
          this.loadingLiga = false
        })
    },
    submit() {
      this.loading4 = true
      this.liga.finish_date = this.$moment(this.new_finish_date).format('YYYY-MM-DD')
      this.liga.show_on_tenisplus = this.liga.show_on_tenisplus ? this.liga.show_on_tenisplus : true
      this.liga
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili rok za završetak ciklusa'),
            type: 'is-success',
          })
          this.getLeague()
          this.loading4 = false
          this.finishDateEdited = true
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading4 = false
        })
    },
    saveLigaGroup(item) {
      this.loading5 = true
      const group = this.liga.groups[this.showGroupinfo]
      const l = new LeagueGroup({
        id: item,
        name: group.name,
        move_up: group.move_up,
        move_down: group.move_down,
        points: group.points === null ? 1 : group.points,
        points_loser: group.points_loser === null ? 0 : group.points_loser,
        points_match: group.points_match === null ? 0 : group.points_match,
      })
      l.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili postavke liga grupe'),
            type: 'is-success',
          })
          this.loading5 = false
          this.ress = res
          this.getLeague()
          // deselect group settings
          this.showGroupinfo = null
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading5 = false
        })
    },
  },
}
</script>
<style scoped>
.liga__group__settings {
  padding: 0;
  background-color: transparent;
}
.schoolgroup__messages {
  background-color: #ffffff50;
}
</style>
