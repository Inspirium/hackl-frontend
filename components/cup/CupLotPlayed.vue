<template>
  <div class="results cup-lots-played">
    <div class="activity__box">
      <div class="results__list">
        <div class="result__box relative m-b-0" :class="{ 'cup-not-verified': !game.result.verified_at }">
          <div class="flex justify-between">
            <p
              class="fw600 is-size-6"
              :class="[game.result.winner ? 'has-text-black30' : 'has-text-black80', isDoubles ? 'm-l-49' : 'm-l-41']"
            >
              <template v-if="game.players.length">
                <span
                  v-if="sameOrder"
                  class="is-size-7 has-text-lightblue x-tag is-white seed-tag-result-lot-1 radius__full nav__notification m-r-10"
                  :class="game.players[0].seed ? '' : 'display-none'"
                  >{{ game.players[0].seed ? game.players[0].seed : '' }}.</span
                >
                <span
                  v-else
                  :class="game.players[1].seed ? '' : 'display-none'"
                  class="is-size-7 has-text-lightblue x-tag is-white seed-tag-result-lot-1 radius__full nav__notification m-r-10"
                  >{{ game.players[1].seed ? game.players[1].seed : '' }}.</span
                >
              </template>
              {{ game.result.players[0].display_name }}
            </p>
            <p v-if="showDate" class="is-size-7 has-text-black50 fw600">
              {{ $moment(game.result.date).format('DD' + '.' + 'MM' + '.') }}
            </p>
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
                  @click="
                    $router.push(
                      isDoubles
                        ? localePath('/doubles/' + game.result.players[0].id)
                        : localePath('/player/' + game.result.players[0].players[0].id)
                    )
                  "
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
                        :size="[32, 32]"
                        :src="game.result.players[0].image"
                        class="user_image-small border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-else
                    :size="[32, 32]"
                    :src="game.result.players[0].image"
                    class="user_image-small m-r-5"
                    alt=""
                  />
                  <div class="result__score__box">
                    <div
                      v-for="(set, index) in game.result.sets"
                      v-show="set[0] > set[1] || set[0] < set[1]"
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
                    size="is-smaller"
                    class="m-r-10 m-l-5 m-t-5 is-size-6"
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
                  @click="
                    $router.push(
                      isDoubles
                        ? localePath('/doubles/' + game.result.players[1].id)
                        : localePath('/player/' + game.result.players[1].players[0].id)
                    )
                  "
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
                        class="user_image-small border__white--2 mr-3"
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
                      v-show="set[0] > set[1] || set[0] < set[1]"
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
                    size="is-smaller"
                    class="m-r-10 m-l-5 m-t-5 is-size-6"
                  >
                  </b-icon>
                </div>
              </div>
            </div>
            <template v-if="game.result.verified_at">
              <div class="align__centar__all">
                <div v-if="isAdmin || isligaadmin > 0" class="add__icon" @click="isMatchOptionsModal = true">
                  <b-icon v-show="true" icon="cog" type="is-grey" pack="fal" class="m-r-15"> </b-icon>
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
            </template>
            <template v-else>
              <div class="m-t-20 has-text-right">
                <b-icon v-show="true" icon="exclamation-circle" type="is-danger" pack="fal" class=""> </b-icon>
                <div class="fw600 is-size-65 has-text-danger">{{ $t('rezultatNijePotvren') }}</div>
              </div>
            </template>
          </div>
          <p
            class="fw600 is-size-6"
            :class="[!game.result.winner ? 'has-text-black30' : 'has-text-black80', isDoubles ? 'm-l-49' : 'm-l-41']"
          >
            <template v-if="game.players.length">
              <span
                v-if="sameOrder"
                class="is-size-7 has-text-lightblue x-tag is-white seed-tag-result-lot-2 radius__full nav__notification m-r-10"
                :class="game.players[1].seed ? '' : 'display-none'"
                >{{ game.players[1].seed ? game.players[1].seed : '' }}.</span
              >
              <span
                v-else
                :class="game.players[0].seed ? '' : 'display-none'"
                class="is-size-7 has-text-lightblue x-tag is-white seed-tag-result-lot-2 radius__full nav__notification m-r-10"
                >{{ game.players[0].seed ? game.players[0].seed : '' }}.</span
              >
            </template>
            {{ game.result.players[1].display_name }}
          </p>
          <template v-if="!game.result.verified_at">
            <div class="flex align__centar__x">
              <b-button
                v-if="canVerify || canVerifyPlayer"
                type="is-primary is-smaller-12 m-t-10 m-b-10"
                class="m-l-5"
                icon-right="check"
                pack="fal"
                rounded
                size="is-smaller"
                :loading="loading"
                @click="verifyResult()"
                >{{ $t('potvrdiRezultat') }}</b-button
              >
              <b-button
                v-if="isAdmin || isligaadmin > 0"
                class="softshadow has-text-black80 m-t-10 m-b-10"
                type="is-small noborder__small"
                icon-right="cog"
                pack="fal"
                rounded
                size="is-smaller"
                @click="isMatchOptionsModal = true"
                >{{ $t('opcije') }}</b-button
              >
            </div>
          </template>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalResultUpdate" :width="640" scroll="clip">
      <modalResult
        :result-update="game.result"
        :options="{ prepopulated: true, updateResult: true, bothPlayers: game.players }"
        :title="$t('upiiRezultat')"
      ></modalResult>
    </b-modal>

    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="game"
        :title="$t('rezultat')"
        :subtitle="$t('Ako je došlo do greške pri upisu rezultata imate sljedeće opcije:')"
        @update="updateResult($event)"
        @opa="test($event)"
      ></modalOptions>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import Result from '@/models/Result'
