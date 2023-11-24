<template>
  <div class="p-b-150">
    <b-tabs v-model="activeTab">
      <b-tab-item>
        <div class="">
          <template v-if="reservations.length">
            <div class="fw600 is-size-4 m-l-5 m-t-10 m-b--16">
              {{ $t('Popis izvještaja') }}
            </div>
            <div class="m-t-10 m-t-20">
              <div
                v-for="(training, index) in reservations"
                :key="training.id + index + 'training'"
                @click="isOpen = index"
              >
                <div class="action__item__small has-background-white fw600 softshadow activity__box m-b-5">
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
                        :key="player.id + index + i + 'player'"
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
                        <template v-if="training.school_performances[player.players[0].id] !== undefined">
                          <div
                            v-if="Object.keys(training.school_performances[player.players[0].id])"
                            :class="['m-l-auto']"
                          >
                            <b-icon icon="file-pen" type="is-green" pack="fal"> </b-icon>
                          </div>
                        </template>
                        <div v-else :class="['m-l-auto']">
                          <b-icon icon="file-pen" type="is-danger" pack="fal"> </b-icon>
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
        </div>
      </b-tab-item>
      <b-tab-item>
        <PlayerReport
          v-if="Object.keys(selected_player).length && Object.keys(selected_reservation).length && activeTab === 1"
          :reservations-history="reservations"
          :reservation="selected_reservation"
          :school-group="schoolGroup"
          :player="selected_player"
          @back="
            activeTab = 0
            loadReservations()
          "
        />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import PlayerReport from '@/components/school/playerReport'
import Reservation from '~/models/Reservation'

export default {
  name: 'SchoolReports',
  components: {
    TennisImage,
    PlayerReport,
  },
  props: {
    schoolGroup: {
      type: Object,
      required: true,
      default() {
        return {
          schoolGroup: {},
        }
      },
    },
    attendanceList: {
      type: Array,
      required: true,
      default() {
        return {
          attendanceList: [],
        }
      },
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      activeTab: 0,
      isModalConfirmationActive: false,
      loading: false,
      selected_player: {},
      selected_reservation: {},
      reservations: [],
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
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
  },
  watch: {},
  mounted() {
    this.loadReservations()
  },
  methods: {
    loadReservations() {
      this.loading = true
      Reservation.where('school_group_id', this.schoolGroup.id)
        .where('to', this.today)
        .limit(10)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          this.reservations = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // async loadReservations() {
    //   try {
    //     this.loading = true
    //     this.reservations = await Reservation.where('school_group_id', this.schoolGroup.id)
    //       .where('to', this.today)
    //       .limit(10)
    //       .orderBy('-created_at')
    //       .$get()
    //   } catch (error) {
    //     this.loading = false
    //   } finally {
    //     this.loading = false
    //   }
    // },
  },
}
</script>
<style scoped></style>
