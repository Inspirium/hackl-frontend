<template>
  <div>
    <PageHeader :title="$t('Izvještaj')" :background="'is-primary'" />
    <div class="p-b-150 p-x-16">
      <div class="relative">
        <div v-if="!loading1" class="">
          <div v-if="Object.keys(player).length" class="member__info">
            <div v-if="player.image" class="align__centar__all m-t-20">
              <TennisImage
                :size="[180, 180]"
                :src="player.image"
                class="user_image-mediumsmall m-r-5 border__white--2 m-r-10"
                alt=""
              />
              <div class="fw600 is-size-5">{{ player.display_name }}</div>
            </div>
          </div>
          <div class="fw600 is-size-65 has-text-centered flex align__centar__all is-white radius__12 softshadow m-t-10">
            {{ $t('Vrijeme izrade') }}:
            <span class="fw600 m-l-7 is-size-5">{{ $moment(report.created_at).format('DD.' + 'MM' + '.') }}</span>
          </div>

          <div v-if="true" class="m-t-20">
            <!-- eslint-disable-next-line -->
            <div class="has-text-left is-size-6 content-tiny" v-html="notes[0].description"></div>

            <div class="fw600 is-size-4 m-l-5 m-t-30">
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
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import SchoolPerformance from '@/models/SchoolPerformance'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'SchoolReportPerformance',
  components: {
    TennisImage,
    PageHeader,
  },
  data() {
    return {
      activeTab: 0,
      isModalConfirmationActive: false,
      loading: false,
      loading1: false,
      isTouched: 0,
      notes: [{ title: '', description: '' }],
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
      placeholderNotes: [{ title: '', description: '' }],
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
      previousReport: {},
      player: {},
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
    this.getPlayer()
  },
  methods: {
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
      SchoolPerformance.find(this.$route.params.performance).then((res) => {
        this.report = res
        this.loading1 = false
        if (Object.keys(this.report).length) {
          this.notes = this.report.data.notes
          this.questionary = this.report.data.questionary
        }
      })
    },
    getPlayer() {
      Player.find(this.$route.params.player).then((res) => {
        this.player = res
        this.loading1 = false
      })
    },
  },
}
</script>
<style scoped></style>
