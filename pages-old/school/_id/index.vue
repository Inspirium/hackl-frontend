<template>
  <div v-if="Object.keys(schoolGroup).length" class="member p-b-300">
    <PageHeader
      :second="{
        name: $t('Škole'),
        link: '/school',
      }"
      :title="schoolGroup.name"
      :background="'is-primary'"
    />
    <div v-if="isAdminAndTrainer" class="home-menu">
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

    <b-tabs v-model="activeMainTab" position="is-centered" size="is-medium" class="hide_tab_navigation">
      <b-tab-item>
        <div class="member__info">
          <TennisImage :size="[180, 180]" :src="schoolGroup.image" class="user_image-large m-r-5 m-t-10" alt="" />
          <div class="title m-b-10 m-t-5">{{ schoolGroup.name }}</div>
          <div class="align__centar__all m-t-20">
            <div class="modal-subtitle is-uppercase m-r-10">{{ $t('trener2') }}</div>
            <TennisImage
              :size="[42, 42]"
              :src="schoolGroup.trainers[0].image"
              class="user_image m-r-10 border__white"
              alt=""
            />
            <div class="is-text-center fw600 is-size-5">{{ schoolGroup.trainers[0].display_name }}</div>
          </div>
          <template v-if="schoolGroup.trainers.length > 1">
            <div class="divider-line-1 m-t-7"></div>
            <div class="flex align__centar__x m-t-5">
              <div
                v-for="(item, index) in schoolGroup.trainers"
                v-show="index > 0"
                :key="item.id"
                class="is-text-center fw600 is-size-65 m-r-10"
              >
                + {{ item.display_name }}
              </div>
            </div>
          </template>
          <template v-if="!isAdminAndTrainer">
            <div class="buttons m-t-20">
              <b-button
                class="m-l-10"
                type="is-primary"
                pack="fal"
                icon-right="chevron-right"
                rounded
                tag="nuxt-link"
                :to="localePath('/school/' + $route.params.id + '/' + user.id)"
              >
                {{ $t('Moj profil') }}
              </b-button>
            </div>
          </template>

          <div v-if="isTrainerOfTheGroup || isAdmin" class="buttons m-t-20 m-b-0">
            <b-button
              tag="nuxt-link"
              :to="localePath('/school/' + schoolGroup.id + '/edit')"
              class="softshadow m-t-10"
              type="is-small noborder"
              pack="fal"
              icon-right="user-edit"
              rounded
            >
              {{ $t('urediGrupu') }}
            </b-button>
          </div>
        </div>
        <div class="activity x-container">
          <b-tabs position="is-centered" size="is-medium" class="hide_tab_navigation">
            <b-tab-item :label="$t('grupa3')">
              <template v-if="reservations.length">
                <div class="fw600 is-size-55 m-l-5 m-t-10 m-b--16" @click="getAttendance">
                  {{ $t('rasporedTreninga') }}
                </div>
                <div
                  v-if="reservations.length"
                  class="reservation__item school__next-training has-background-white m-t-20"
                >
                  <div class="reservation__item__content">
                    <div class="is-uppercase fw600 is-size-65 has-text-lightblue m-r-5">
                      {{ $moment(reservations[0].from).format('dddd') }}
                    </div>
                    <div class="title-num is-size-6">
                      <span class="fw600 is-size-5">{{
                        $moment(reservations[0].from).format('Do' + ' MMM' + ', ' + 'LT')
                      }}</span>
                    </div>
                    <div
                      :class="reservations[0].court.surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
                      class="x-tag m-l-auto"
                    >
                      {{ reservations[0].court.name }}
                    </div>
                  </div>
                </div>

                <template v-if="isTrainerOfTheGroup && isAdmin">
                  <b-icon icon="chevron-down" type="is-black50" pack="fal" class="tranform__center"> </b-icon>
                  <div class="activity__reservation tranform__center mw80 m-t--5">
                    <transition name="fade">
                      <div class="activity__box action__buttons">
                        <div
                          v-for="(player, index) in schoolGroup.players"
                          :key="player.id"
                          :class="[
                            'action__item__small',
                            'fw600',
                            attending(player.players[0].id) !== false ? 'active_attender' : '',
                            { blur_button: loading && index === selected_attender },
                          ]"
                          @click="
                            attending(player.players[0].id) !== false
                              ? deleteAttendance(player.players[0].id)
                              : saveAttendance(player)
                            selected_attender = index
                          "
                        >
                          <TennisImage
                            :size="[42, 42]"
                            :src="player.image"
                            class="user_image-small m-r-10 border__white"
                            alt=""
                          />
                          <div :class="loading ? 'loading-green-text' : ''">{{ player.display_name }}</div>
                          <div v-if="attending(player.players[0].id) !== false" :class="['m-l-auto']">
                            <b-icon icon="times-circle" type="is-white" pack="fal"> </b-icon>
                          </div>
                          <div v-else :class="['m-l-auto']">
                            <b-icon icon="check-circle" type="is-green" pack="fal"> </b-icon>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </template>
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
              <template v-if="!reservations.length && isAdminAndTrainer">
                <div class="buttons m-t-20">
                  <b-button
                    tag="nuxt-link"
                    class="m-l-10"
                    type="is-primary"
                    pack="fal"
                    icon-right="racquet"
                    rounded
                    :to="localePath('/courts/')"
                  >
                    {{ $t('rezervirajTeren') }}
                  </b-button>
                </div>
                <div class="fw600 has-text-centered is-size-65 m-t--15 has-text-black50">
                  {{ $t('Rezervacijom terena automatski će se izraditi raspored za polaznike škole') }}
                </div>
              </template>

              <div class="fw600 is-size-55 m-l-5 m-t-30 m-b-10">{{ $t('grupnePoruke') }}</div>
              <div v-if="messages.length" class="schoolgroup__messages">
                <template>
                  <div class="comments p-b-10">
                    <div
                      v-for="comment in messages"
                      :key="comment.id"
                      :class="{
                        'comments-item': true,
                        my_comments: $auth.user.id === comment.player.id && comment.multimedia_type !== 'terms',
                        terms: comment.multimedia_type === 'terms',
                      }"
                    >
                      <text-message v-if="!comment.multimedia_type" :comment="comment" />
                      <term-message
                        v-if="comment.multimedia_type === 'terms'"
                        :players="thread.players"
                        :comment="comment"
                      />
                      <image-message v-if="comment.multimedia_type === 'image'" :comment="comment" />
                    </div>
                  </div>
                </template>
              </div>
              <div v-if="messages.length" class="buttons m-t-20">
                <b-button
                  tag="nuxt-link"
                  :to="localePath('/messages/' + schoolGroup.thread_id)"
                  class="m-l-10 softshadow"
                  pack="fal"
                  type="is-small noborder"
                  icon-right="comments"
                  rounded
                >
                  {{ $t('prikaiOstalePoruke') }}
                </b-button>
              </div>
              <template v-else>
                <div class="buttons m-t-20">
                  <b-button
                    class="m-l-10"
                    type="is-primary"
                    pack="fal"
                    icon-right="comments"
                    rounded
                    tag="nuxt-link"
                    :to="localePath('/messages/' + schoolGroup.thread_id)"
                  >
                    {{ $t('poaljiGrupnuPoruku') }}
                  </b-button>
                </div>
              </template>
              <div class="fw600 is-size-55 m-l-5 m-t-30 m-b-10">{{ $t('lanoviGrupe') }}</div>
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="player in schoolGroup.players"
                      :key="player.id"
                      class="action__item__small fw600"
                      @click="
                        isAdminAndTrainer
                          ? $router.push(localePath('/school/' + $route.params.id + '/' + player.players[0].id))
                          : ''
                      "
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="player.image"
                        class="user_image-small m-r-10 border__white"
                        alt=""
                      />
                      <div class="">
                        <div>{{ player.display_name }}</div>
                        <template v-if="player.players[0].parents?.length">
                          <div class="flex">
                            <div class="fw600 is-size-7 has-text-black50 name m-r-5">{{ 'Roditelj' }}:</div>
                            <div
                              v-for="parent in player.players[0].parents"
                              :key="parent.id"
                              class="flex align__centar__all"
                            >
                              <div class="fw600 is-size-7 has-text-primary name m-r-10">
                                {{ parent.display_name }}
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                      <div v-if="isAdminAndTrainer" class="action m-l-auto">
                        <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </b-tab-item>
            <b-tab-item v-if="isStudentOfTheGroup" :label="$t('mojiPodaci')">
              <div class="fw600 is-size-55 m-l-5 m-t-15 m-b-10">{{ $t('dolasci') }}</div>
              <div class="school__next-training m-t-10 activity__box">
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
                      $moment(training.from).format('Do' + ' MM' + ', ' + 'LT')
                    }}</span>
                  </div>
                  <!--                  <b-icon v-if="!che(training)" icon="times-circle" type="is-danger" pack="fal" class="m-l-auto">-->
                  <!--                  </b-icon>-->
                  <!--                  <b-icon v-else icon="check-circle" type="is-green" pack="fal" class="m-l-auto"> </b-icon>-->
                </div>
              </div>
              <div class="fw600 is-size-55 m-l-5 m-t-30 m-b-10">{{ $t('uplate') }}</div>
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div v-for="payment in payments" :key="payment.id" class="action__item__small fw600">
                    <div class="title-num is-size-6">
                      <span class="fw600 is-size-6"> {{ payment.amount.toFixed(2) }} € </span>
                    </div>
                    <span class="x-tag--medium primary-light m-l-auto">{{
                      $moment(payment.date).format('Do' + 'MM' + '.')
                    }}</span>
                  </div>
                </div>
              </transition>
            </b-tab-item>
            <b-tab-item v-if="isTrainerOfTheGroup && isAdmin" :label="$t('financije')">
              <div class="buttons m-t-20">
                <b-button
                  class="m-l-10"
                  tag="nuxt-link"
                  type="is-primary"
                  pack="fal"
                  icon-right="usd-circle"
                  rounded
                  :to="localePath('/admin/payments/')"
                >
                  {{ $t('novaUplata') }}
                </b-button>
              </div>
              <!--          <transition name="fade">-->
              <!--            <div class="activity__box action__buttons">-->
              <!--              <div-->
              <!--                v-for="payment in schoolGroup.players[0].payments"-->
              <!--                :key="payment.id"-->
              <!--                class="action__item__small fw600"-->
              <!--              >-->
              <!--                <TennisImage :size="[42, 42]" :src="schoolGroup.players[0].image" class="user_image-small m-r-10 border__white" alt="" />-->
              <!--                <div class="title-num is-size-6">-->
              <!--                  <span class="fw600 is-size-6"> {{ schoolGroup.members[0].name }} — </span>-->
              <!--                  <span class="fw600 is-size-6 has-text-lightblue"> {{ payment.amount }} kn </span>-->
              <!--                </div>-->
              <!--                <span class="x-tag&#45;&#45;medium primary-light m-l-auto">{{-->
              <!--                  $moment(payment.date).format('Do' + 'MM' + '.')-->
              <!--                }}</span>-->
              <!--              </div>-->
              <!--            </div>-->
              <!--          </transition>-->
            </b-tab-item>
          </b-tabs>
        </div>
      </b-tab-item>
      <b-tab-item v-if="isAdminAndTrainer">
        <div v-if="!isEditing" class="p-x-16">
          <reportSubscriptions :school-group="schoolGroup" @reload="getGroups()" />
        </div>
        <schoolSubscription
          :school-group="schoolGroup"
          @isEditing="isEditing = $event"
          @update="getGroups()"
          @reload="getGroups()"
        />
      </b-tab-item>
      <b-tab-item v-if="isAdminAndTrainer" label="izvjestaji">
        <div class="p-l-15 p-r-15">
          <schoolReports
            :school-group="schoolGroup"
            :attendance-list="attendanceList"
            @update="loadReservationsHistory()"
          />
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalActive" :width="640" :data="schoolGroup.players" class="modal__payment" scroll="clip">
      <modalPayment :title="$t('noviTroak')" @update="addPayment()"></modalPayment>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import TextMessage from '@/components/messages/textMessage'
