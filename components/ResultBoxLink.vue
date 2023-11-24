<template>
  <div v-if="Object.keys(result).length">
    <div
      :class="{
        result__box: true,
        unverified: isNotVerified,
      }"
    >
      <div class="result__header">
        <template v-if="$store.state.club.id === 26">
          <TennisImage
            v-if="filteredClubs[result.club_id]"
            :size="[42, 42]"
            :src="filteredClubs[result.club_id].logo"
            class="user_image-small border__white--2 m-l--5 m-r-5 m-t--5"
            alt=""
          />
        </template>

        <div class="modal-subtitle is-size-6 has-text-grey">
          {{ result.created_at | moment('D.M.Y.') }}
        </div>
        <div v-if="result.teams[0].number_of_players === 2" class="m-r-10 flex gap-1">
          <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
          <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
        </div>
        <div v-show="isNotVerified" class="x-tag has-background-danger m-r-5">{{ $t('nepotvreno') }}</div>
        <div v-show="result.game_id !== null" class="x-tag has-background-primary m-r-5">{{ $t(typeName()) }}</div>

        <div v-if="result.surface !== null" :class="['badge', 'badge-' + result.surface.badge, 'x-tag']">
          {{ $t(result.surface.title) }}
        </div>
      </div>
      <div v-if="result.players.length > 1">
        <p class="modal-subtitle" :class="{ 'm-l-0': result.teams[0].number_of_players === 2 }">
          {{ result.players[0].display_name }}
          <span v-if="result.verified" :class="!result.winner ? '' : 'has-text-danger'">{{
            $t('bodova6', { expr: !result.winner ? ' +' : '-', points: result.points })
          }}</span>
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
              <nuxt-link
                :to="
                  localePath(
                    result.teams[0].number_of_players === 2
                      ? '/doubles/' + result.players[0].id
                      : result.players[0].players[0].link
                  )
                "
              >
                <template v-if="result.teams[0].number_of_players === 2" class="for-doubles">
                  <div
                    v-if="result.players[0].image === 'https://api.tenis.plus/images/user.svg' && result.players.length"
                    class="flex"
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
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].image"
                      class="user_image border__white--2 mr-3"
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
                      'is-set-lose': result.winner,
                    }"
                  >
                    {{ set[0]
                    }}<span v-if="result.tie_break.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 0)
                    }}</span>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div
              :class="
                (result.winner ? '' : 'is-won',
                {
                  result__score: true,
                })
              "
            >
              <nuxt-link
                :to="
                  localePath(
                    result.teams[0].number_of_players === 2
                      ? '/doubles/' + result.players[1].id
                      : result.players[1].players[0].link
                  )
                "
              >
                <template v-if="result.teams[0].number_of_players === 2" class="for-doubles">
                  <div
                    v-if="result.players[1].image === 'https://api.tenis.plus/images/user.svg' && result.players.length"
                    class="flex"
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
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].image"
                      class="user_image border__white--2 mr-3"
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
                      'is-set-lose': !result.winner,
                    }"
                  >
                    {{ set[1]
                    }}<span v-if="result.tie_break.length" class="tie-break__num__display">{{
                      displayTieBreak(index, 1)
                    }}</span>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <nuxt-link :to="localePath('/result/' + result.id)" class="results__comments">
            <div class="buttons">
              <div class="results__comments__number">
                {{ result.comment_count }}
              </div>
              <b-icon icon="comment-alt" pack="fal"> </b-icon>
            </div>
          </nuxt-link>
        </div>
        <p class="modal-subtitle" :class="{ 'm-l-0': result.teams[0].number_of_players === 2 }">
          {{ result.players[1].display_name }}
          <span v-if="result.verified" :class="result.winner ? '' : 'has-text-danger'">{{
            $t('bodova6', { expr: !result.winner ? ' -' : '+', points: result.points })
          }}</span>
        </p>
      </div>
      <div v-if="isAdmin && showOptions" class="add__icon result__box--admin" @click="isMatchOptionsModal = true">
        <b-icon v-show="true" icon="cog" type="is-grey" pack="fal" class="cup__add-result"></b-icon>
        <!--        <b-icon v-show="!game.isPlayed" icon="cog" type="is-grey" pack="fal" class="m-r-10 cup__add-result">-->
        <!--        </b-icon>-->
      </div>
      <div class="buttons">
        <b-button
          v-if="canDelete && isAdmin"
          type="is-danger is-smaller-12 m-t-20 m-b-10"
          pack="fal"
          size="is-smaller"
          icon-right="times"
          rounded
          @click.prevent="$emit('delete', result.id)"
        >
          {{ $t('obrii') }}
        </b-button>
        <b-button
          v-if="canDispute"
          class="m-l-5"
          type="is-danger removeborder is-smaller-12 m-t-20 m-b-10"
          pack="fal"
          size="is-smaller"
          icon-right="times"
          rounded
          @click.prevent="$emit('dispute', result.id)"
        >
          {{ $t('osporiRezultat') }}
        </b-button>
        <b-button
          v-if="canVerify || (isAdmin && isNotVerified)"
          class="m-l-5 m-t-20"
          type="green removeborder is-smaller-12 m-b-10"
          pack="fal"
          size="is-smaller"
          icon-right="check"
          rounded
          :loading="loadingConfirm"
          @click.prevent="$emit('confirm', result.id)"
        >
          {{ $t('potvrdiRezultat') }}
        </b-button>
      </div>
    </div>
    <b-modal :active.sync="isModalResultUpdate" :width="640" scroll="clip">
      <modalResult
        :result-update="result"
        :options="{ prepopulated: true, updateResult: true, bothPlayers: result.players }"
        :title="$t('upiiRezultat')"
        @close="getResult()"
      ></modalResult>
    </b-modal>
    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="result"
        :title="$t('rezultat')"
        :subtitle="$t('Ako je došlo do greške pri upisu rezultata imate sljedeće opcije:')"
        @update="updateResult($event)"
      ></modalOptions>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
