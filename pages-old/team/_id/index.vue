<template>
  <div v-if="Object.keys(player).length" class="member p-b-150">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div v-if="true" class="activity x-container m-t--20">
      <div class="member__info">
        <!--Show if doubles-->
        <template v-if="isItDoubles">
          <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="">
            <TennisImage :size="[180, 180]" :src="player.players[0].image" class="user_image-large m-r-5" alt="" />
            <TennisImage :size="[180, 180]" :src="player.players[1].image" class="user_image-large m-l--80" alt="" />
          </div>
          <div v-else class="">
            <TennisImage :size="[42, 42]" :src="player.image" class="user_image-large" alt="" />
          </div>

          <div v-if="isItDoubles" class="modal-subtitle m-t-5">{{ $t('teniskiPar') }}</div>
          <div class="title m-b-5">{{ player.display_name }}</div>
          <h2 v-if="player.rating_club" class="is-text-center fw600 is-size-5">
            {{ $t('bodova2', { round: Math.round(player.rating_club) }) }}
          </h2>
          <b-table class="softshadow tablelist m-t-20" :data="player.players" :mobile-cards="false" :bordered="false">
            <b-table-column v-slot="props" cell-class="list__image-col">
              <nuxt-link :to="localePath('/player/' + props.row.id)">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content has-text-left">
                  <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                  <div class="fw600 is-size-7 has-text-lightblue">{{ props.row.range + ' ' + $t('godina') }}</div>
                </div>
                <b-tag v-if="props.row.rating_club" type="is-info">{{ Math.round(props.row.rating_club) }}</b-tag>
              </nuxt-link>
            </b-table-column>
          </b-table>

          <div v-if="user.is_admin" class="buttons m-t-20">
            <b-button
              tag="nuxt-link"
              :to="localePath('/doubles/' + player.id + '/edit')"
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="user-edit"
              rounded
            >
              {{ $t('urediPar') }}
            </b-button>
          </div>
          <div v-if="user.id !== player.id" class="buttons m-t-20">
            <b-button
              class="m-l-10"
              type="is-primary"
              pack="fal"
              icon-right="comments"
              rounded
              :loading="loadingMessage"
              @click.native.prevent="submitMessage"
            >
              {{ $t('poaljiGrupnuPoruku') }}
            </b-button>
          </div>
        </template>
        <!--Show if single-->
        <template v-else>
          <TennisImage :size="[180, 180]" :src="player.image" class="user_image-large m-r-5" alt="" />
          <div class="title m-b-5 m-t-5">{{ player.display_name }}</div>
          <div class="modal-subtitle">{{ $t('godina range', { range: player.players[0].range }) }}</div>
          <div v-if="user.id === 2" class="buttons m-t-15 m-b--10">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              rounded
              :loading="loadingClub"
              @click="isModalClubActive = true"
            >
              {{ $t('ulaniUNoviKlub') }}
            </b-button>
          </div>
          <div v-if="user.team.id !== player.id" class="buttons m-t-20">
            <b-button
              :href="'tel:' + player.phone"
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
              @click.native.prevent="submitMessage"
            >
              {{ $t('poaljiPoruku') }}
            </b-button>
          </div>
          <template v-if="myTeams.length">
            <div class="activity__header--center m-b-10 m-t-20">
              <div class="fw600 is-size-35 has-text-centered">
                {{ user.team.id === player.id ? 'Moji parovi' : 'Teniski parovi' }}
              </div>
            </div>
            <div class="tablelist">
              <b-table class="softshadow" :data="myTeams" :mobile-cards="false" :bordered="false">
                <b-table-column v-slot="props" cell-class="list__image-col">
                  <div class="flex">
                    <nuxt-link :to="localePath('/team/' + props.row.id)" class="w100">
                      <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                      <b-tag v-if="props.row.rating_club !== null" type="is-info" class="m-l-auto">{{
                        Math.round(props.row.rating_club)
                      }}</b-tag>
                    </nuxt-link>
                  </div>
                </b-table-column>
              </b-table>
            </div>
          </template>
        </template>
      </div>
      <playersVsStats v-if="user.team.id !== player.id" :result-item="playersForVsRecord" class="m-t-30" />
      <playersStats :team="player.id" />
      <!--Show only for single-->
      <div v-if="Object.keys(player).length && !isItDoubles" id="profile">
        <div v-if="playerProfile.length" class="x-container">
          <div class="activity__header--center m-b-0 m-t-20">
            <nuxt-link :to="localePath('/team/' + $route.params.id + '/profile')" class="fw600"
              >{{ $t('profil') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>
          <profileDisplay :player="player" />
        </div>
        <div v-else class="">
          <div class="activity__header--center m-b-0 m-t-20">
            <nuxt-link :to="localePath('/team/' + $route.params.id + '/profile')" class="fw600"
              >{{ $t('profil') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>

          <div class="fw600 is-size-5 has-text-black50 has-text-centered flex align__centar__all m-t-5 m-b-5">
            <b-icon icon="exclamation-square" class="m-r-5" type="is-danger" size="is-smaller" pack="fal"></b-icon>
            {{ $t('igraNijeProfiliran') }}
          </div>
          <div class="buttons m-t-10 m-b-20">
            <b-button
              class="softshadow m-t-10 m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="chart-line"
              rounded
              @click="$router.push(localePath('/team/' + $route.params.id + '/profile'))"
            >
              {{ $t('prviProfilirajIgraa') }}
            </b-button>
          </div>
        </div>
      </div>
      <tournamentScore :team="+$route.params.id" class="m-b-20" />

      <template v-if="results.length">
        <div class="activity__header--center m-b-0 m-t-20">
          <nuxt-link :to="localePath('/team/' + $route.params.id + '/results')" class="fw600"
            >{{ $t('rezultati') }}
            <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
          </nuxt-link>
        </div>

        <div v-touch:swipe="swipeHandler">
          <b-tabs v-model="activeTab" position="is-centered">
            <b-tab-item :label="$t('ukupno')">
              <div v-if="Object.keys(player).length" class="modal-subtitle has-text-centered fw400 m-b-20">
                {{ $t('ukupnoMeeva') }}
                <span class="has-text-primary">{{ totalMatches }}</span>
                <div class="m-t-10">
                  <span class="is-size-7 x-tag green nav__notification has-text-white">{{
                    player.winslosses.wins
                  }}</span>
                  <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
                    player.winslosses.losses
                  }}</span>
                </div>
              </div>
              <div class="activity__results results">
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
        <div v-if="results.length" class="buttons m-t--10">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/team/' + player.id + '/results')"
          >
            {{ $t('sviRezultati') }}
          </b-button>
        </div>
      </template>
      <template v-else>
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"> </b-icon>
            <p class="has-text-centerd fw600 m-t-10">
              {{ $t('zaPrikazPopisaRezultataIStatistikeMorateImatiUnese') }}
            </p>
            <div class="buttons m-t-10">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                icon-right="tennis-ball"
                rounded
                tag="nuxt-link"
                :to="localePath('/result')"
              >
                {{ $t('unesiRezultat') }}
              </b-button>
            </div>
          </div>
        </section>
      </template>
    </div>
    <b-modal :active.sync="isModalClubActive" :width="640" scroll="clip">
      <modalClub
        :switch-club="false"
        :title="$t('odaberiNoviKlub')"
        style="min-height: 200px"
        @club="joinClub($event)"
      />
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Team from '~/models/Team'
import Reservation from '~/models/Reservation'
import resultBox from '~/components/ResultBox'
import Result from '~/models/Result'
import modalClub from '~/components/modal/ModalClubs'
import profileDisplay from '~/components/stats/profileDisplay'
import playersVsStats from '~/components/stats/PlayersVsStats'
import playersStats from '~/components/stats/Stats'
import PlayerProfile from '~/models/PlayerProfile'
import tournamentScore from '~/components/stats/tournaments'

export default {
  name: 'Member',
  components: {
    playersVsStats,
    resultBox,
    modalClub,
    profileDisplay,
    playersStats,
    tournamentScore,
    TennisImage,
  },
  data() {
    return {
      isModalClubActive: false,
      isModalRemoveUserFromClubActiveSelf: false,
      isModalRemoveUserFromClubActive: false,
      activeTab: 0,
      isCardModalActive: false,
      isModalDeleteActive: false,
      total_user_reservation: 1221,
      is_admin: {
        admin: [],
        winslosses: [],
        is_admin: false,
      },
      player: {},
      playerProfile: [],
      player_memberships: [],
      reservations: [],
      results: [],
      results_page: 1,
      results_total_pages: 1,
      totalMatches: 0,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      meta: '',
      memberships: [],
      loading: false,
      loadingClub: false,
      myTeams: [],
      firstTansaction: false,
      loadingMessage: false,
    }
  },
  computed: {
    isItDoubles() {
      return this.player.players.length === 2
    },
    playersForVsRecord() {
      return { players: [this.user.team, this.player] }
    },
    playerSelected() {
      return this.player
    },
    check() {
      // if (this.user.id === 2) {
      //   return false
      // }
      if (
        Object.keys(this.player).length &&
        this.clubId !== null &&
        this.player.club_member[this.clubId.toString()] !== undefined
      ) {
        return this.player.club_member[this.clubId.toString()].type
      }
      return false
    },
    clubId() {
      return this.club.id
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  mounted() {
    this.getTeam()
    this.getResults()
    // this.backFromProfiling()
  },
  methods: {
    // Scrool intoview if back from profiling
    backFromProfiling() {
      if (this.$route.query.profile) {
        setTimeout(function () {
          document.getElementById('profile').scrollIntoView({
            alignToTop: false,
            behavior: 'smooth',
          })
        }, 500)
      }
    },
    getPlayerProfile() {
      PlayerProfile.where('player', this.player.players[0].id)
        .get()
        .then((res) => {
          this.playerProfile = res.data
        })
    },
    getTeam() {
      this.loading = true
      Team.include(['teams'])
        .params({ wins: true, stats: true })
        .$find(this.$route.params.id)
        .then((res) => {
          this.player = res
          this.loading = false
          if (!this.isItDoubles) {
            this.getMyTeams()
            this.getPlayerProfile()
          }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    getMyTeams() {
      Team.where('number_of_players', 2)
        .where('players', this.player.players[0].id)
        .get()
        .then((res) => {
          this.myTeams = res.data
        })
    },
    loadReservations() {
      Reservation.where('player', this.$route.params.id)
        .limit(3)
        .$get()
        .then((res) => (this.reservations = res))
    },
    playersMembershipClass(item) {
      if (this.player_memberships.length) {
        if (this.player_memberships[0].membership_id === item.id) {
          return true
        }
      }
    },
    getMembership() {
      this.memberships = this.$store.state.club.memberships
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    submitMessage() {
      this.loadingMessage = true
      const x = this.player.players[0]
      const y = this.player.players[1]
      x.type = 'player'
      y.type = 'player'
      Thread.whereIn('players_exact', [this.user.id, this.player.players[0].id, this.player.players[1].id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.user, x, y] })
            t.save()
              .then((res) => {
                this.$router.push(this.localePath(`/messages/${res.id}`))
                this.loadingMessage = false
              })
              .catch(() => {
                this.loadingMessage = false
              })
          }
        })
    },
    submitMessage1() {},
    getMore() {
      if (this.activeTab === 0 && this.results_total_pages >= this.results_page) {
        this.getResults()
      }
      if (this.activeTab === 1 && this.my_results_total_pages >= this.my_results_page) {
        this.getVSResults()
      }
    },
    getResults() {
      Result.where('team', this.$route.params.id)
        .limit(3)
        .get()
        .then((res) => {
          this.results = res.data
          this.totalMatches = res.meta.total
          this.meta = res.meta
        })
      this.getVSResults()
    },
    getVSResults() {
      if (this.player.id !== this.$auth.user.id) {
        Result.where('players', this.player.team.id + ',' + this.user.team.id)
          .page(this.my_results_page)
          .get()
          .then((res) => {
            if (res.data) {
              this.my_results = [...this.my_results, ...res.data]
              this.my_results_total_pages = res.meta.last_page
              this.my_results_page++
            }
          })
      }
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
