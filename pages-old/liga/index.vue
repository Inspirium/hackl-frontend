<template>
  <div>
    <hero :page="'liga'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('tenisLige') }}</h1>
    </hero>
    <div class="home-menu">
      <div class="home-menu-middle">
        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <img src="/liga.svg" class="custom-icon" alt="" />
            <div class="is-size-6 fw600">{{ $t('lige') }}</div>
          </div>
        </div>
        <!--        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="activeMainTab = 1">-->
        <!--          <div class="has-text-black80 flex flex__column align__centar__y">-->
        <!--            <b-icon class="m-b-5" pack="fal" icon="trophy" type="is-black50"> </b-icon>-->
        <!--            <div class="is-size-6 fw600 has-text-centered">{{ $t('rankLjestvica') }}</div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(2)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="user" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('mojeLige') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="x-container registration">
      <div class="tablelist">
        <div v-if="club.show_competitions || isAdmin" class="buttons m-t-10">
          <b-button
            class="fw600"
            type="is-primary"
            pack="fal"
            icon-right="plus-circle"
            rounded
            tag="nuxt-link"
            :to="localePath('/liga/select')"
          >
            {{ $t('novaLiga') }}
          </b-button>
        </div>
        <location class="m-t-20 m-b-20" @location="setLocation" @update="noLocation()" />
        <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
          <b-tab-item :label="$t('sve')" class="p-b-100">
            <div class="activity__reservation">
              <div class="buttons m-t-15 m-b-5">
                <b-button
                  v-for="(court, index) in filters"
                  :key="index"
                  :class="{ softshadow: true, 'invert-small-button': selectedCourts.includes(court) }"
                  :icon-right="selectedCourts.includes(court) ? 'check' : ''"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'has-text-white': selectedCourts.includes(court),
                  }"
                  :style="returnBckg(court)"
                  pack="fal"
                  rounded
                  @click.prevent="selectCourt(court)"
                >
                  {{ $t(court) }}
                </b-button>
              </div>
            </div>
            <div v-if="selectedCourts[0] === 'završene'" id="inputsearch" class="search container">
              <b-field>
                <b-input
                  v-model="search_term"
                  :placeholder="$t('pretrazi lige')"
                  type="search"
                  pack="far"
                  class="search-icon-right"
                  :icon-right="search_icon"
                  icon-right-clickable
                  @icon-right-click="search_icon_click()"
                >
                  >
                </b-input>
              </b-field>
            </div>
            <div class="relative">
              <transition name="fade">
                <div v-if="loading" class="align__centar__x loading_z_spinner">
                  <b-icon
                    class="comment-send m-t-20"
                    custom-class="rotating"
                    icon="spinner"
                    size="is-large"
                    type="is-primary"
                    pack="far"
                  ></b-icon>
                </div>
              </transition>
            </div>
            <template v-if="league.length">
              <div v-for="(item, index) in league" :key="index" class="overflow-hidden br10">
                <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
                  <div class="active list__image-col">
                    <nuxt-link
                      :to="
                        localePath('/liga/' + isElo(item.classification) + item.id + '/' + link(item.status, item.type))
                      "
                      class="fw600"
                    >
                      <div class="list__content">
                        <!--                        <div class="align__centar__y">-->
                        <!--                          <h4 class="has-text-grey-light fw600 is-size-7 is-uppercase">-->
                        <!--                            <span class="">{{ item.type === 'private' ? 'Privatna liga' : 'Otvorena liga' }}</span>-->
                        <!--                          </h4>-->
                        <!--                        </div>-->
                        <h4 class="fw600 is-size-5 m-t--2 is-size-5">
                          {{ item.name }}
                        </h4>
                        <template v-if="item.status === '3'">
                          <div
                            v-if="howManyDaysOnboarding(item) && item.finish_onboarding"
                            class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                          >
                            <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-flag" />
                              {{ $t('prijaveIstiu') }}
                              <span class="has-text-success m-l-4">{{
                                $moment().to($moment(item.finish_onboarding))
                              }}</span>
                            </div>
                          </div>
                        </template>
                        <!--      Universal club but not-->
                        <template>
                          <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                            <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon
                                class="m-r-5 has-text-lightblue iw08"
                                icon="fa-light fa-location-dot"
                              />
                              {{ item.club.name }}{{ ' • ' + item.club.city }}
                            </div>
                          </div>
                          <!--                        Show only if is open type tournament and-->
                          <div
                            v-if="item.status !== '3'"
                            class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                          >
                            <div
                              v-if="item.type === 'open'"
                              class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                            >
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                              {{ $t('Otvoreno natjecanje') }}
                            </div>
                            <div v-else class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                              {{ $t('Privatno natjecanje') }}
                            </div>
                          </div>
                          <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                            <div v-if="item.start_date" class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-clock" />
                              <span class="hideonmobile">{{ $t('Početak') }}: </span>
                              {{ item.start_date | moment('DD.MM.YYYY.') }}
                            </div>
                            <div
                              v-if="item.finish_date"
                              class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y"
                            >
                              <font-awesome-icon
                                class="m-r-5 has-text-lightblue iw08"
                                icon="fa-light fa-flag-checkered"
                              />
                              <span class="hideonmobile">{{ $t('Kraj') }}: </span>
                              {{ item.finish_date | moment('DD.MM.YYYY.') }}
                            </div>
                          </div>
                        </template>
                      </div>
                      <div class="x-tag--xl m-l-auto nowrap m-l-10" :style="tagColor(item.status)">
                        {{ status(item.status) }}
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </template>
            <section v-if="!league.length && !loading" class="">
              <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                <p class="fw600 is-size-6 has-text-centered has-text-black50 m-b-10">
                  {{ $t('Nema otvorenih natjecanja u klubu') }}
                </p>
              </div>
            </section>
            <allLigas
              v-if="$store.state.club.id !== 26 && selectedCourts[0] !== 'završene'"
              :competition="'liga'"
              :filter-status="selectedCourts[0]"
            />
          </b-tab-item>
          <b-tab-item :label="$t('mojeLige')">
            <!--            Prikaži sve lige kojima sam igrač ili admin-->
            <template v-if="leagueAdmin.length">
              <div v-for="(item, index) in leagueAdmin" :key="index" class="overflow-hidden br10">
                <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
                  <div class="active list__image-col">
                    <nuxt-link
                      :to="
                        localePath('/liga/' + isElo(item.classification) + item.id + '/' + link(item.status, item.type))
                      "
                      class="fw600"
                    >
                      <div class="list__content">
                        <!--                        <div class="align__centar__y">-->
                        <!--                          <h4 class="has-text-grey-light fw600 is-size-7 is-uppercase">-->
                        <!--                            <span class="">{{ item.type === 'private' ? 'Privatna liga' : 'Otvorena liga' }}</span>-->
                        <!--                          </h4>-->
                        <!--                        </div>-->
                        <h4 class="fw600 is-size-5 m-t--2 is-size-5">
                          {{ item.name }}
                        </h4>
                        <template v-if="item.status === '3'">
                          <div
                            v-if="howManyDaysOnboarding(item) && item.finish_onboarding"
                            class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                          >
                            <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-flag" />
                              {{ $t('prijaveIstiu') }}
                              <span class="has-text-success m-l-4">{{
                                $moment().to($moment(item.finish_onboarding))
                              }}</span>
                            </div>
                          </div>
                        </template>
                        <!--      Universal club but not-->
                        <template>
                          <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                            <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon
                                class="m-r-5 has-text-lightblue iw08"
                                icon="fa-light fa-location-dot"
                              />
                              {{ item.club.name }}{{ ' • ' + item.club.city }}
                            </div>
                          </div>
                          <!--                        Show only if is open type tournament and-->
                          <div
                            v-if="item.status !== '3'"
                            class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                          >
                            <div
                              v-if="item.type === 'open'"
                              class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                            >
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                              {{ $t('Otvoreno natjecanje') }}
                            </div>
                            <div v-else class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                              {{ $t('Privatno natjecanje') }}
                            </div>
                          </div>
                          <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                            <div v-if="item.start_date" class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                              <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-clock" />
                              <span class="hideonmobile">{{ $t('Početak') }}: </span>
                              {{ item.start_date | moment('DD.MM.YYYY.') }}
                            </div>
                            <div
                              v-if="item.finish_date"
                              class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y"
                            >
                              <font-awesome-icon
                                class="m-r-5 has-text-lightblue iw08"
                                icon="fa-light fa-flag-checkered"
                              />
                              <span class="hideonmobile">{{ $t('Kraj') }}: </span>
                              {{ item.finish_date | moment('DD.MM.YYYY.') }}
                            </div>
                          </div>
                        </template>
                      </div>
                      <div class="x-tag--xl m-l-auto nowrap m-l-10" :style="tagColor(item.status)">
                        {{ status(item.status) }}
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('Niste sudjelovali u ligama') }}</p>
                </div>
              </section>
            </template>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import League from '@/models/League'
