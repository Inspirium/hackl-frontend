<template>
  <div v-if="Object.keys(schoolGroup).length" class="member p-b-300">
    <PageHeader :title="schoolGroup.name" :background="'is-primary'">
      <nuxt-link
        :to="localePath('/school/' + $route.params.id)"
        class="has-text-centered fw600 is-size-3 m-l-auto m-r-auto has-text-white line-height-22 m-t--10"
      >
        {{ schoolGroup.name }}
      </nuxt-link>
      <div v-if="Object.keys(player).length" class="has-text-white has-text-centered fw600 m-t-7 is-size-55">
        {{ player.display_name }}
      </div>
    </PageHeader>
    <div class="home-menu">
      <div class="home-menu-middle">
        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="circle-info" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600">{{ $t('info') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(1)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="money-bill" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('financije') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 2 ? 'active-menu-item' : 'menu-item']" @click="goToTab(2)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="file-pen" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('Izvještaji') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="activity x-container">
      <b-tabs v-model="activeMainTab" position="is-centered" size="is-medium" class="hide-only-one">
        <b-tab-item>
          <div v-if="Object.keys(player).length" class="member__info">
            <TennisImage :size="[180, 180]" :src="player.image" class="user_image-mediumlarge m-r-5 m-t-10" alt="" />
            <div class="title m-b-10 m-t-5">{{ player.name }}</div>
            <div class="align__centar__all m-t-20">
              <div class="title m-b-10 m-t--10">{{ player.display_name }}</div>
            </div>
            <div v-if="user.id !== player.id" class="buttons m-t-10 m-b-10">
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
                :loading="loadingMessage"
                @click.native.prevent="submitMessage"
              >
                {{ $t('poaljiPoruku') }}
              </b-button>
            </div>
            <div class="buttons m-t-10 m-b-0">
              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                icon-right="chevron-right"
                rounded
                @click="$router.push(localePath('/player/' + $route.params.player))"
              >
                {{ $t('idiNaProfilIgraa') }}
              </b-button>
            </div>
          </div>
          <template v-if="isFullAdmin">
            <!--          Show if parent-->
            <div class="divider-line-1 m-t-10"></div>
            <AssignParent
              v-if="Object.keys(player).length"
              :player="player"
              class="m-b-10"
              @update="getPlayer"
            ></AssignParent>
          </template>
          <!--Arrivals-->
          <div class="relative">
            <template v-if="loadingReservationsHistory">
              <transition name="fade">
                <div class="align__centar__x loading_z_spinner m-t-30">
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

            <template v-if="reservations.length">
              <div class="fw600 is-size-55 m-l-5 m-t-10 m-b--16" @click="getAttendance">
                {{ $t('rasporedTreninga') }}
              </div>
              <div v-if="reservations.length" class="school__next-training m-t-10 activity__box m-t-20">
                <div
                  v-for="(training, index) in reservations"
                  v-show="index !== 0"
                  :key="training.id"
                  class="action__item__small has-background-white fw600"
                >
                  <div class="is-uppercase fw600 is-size-65 has-text-lightblue m-r-5">
                    {{ $moment(training.from).format('dddd') }}
                  </div>
                  <div class="title-num is-size-6">
                    <span class="fw600 is-size-6 vertical-align__none">{{
                      $moment(training.from).format('Do' + ' MMM' + ', ' + 'LT')
                    }}</span>
                  </div>
                  <div
                    :class="training.court.surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
                    class="x-tag m-l-auto"
                  >
                    {{ training.court.name }}
                  </div>
                </div>
              </div>
            </template>

            <div class="flex justify-between m-t-30 relative">
              <div class="fw600 is-size-5 m-l-5">{{ $t('dolasci') }}</div>
              <div
                v-if="reservationsHistory.length"
                class="is-size-65 fw600 has-text-centered has-text-black50 align__centar__y"
              >
                {{ $t('ukupnoDolazaka', { length: attendanceList.length, length_2: reservationsHistory.length }) }}
                <span v-if="reservationsHistory.length" class="has-text-primary p-l-5">
                  ({{
                    Math.round(
                      ((reservationsHistory.length - attendanceList.length) / reservationsHistory.length) * 100
                    )
                  }}%)</span
                >
              </div>
            </div>

            <div class="school__next-training m-t-5 activity__box">
              <div
                v-for="training in reservationsHistory"
                :key="training.id"
                class="action__item__small has-background-white fw600"
              >
                <div class="is-uppercase fw600 is-size-65 has-text-lightblue m-r-5">
                  {{ $moment(training.from).format('dddd') }}
                </div>
                <div class="title-num is-size-6">
                  <span class="fw600 is-size-6 vertical-align__none">{{
                    $moment(training.from).format('Do MMM YYYY, LT')
                  }}</span>
                </div>
                <b-icon v-if="!che(training.id)" icon="times-circle" type="is-danger" pack="fal" class="m-l-auto">
                </b-icon>
                <b-icon v-else icon="check-circle" type="is-green" pack="fal" class="m-l-auto"> </b-icon>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="has-text-centered fw600 is-size-6 m-l-auto m-r-auto m-t-10 w100 m-b-5">
            {{ $t('Ukupno računa') }}: {{ paymentsMeta.total }}
          </div>
          <div class="activity x-container m-b--10 p-t-10 p-b-10 statistics_new softshadow">
            <div class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto m-b--20 w100">
              {{ $t('sveukupno') }}
            </div>
            <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
              {{ paymentsMeta.total_amount | currency }}
            </div>
          </div>
          <div class="activity__box action__buttons">
            <div
              v-for="payment in payments"
              :key="payment.id"
              class="action__item__small fw600"
              @click="$router.push(localePath('/admin/invoices/' + payment.id))"
            >
              <div class="flex-grow-1 p-r-10">
                <h4 class="has-text-grey-light fw600 is-size-7">
                  {{ payment.created_at | moment('DD.MM.YYYY.' + ' — ' + 'HH:mm') }}
                </h4>
                <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                  <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                    {{ payment.invoice_number }}
                  </div>
                </div>
                <div class="fw600 is-size-5 line-height-12 m-t-3">
                  {{ payment.amount | currency }}
                </div>
              </div>

              <div class="x-tag m-l-auto nowrap" :class="returnBckg(payment)">
                {{ $t(payment.payment_status) }}
              </div>
            </div>
            <template v-if="!payments.length">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaUplata', { name: player.name }) }}</p>
                </div>
              </section>
            </template>
          </div>
        </b-tab-item>
        <b-tab-item>
          <!--          Reports-->
          <b-tabs v-model="activeReportTab" position="is-centered" class="m-t--16">
            <b-tab-item :label="$t('Treninzi')">
              <template v-if="loading">
                <transition name="fade">
                  <div class="align__centar__x loading_z_spinner m-t-30">
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

              <template v-if="schoolPerformanceList.length">
                <div class="school__next-training m-t-5 activity__box">
                  <div
                    v-for="item in schoolPerformanceListReverse"
                    :key="item.id"
                    class="action__item__small has-background-white fw600"
                    @click="$router.push(localePath(`/school/${$route.params.id}/${$route.params.player}/${item.id}`))"
                  >
                    <div class="is-uppercase fw600 is-size-65 has-text-lightblue m-r-5">
                      {{ $moment(item.created_at).format('dddd') }}
                    </div>
                    <div class="title-num is-size-6">
                      <span class="fw600 is-size-6 vertical-align__none">{{
                        $moment(item.created_at).format('Do' + 'MM' + '.')
                      }}</span>
                    </div>
                    <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-auto m-r--5"> </b-icon>
                  </div>
                </div>
              </template>
            </b-tab-item>
            <b-tab-item :label="$t('Napomene')">
              <div v-if="isAdmin" class="buttons">
                <b-button
                  class="m-t-20"
                  type="is-primary"
                  pack="fal"
                  icon-right="plus-circle"
                  rounded
                  @click="
                    $router.push({
                      path: localePath('/academy/notes/new'),
                      query: { player: $route.params.player },
                    })
                  "
                >
                  {{ $t('izradiNovo') }}
                </b-button>
              </div>

              <div
                v-if="newsMeta.total"
                class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-0 has-text-centered m-b-10"
              >
                {{ $t('ukupno') }}: <span class="has-text-lightblue">{{ newsMeta.total }}</span>
              </div>

              <div :label="$t('Napomene trenera')">
                <template v-if="news.length">
                  <div v-for="one in news" :key="one.id" typeof="div">
                    <noteBox :options="one" @delete="refresh" />
                  </div>
                </template>
                <template v-if="!news.length && !loadingNews">
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                      <p class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
                        {{ $t('nemaPodataka') }}
                      </p>
                    </div>
                  </section>
                </template>
              </div>

              <transition v-if="loading" name="fade">
                <div class="align__centar__x m-t-100 loading_z_spinner">
                  <b-icon
                    class="comment-send"
                    custom-class="rotating"
                    icon="spinner"
                    size="is-large"
                    type="is-primary"
                    pack="far"
                  ></b-icon>
                </div>
              </transition>
            </b-tab-item>
          </b-tabs>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Invoice from '@/models/Invoice'