// import _ from 'lodash'
import Result from '@/models/Result'
import Club from '@/models/Club'
import modalOptions from '~/components/modal/ModalMatchAdminOptions'
import modalResult from '~/components/modal/ModalResult'

export default {
  name: 'ResultBoxLink',
  components: {
    TennisImage,
    modalResult,
    modalOptions,
  },
  props: {
    resultProp: {
      type: Object,
      required: false,
      default() {},
    },
    stream: {
      type: Boolean,
      requried: false,
    },
    loadingConfirm: {
      type: Boolean,
      requried: false,
      default: false,
    },
    showOptions: {
      type: Boolean,
      requried: false,
      default: false,
    },
  },
  async fetch() {
    await this.getClubs()
  },
  data() {
    return {
      isMatchOptionsModal: false,
      isModalResultUpdate: false,
      loading: false,
      loading1: false,
      loading2: false,
      result: {},
      clubs: [],
    }
  },
  computed: {
    filteredClubs() {
      const obj = {}
      for (let i = 0; i < this.clubs.length; i++) {
        const element = this.clubs[i]
        obj[element.id] = element
      }
      return obj
    },
    test() {
      return this.result.tie_break
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
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
    canDispute() {
      if (this.result.non_member) {
        return false
      }
      return !this.result.verified && !this.result.players[1].pivot.verified && this.playerIsInMatch
    },
    isDoubles() {
      return this.result.teams[0].players.length === 2
    },
    playerIsInMatch() {
      if (this.result.non_member) {
        return false
      }
      if (!this.isDoubles) {
        return (
          this.result.teams[0].players[0].id === this.user.id || this.result.teams[1].players[0].id === this.user.id
        )
      } else {
        return (
          this.result.teams[0].players[0].id === this.user.id ||
          this.result.teams[0].players[1].id === this.user.id ||
          this.result.teams[1].players[0].id === this.user.id ||
          this.result.teams[1].players[1].id === this.user.id
        )
      }
    },
    canVerify() {
      if (this.result.non_member) {
        return false
      }
      if (!this.isDoubles && this.isNotVerified) {
        return (
          (this.result.players[0].pivot.verified === 0 && this.user.team.id === this.result.players[0].id) ||
          (this.result.players[0].pivot.verified === 1 && this.user.team.id === this.result.players[1].id) ||
          (this.isNotVerified && this.isAdmin)
        )
      } else if (
        this.isDoubles &&
        this.isNotVerified &&
        this.result.players[0].pivot.verified === 0 &&
        (this.result.players[0].players[0].id === this.user.id || this.result.players[0].players[1].id === this.user.id)
      ) {
        return true
      } else if (
        this.isDoubles &&
        this.isNotVerified &&
        this.result.players[0].pivot.verified === 1 &&
        (this.result.players[1].players[0].id === this.user.id || this.result.players[1].players[1].id === this.user.id)
      ) {
        return true
      }
      return false
    },
    isNotVerified() {
      if (this.result.non_member) {
        return true
      }
      return this.result.verified_at === null
    },
  },
  watch: {
    resultProps: {
      immediate: true,
      handler() {
        this.getResult()
      },
    },
  },
  methods: {
    updateResult(event) {
      if (event === 1) {
        this.isModalResultUpdate = true
      } else if (event === 0) {
        const r = new Result({ id: this.result.id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.$router.push(this.localePath('/result/'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
    getClubs() {
      Club.get().then((res) => {
        this.clubs = res.data
      })
    },
    typeName() {
      if (this.result.game) {
        switch (this.result.game.type_type) {
          case 'App\\Models\\TournamentRound':
            return 'Turnir'
          case 'App\\Models\\League\\Group':
            return 'Liga'
          case 'App\\Notifications\\NewReservation':
            return 'Rezervacija'
        }
        return ''
      }
    },
    getResult() {
      Result.include(['game'])
        .find(this.$route.params.id)
        .then((res) => {
          this.result = res
        })
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
