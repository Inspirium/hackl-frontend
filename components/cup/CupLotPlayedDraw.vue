<template>
  <div class="cup-lots-played flex">
    <div class="bracket-item">
      <div class="results__list results__list-draw">
        <div class="relative m-b-0" :class="{ 'cup-not-verified': !game.result.verified_at }">
          <div class="flex justify-between">
            <p
              class="fw600 is-size-6"
              :class="[game.result.winner ? 'has-text-black30' : 'has-text-black80', isDoubles ? 'm-l-49' : 'm-l-41']"
            ></p>
            <p v-if="showDate" class="is-size-7 has-text-black50 fw600">
              {{ $moment(game.result.date).format('DD' + '.' + 'MM' + '.') }}
            </p>
          </div>
          <div class="">
            <div class="flex flex-column-reverse">
              <div
                :class="
                  (!game.winner ? '' : 'is-won',
                  {
                    result__score: true,
                    'm-b-2 m-t-2': true,
                  })
                "
              >
                <div
                  class="result__score__flex align__centar__y"
                  @click="
                    $router.push(
                      isDoubles
                        ? localePath('/doubles/' + game.result.players[0].id)
                        : localePath('/player/' + game.result.players[0].players[0].id)
                    )
                  "
                >
                  <template v-if="game.players.length">
                    <span
                      v-if="sameOrder"
                      class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
                      :class="game.players[0].seed ? '' : 'display-none'"
                      >{{ game.players[0].seed ? game.players[0].seed : '' }}</span
                    >
                    <span
                      v-else
                      :class="game.players[1].seed ? '' : 'display-none'"
                      class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
                      >{{ game.players[1].seed ? game.players[1].seed : '' }}</span
                    >
                  </template>
                  <!--                  <div class="fw600 is-size-65" :class="game.result.winner ? 'has-text-black30' : 'has-text-black80'">-->
                  <!--                    {{-->
                  <!--                      game.result.players[0].players[0].first_name[0] +-->
                  <!--                      '. ' +-->
                  <!--                      game.result.players[0].players[0].last_name-->
                  <!--                    }}-->
                  <!--                  </div>-->
                  <div
                    v-if="!isDoubles"
                    class="fw600 is-size-65 whitespace w100 overflowhidden"
                    :class="game.result.winner ? 'has-text-black30' : 'has-text-black80'"
                  >
                    {{
                      game.result.players[0].players[0].first_name[0] +
                      '. ' +
                      game.result.players[0].players[0].last_name
                    }}
                  </div>
                  <div
                    v-else
                    class="fw600 is-size-65 whitespace w100 overflowhidden"
                    :class="game.result.winner ? 'has-text-black30' : 'has-text-black80'"
                  >
                    {{ game.players[0].players[0].last_name + ' - ' + game.players[0].players[1].last_name }}
                  </div>
                  <div class="result__score__box m-l-auto">
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
                </div>
              </div>
              <div
                :class="
                  (game.winner ? '' : 'is-won',
                  {
                    result__score: true,
                    'm-b-2 m-t-2': true,
                  })
                "
              >
                <div
                  class="result__score__flex align__centar__y"
                  @click="
                    $router.push(
                      isDoubles
                        ? localePath('/doubles/' + game.result.players[1].id)
                        : localePath('/player/' + game.result.players[1].players[0].id)
                    )
                  "
                >
                  <template v-if="game.players.length">
                    <span
                      v-if="sameOrder"
                      class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
                      :class="game.players[1].seed ? '' : 'display-none'"
                      >{{ game.players[1].seed ? game.players[1].seed : '' }}</span
                    >
                    <span
                      v-else
                      :class="game.players[0].seed ? '' : 'display-none'"
                      class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
                      >{{ game.players[0].seed ? game.players[0].seed : '' }}</span
                    >
                  </template>

                  <!--                  <div class="fw600 is-size-65" :class="!game.result.winner ? 'has-text-black30' : 'has-text-black80'">-->
                  <!--                    {{-->
                  <!--                      game.result.players[1].players[0].first_name[0] +-->
                  <!--                      '. ' +-->
                  <!--                      game.result.players[1].players[0].last_name-->
                  <!--                    }}-->
                  <!--                  </div>-->
                  <div
                    v-if="!isDoubles"
                    class="fw600 is-size-65 whitespace w100 overflowhidden"
                    :class="!game.result.winner ? 'has-text-black30' : 'has-text-black80'"
                  >
                    {{
                      game.result.players[1].players[0].first_name[0] +
                      '. ' +
                      game.result.players[1].players[0].last_name
                    }}
                  </div>
                  <div
                    v-else
                    class="fw600 is-size-65 whitespace w100 overflowhidden"
                    :class="!game.result.winner ? 'has-text-black30' : 'has-text-black80'"
                  >
                    {{ game.players[0].players[0].last_name + ' - ' + game.players[1].players[0].last_name }}
                  </div>
                  <div class="result__score__box m-l-auto">
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
                </div>
              </div>
            </div>
            <template v-if="!game.result.verified_at">
              <div class="m-t-20 has-text-right">
                <b-icon v-show="true" icon="exclamation-circle" type="is-danger" pack="fal" class=""> </b-icon>
                <div class="fw600 is-size-65 has-text-danger">{{ $t('rezultatNijePotvren') }}</div>
              </div>
            </template>
          </div>
          <p
            class="fw600 is-size-6"
            :class="[!game.result.winner ? 'has-text-black30' : 'has-text-black80', isDoubles ? 'm-l-49' : 'm-l-41']"
          ></p>
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
// import TennisImage from '@/components/TennisImage.vue'

import Result from '@/models/Result'
import modalResult from '~/components/modal/ModalResult'
import modalOptions from '~/components/modal/ModalMatchAdminOptions'

export default {
  name: 'CupLotsPlayed',
  components: {
    modalOptions,
    modalResult,
    // TennisImage,
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
      showDate: false,
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
