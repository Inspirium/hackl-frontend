<template>
  <div>
    <hero :page="'schedule'" :options="heroImage">
      <h1 class="has-text-white navigation__title">
        {{ selected_date | moment('dddd') }},
        <span>{{ selected_date | moment('DD.MM.') }}</span>
      </h1>
    </hero>
    <div v-touch:swipe="swipeHandler" class="activity x-container results schedule">
      <div class="tab__navigation m-b-20 m-t--40">
        <div :class="['tab__navigation__arrow__left', inactive ? 'inactive' : '']" @click="prevDay">
          <b-icon icon="chevron-left" pack="fal"></b-icon>
        </div>
        <div class="tab__navigation__arrow__right" @click="nextDay">
          <b-icon icon="chevron-right" pack="fal"> </b-icon>
        </div>
      </div>

      <!--Class .inactive is for disabled arrow - user can't go to past dates -->
      <div class="date-picker m-t--10">
        <i :class="['fa fa-angle-left fa-4x', inactive ? 'inactive' : '']" @click="prevDay"></i>
        <div class="tab__header m-b-10">
          <div>{{ $t('najaveMeeva') }}</div>
        </div>
        <i class="fa fa-angle-right fa-4x" @click="nextDay"></i>
      </div>
      <div v-if="total" class="m-t--20">
        <h6 class="fw600 flex align__centar__all">
          {{ $t('ukupnoMeeva') }}
          <span>{{ total }}</span>
        </h6>
      </div>

      <div class="relative p-b-200">
        <div v-if="filteredList.length" class="schedule activity__box">
          <div v-for="match in filteredList" :key="match.id" class="schedule-match results__list">
            <scheduleBoxAdvance
              v-if="timeHasPassed(match)"
              :result-item="match"
              class="relative z-1"
              @update="getSchedule"
            ></scheduleBoxAdvance>
            <template v-if="match.game !== null && isAdmin">
              <template v-if="timeHasPassed(match) && inactive">
                <template v-if="match.game.live === null || match.game.live === 0">
                  <nuxt-link v-if="match.game.id" :to="localePath('/live/' + match.game.id)" class="">
                    <transition name="slide-fade" mode="out-in">
                      <div
                        class="fw600 m-b-15 is-size-55 tie-break__live__label w100 m-b-10 m-t--10 is-blackblue rounded-md has-text-white"
                      >
                        <div class="flex align__centar__all">
                          <b-icon class="m-r-10 m-l-5" pack="fal" size="is-smaller" icon="play-circle"> </b-icon>

                          <div class="has-text-centered has-text-white is-size-6 p-t-5 p-b-5">
                            {{ $t('zaponiLivePrijenos') }}
                          </div>
                        </div>
                      </div>
                    </transition>
                  </nuxt-link>
                </template>
                <template v-else>
                  <nuxt-link :to="localePath(link(match.game.result))">
                    <transition name="slide-fade" mode="out-in">
                      <div
                        class="fw600 m-b-15 is-size-55 tie-break__live__label w100 m-b-10 m-t--10 is-red rounded-md has-text-white"
                      >
                        <template v-if="match.game.live === 1">
                          <div class="has-text-centered p-t-10 p-b-10">
                            {{
                              match.game.result.live_data.umpire === user.id
                                ? $t('Nastavi s prijenosom')
                                : $t('Live prijenos')
                            }}
                            <b-icon
                              class="m-l-5 linkarrow_small"
                              icon="long-arrow-right"
                              type="is-white"
                              size="is-small"
                              pack="fal"
                            ></b-icon>
                          </div>
                        </template>
                        <template v-else>
                          <div class="has-text-centered p-t-10 p-b-10">
                            {{ $t('livePrijenos') }}
                            <b-icon
                              class="m-l-5 linkarrow_small"
                              icon="long-arrow-right"
                              type="is-white"
                              size="is-small"
                              pack="fal"
                            ></b-icon>
                          </div>
                        </template>
                      </div>
                    </transition>
                  </nuxt-link>
                </template>
              </template>
            </template>
          </div>
        </div>
        <template v-if="loading">
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
        <section v-if="!filteredList.length && !loading" class="p-l-15 p-r-15 m-t-20">
          <div class="content has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"> </b-icon>
            <p class="has-text-centered fw600 m-t-5 is-size-5">{{ $t('nemaNajavljenihMeeva') }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import moment from 'moment'
import hero from '~/components/Hero'
import scheduleBoxAdvance from '~/components/ScheduleBoxAdvance'

export default {
  name: 'Schedule',
  components: {
    scheduleBoxAdvance,
    hero,
  },
  async fetch() {
    await this.getSchedule()
  },
  data() {
    return {
      test: '',
      heroImage: '/hero_schedule.jpg',
      selected_date: moment(),
      inactive: true,
      reservations: [],
      isToday: true,
      loading: false,
      total: 0,
      last_page: 1,
      offset: 1,
      bottom: false,
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    filteredList() {
      if (!this.reservations.length) {
        return false
      }
      return this.reservations
      /*
      return _.filter(this.reservations, (item) => {
        return item.players.length === 2 && this.timeHasPassed(item) && item.players[0]?.id !== item.players[1]?.id
      })

       */
    },
  },
  watch: {
    selected_date() {
      this.getSchedule()
      this.reservations = []
    },
    bottom(bottom) {
      if (bottom && this.last_page >= this.offset) {
        this.bottom = false
        this.getSchedule()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    link(match) {
      if (this.isAdmin || match.live_data.umpire === this.user.id) {
        return `/live/${match.game_id}`
      } else {
        return `/result/${match.id}`
      }
    },
    timeHasPassed(match) {
      const matchTime = moment(match.from)
      const currentTime = moment()
      if (matchTime.diff(currentTime, 'hours') > 24) {
        return true
      } else {
        return matchTime.diff(currentTime, 'hours') > -2
      }
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.prevDay()
      } else if (direction === 'left') {
        this.nextDay()
      }
    },
    getSchedule() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$axios
        .get('club/schedule/' + this.selected_date.format('YYYY-MM-DD') + '?include=watchers&page=' + this.offset)
        .then((res) => {
          this.loading = false
          if (this.offset === 1) {
            this.reservations = res.data.data
          } else {
            this.reservations = [...this.reservations, ...res.data.data]
          }
          this.offset++
          this.total = res.data.meta.total
          this.last_page = res.data.meta.last_page
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    nextDay() {
      this.selected_date = moment(this.selected_date).add(1, 'day')
      if (this.selected_date.isAfter(moment())) {
        this.inactive = false
      }
      this.isToday = false
    },
    prevDay() {
      if (!this.inactive) {
        this.selected_date = moment(this.selected_date).subtract(1, 'day')
        if (this.selected_date.isSame(moment(), 'day')) {
          this.inactive = true
        }
      }
    },
  },
  head() {
    return {
      title: 'Raspored',
    }
  },
}
</script>