import modalResult from '~/components/modal/ModalResult'
import modalOptions from '~/components/modal/ModalMatchAdminOptions'

export default {
  name: 'CupLotsPlayed',
  components: {
    modalOptions,
    modalResult,
    TennisImage,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
    isligaadmin: {
      type: Number,
      required: false,
      default: 0,
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
  data() {
    return {
      isMatchOptionsModal: false,
      isModalResultUpdate: false,
      loading: false,
    }
  },
  computed: {
    sameOrder() {
      return this.game.result.players[0].id === this.game.players[0].id
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    canVerify() {
      return (
        (!this.game.result.verified_at && this.$store.state.auth.user.id === this.game.result.players[1].id) ||
        (!this.game.result.verified_at && (this.isAdmin || this.isligaadmin > 0))
      )
    },
    canVerifyPlayer() {
      if (!this.isDoubles && this.isNotVerified) {
        return (
          (this.game.result.players[0].pivot.verified === 0 && this.user.team.id === this.game.result.players[0].id) ||
          (this.game.result.players[0].pivot.verified === 1 && this.user.team.id === this.game.result.players[1].id) ||
          (this.isNotVerified && this.isAdmin)
        )
      } else if (
        this.isDoubles &&
        this.isNotVerified &&
        this.game.result.players[0].pivot.verified === 0 &&
        (this.game.result.players[0].players[0].id === this.user.id ||
          this.game.result.players[0].players[1].id === this.user.id)
      ) {
        return true
      } else if (
        this.isDoubles &&
        this.isNotVerified &&
        this.game.result.players[0].pivot.verified === 1 &&
        (this.game.result.players[1].players[0].id === this.user.id ||
          this.game.result.players[1].players[1].id === this.user.id)
      ) {
        return true
      }
      return false
    },
    isNotVerified() {
      if (this.game.result.non_member) {
        return true
      }
      return this.game.result.verified_at === null
    },
  },
  methods: {
    test(event) {
      this.$emit('verified')
    },
    verifyResult() {
      this.loading = true
      this.$emit('verified')
      const r = new Result({ id: this.game.result.id })
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('verified')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    updateResult(event) {
      if (event === 1) {
        this.isModalResultUpdate = true
      } else if (event === 0) {
        const r = new Result({ id: this.game.result.id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.$emit('refresh')
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
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
.results__list >>> p.modal-subtitle {
  margin-left: 41px;
  padding: 2px 0;
}
</style>