import _ from 'lodash'
import hero from '~/components/Hero'
import location from '~/components/GeoLocation'
import allLigas from '~/components/liga/allLigas'

export default {
  name: 'Liga',
  components: {
    hero,
    location,
    allLigas,
  },
  data() {
    return {
      activeMainTab: 0,
      isModalActive: false,
      heroImage: '/liga.jpg',
      league: [],
      clubs: [],
      leagueAdmin: [],
      selectedLeague: {},
      location: {},
      loading1: false,
      nomore: false,
      nomore1: false,
      total: 0,
      total1: 0,
      last_page: 1,
      last_page1: 1,
      bottom: '',
      bottom1: '',
      offset: 0,
      offset1: 0,
      loading: false,
      filters: ['otvorene', 'aktivne', 'završene'],
      selectedCourts: ['otvorene'],
      search_term: '',
    }
  },
  computed: {
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    '$route.hash': {
      immediate: true,
      handler(newHash) {
        if (!newHash) {
          this.$router.replace({ hash: '0' })
        } else if (newHash.startsWith('#')) {
          const tab = parseInt(newHash.substring(1))
          if (!isNaN(tab)) {
            if (tab === 4) {
              this.selectedCourts = ['aktivne']
              this.activeMainTab = 0
            } else if (tab === 5) {
              this.selectedCourts = ['završene']
              this.activeMainTab = 0
            } else {
              this.activeMainTab = tab
              window.history.replaceState(null, null, `#${tab}`)
            }
          }
        }
      },
    },
    search_term(term) {
      if (term.length) {
        this.offset = 1
        this.league = []
        this.debouncedGetLeague()
      } else {
        this.getLeague()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getLeague()
      }
    },
    bottom1(bottom1) {
      if (bottom1 && !this.nomore1) {
        this.offset1++
        this.getLeagueAdmin()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    window.addEventListener('scroll', () => {
      this.bottom1 = this.bottomVisible()
    })
    this.offset = 1
    this.offset1 = 1
    this.getLeagueAdmin()
  },
  created() {
    this.debouncedGetLeague = _.debounce(this.getLeague, 500)
  },
  methods: {
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    returnBckg(item) {
      if (this.selectedCourts[0] === 'otvorene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #73c03d'
      } else if (this.selectedCourts[0] === 'aktivne' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #209cee'
      } else if (this.selectedCourts[0] === 'završene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #f03a5f'
      } else {
        return ''
      }
    },
    search_icon_click() {
      this.offset = 1
      this.search_term = ''
      this.getLeague()
    },
    noLocation() {
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    selectCourt(item) {
      if (item === 'aktivne') {
        window.history.replaceState(null, null, '#4')
      } else if (item === 'završene') {
        window.history.replaceState(null, null, '#5')
      } else {
        window.history.replaceState(null, null, '#0')
      }
      this.selectedCourts[0] = item
      this.league = []
      this.offset = 1
      this.last_page = 1
      this.getLeague()
    },
    getLeague() {
      if (this.last_page < this.offset) return
      this.loading = true
      let l = League.include('club')
      if (this.selectedCourts[0] === 'otvorene') {
        l = l.whereIn('status', ['3'])
      } else if (this.selectedCourts[0] === 'aktivne') {
        l = l.whereIn('status', ['4'])
      } else if (this.selectedCourts[0] === 'završene') {
        l = l.whereIn('status', ['5'])
      }
      if (this.$store.state.club.id !== 26) {
        l.where('club', this.$store.state.club.id).orderBy('-start_date')
      } else {
        l.params({
          latitude: this.location.latitude,
          longitude: this.location.longitude,
        }).orderBy('distance')
      }
      if (this.selectedCourts[0] === 'završene') {
        l = l.orderBy('-finish_date')
      }
      if (this.search_term !== '') {
        l = l.where('name', this.search_term).whereIn('status', ['3', '4', '5'])
      }
      l.get()
        .then((res) => {
          if (this.offset === 1) {
            this.league = res.data
          } else {
            this.league = [...this.league, ...res.data]
          }
          if (res.meta.last_page === this.offset) {
            this.nomore = true
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getLeagueAdmin() {
      if (this.last_page1 < this.offset1) return
      League.include('club')
        .where('player', this.user.id)
        .page(this.offset1)
        .get()
        .then((res) => {
          if (this.offset1 === 1) {
            this.leagueAdmin = res.data
          } else {
            this.leagueAdmin = [...this.leagueAdmin, ...res.data]
          }
          this.total1 = res.meta.total
          this.last_page1 = res.meta.last_page
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    status(s) {
      switch (s) {
        case '0': // Kreirana liga
          return this.$t('U izradi')
        case '1': // Ždrijeb
          return this.$t('Ždrijebanje')
        case '2': // Privatna liga - priprema prijave
          return this.$t('U izradi')
        case '3': // Otvorena liga - otvorene prijave
          return this.$t('Prijave')
        case '4':
          return this.$t('Aktivna')
        case '5':
          return this.$t('Završena')
      }
      return ''
    },
    tagColor(s) {
      switch (s) {
        case '0':
          return 'backgroundColor:#cccccc'
        case '1':
          return 'backgroundColor:#F18F01'
        case '2':
          return 'backgroundColor:#ff3860'
        case '3':
          return 'backgroundColor:#9acd32'
        case '4':
          return 'backgroundColor:#209CEE'
        case '5':
          return 'backgroundColor:#777777'
      }
      return ''
    },
    isElo(e) {
      if (e === 'elo') {
        return 'elo/'
      }
      return ''
    },
    link(s, tr) {
      switch (s) {
        case '0':
          return tr === 'private' ? 'privat' : 'open'
        case '1':
          return 'liga_create'
        case '2':
          return 'open'
        case '3':
          return 'open-onboarding'
        case '4':
          return ''
        case '5':
          return ''
      }
      return ''
    },
    howManyDaysOnboarding(liga) {
      if (liga.finish_onboarding) {
        if (this.$moment(liga.finish_onboarding) <= this.$moment()) {
          return false
        }
      }
      return true
    },
  },
  head() {
    return {
      title: 'Lige',
    }
  },
}
</script>
