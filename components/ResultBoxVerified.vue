<template>
  <div>
    <div :class="{ result__box: true, unverified: result.verified === null }">
      <div class="result__header">
        <div class="modal-subtitle is-size-6 has-text-grey" @click="winner">
          {{ result.created_at | moment('D.M.Y.') }}
        </div>
        <template v-if="false">
          <div v-if="result.teams[0].number_of_players === 2" class="m-r-10 flex gap-1">
            <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
            <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
          </div>
        </template>
        <div v-show="result.verified === null" class="x-tag has-background-danger m-r-5">{{ $t('nepotvreno') }}</div>
        <div class="x-tag is-clay">{{ $t(result.surface.title) }}</div>
      </div>
      <div v-if="result.players.length > 1">
        <p :class="{ 'm-l-0': isDoubles }">
          {{ result.players[0].display_name }}
        </p>
        <div class="comments__box">
          <div class="">
            <div :class="(!result.winner ? '' : 'is-won', { result__score: true, 'm-b-5': true })">
              <nuxt-link :to="localePath(result.players[0].link)">
                <template v-if="isDoubles" class="for-doubles">
                  <div
                    v-if="result.players[0].image === 'https://api.tenis.plus/images/user.svg' && result.players.length"
                    class="flex min-w-65"
                  >
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].players[1].image"
                      class="user_image m-l--30 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="flex min-w-65">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                  </div>
                </template>
                <TennisImage v-else :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in result.sets"
                    v-show="set[0] !== set[1]"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[0] > set[1],
                      'is-set-lose': !winner,
                    }"
                  >
                    {{ set[0] }}<span class="tie-break__num__display">{{ displayTieBreak(index, 0) }}</span>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div :class="(result.winner ? '' : 'is-won', { result__score: true })">
              <nuxt-link :to="localePath(result.players[0].link)">
                <template v-if="isDoubles" class="for-doubles">
                  <div
                    v-if="result.players[1].image === 'https://api.tenis.plus/images/user.svg' && result.players.length"
                    class="flex min-w-65"
                  >
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].players[1].image"
                      class="user_image m-l--30 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="flex min-w-65">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                  </div>
                </template>

                <TennisImage v-else :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-5" alt="" />
                <div class="result__score__box">
                  <div
                    v-for="(set, index) in result.sets"
                    v-show="set[0] !== set[1]"
                    :key="'set' + index"
                    :class="{
                      result__score__item: true,
                      'is-set': set[1] > set[0],
                      'is-set-lose': winner,
                    }"
                  >
                    {{ set[1] }}<span class="tie-break__num__display">{{ displayTieBreak(index, 1) }}</span>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="results__comments">
            <div class="buttons">
              <div class="results__comments__number">
                {{ result.comment_count }}
              </div>
              <b-icon icon="comment-alt" pack="fal"> </b-icon>
            </div>
          </div>
        </div>
        <p :class="{ 'm-l-0': isDoubles }">
          {{ result.players[1].display_name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
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
      default() {
        return {}
      },
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      won: null,
    }
  },
  computed: {
    winner() {
      let p1 = 0
      let p2 = 0
      _.forEach(this.result.sets, (set) => {
        if (set[0] > set[1]) {
          p1++
        }
        if (set[0] < set[1]) {
          p2++
        }
      })
      if (p1 > p2) {
        return true
      }
      return false
    },
  },
  watch: {
    result: {
      handler() {
        this.winner()
      },
    },
  },
  methods: {
    displayTieBreak(set, player) {
      // ako je tie-break
      if (this.result.tie_break === undefined) {
        return
      }
      if (Math.abs(this.result.sets[set][0] - this.result.sets[set][1]) === 1) {
        // ako je tie-break upisan
        if (this.result.tie_break[set][0] !== 0 || this.result.tie_break[set][1] !== 0) {
          return this.result.tie_break[set][player]
        }
      }
    },
  },
}
</script>
