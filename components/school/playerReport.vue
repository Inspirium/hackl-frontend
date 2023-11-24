<template>
  <div class="p-b-150">
    <div v-if="user.is_trainer" class="buttons m-t-10 m-b-10">
      <b-button
        class="softshadow m-t-10"
        type="is-small noborder"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click="goBack()"
      >
        {{ $t('nazad') }}
      </b-button>
    </div>
    <div class="fw600 is-size-3 m-b--10 has-text-centered" @click="getSchoolPerformance()">
      {{ isEditing ? $t('Uredi izvještaj') : $t('Novi izvještaj') }}
    </div>
    <div v-if="Object.keys(previousReport).length" class="buttons m-t-30 m-b--10">
      <b-button class="softshadow" type="is-small noborder" pack="fal" icon-right="copy" rounded @click="copyReport()">
        {{ $t('Kopiraj zadnji izvještaj') }}
      </b-button>
    </div>

    <div class="relative">
      <div v-if="!loading1" class="">
        <div class="member__info">
          <div v-if="player.image" class="align__centar__all m-t-20">
            <TennisImage
              :size="[180, 180]"
              :src="player.image"
              class="user_image-mediumsmall m-r-5 border__white--2 m-r-10"
              alt=""
            />
            <div class="fw600 is-size-5">{{ player.display_name }}</div>
          </div>
          <div
            v-if="reservationsHistory.length"
            class="reservation__item__content radius__12 is-white softshadow m-t-15 p-t-5"
          >
            <div class="is-uppercase fw600 is-size-65 has-text-lightblue m-r-5">
              {{ $moment(reservationsHistory[0].from).format('dddd') }}
            </div>
            <div class="title-num is-size-6">
              <span class="fw600 is-size-5">{{
                $moment(reservationsHistory[0].from).format('Do' + ' MMMM' + ', ' + 'LT')
              }}</span>
            </div>
            <div
              :class="reservationsHistory[0].court.surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
              class="x-tag m-l-auto"
            >
              {{ reservationsHistory[0].court.name }}
            </div>
          </div>
        </div>
        <div v-if="true" class="m-t-20">
          <div class="fw600 is-size-4 m-l-5 m-t-10">
            {{ $t('Napomene') }}
          </div>
          <div class="divider-line-1 m-t-5 m-b-20" />
          <tinymce-editor v-if="!isEditing || editNote" v-model="notes[0].description" class="" />
          <div v-else class="m-b-50">
            <!-- eslint-disable-next-line -->
            <div class="has-text-left is-size-6 content-tiny" v-html="notes[0].description"></div>
            <div class="buttons m-t-10 m-b-10">
              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                icon-right="edit"
                rounded
                @click="editNote = true"
              >
                {{ $t('Uredi napomenu') }}
              </b-button>
            </div>
          </div>
          <template>
            <div class="fw600 is-size-4 m-l-5 m-t-10">
              {{ $t('Video') }}
            </div>
            <div class="divider-line-1 m-t-5 m-b-20" />
            <!--            <div class="buttons">-->
            <!--              <b-button-->
            <!--                class="softshadow"-->
            <!--                type="is-small noborder"-->
            <!--                pack="fas"-->
            <!--                icon-right="video"-->
            <!--                rounded-->
            <!--                tag="nuxt-link"-->
            <!--                :to="localePath('/admin/courts')"-->
            <!--              >-->
            <!--                {{ $t('Unesi video') }}-->
            <!--              </b-button>-->
            <!--            </div>-->
            <videoUpload class="m-b-20" @videoUploaded="videoUploaded" />
          </template>

          <div class="fw600 is-size-4 m-l-5 m-t-20">
            {{ $t('Upitnik') }}
          </div>
          <div class="divider-line-1 m-t-5" />
          <div v-for="(item, index) in questionary" :key="index + 'upitini'" class="m-t-10">
            <div
              v-if="item.heading"
              class="fw600 is-size-5 has-text-lightblue line-height-16 flex align__centar__y m-t-20"
            >
              <font-awesome-icon icon="fa-light fa-chevron-right" class="primary iw12 m-r-5 m-l--5" />
              {{ $t(item.name) }}
            </div>
            <div v-else class="">
              <div class="fw600 line-height-14 is-size-6">{{ $t(item.name) }}</div>

              <div class="flex m-t-7">
                <div
                  v-for="grade in [1, 2, 3, 4, 5]"
                  :key="grade"
                  class="radius__12 fw600 has-text-centered softshadow2 m-r-7 w100 p-t-10 p-b-10"
                  :class="returnBckg(grade, item.score)"
                  @click="questionary[index].score = grade"
                >
                  {{ grade }}
                </div>
              </div>
              <div class="divider-line-1 m-t-15" />
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="loading1" class="align__centar__x loading_z_spinner">
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

    <div class="buttons m-t-10 is-fixed">
      <b-button class="fw600" type="is-danger" pack="fal" icon-left="chevron-left" rounded @click="goBack()">
        {{ $t('nazad') }}
      </b-button>
      <b-button
        class="m-l-10 fw600"
        :class="isTouched ? '' : 'blur_button'"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
        @click="saveSchoolPerformance()"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import SchoolPerformance from '@/models/SchoolPerformance'