import TermMessage from '@/components/messages/termsMessage'
import ImageMessage from '@/components/messages/imageMessage'
import Thread from '@/models/Thread'
import Payment from '@/models/Payment'
import Club from '@/models/Club'
import SchoolGroup from '@/models/SchoolGroup'
import Attendance from '@/models/Attendance'
import PageHeader from '~/components/headers/blankBack'
import Reservation from '~/models/Reservation'
import modalPayment from '~/components/modal/ModalPayment'
import schoolReports from '~/components/school/reports'
import schoolSubscription from '~/components/subscriptions/subscriptionSchoolPayments'
import reportSubscriptions from '~/components/school/reportSubscriptions'

export default {
  name: 'SchoolGroup',
  components: {
    ImageMessage,
    TermMessage,
    TextMessage,
    modalPayment,
    TennisImage,
    PageHeader,
    schoolReports,
    schoolSubscription,
    reportSubscriptions,
  },
  async fetch() {
    await this.getGroups()
    // await this.getPayments()
    // await this.getPaymentsAdmin()
  },
  data() {
    return {
      activeMainTab: 0,
      activeTab: 0,
      isModalActive: false,
      isModalSubscriptionActive: false,
      schoolGroup: {},
      reservations: [],
      reservationsHistory: [],
      attendanceList: [],
      payments: [],
      payments_admin: [],
      messages: [],
      thread: {
        players: [],
      },
      selected_attender: 0,
      loading: false,
      isEditing: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdminAndTrainer() {
      return this.isAdmin && this.isTrainerOfTheGroup
    },
    isAdmin() {
      return this.user.is_admin
    },
    isTrainerOfTheGroup() {
      return this.schoolGroup.trainers.filter((t) => t.id === this.user.id).length > 0
    },
    isStudentOfTheGroup() {
      return this.schoolGroup.players.filter((p) => p.primary_contact_id === this.user.id).length > 0
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
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
  },
  methods: {
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    che(training) {
      return training.attendances.filter((a) => a.user_id === this.user.id).length > 0
    },
    getPaymentsAdmin() {
      Payment.where('receiver', this.user.id)
        .include(['user', 'receiver', 'type'])

        .for(new Club({ id: this.$store.state.club.id }))
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.payments_admin = res.data
        })
    },
    getPayments() {
      Payment.where('user', this.user.id)
        .include(['user', 'receiver', 'type'])
        .for(new Club({ id: this.$store.state.club.id }))
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.payments = res.data
        })
    },
    getMessages() {
      Thread.find(this.schoolGroup.thread_id).then((res) => {
        this.thread = new Thread(res)
        this.thread
          .messages()
          .limit(3)
          .get()
          .then((res) => {
            this.messages = res.data.reverse()
          })
      })
    },
    attending(player) {
      const attendance = this.attendanceList.filter((item) => {
        return item.user_id === player
      })
      if (attendance.length !== 0) {
        return attendance[0].id
      } else {
        return false
      }
    },
    async loadReservations() {
      this.reservations = await Reservation.where('school_group_id', this.schoolGroup.id)
        .where('from', this.today)
        .$get()
    },
    async loadReservationsHistory() {
      this.reservationsHistory = await Reservation.include('school_performances')
        .where('school_group_id', this.schoolGroup.id)
        .where('from', '0000-00-00')
        .$get()
    },
    getGroups() {
      const id = this.$route.params.id
      SchoolGroup.include(['players', 'players.subscriptions', 'players.parents'])
        .params({ include_invoices: true })
        .$find(id)
        .then((res) => {
          this.schoolGroup = res
          this.loadReservations().then(() => {
            this.getAttendance()
            this.getMessages()
            this.loadReservationsHistory()
          })
        })
    },
    /** ovo su primjeri koda
     *   - kako spremiti da je netko bio
     *   - kako povući popis već spremljenih
     *   - kako obrisati nečiji zapis
     *
     *   sustav pretpostavlja da ako nema zapisa da nisi bio
     *   trener bi trebao samo označavati one koji su bili
     */
    saveAttendance(player) {
      this.loading = true
      const a = new Attendance({
        school_group: this.schoolGroup, // koja grupa
        reservation: this.reservations[0], // koja rezervacija
        user: player.players[0], // koji igrač
      })
      a.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste prijavili dolazak'),
            type: 'is-success',
            duration: 1000,
          })
          this.getAttendance()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    async getAttendance() {
      if (this.reservations.length === 0) {
        return
      }
      this.attendanceList = await Attendance.where('reservation', this.reservations[0].id).get()
    },
    deleteAttendance(id) {
      id = this.attending(id)
      if (!id) {
        return
      }
      this.loading = true
      const a = new Attendance({ id })
      a.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste odjavili dolazak'),
            type: 'is-success',
            duration: 1000,
          })
          this.getAttendance()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
