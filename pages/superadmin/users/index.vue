<template>
  <div class="members">
    <hero>
      <h1 class="has-text-white">{{ $t('popisKorisnika') }}</h1>
    </hero>
    <div class="filters--two container">
      <div class="filter">
        <div class="label m-t-0">{{ $t('jainaIgraa') }}</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalPowerActive = true">
            {{ filterPowerDisplay }}
          </b-button>
        </div>
      </div>
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
          :placeholder="$t('pretraiKorisnike')"
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
    <div class="total__members">
      <h6 class="fw600 flex align__centar__all">
        {{ $t('ukupnoKorisnika') }}
        <span>{{ total }}</span>
      </h6>
    </div>
    <div class="tablelist x-container relative p-b-75">
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
      <b-table
        v-if="club_players.length"
        class="softshadow"
        :data="club_players"
        :mobile-cards="false"
        :bordered="false"
      >
        <b-table-column v-slot="props" cell-class="list__image-col">
          <div class="flex">
            <nuxt-link :to="localePath(props.row.link)">
              <div
                :class="tournament_expand && props.index === tournament_index ? 'display-none' : ''"
                class="list__img"
              >
                <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                <div
                  :class="tournament_expand && props.index === tournament_index ? 'display-none' : ''"
                  class="fw600 is-size-7 has-text-lightblue"
                >
                  {{ $t('bodova2', { round: Math.round(props.row.rating) }) }}
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
                  :size="[32, 32]"
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
import Player from '~/models/Player'

export default {
  name: 'SuperadminUsers',
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
      tournament_expand: false,
      tournament_index: 0,
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
    }
  },
  computed: {
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
    getPlayers() {
      if (this.last_page < this.offset) return
      this.loading = true
      Player.page(this.offset)
        .where('age', this.ageRange.join(','))
        .where('is_doubles', false)
        .where('power', this.powerRange.join(','))
        .where('display_name', this.search_term)
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
    updatePower(data) {
      this.offset = 1
      this.filterPowerDisplay = data.label
      this.powerRange = data.range
      this.getPlayers()
    },
  },
}
</script>
