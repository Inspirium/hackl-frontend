<template>
  <div v-if="Object.keys(result.live_data).length">
    <div
      :class="{
        result__box: true,
        result__box__noshadow: stream,
        'p-b-5': true,
        'p-t-3': true,
      }"
    >
      <!--      <div class="result__header">-->
      <!--                <div class="modal-subtitle is-size-6 has-text-grey">{{ result.date | moment('D.M.Y.') }}</div>-->
      <!--                <div v-show="result.game_id !== null" class="x-tag has-background-primary m-r-5">-->
      <!--                  {{ club.type === 'classic' ? 'Liga' : 'Turnir' }}-->
      <!--                </div>-->
      <!--                <div class="x-tag is-clay">{{ result.surface.title }}</div>-->
      <!--      </div>-->
      <div v-if="result.players.length > 1">
        <p class="modal-subtitle" :class="{ 'has-text-black100': stream }">
          {{ result.players[0].display_name }}
        </p>
        <div class="comments__box">
          <div class="w100">
            <div
              :class="
                (!result.winner ? '' : 'is-won',
                {
                  result__score: true,
                  'justify-between': true,
                  'm-b-5': true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in result.live_data.sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'has-text-black100': stream && !(set[0] > set[1]),
                      fw600: stream,
                      'is-set': set[0] > set[1],
                      'is-set-live-selected': 'a' + index === selectedSet,
                    }"
                    @click="selectedSet = 'a' + index"
                  >
                    {{ set[0]
                    }}<span v-if="result.live_data.tieBreak.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 0)
                    }}</span>
                  </div>
                </div>
              </span>
              <div class="gem__live">
                <div
                  v-if="result.live_data.isTieBreak"
                  class="result__score__item-live-gem"
                  :class="{ 'has-text-black100': stream }"
                >
                  {{ result.live_data.firstPlayerPoints }}
                </div>
                <div v-else class="result__score__item-live-gem" :class="{ 'has-text-black100': stream }">
                  {{ showScore(result.live_data.firstPlayerPoints, 0) }}
                </div>

                <b-icon
                  v-if="result.live_data.whoServing === 0"
                  class="m-b-5 live__service"
                  pack="fal"
                  size="is-smaller"
                  icon="tennis-ball"
                >
                </b-icon>
                <b-icon
                  v-if="result.live_data.whoServing === 0 && result.live_data.firstServe === 0"
                  class="m-b-5 right-60 live__service"
                  pack="fal"
                  size="is-smaller"
                  icon="tennis-ball"
                >
                </b-icon>
              </div>
            </div>
            <div
              :class="
                (result.winner ? '' : 'is-won',
                {
                  result__score: true,
                  'justify-between': true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in result.live_data.sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'has-text-black100': stream && !(set[1] > set[0]),
                      fw600: stream,
                      'is-set': set[1] > set[0],
                      'is-set-live-selected': 'b' + index === selectedSet,
                    }"
                    @click="selectedSet = 'b' + index"
                  >
                    {{ set[1]
                    }}<span v-if="result.live_data.tieBreak.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 1)
                    }}</span>
                  </div>
                </div>
              </span>
              <div class="gem__live">
                <div
                  v-if="result.live_data.isTieBreak"
                  class="result__score__item-live-gem"
                  :class="{ 'has-text-black100': stream }"
                >
                  {{ result.live_data.secondPlayerPoints }}
                </div>
                <div v-else class="result__score__item-live-gem" :class="{ 'has-text-black100': stream }">
                  {{ showScore(result.live_data.secondPlayerPoints, 1) }}
                </div>

                <b-icon
                  v-if="result.live_data.whoServing === 1"
                  class="m-b-5 live__service"
                  pack="fal"
                  size="is-smaller"
                  icon="tennis-ball"
                >
                </b-icon>
                <b-icon
                  v-if="result.live_data.whoServing === 1 && result.live_data.firstServe === 0"
                  class="m-b-5 right-60 live__service"
                  pack="fal"
                  size="is-smaller"
                  icon="tennis-ball"
                >
                </b-icon>
              </div>
            </div>
          </div>
          <div class="flex"></div>
        </div>
        <p class="modal-subtitle" :class="{ 'has-text-black100': stream }">
          {{ result.players[1].display_name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'ResultBoxLivePreview',
  components: {
    TennisImage,
  },
  props: {
    result: {
      type: Object,
      required: true,
    },
    stream: {
      type: Boolean,
      requried: false,
    },
  },
  data() {
    return {
      test: 5,
      selectedSet: null,
      sets: [[2, 0]],
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    addSets() {
      return this.sets[0]
    },
    canDelete() {
      if (this.result.non_member) {
        return false
      }
      return (
        !this.result.verified &&
        !this.result.players[1].pivot.verified &&
        (this.result.players[0].id === this.$store.state.auth.user.id ||
          (this.$auth.loggedIn && this.$auth.user.is_admin))
      )
    },
  },
  methods: {
    showScore(score, player) {
      if (score === 0) {
        return 0
      }
      if (score === 1) {
        return 15
      }
      if (score === 2) {
        return 30
      }
      if (score === 3) {
        return 40
      }
      if (player === 0) {
        if (score > 3 && this.result.live_data.firstPlayerPoints - this.result.live_data.secondPlayerPoints >= 1) {
          return 'AD'
        } else {
          return '40'
        }
      }
      if (player === 1) {
        if (score > 3 && this.result.live_data.secondPlayerPoints - this.result.live_data.firstPlayerPoints >= 1) {
          return 'AD'
        } else {
          return '40'
        }
      }
    },
    addInitialSet(plus) {
      switch (this.selectedSet) {
        case 'a0':
          this.sets[0].splice(0, 1, this.sets[0][0] + (plus ? +1 : -1))
          if (this.sets[0][0] === -1) {
            this.sets[0][0] = 0
          }
          break
        case 'a1':
          this.sets[1].splice(0, 1, this.sets[1][0] + (plus ? +1 : -1))
          if (this.sets[1][0] === -1) {
            this.sets[1][0] = 0
          }
          break
        case 'a2':
          this.sets[2].splice(0, 1, this.sets[2][0] + (plus ? +1 : -1))
          if (this.sets[2][0] === -1) {
            this.sets[2][0] = 0
          }
          break
        case 'b0':
          this.sets[0].splice(1, 1, this.sets[0][1] + (plus ? +1 : -1))
          if (this.sets[0][1] === -1) {
            this.sets[0][1] = 0
          }
          break
        case 'b1':
          this.sets[1].splice(1, 1, this.sets[1][1] + (plus ? +1 : -1))
          if (this.sets[1][1] === -1) {
            this.sets[1][1] = 0
          }
          break
        case 'b2':
          this.sets[2].splice(1, 1, this.sets[2][1] + (plus ? +1 : -1))
          if (this.sets[2][1] === -1) {
            this.sets[2][1] = 0
          }
          break
      }
    },
    displayTieBreak(set, player) {
      // ako je tie-break
      if (this.result.live_data.tieBreak === undefined) {
        return
      }
      if (this.result.live_data.tieBreak[set][0] !== 0 || this.result.live_data.tieBreak[set][1] !== 0) {
        return this.result.live_data.tieBreak[set][player]
      }
    },
    send(name) {
      this.$emit(name, this.result.id)
    },
  },
}
</script>
