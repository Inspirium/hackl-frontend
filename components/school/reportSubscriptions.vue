<template>
  <div class="">
    <template v-if="forGroup">
      <div class="fw600 is-size-4 has-text-centered m-t-15">{{ $t('Članarina grupe') }}</div>
      <div class="fw600 is-size-65 has-text-centered has-text-primary m-b-10 m-t-2">
        {{ $t('Odaberi članarinu i primjeni je na sve članove ove grupe') }}
      </div>
    </template>
    <div v-else class="fw600 is-size-4 has-text-centered m-t-15">{{ $t('Članarina člana') }}</div>
    <div class="activity__box action__buttons br100 m-t-5">
      <div class="action__item__small fw600 br100 p-l-20">
        <template>
          <div v-if="checkSubscription()" class="align__centar__all w100">
            <div class="list__content">
              <h3 class="fw600 has-text-black80 is-size-5 line-height-14">{{ selected_subscription.name }}</h3>
              <h4 class="fw600 has-text-primary is-size-65">
                {{ $t('Cijena') }}: {{ selected_subscription.price | currency }}
              </h4>
            </div>
            <div :class="{ blur_button: loadingDelete }" @click="deleteSubscription()">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div
            v-else
            class="activity__header"
            @click="
              isModalSubscriptionActive = true
              $emit('reload')
            "
          >
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('Odaberi vrstu Članarine') }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="user.is_trainer && forGroup && checkSubscription()" class="buttons m-t-20 m-b--10">
      <b-button
        class="softshadow m-t-10"
        type="is-small noborder"
        pack="fal"
        icon-right="arrow-down-from-dotted-line"
        rounded
        :loading="loading"
        @click.prevent="applySubscriptionGroup()"
      >
        {{ forGroup ? $t('Primijeni na sve članove') : $t('Primijeni na člana') }}
      </b-button>
    </div>
    <div v-if="forGroup" class="divider-line-1 m-t-20"></div>
    <b-tabs v-model="activeTab">
      <b-tab-item>
        <div class="">
          <template v-if="reservationsHistory.length">
            <div class="fw600 is-size-55 m-l-5 m-t-30 m-b--16">
              {{ $t('Uplate članarina') }}
            </div>
            <div class="m-t-10 m-t-20">
              <div
                v-for="(training, index) in reservationsHistory"
                :key="training.id + index"
                @click="isOpen === index ? (isOpen = 0) : (isOpen = index)"
              >
                <div class="action__item__small has-background-white fw600 softshadow activity__box m-b-5">
                  <div class="title-num is-size-6">
                    <span class="fw600 is-size-6 vertical-align__none">{{
                      $moment(training.from).format('DD' + '. ' + 'MMM' + ' ' + 'YYYY' + '.')
                    }}</span>
                  </div>
                  <div :class="training.court.surface.badge === 'clay' ? 'is-red' : 'green'" class="x-tag m-l-auto">
                    {{ training.court.surface.badge !== 'clay' ? 'Plaćeno' : 'Nije plaćeno' }}
                  </div>
                  <b-icon
                    icon="chevron-down"
                    size="is-small-9"
                    pack="far"
                    class="m-t--3 m-l-7 m-r--5 chevrone-open"
                    :class="[isOpen === index ? 'chevron-animated-open' : 'chevron-animated-close']"
                  ></b-icon>
                </div>
                <!--                Show players list-->
                <div v-if="isOpen === index" class="activity__reservation tranform__center mw80 m-t--5 m-b-30">
                  <b-icon icon="chevron-down" type="is-black50" pack="fal" class="tranform__center"> </b-icon>
                  <transition name="fade">
                    <div class="activity__box action__buttons">
                      <div
                        v-for="(player, i) in schoolGroup.players"
                        :key="player.id + i"
                        :class="['action__item__small', 'fw600']"
                        @click="
                          selected_player = player
                          selected_reservation = training
                          activeTab = 1
                        "
                      >
                        <TennisImage
                          :size="[42, 42]"
                          :src="player.image"
                          class="user_image-small m-r-10 border__white"
                          alt=""
                        />
                        <div :class="loading ? 'loading-green-text' : ''">{{ player.display_name }}</div>
                        <template v-if="training.school_performances[player.id] !== undefined">
                          <div v-if="Object.keys(training.school_performances[player.id])" :class="['m-l-auto']">
                            <b-icon icon="check-circle" type="is-green" pack="fal"> </b-icon>
                          </div>
                        </template>
                        <div v-else :class="['m-l-auto']">
                          <b-icon icon="times-circle" type="is-danger" pack="fal"> </b-icon>
                        </div>
                        <div>
                          <b-icon
                            class="m-r--15 m-l-5"
                            icon="chevron-right"
                            size="is-small-9"
                            type="is-black20"
                            pack="fal"
                          >
                          </b-icon>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </template>
          <transition v-else name="fade">
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
        </div>
      </b-tab-item>
      <b-tab-item>
        <PlayerReport
          v-if="Object.keys(selected_player).length && Object.keys(selected_reservation).length && activeTab === 1"
          :reservations-history="reservationsHistory"
          :reservation="selected_reservation"
          :school-group="schoolGroup"
          :player="selected_player"
          @back="
            activeTab = 0
            $emit('update')
          "
        />
      </b-tab-item>
    </b-tabs>
    <b-modal
      :active.sync="isModalSubscriptionActive"
      :width="640"
      :data="schoolGroup.players"
      class="modal__payment"
      scroll="clip"
    >
      <modalSubscription :title="$t('Članarine')" @update="updateSubscription($event)"></modalSubscription>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import PlayerReport from '@/components/school/playerReport'
