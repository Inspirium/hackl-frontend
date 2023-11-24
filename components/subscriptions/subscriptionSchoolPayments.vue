<template>
  <div>
    <div id="tu" class="buttons m-t-20 m-b-10">
      <b-button
        v-if="activeTab === 1"
        class="fw600 softshadow"
        type="is-white"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click="resetOnBack()"
      >
        {{ $t('nazad') }}
      </b-button>
    </div>
    <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation_impt p-b-150">
      <b-tab-item>
        <div class="buttons m-t-0">
          <b-button
            class="m-l-5 fw600"
            type="is-primary"
            pack="fal"
            icon-right="chevron-right"
            rounded
            :loading="loadingInvoices"
            @click="createInvoices()"
          >
            {{ $t('Izradi predračune') }}
          </b-button>
        </div>

        <div class="p-x-16">
          <div class="activity__box action__buttons">
            <div
              v-for="(item, index) in schoolGroup.players"
              :key="item.id + index"
              class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation has-text-left"
              @click.stop="selectIt(item)"
            >
              <div class="fw600 align__centar__all">
                <div class="list__content">
                  <template v-if="item.active_subscription">
                    <div
                      v-if="item.active_subscription?.status !== 'active' || item.active_subscription?.is_paused === 1"
                      class="inlineblock is-size-7 x-tag is-red nav__notification has-text-white m-b-5"
                    >
                      {{ $t('paused') }}
                    </div>
                  </template>
                  <div class="flex align__centar__y">
                    <TennisImage
                      :size="[42, 42]"
                      :src="item.image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                    <div class="">
                      <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.display_name }}</h4>
                      <h4 v-if="!item.active_subscription" class="fw600 is-size-65 has-text-danger m-t--2">
                        {{ $t('Nema Članarine') }}
                      </h4>
                    </div>
                  </div>
                  <template v-if="item.active_subscription">
                    <div
                      v-if="item.previous_invoices.length"
                      class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap"
                    >
                      {{ $t('Računi') }}:
                      <span
                        v-for="(indicator, index) in item.previous_invoices"
                        :key="index + 'i'"
                        class="school-payment-indicatior"
                        :class="indicator.payment_status === 'PAID' ? 'green' : 'is-red'"
                      ></span>
                    </div>

                    <div class="fw600 has-text-black80 is-size-65 m-l-auto m-t-2 nowrap">
                      {{ $t('Članarina') }}:
                      <span class="has-text-lightblue">{{ item.active_subscription?.name }}</span>
                    </div>
                    <template>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ item.description }}
                      </div>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ $t('Cijena') }}:
                        <span class="has-text-black80">{{ item.active_subscription?.price | currency }}</span>
                      </div>
                    </template>
                  </template>
                </div>
                <div class="action m-l-auto">
                  <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="p-x-16">
          <div class="fw600 is-size-3 has-text-centered has-text-black80">{{ $t('Uredi članarinu') }}</div>
          <div class="flex align__centar__all m-t-10">
            <TennisImage
              v-if="selectedPlayer.image"
              :size="[80, 80]"
              :src="selectedPlayer.image"
              class="user_image m-r-10 border__white"
              alt=""
            />
            <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ selectedPlayer.display_name }}</h4>
          </div>
          <div v-if="reservationsHistory" class="relative">
            <div class="label--center m-t-20">{{ $t('Dolasci') }}</div>

            <div v-if="reservationsHistory.length && attendanceList.length" class="flex align__centar__x">
              <div v-for="training in reservationsHistoryReverse" :key="training.id" class="m-r-3">
                <b-icon v-if="!che(training)" icon="times-circle" type="is-danger" pack="fal" class="m-l-auto">
                </b-icon>
                <b-icon v-else icon="check-circle" type="is-green" pack="fal" class="m-l-auto"> </b-icon>
              </div>
            </div>
            <transition v-if="loading2 || loading1" name="fade">
              <div class="align__centar__x m-t--15 loading_z_spinner">
                <b-icon
                  class="comment-send"
                  custom-class="rotating"
                  icon="spinner"
                  size="is-large"
                  type="is-primary"
                  pack="far"
                />
              </div>
            </transition>
          </div>

          <reportSubscriptions
            :for-group="false"
            :selected-user="selectedPlayer"
            @update="resetOnBack()"
            @reload="$emit('reload')"
            @singleupdate="
              activeTab = 0
              selected_subscriptions = $event
              applySubscriptionSingle()
            "
          />
          <template v-if="selectedPlayer?.active_subscription">
            <div class="divider-line-1"></div>
            <div class="fw600 is-size-4 has-text-centered m-t-15 line-height-19">
              {{ $t('Premostite postavke Članarine') }}
            </div>
            <div class="label">{{ $t('Status članarine') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
              <div class="block">
                <b-radio
                  v-model="userSuscription.is_paused"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :native-value="false"
                >
                  {{ $t('Aktivna') }}
                </b-radio>
                <b-radio
                  v-model="userSuscription.is_paused"
                  :type="valid ? 'is-danger' : 'is-danger'"
                  :native-value="true"
                >
                  {{ $t('Pauzirana') }}
                </b-radio>
              </div>
            </ValidationProvider>

            <ValidationProvider name="Cijena Članarine">
              <b-field :label="$t('Prilagođena cijena')" class="login__input__container has-text-white">
                <b-input
                  v-model="userSuscription.price"
                  :placeholder="$t('Upiši cijenu članarine')"
                  type="number"
                  rounded
                ></b-input>
              </b-field>
            </ValidationProvider>
            <!--            <div class="label">{{ $t('napomena') }}</div>-->
            <!--            <ValidationProvider name="Napomena" rules="required">-->
            <!--              <b-field class="login__input__container">-->
            <!--                <b-input-->
            <!--                  id="message"-->
            <!--                  v-model="userSuscription.note"-->
            <!--                  :placeholder="$t('upiiNapomenu')"-->
            <!--                  rows="4"-->
            <!--                  type="textarea"-->
            <!--                ></b-input>-->
            <!--              </b-field>-->
            <!--            </ValidationProvider>-->
            <div class="buttons m-t-30 m-b-5">
              <b-button
                class="softshadow m-t-10 m-b-20 invert-small-button"
                type="noborder is-small is-primary has-text-white"
                pack="fal"
                icon-right="check"
                rounded
                :loading="loadingEdit"
                @click="editSubscriptionSingle()"
              >
                {{ $t('spremi') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="sendEmit($event)" />
    </b-modal>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiKategoriju')"
          :subtitle="$t('Potvrdom će kategorija biti obrisana')"
          @update="deleteSubscription()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Attendance from '@/models/Attendance'
import Invoice from '@/models/Invoice'
import SchoolGroup from '@/models/SchoolGroup'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import Subscription from '~/models/Subscription'
import UserSubscription from '~/models/UserSubscription'
import Reservation from '~/models/Reservation'
import modalMembers from '~/components/modal/ModalMembersAll'
import reportSubscriptions from '~/components/school/reportSubscriptions'

export default {
  name: 'SubscriptionSchoolPayments',
  components: {
    modalMembers,
    modalConfirmation,
    reportSubscriptions,
  },
  props: {
    schoolGroup: {
      type: Object,
      required: false,
      default() {},
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      loading1: false,
      loading2: false,
      loadingDelete: false,
      loadingEdit: false,
      isLoaded: null,
      loadingMedia: false,
      activeTab: 0,
      total: 0,
      category: [],
      subscriptions: [],
      selected_subscriptions: null,
      selected_subscriptions_delete: null,
      isModalConfirmationActive: false,
      isEditing: false,
      attendanceList: [],
      reservationsHistory: [],
      selectedPlayer: {},
      userSuscription: {
        price: null,
        is_paused: false,
      },
      isModalMembersActive: false,
      loadingInvoices: false,
    }
  },
  computed: {
    checkPlayersSubscription() {
      return this.schoolGroup.players.some((player) => player.active_subscription)
    },
    reservationsHistoryReverse() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.reservationsHistory.reverse().slice(0, 10)
    },
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    activeTab() {
      if (this.activeTab === 1) {
        this.$emit('isEditing', true)
        this.scrollToTop()
      } else {
        this.$emit('isEditing', false)
      }
    },
  },
  mounted() {
    this.loadReservationsHistory()
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    createInvoices() {
      if (!this.checkPlayersSubscription) {
        this.$buefy.toast.open({
          message: this.$t('Nema članarina za izradu računa'),
          type: 'is-danger',
        })
        return
      }
      this.loadingInvoices = true
      new Invoice({ name: 'rujan' })
        .for(new SchoolGroup({ id: this.$route.params.id }))
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili račun'),
            type: 'is-success',
          })
          this.loadingInvoices = false
          this.$router.push(this.localePath('/admin/subscriptions/pending'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingInvoices = false
        })
    },
    selectIt(item) {
      this.selectedPlayer = item
      this.getAttendance()
      this.activeTab = 1
    },
    applySubscriptionSingle() {
      this.loading = true
      new Subscription({ id: this.selected_subscriptions.id })
        .users()
        .attach({
          users: [{ id: this.selectedPlayer.id }],
          type: 'schoolGroup',
          type_id: this.schoolGroup.id,
          all: false,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Grupa je spremljena'),
            type: 'is-success',
          })
          this.$emit('reload')
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    editSubscriptionSingle() {
      this.loadingEdit = true
      const us = new UserSubscription({
        id: this.selectedPlayer.active_subscription.pivot_id,
        is_paused: this.userSuscription.is_paused,
      })
      if (this.userSuscription.price) {
        us.price = this.userSuscription.price
      }
      us.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Promjene su uspješno spremljene'),
            type: 'is-success',
          })
          this.userSuscription.price = null
          this.userSuscription.is_paused = false
          this.saved = true
          this.loadingEdit = false
          this.$emit('update')
          this.activeTab = 0
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingEdit = false
        })
    },
    scrollToTop() {
      document.getElementById('tu').scrollIntoView({
        top: 10,
        behavior: 'smooth',
      })
    },
    resetOnBack() {
      this.$emit('reload')
      this.selectedPlayer = {}
      this.attendanceList = []
      this.activeTab = 0
    },
    che(training) {
      let activeClass = ''
      this.attendanceList.forEach((al) => {
        if (al.reservation_id === training.id) {
          activeClass = 'active'
        }
      })
      return activeClass
    },
    loadReservationsHistory() {
      this.loading1 = true
      Reservation.where('school_group_id', this.schoolGroup.id)
        .where('from', '0000-00-00')
        .limit(10)
        .get()
        .then((res) => {
          this.reservationsHistory = res.data
          this.loading2 = false
        })
    },
    getAttendance() {
      this.loading1 = true
      Attendance.where('user', this.selectedPlayer.players[0].id)
        .where('school_group', this.schoolGroup.id)
        .limit(10)
        .get()
        .then((res) => {
          this.attendanceList = res
          this.loading1 = false
        })
    },
    newSubscriptionAction() {
      this.isEditing = false
      this.newSubscription = _.cloneDeep(this.newSubscriptionPlaceholder)
      this.activeTab = 1
    },
    action(index) {
      // if selected then edit category
      if (index !== this.selected_subscriptions) {
        this.selected_subscriptions_delete = index
        this.isModalConfirmationActive = true
      } else {
        this.selected_subscriptions = index
        this.isEditing = true
        this.newSubscription = this.subscriptions[this.selected_subscriptions]
        this.activeTab = 1
      }
    },
    sendEmit(item, index) {
      if (index === this.selected_subscriptions) {
        this.selected_subscriptions = null
      } else {
        this.selected_subscriptions = index
      }
      this.$emit('update', item)
    },
    deleteSubscription() {
      this.loadingDelete = true
      const subscriptionDelete = new Subscription({ id: this.subscriptions[this.selected_subscriptions_delete]?.id })
      const subscriptionDeleteFromEdit = new Subscription({ id: this.newSubscription.id })
      const whatID = this.activeTab === 0 ? subscriptionDelete : subscriptionDeleteFromEdit
      whatID
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali kategoriju'),
            type: 'is-success',
          })
          this.activeTab = 0
          this.getSubscription()
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
  },
}
</script>
<style scoped>
.cropper {
  width: 100vw;
}
</style>