import videoUpload from '~/components/videoUpload'

export default {
  name: 'PlayersSchoolReport',
  components: {
    TennisImage,
    videoUpload,
  },
  props: {
    player: {
      type: Object,
      required: true,
      default() {
        return {
          player: {},
        }
      },
    },
    reservationsHistory: {
      type: Array,
      required: true,
      default() {
        return {
          reservationsHistory: [],
        }
      },
    },
    reservation: {
      type: Object,
      required: true,
      default() {
        return {
          reservation: {},
        }
      },
    },
    schoolGroup: {
      type: Object,
      required: true,
      default() {
        return {
          schoolGroup: {},
        }
      },
    },
  },
  data() {
    return {
      activeTab: 0,
      isModalConfirmationActive: false,
      loading: false,
      loading1: false,
      isTouched: 0,
      notes: [{ description: '', videos: [] }],
      questionary: [
        { name: 'Progress', heading: true },
        { name: 'Overall progress', score: 0 },

        { name: 'Serve and Return - Tactical Objective', heading: true },
        { name: 'Serve consistently to the relevant service box', score: 0 },
        { name: 'Serve with variety by directing the serve to the left or right of the service box', score: 0 },
        { name: 'Consistently return the second serve back into the play and move the opponent', score: 0 },

        { name: 'Serve and Return - Technical Checkpoints', heading: true },
        {
          name: 'Use a simple overarm throwing action on the serve',
          score: 0,
        },
        {
          name: 'Place the ball up with control to a good position. At contact the hitting arm is close to fully extended',
          score: 0,
        },
        { name: 'Move toward the ball to return, and use an appropriate swing shape', score: 0 },
        { name: 'Rally - Tactical Objective', heading: true },
        { name: 'Rally with consistency', score: 0 },
        { name: 'Create space on the court by directing and redirecting the ball to move the opponent', score: 0 },
        {
          name: 'Maintain a good court position that allows the player to attack, rally or defend effectively',
          score: 0,
        },
        { name: 'Use their strength in order to build or finish the point', score: 0 },
        { name: "Play to their opponent's weaknesses in order to stay in, build or finish the point", score: 0 },
        { name: 'Rally - Technical Checkpoints', heading: true },
        { name: "Use a 'split step' between shots when the time allows", score: 0 },
        {
          name: 'Judge the depth, speed, spin, height and direction of the ball, and react to move to the ball then balance, strike and recover',
          score: 0,
        },
        { name: 'Use a different footwork patterns to move up, from and around the ball', score: 0 },
        {
          name: 'Hit forehand and backhand groundstrokes with appropriate racket head speed and control of the racket face, ideally with top-spin at Orange and Green',
          score: 0,
        },
        {
          name: 'Contact the ball slightly in front and to the side of the body, between waist and shoulder height on groundstrokes',
          score: 0,
        },
        { name: 'Net Game - Tactical Objective', heading: true },
        { name: 'Assume a good court position and volley the ball consistently into the court', score: 0 },
        {
          name: 'Direct the ball either away from the opponent or deep to build, finish or stay in the point',
          score: 0,
        },
        {
          name: 'Approach the net at a suitable moment with a shot that puts their opponent under pressure',
          score: 0,
        },
        { name: 'Attempt to pass or lob against a net player', score: 0 },
        { name: 'Net Game - Technical Checkpoints', heading: true },
        {
          name: 'Move the ball and make contact effectively with a controlled racket face angle and good contact point',
          score: 0,
        },
        {
          name: 'Use a split step on approaching, and cover the net except against good passing shots or lobs',
          score: 0,
        },
        { name: 'Execute a lob or passing shot with a controlled racket face pace of shot', score: 0 },
        { name: 'Does the player...?', heading: true },
        {
          name: 'Compete with confidence, and enjoyment at the current level and achieve success in competition',
          score: 0,
        },
        { name: 'Want to progress to the next level', score: 0 },
        { name: 'Understand the scoring system being used and keep score in matches', score: 0 },
        { name: 'Make decisions as required by the game with regard to rules (call in or out etc)', score: 0 },
      ],
      placeholderNotes: [{ description: '' }],
      placeholderQuestionary: [
        { name: 'Progress', heading: true },
        { name: 'Overall progress', score: 0 },

        { name: 'Serve and Return - Tactical Objective', heading: true },
        { name: 'Serve consistently to the relevant service box', score: 0 },
        { name: 'Serve with variety by directing the serve to the left or right of the service box', score: 0 },
        { name: 'Consistently return the second serve back into the play and move the opponent', score: 0 },

        { name: 'Serve and Return - Technical Checkpoints', heading: true },
        {
          name: 'Use a simple overarm throwing action on the serve',
          score: 0,
        },
        {
          name: 'Place the ball up with control to a good position. At contact the hitting arm is close to fully extended',
          score: 0,
        },
        { name: 'Move toward the ball to return, and use an appropriate swing shape', score: 0 },
        { name: 'Rally - Tactical Objective', heading: true },
        { name: 'Rally with consistency', score: 0 },
        { name: 'Create space on the court by directing and redirecting the ball to move the opponent', score: 0 },
        {
          name: 'Maintain a good court position that allows the player to attack, rally or defend effectively',
          score: 0,
        },
        { name: 'Use their strength in order to build or finish the point', score: 0 },
        { name: "Play to their opponent's weaknesses in order to stay in, build or finish the point", score: 0 },
        { name: 'Rally - Technical Checkpoints', heading: true },
        { name: "Use a 'split step' between shots when the time allows", score: 0 },
        {
          name: 'Judge the depth, speed, spin, height and direction of the ball, and react to move to the ball then balance, strike and recover',
          score: 0,
        },
        { name: 'Use a different footwork patterns to move up, from and around the ball', score: 0 },
        {
          name: 'Hit forehand and backhand groundstrokes with appropriate racket head speed and control of the racket face, ideally with top-spin at Orange and Green',
          score: 0,
        },
        {
          name: 'Contact the ball slightly in front and to the side of the body, between waist and shoulder height on groundstrokes',
          score: 0,
        },
        { name: 'Net Game - Tactical Objective', heading: true },
        { name: 'Assume a good court position and volley the ball consistently into the court', score: 0 },
        {
          name: 'Direct the ball either away from the opponent or deep to build, finish or stay in the point',
          score: 0,
        },
        {
          name: 'Approach the net at a suitable moment with a shot that puts their opponent under pressure',
          score: 0,
        },
        { name: 'Attempt to pass or lob against a net player', score: 0 },
        { name: 'Net Game - Technical Checkpoints', heading: true },
        {
          name: 'Move the ball and make contact effectively with a controlled racket face angle and good contact point',
          score: 0,
        },
        {
          name: 'Use a split step on approaching, and cover the net except against good passing shots or lobs',
          score: 0,
        },
        { name: 'Execute a lob or passing shot with a controlled racket face pace of shot', score: 0 },
        { name: 'Does the player...?', heading: true },
        {
          name: 'Compete with confidence, and enjoyment at the current level and achieve success in competition',
          score: 0,
        },
        { name: 'Want to progress to the next level', score: 0 },
        { name: 'Understand the scoring system being used and keep score in matches', score: 0 },
        { name: 'Make decisions as required by the game with regard to rules (call in or out etc)', score: 0 },
      ],
      report: {},
      isEditing: true,
      editNote: false,
      previousReport: {},
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    questionary: {
      deep: true,
      handler() {
        this.isTouched++
      },
    },
    notes: {
      deep: true,
      handler() {
        this.isTouched++
      },
    },
  },
  mounted() {
    this.getSchoolPerformance()
    this.getSchoolPerformancePrevious()
  },
  methods: {
    videoUploaded(url) {
      this.notes[0].videos.push(url)
    },
    copyReport() {
      this.questionary = this.previousReport.data.questionary
      this.notes = this.previousReport.data.notes
      this.report.data.questionary = this.previousReport.data.questionary
      this.report.data.notes = this.previousReport.data.notes
    },
    goBack() {
      this.report = {}
      this.notes = this.placeholderNotes
      this.questionary = this.placeholderQuestionary
      this.$emit('back')
    },
    returnBckg(item, score) {
      if (item === 1 && score === 1) {
        return 'is-red has-text-white'
      } else if (item === 2 && score === 2) {
        return 'is-orange has-text-white'
      } else if (item === 3 && score === 3) {
        return 'is-primary has-text-white'
      } else if (item === 4 && score === 4) {
        return 'is-tirkiz has-text-white'
      } else if (item === 5 && score === 5) {
        return 'green has-text-white'
      } else {
        return 'is-white has-text-black-80'
      }
    },
    getSchoolPerformance() {
      if (this.reservation.school_performances[this.player.players[0].id] !== undefined) {
        this.loading1 = true
        SchoolPerformance.find(this.reservation.school_performances[this.player.players[0].id].id).then((res) => {
          this.report = res
          this.loading1 = false
          if (Object.keys(this.report).length) {
            this.notes = this.report.data.notes
            this.questionary = this.report.data.questionary
          }
        })
      } else {
        this.isEditing = false
      }
    },
    getSchoolPerformancePrevious() {
      if (this.reservationsHistory.length < 2) return
      if (this.reservationsHistory[1].school_performances[this.player.players[0].id] !== undefined) {
        SchoolPerformance.find(this.reservationsHistory[1].school_performances[this.player.players[0].id].id).then(
          (res) => {
            this.previousReport = res
          }
        )
      }
    },
    saveSchoolPerformance() {
      this.loading = true
      const sp = new SchoolPerformance({
        player: { id: this.player.players[0].id },
        trainer: this.user,
        school_group: this.schoolGroup,
        reservation: this.reservation,
        data: { notes: this.notes, questionary: this.questionary, videos: this.notes[0].videos },
      })
      if (this.isEditing) {
        sp.id = this.report.id
      }
      sp.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izvještaj'),
            type: 'is-success',
            duration: 1000,
          })
          this.notes = this.placeholderNotes
          this.questionary = this.placeholderQuestionary
          this.loading = false
          this.$emit('back')
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
<style scoped></style>
