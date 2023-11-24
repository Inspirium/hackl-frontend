<template>
  <div class="results cup-lots-played">
    <div class="activity__box">
      <div class="results__list">
        <div class="result__box m-b-0">
          <div class="flex justify-between">
            <p class="fw600 is-size-6 p-t-2 p-b-2" :class="isDoubles ? ' m-l-49' : ' m-l-41'">
              {{ game.result.players[0].display_name }}
            </p>
            <p v-if="showDate" class="is-size-7 has-text-black50 fw600">
              {{ $moment(game.result.date).format('DD' + '.' + 'MM' + '.') }}
            </p>
            <p v-if="$auth.user.id === 1">{{ game.id }}</p>
          </div>
          <div class="comments__box">
            <div class="">
              <div
                :class="
                  (!game.winner ? '' : 'is-won',
                  {
                    result__score: true,
                    'm-b-5': true,
                  })
                "
              >
                <div
                  class="result__score__flex"
                  @click="$router.push(localePath('/liga/' + $route.params.id + '/' + game.players[0].id))"
                >
                  <template v-if="isDoubles" class="for-doubles">
                    <div
                      v-if="
                        game.result.players[0].image === 'https://api.tenis.plus/images/user.svg' &&
                        game.result.players.length
                      "
                      class="flex min-w-45"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[0].players[0].image"
                        class="user_image-small border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[0].players[1].image"
                        class="user_image-small m-l--20 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="flex min-w-45">
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[0].image"
                        class="user_image-small border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-else
                    :size="[42, 42]"
                    :src="game.result.players[0].image"
                    class="user_image-small m-r-5"
                    alt=""
                  />
                  <div class="result__score__box">
                    <div
                      v-for="(set, index) in game.result.sets"
                      v-show="set[0] !== set[1]"
                      :key="'set' + index"
                      :class="{
                        'result__score__item-small': true,
                        'is-set': set[0] > set[1],
                        'is-set-lose': game.result.winner,
                      }"
                    >
                      {{ set[0] }}<span class="tie-break__num__display">{{ displayTieBreak(index, 0) }}</span>
                    </div>
                  </div>
                  <b-icon
                    v-if="!game.result.winner"
                    icon="check"
                    type="is-darkgreen"
                    pack="fal"
                    size="is-medium"
                    class="m-r-10 m-l-5 is-size-6"
                  >
                  </b-icon>
                </div>
              </div>
              <div
                :class="
                  (game.winner ? '' : 'is-won',
                  {
                    result__score: true,
                  })
                "
              >
                <div
                  class="result__score__flex"
                  @click="$router.push(localePath('/liga/' + $route.params.id + '/' + game.players[1].id))"
                >
                  <template v-if="isDoubles" class="for-doubles">
                    <div
                      v-if="
                        game.result.players[1].image === 'https://api.tenis.plus/images/user.svg' &&
                        game.result.players.length
                      "
                      class="flex min-w-45"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[1].players[0].image"
                        class="user_image-small border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[1].players[1].image"
                        class="user_image-small m-l--20 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="flex min-w-45">
                      <TennisImage
                        :size="[42, 42]"
                        :src="game.result.players[1].image"
                        class="user_image-small border__white--2 m-r-3"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-else
                    :size="[42, 42]"
                    :src="game.result.players[1].image"
                    class="user_image-small m-r-5"
                    alt=""
                  />
                  <div class="result__score__box">
                    <div
                      v-for="(set, index) in game.result.sets"
                      v-show="set[0] !== set[1]"
                      :key="'set' + index"
                      :class="{
                        'result__score__item-small': true,
                        'is-set': set[1] > set[0],
                        'is-set-lose': !game.result.winner,
                      }"
                    >
                      {{ set[1] }}<span class="tie-break__num__display">{{ displayTieBreak(index, 1) }}</span>
                    </div>
                  </div>
                  <b-icon
                    v-if="game.result.winner"
                    icon="check"
                    type="is-darkgreen"
                    pack="fal"
                    size="is-medium"
                    class="m-r-10 m-l-5 is-size-6"
                  >
                  </b-icon>
                </div>
              </div>
            </div>
            <nuxt-link
              v-show="game.result.played_at !== null"
              :to="localePath('/result/' + game.result.id)"
              class="results__comments"
            >
              <div class="buttons">
                <div class="results__comments__number">
                  {{ game.result.comment_count }}
                </div>
                <b-icon icon="comment-alt" pack="fal"> </b-icon>
              </div>
            </nuxt-link>
          </div>
          <p class="fw600 is-size-6 p-t-2 p-b-2" :class="isDoubles ? ' m-l-49' : ' m-l-41'">
            {{ game.result.players[1].display_name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'LigaLotsPlayed',
  components: {
    TennisImage,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
    showDate: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    displayTieBreak(set, player) {
      // ako je tie-break
      if (this.game.result.tie_break === undefined) {
        return
      }
      if (
        this.game.result.tie_break !== undefined &&
        Math.abs(this.game.result.sets[set][0] - this.game.result.sets[set][1]) === 1
      ) {
        // ako je tie-break upisan
        if (this.game.result.tie_break[set][0] !== 0 || this.game.result.tie_break[set][1] !== 0) {
          return this.game.result.tie_break[set][player]
        }
      }
    },
  },
}
</script>

<style scoped>
.tie-break__num__display {
  font-size: 0.7rem;
  margin-left: 0px;
  margin-top: -14px;
}
.results__list >>> .result__score__item-small {
  height: 32px;
}
</style>