import modalSubscription from '~/components/modal/ModalSubscription'
import Subscription from '~/models/Subscription'
import UserSubscription from '~/models/UserSubscription'

export default {
  name: 'ReportSubscriptions',
  components: {
    TennisImage,
    PlayerReport,
    modalSubscription,
  },
  props: {
    reservationsHistory: {
      type: Object,
      required: false,
      default() {
        return {
          reservationsHistory: {},
        }
      },
    },
    reservations: {
      type: Object,
      required: false,
      default() {
        return {
          reservations: {},
        }
      },
    },
    schoolGroup: {
      type: Object,
      required: false,
      default() {
        return {
          schoolGroup: {},
        }
      },
    },
    selectedUser: {
      type: Object,
      required: false,
      default() {
        return {
          selectedUser: {},
        }
      },
    },
    attendanceList: {
      type: Object,
      required: false,
      default() {
        return {
          attendanceList: {},
        }
      },
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
    forGroup: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      activeTab: 0,
      isModalConfirmationActive: false,
      isModalSubscriptionActive: false,
      loading: false,
      loadingDelete: false,
      selected_player: {},
      selected_reservation: {},
      selected_subscription: {},
      isOpen: 0,
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    schoolGroupIDs() {
      return this.schoolGroup.players.map((p) => ({ id: p.id }))
    },
  },
  watch: {
    selectedUser: {
      handler() {
        if (this.selectedUser.active_subscription !== null) {
          this.selected_subscription = this.selectedUser.active_subscription
        }
      },
    },
    schoolGroup: {
      handler() {
        if (this.schoolGroup.active_subscription !== null) {
          this.selected_subscription = this.selectedUser.active_subscription
        }
      },
    },
  },
  mounted() {},
  methods: {
    checkSubscription() {
      if (this.selected_subscription === undefined) {
        return false
      } else if (this.selected_subscription === null) {
        return false
      } else if (Object.keys(this.selected_subscription).length > 0) {
        return true
      } else {
        return false
      }
    },
    applySubscriptionGroup() {
      this.loading = true
      new Subscription({ id: this.selected_subscription.id })
        .users()
        .attach({
          users: this.schoolGroupIDs,
          type: 'schoolGroup',
          type_id: this.schoolGroup.id,
          all: true,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Grupa je spremljena'),
            type: 'is-success',
          })
          this.$emit('reload')
          this.saved = true
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
    deleteSubscription() {
      if (!this.selectedUser.active_subscription) {
        this.selected_subscription = {}
        return
      }
      this.loadingDelete = true
      const s = new UserSubscription({ id: this.selectedUser.active_subscription.pivot_id })
      s.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.loadingDelete = false
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    updateSubscription(item) {
      this.selected_subscription = item
      if (!this.forGroup) {
        this.$emit('singleupdate', item)
      }
    },
  },
}
</script>
<style scoped></style>