import SchoolGroup from '@/models/SchoolGroup'
import Attendance from '@/models/Attendance'
import SchoolPerformance from '@/models/SchoolPerformance'
import News from '~/models/TrainerNote'
import Player from '~/models/Player'
import Reservation from '~/models/Reservation'
import PageHeader from '~/components/headers/blankBack'
import AssignParent from '~/components/find/assignParent'

export default {
  name: 'SchoolMember',
  components: {
    TennisImage,
    PageHeader,
    AssignParent,
  },
  async fetch() {
    await this.getGroups()
    await this.getPayments()
    await this.getPlayer()
    await this.getNews()
  },
  data() {
    return {
      activeReportTab: 0,
      activeMainTab: 0,
      isModalActive: false,
      schoolGroup: {},
      reservations: [],
      reservationsHistory: [],
      attendanceList: [],
      schoolPerformanceList: [],
      paymentsMeta: {},
      payments: [],
      player: {},
      activeTab: 0,
      group: null,
      loading: false,
      loading1: false,
      loadingNews: false,
      loadingMessage: false,
      loadingNotes: false,
      loadingReservationsHistory: false,
      test1: [],
      test2: '',
      news: [],
      newsMeta: {
        last_page: 1,
      },
      bottom: false,
      page: 1,
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    isFullAdmin() {
      return this.user.is_trainer || this.isAdmin
    },
    schoolPerformanceListReverse() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.schoolPerformanceList.reverse()
    },
    attendanceListKeyed() {
      return this.attendanceList.map((item) => {
        return item.reservation_id
      })
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
            this.activeMainTab = tab
            window.history.replaceState(null, null, `#${tab}`)
          }
        }
      },
    },
    bottom(bottom) {
      if (bottom) {
        this.page++
        this.getNews()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      // this.bottom = this.bottomVisible()
    })
  },
  methods: {
    getNews() {
      if (this.page <= this.newsMeta.last_page) {
        this.loadingNews = true
        const p = News.page(this.page)
        p.include('team', 'trainer')
          .orderBy('-created_at')
          .where('club', this.$store.state.club.id)
          .where('team', this.$route.params.player)
        if (!this.isFullAdmin) {
          p.where('is_public', true)
        }
        p.get().then((res) => {
          if (this.page === 1) {
            this.news = res.data
          } else {
            this.news = [...this.news, ...res.data]
          }
          this.newsMeta = res.meta
          this.loadingNews = false
        })
      }
    },
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    che(training) {
      // let activeClass = ''
      /* this.attendanceList.forEach((al) => {
        if (al.reservation_id === training) {
          activeClass = 'active'
        }
      }) */
      return this.attendanceListKeyed.includes(training) ? 'active' : ''
      // return activeClass
    },
    async getPlayer() {
      this.player = await Player.include('parents').$find(parseInt(this.$route.params.player, 10))
    },
    getPayments() {
      Invoice.where('club', this.club.id)
        .where('user', this.$route.params.player)
        .where('item_type', 'App\\Models\\Subscription')
        .limit(12)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.payments = res.data
          this.paymentsMeta = res.meta
        })
    },
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.player.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.player] })
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
    attending(player) {
      const attendance = this.attendanceList.filter((item) => {
        return item.user_id === player
      })
      if (attendance.length !== 0) {
        return true
      } else {
        return false
      }
    },
    async loadReservations() {
      this.reservations = await Reservation.where('school_group_id', this.schoolGroup.id).$get()
    },
    async loadReservationsHistory() {
      this.loadingReservationsHistory = true
      try {
        this.reservationsHistory = await Reservation.where('school_group_id', this.schoolGroup.id)
          .orderBy('-from')
          .$get()
      } catch (error) {
        this.$buefy.toast.open({
          message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
          type: 'is-danger',
        })
        this.loadingReservationsHistory = false
      } finally {
        this.loadingReservationsHistory = false
      }
    },
    getGroups() {
      this.loading = true
      this.loading1 = true
      this.loadingReservationsHistory = true
      const id = this.$route.params.id
      SchoolGroup
        // .include('players')
        // .include('attendances')
        .$find(id)
        .then((res) => {
          this.schoolGroup = res
          this.loadReservations().then(() => {
            this.getAttendance()
            this.loadReservationsHistory()
            this.getSchoolPerformance()
          })
        })
    },
    // async getSchoolPerformance() {
    //   this.schoolPerformanceList = await SchoolPerformance.where('player', this.$route.params.player)
    //     .where('school_group', this.schoolGroup.id)
    //     .get()
    // },
    getSchoolPerformance() {
      this.loading = true
      SchoolPerformance.where('player', this.$route.params.player)
        .where('school_group', this.schoolGroup.id)
        .limit(20)
        .get()
        .then((res) => {
          this.schoolPerformanceList = res.data
          this.loading = false
        })
    },
    getAttendance() {
      this.loading1 = true
      Attendance.where('user', this.$route.params.player)
        .where('school_group', this.schoolGroup.id)
        .limit(20)
        .get()
        .then((res) => {
          this.attendanceList = res
          this.loading1 = false
        })
    },
    returnBckg(item) {
      if (item.payment_status === 'DRAFT') {
        return 'is-primary has-text-white'
      } else if (item.payment_status === 'PAID') {
        return 'green has-text-white'
      } else if (item.payment_status === 'UNPAID') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>

<script setup></script>
