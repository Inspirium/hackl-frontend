<template>
  <div class="members">
    <hero :page="'player'">
      <h1 class="has-text-white">{{ $t('popisIgraa2') }}</h1>
    </hero>
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
        :class="{ softshadow: true, 'invert-small-button': !onlyGroups }"
        :type="{
          'is-small': true,
          noborder: true,
          'is-primary has-text-white': !onlyGroups,
        }"
        pack="fal"
        rounded
        @click.prevent="filterPlayers(false)"
      >
        {{ $t('Svi članovi') }}
      </b-button>

      <b-button
        :class="{ softshadow: true, 'invert-small-button': onlyGroups }"
        :type="{
          'is-small': true,
          noborder: true,
          'is-primary has-text-white': onlyGroups,
        }"
        pack="fal"
        rounded
        @click.prevent="filterPlayers(true)"
      >
        {{ $t('Akademija') }}
      </b-button>
    </div>

    <div class="tablelist x-container relative p-b-75">
      <template>
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
                :to="localePath('/player/' + props.row.players[0].id)"
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

export default {
  name: 'Academy',
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
      onlyGroups: false,
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
    filterPlayers(item) {
      this.onlyGroups = item
      this.offset = 1
      this.club_players = []
      this.getPlayers()
    },
    getPlayers() {
      if (this.last_page < this.offset) return
      this.loading = true
      const p = Team.page(this.offset)
      p.where('display_name', this.search_term).where('club', this.$store.state.club.id)
      if (this.onlyGroups) {
        p.where('has_school_group', true || 1)
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
