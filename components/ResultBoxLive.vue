<template>
  <div>
    <div
      v-if="result.result !== null"
      :class="{
        result__box: true,
      }"
    >
      <div class="result__header">
        <div class="modal-subtitle is-size-6 has-text-grey">{{ result.date | moment('D.M.Y.') }}</div>
        <div v-show="result.game_id !== null" class="x-tag has-background-primary m-r-5">{{ $t('liga') }}</div>
        <!--        <div class="x-tag is-clay">{{ result.surface.title }}</div>-->
      </div>
      <div v-if="result.players.length > 1">
        <p class="modal-subtitle">
          {{ result.players[0].display_name }}
        </p>
        <div class="comments__box">
          <div class="">
            <div
              :class="
                (!result.winner ? '' : 'is-won',
                {
                  result__score: true,
                  'm-b-5': true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[0] > set[1],
                      'is-set-live-selected': 'a' + index === selectedSet,
                    }"
                    @click="selectedSet = 'a' + index"
                  >
                    {{ set[0] }}
                  </div>
                </div>
              </span>
            </div>
            <div
              :class="
                (result.winner ? '' : 'is-won',
                {
                  result__score: true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[1] > set[0],
                      'is-set-live-selected': 'b' + index === selectedSet,
                    }"
                    @click="selectedSet = 'b' + index"
                  >
                    {{ set[1] }}
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="fw600 is-size-55 has-text-black80 align__centar__y" @click="addInitialSet(false)">
              <b-icon icon="minus-circle" pack="fal" size="is-larger" type="is-danger" class="m-l-25"> </b-icon>
            </div>
            <div class="fw600 is-size-55 has-text-black80 align__centar__y" @click="addInitialSet(true)">
              <b-icon icon="plus-circle" pack="fal" size="is-larger" type="is-green" class="m-l-25"> </b-icon>
            </div>
          </div>
        </div>
        <p class="modal-subtitle">
          {{ result.players[1].display_name }}
        </p>
      </div>
      <div class="buttons">
        <b-button
          class="m-l-10 m-t-20"
          type="is-danger"
          pack="fal"
          size="is-smaller"
          icon-right="times"
          rounded
          @click="
            sets = [
              [0, 0],
              [0, 0],
              [0, 0],
            ]
          "
        >
          {{ $t('resetiraj') }}
        </b-button>
      </div>
    </div>
    <div
      v-else
      :class="{
        result__box: true,
      }"
    >
      <div class="result__header">
        <div class="modal-subtitle is-size-6 has-text-grey">{{ result.date | moment('D.M.Y.') }}</div>
        <div v-show="result.game_id !== null" class="x-tag has-background-primary m-r-5">{{ $t('natjecanje') }}</div>
      </div>
      <div v-if="result.players.length > 1">
        <p class="modal-subtitle">
          {{ result.players[0].display_name }}
        </p>
        <div class="comments__box">
          <div class="">
            <div
              :class="
                (!result.winner ? '' : 'is-won',
                {
                  result__score: true,
                  'm-b-5': true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[0] > set[1],
                      'is-set-live-selected': 'a' + index === selectedSet,
                    }"
                    @click="selectedSet = 'a' + index"
                  >
                    {{ set[0] }}
                  </div>
                </div>
              </span>
            </div>
            <div
              :class="
                (result.winner ? '' : 'is-won',
                {
                  result__score: true,
                })
              "
            >
              <span class="flex">
                <TennisImage :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in sets"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[1] > set[0],
                      'is-set-live-selected': 'b' + index === selectedSet,
                    }"
                    @click="selectedSet = 'b' + index"
                  >
                    {{ set[1] }}
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="fw600 is-size-55 has-text-black80 align__centar__y" @click="addInitialSet(false)">
              <b-icon icon="minus-circle" pack="fal" size="is-larger" type="is-danger" class="m-l-25"> </b-icon>
            </div>
            <div class="fw600 is-size-55 has-text-black80 align__centar__y" @click="addInitialSet(true)">
              <b-icon icon="plus-circle" pack="fal" size="is-larger" type="is-green" class="m-l-25"> </b-icon>
            </div>
          </div>
        </div>
        <p class="modal-subtitle">
          {{ result.players[1].display_name }}
        </p>
      </div>
      <div class="buttons">
        <b-button
          class="m-l-10 m-t-20"
          type="is-danger"
          pack="fal"
          size="is-smaller"
          icon-right="times"
          rounded
          @click="
            sets = [
              [0, 0],
              [0, 0],
              [0, 0],
            ]
          "
        >
          {{ $t('resetiraj') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'ResultBox',
  components: {
    TennisImage,
  },
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      test: 5,
      selectedSet: 'a0',
      sets: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      live: {
        sets: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      },
    }
  },
  computed: {
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
  watch: {
    sets() {
      this.$emit('update', this.sets)
    },
  },
  methods: {
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
      if (this.result.tie_break === undefined) {
        return
      }
      if (this.result.tie_break[set][0] !== 0 || this.result.tie_break[set][1] !== 0) {
        return this.result.tie_break[set][player]
      }
    },
    send(name) {
      this.$emit(name, this.result.id)
    },
  },
}
</script>
