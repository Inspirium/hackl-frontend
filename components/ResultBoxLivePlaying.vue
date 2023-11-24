<template>
  <div>
    <div
      :class="{
        result__box: true,
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
        <p class="modal-subtitle">
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
                    v-for="(set, index) in live.sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[0] > set[1],
                      'is-set-live-selected': 'a' + index === selectedSet,
                    }"
                    @click="selectedSet = 'a' + index"
                  >
                    {{ set[0]
                    }}<span v-if="live.tieBreak.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 0)
                    }}</span>
                  </div>
                </div>
              </span>
              <div class="gem__live">
                <div v-if="live.isTieBreak" class="result__score__item-live-gem">{{ live.firstPlayerPoints }}</div>
                <div v-else class="result__score__item-live-gem">{{ showScore(live.firstPlayerPoints, 0) }}</div>

                <b-icon
                  v-if="live.whoServing === 0"
                  class="m-b-5 live__service"
                  pack="fal"
                  size="is-smaller"
                  type="is-black80"
                  icon="tennis-ball"
                >
                </b-icon>

                <b-icon
                  v-if="live.whoServing === 0 && live.firstServe === 0"
                  class="m-b-5 right-60 live__service"
                  pack="fal"
                  size="is-smaller"
                  type="is-black80"
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
                    v-for="(set, index) in live.sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[1] > set[0],
                      'is-set-live-selected': 'b' + index === selectedSet,
                    }"
                    @click="selectedSet = 'b' + index"
                  >
                    {{ set[1]
                    }}<span v-if="live.tieBreak.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 1)
                    }}</span>
                  </div>
                </div>
              </span>
              <div class="gem__live">
                <div v-if="live.isTieBreak" class="result__score__item-live-gem">{{ live.secondPlayerPoints }}</div>
                <div v-else class="result__score__item-live-gem">{{ showScore(live.secondPlayerPoints, 1) }}</div>

                <b-icon
                  v-if="live.whoServing === 1"
                  class="m-b-5 live__service"
                  pack="fal"
                  size="is-smaller"
                  icon="tennis-ball"
                >
                </b-icon>
                <b-icon
                  v-if="live.whoServing === 1 && live.firstServe === 0"
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
        <p class="modal-subtitle">
          {{ result.players[1].display_name }}
        </p>
      </div>
      <!--      <div class="buttons">-->
      <!--        <b-button-->
      <!--          class="m-l-10 m-t-20"-->
      <!--          type="is-danger"-->
      <!--          pack="fal"-->
      <!--          size="is-smaller"-->
      <!--          icon-right="times"-->
      <!--          rounded-->
      <!--          @click="-->
      <!--            sets = [-->
      <!--              [0, 0],-->
      <!--              [0, 0],-->
      <!--              [0, 0],-->
      <!--            ]-->
      <!--          "-->
      <!--        >-->
      <!--          Resetiraj-->
      <!--        </b-button>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
export default {
  name: 'ResultBoxLivePlaying',
  components: {
    TennisImage,
  },
  props: {
    result: {
      type: Object,
      required: true,
    },
    live: {
      type: Object,
      required: true,
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
        if (score > 3 && this.live.firstPlayerPoints - this.live.secondPlayerPoints >= 1) {
          return 'AD'
        } else {
          return '40'
        }
      }
      if (player === 1) {
        if (score > 3 && this.live.secondPlayerPoints - this.live.firstPlayerPoints >= 1) {
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
      if (this.live.tieBreak === undefined) {
        return
      }
      if (this.live.tieBreak[set][0] !== 0 || this.live.tieBreak[set][1] !== 0) {
        return this.live.tieBreak[set][player]
      }
    },
    send(name) {
      this.$emit(name, this.result.id)
    },
  },
}
</script>
