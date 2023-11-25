<template>
  <div class="members">
    <hero :page="'player'">
      <h1 class="has-text-white">{{ $t('popisIgraa2') }}</h1>
    </hero>
    <div class="filters container">
      <!--      <div class="filter">-->
      <!--        <div class="label m-t-0">{{ $t('jainaIgraa') }}</div>-->
      <!--        <div class="buttons">-->
      <!--          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalPowerActive = true">-->
      <!--            {{ filterPowerDisplay }}-->
      <!--          </b-button>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="filter">
        <div class="label m-t-0">{{ $t('dobIgraa') }}</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalAgeActive = true">
            {{ $t(filterAgeDisplay) }}
          </b-button>
        </div>
      </div>
    </div>
    <div id="inputsearch" class="search container">
      <b-field>
        <b-input
          v-model="search_term"
          :placeholder="$t('pretraiIgrae')"
          type="search"
          pack="far"
          class="search-icon-right"
          :icon-right="search_icon"
          icon-right-clickable
          @icon-right-click="search_term = ''"
        >
        </b-input>
      </b-field>
    </div>
    <div v-if="$store.state.club.id !== 26" class="total__members">
      <h6 class="fw600 flex align__centar__all">
        {{ $t('ukupnoLanova') }}
        <span>{{ total }}</span>
      </h6>
    </div>
    <div v-if="isAdmin" class="buttons m-t-5">
      <b-button
        class="softshadow m-b-10"
        type="is-small noborder"
        pack="fal"
        icon-right="user-plus"
        rounded
        tag="nuxt-link"
        :to="localePath('/player/new')"
      >
        {{ $t('registrirajNovogIgraa') }}
      </b-button>
    </div>

    <div class="tablelist x-container relative p-b-75">
      <!--      Universal club-->
      <template v-if="clubId === 26">
        <b-table
          v-if="club_players.length"
          class="softshadow"
          :data="club_players"
          :mobile-cards="false"
          :bordered="false"
        >
          <b-table-column v-slot="props" cell-class="list__image-col">
            <div class="flex">
              <nuxt-link v-if="props.row.link" :to="localePath(props.row.link)">
                <div
                  :class="tournament_expand && props.index === tournament_index ? 'display-none' : ''"
                  class="list__img"
                >
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                  <div class="fw600 is-size-7 has-text-lightblue">
                    {{ $t('bodova2', { round: Math.round(props.row.team.rating) }) }}
                    <span class="has-text-black80"> • </span>
                    {{ props.row.range }} <span class="has-text-lightblue">{{ $t('godina2') }}</span>
                  </div>
                </div>
              </nuxt-link>

              <div
                class="m-l-auto"
                style="transition: 0.3s all"
                :class="
                  tournament_expand && props.index === tournament_index
                    ? 'club-logo-list-display--extend'
                    : 'club-logo-list-display'
                "
              >
                <div
                  v-for="club in props.row.club_member"
                  :key="club.id"
                  style="transition: 0.3s all"
                  class="flex justify-content-end"
                  @click="
                    tournament_expand = !tournament_expand
                    tournament_index = props.index
                  "
                >
                  <div style="transition: 0.3s all" class="fw600 is-size-7 has-text-black50 name m-r-10">
                    {{ club.name }}
                  </div>
                  <TennisImage
                    :size="[42, 42]"
                    style="transition: 0.3s all"
                    :src="club.logo"
                    class="user_image-small border__white softshadow"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </b-table-column>
          <template v-if="!loading" #empty>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                <p class="modal-title">{{ $t('naalostNemaLanovaPodTimUvjetima') }}</p>
              </div>
            </section>
          </template>
        </b-table>
        <transition name="fade">
          <div class="align__centar__x loading_z_spinner--bottom m-t-20">
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
      </template>
      <template v-else>
        <b-table
          v-if="filteredClubPlayers.length"
          class="softshadow"
          :data="filteredClubPlayers"
          :mobile-cards="false"
          :bordered="false"
        >
          <b-table-column v-slot="props" cell-class="list__image-col">
            <template v-if="props.row.club_member[clubId] !== undefined">
              <nuxt-link
                v-if="props.row.club_member[clubId].type !== 'applicant' || isAdmin"
                :to="localePath(props.row.link)"
              >
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                  <div class="fw600 is-size-7 has-text-lightblue">
                    {{ props.row.range + ' ' + $t('godina') }}
                  </div>
                </div>
                <template v-if="$store.state.club.id === 26">
                  <b-tag v-if="props.row.club_member[clubId].type !== 'applicant'" type="is-info"
                    >{{ Math.round(props.row.team.rating_global) }}
                  </b-tag>
                </template>
                <template v-else>
                  <b-tag v-if="props.row.club_member[clubId].type !== 'applicant'" type="is-info"
                    >{{ Math.round(props.row.team.rating_club) }}
                  </b-tag>
                </template>
                <b-tag v-if="props.row.club_member[clubId].type === 'applicant' && isAdmin" type="is-danger"
                  >{{ $t('aplikant') }}
                </b-tag>
                <b-tag v-if="props.row.club_member[clubId].type === 'blocked' && isAdmin" class="m-l-5" type="is-danger"
                  >{{ $t('blokiran') }}
                </b-tag>
              </nuxt-link>
            </template>
          </b-table-column>
          <template v-if="!loading" #empty>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                <p class="modal-title">{{ $t('naalostNemaLanovaPodTimUvjetima') }}</p>
              </div>
            </section>
          </template>
        </b-table>
        <transition name="fade">
          <div v-if="loading" class="align__centar__x loading_z_spinner--bottom m-t-20">
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
      </template>
    </div>
    <b-modal :active.sync="isModalAgeActive" :width="640" scroll="clip">
      <modal-range
        :title="$t('dob')"
        :subtitle="$t('Filtriraj popis prema dobi igrača')"
        :suffix="$t('godina')"
        @update="updateAge"
      ></modal-range>
    </b-modal>
    <b-modal :active.sync="isModalPowerActive" :width="640" scroll="clip">
      <modal-range
        :title="$t('snage')"
        :subtitle="$t('Filtriraj popis prema snazi igrača')"
        suffix="%"
        @update="updatePower"
      ></modal-range>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import modalRange from '~/components/modal/ModalSelectRange'
import Team from '~/models/Team'
import Player from '~/models/Player'

export default {
  name: 'Players',
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
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      player_memberships: [],
      loading: false,
      tournament_expand: false,
      tournament_index: 0,
    }
  },
  computed: {
    filteredClubPlayers() {
      return this.club_players.filter((player) => {
        return player.club_member[this.clubId] !== undefined
      })
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    clubId() {
      return this.$store.state.club.id
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.offset = 1
        this.debouncedGetPlayers()
      } else {
        this.getPlayers()
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
    search_icon_click() {
      this.search_term = ''
    },
    // getPlayers() {
    //   if (this.last_page < this.offset) return
    //   this.loading = true
    //   const p = Player.params({ stats: true })
    //     .page(this.offset)
    //     .where('age', this.ageRange.join(','))
    //     .where('is_doubles', false)
    //     .where('power', this.powerRange.join(','))
    //     .where('display_name', this.search_term)
    //   if (this.$store.state.club.id !== 26) {
    //     p.where('club', this.$store.state.club.id)
    //   }
    //   p.get().then((res) => {
    //     if (this.offset === 1) {
    //       this.club_players = res.data
    //     } else {
    //       this.club_players = [...this.club_players, ...res.data]
    //     }
    //     this.total = res.meta.total
    //     this.last_page = res.meta.last_page
    //     this.loading = false
    //   })
    // },
    getPlayers1() {
      if (this.last_page < this.offset) return
      this.loading = true
      const t = Team.page(this.offset)
        .where('age', this.ageRange.join(','))
        .where('number_of_players', 1)
        .where('display_name', this.search_term)
        .orderBy('random')
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
    getPlayers() {
      if (this.last_page < this.offset) return
      this.loading = true
      const p = Player.page(this.offset)
      p.where('is_doubles', false)
        .where('age', this.ageRange.join(','))
        .where('is_admin', false)
        .where('is_trainer', false)
        .where('display_name', this.search_term)
      if (this.$store.state.club.id !== 26) {
        p.where('club', this.$store.state.club.id)
      }
      p.get()
        .then((res) => {
          if (this.offset === 1) {
            this.club_players = res.data
          } else {
            this.club_players = [...this.club_players, ...res.data]
          }
          this.checkedRows = []
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
        .catch(() => {
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
    updatePower(data) {
      this.offset = 1
      this.filterPowerDisplay = data.label
      this.powerRange = data.range
      this.getPlayers()
    },
  },
  head() {
    return {
      title: 'Igrači',
    }
  },
}
</script>
