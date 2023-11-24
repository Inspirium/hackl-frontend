<template>
  <div v-if="result.players[1] !== undefined">
    <transition name="fade">
      <div
        :class="{
          result__box: true,
          relative: true,
          unverified: isNotVerified && !stream && !isVerified,
          disable_opaq_2: isDeleted,
          disable_opaq_5: isDisputed,
        }"
      >
        <div v-if="!stream" class="result__header">
          <!--      Universal club-->
          <template v-if="$store.state.club.id === 26">
            <TennisImage
              v-if="filteredClubs[result.club_id]"
              :size="[42, 42]"
              :src="filteredClubs[result.club_id].logo"
              class="user_image-small border__white--2 m-l--5 m-r-5 m-t--5"
              alt=""
            />
          </template>
          <div class="modal-subtitle is-size-09 has-text-black30">
            {{ result.created_at | moment('D.M.Y.') }}
          </div>
          <div v-if="result.teams[0].number_of_players === 2" class="m-r-10 flex gap-1">
            <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
            <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
          </div>
          <div v-show="isNotVerified && !isVerified" class="x-tag has-background-danger m-r-5">
            {{ $t('nepotvreno') }}
          </div>
          <div v-show="result.game" class="x-tag has-background-primary m-r-5">{{ $t(typeName()) }}</div>
          <div v-if="result.surface !== null" :class="['badge', 'badge-' + result.surface.badge, 'x-tag']">
            {{ $t(result.surface.title) }}
          </div>
        </div>
        <div v-if="result.players.length > 1">
          <p class="modal-subtitle" :class="{ 'm-l-0': result.teams[0].number_of_players === 2 }">
            {{ result.players[0].display_name }}
            <span v-if="result.verified" :class="!result.winner ? '' : 'has-text-danger'">{{
              $t('bodova4', { expr: !result.winner ? ' +' : '-', expr_2: Math.round(result.points * 100) / 100 })
            }}</span>
          </p>
          <div class="comments__box">
            <nuxt-link :to="localePath('/result/' + result.id)" class="results__comments">
              <div
                :class="
                  (!result.winner ? '' : 'is-won',
                  {
                    result__score: true,
                    'm-b-5': true,
                  })
                "
              >
                <div class="flex">
                  <template v-if="result.teams[0].number_of_players === 2" class="for-doubles">
                    <div
                      v-if="
                        result.players[0].image === 'https://api.tenis.plus/images/user.svg' && result.players.length
                      "
                      class="flex min-w-65"
                    >
                      <TennisImage
                        :src="result.players[0].players[0].image"
                        :size="[42, 42]"
                        class="user_image border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :src="result.players[0].players[1].image"
                        :size="[42, 42]"
                        class="user_image m-l--20 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="flex min-w-65">
                      <TennisImage
                        :src="result.players[0].image"
                        :size="[42, 42]"
                        class="user_image border__white--2"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-else
                    :src="result.players[0].image"
                    :size="[42, 42]"
                    class="user_image m-r-5"
                    :alt="result.players[0].display_name"
                  />
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
                  <b-icon
                    v-if="!result.winner"
                    icon="check"
                    type="is-darkgreen"
                    pack="fal"
                    size="is-medium"
                    class="m-r-10 m-t-10 m-l-5 is-size-6"
                  >
                  </b-icon>
                </div>
              </div>
              <div
                :class="
                  (result.winner ? '' : 'is-won',
                  {
                    result__score: true,
                  })
                "
              >
                <div class="flex">
                  <template v-if="result.teams[1].number_of_players === 2" class="for-doubles">
                    <div
                      v-if="
                        result.players[1].image === 'https://api.tenis.plus/images/user.svg' && result.players.length
                      "
                      class="flex min-w-65"
                    >
                      <TennisImage
                        :src="result.players[1].players[0].image"
                        :size="[42, 42]"
                        class="user_image border__white--2"
                        :alt="result.players[1].players[0].display_name"
                      />
                      <TennisImage
                        :src="result.players[1].players[1].image"
                        class="user_image m-l--20 border__white--2"
                        :alt="result.players[1].players[1].display_name"
                        :size="[42, 42]"
                      />
                    </div>
                    <div v-else class="flex min-w-65">
                      <TennisImage
                        :src="result.players[1].image"
                        :size="[42, 42]"
                        class="user_image border__white--2"
                        alt=""
                      />
                    </div>
                  </template>
                  <TennisImage v-else :src="result.players[1].image" :size="[42, 42]" class="user_image m-r-5" alt="" />
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
                  <b-icon
                    v-if="result.winner"
                    icon="check"
                    type="is-darkgreen"
                    pack="fal"
                    size="is-medium"
                    class="m-r-10 m-t-10 m-l-5 is-size-6"
                  >
                  </b-icon>
                </div>
              </div>
            </nuxt-link>
            <nuxt-link v-if="!stream" :to="localePath('/result/' + result.id)" class="results__comments">
              <div class="buttons">
                <div class="results__comments__number">
                  {{ result.comment_count }}
                </div>
                <b-icon icon="comment-alt" pack="fal"></b-icon>
              </div>
            </nuxt-link>
          </div>
          <p class="modal-subtitle" :class="{ 'm-l-0': result.teams[0].number_of_players === 2 }">
            {{ result.players[1].display_name }}
            <span v-if="result.verified" :class="result.winner ? '' : 'has-text-danger'">{{
              $t('bodova4', { expr: !result.winner ? ' -' : '+', expr_2: Math.round(result.points * 100) / 100 })
            }}</span>
          </p>
        </div>
        <div v-if="isAdmin && showOptions" class="add__icon result__box--admin" @click="openModalAdmin">
          <b-icon v-show="true" icon="cog" type="is-grey" pack="fal" class="cup__add-result"></b-icon>
          <!--        <b-icon v-show="!game.isPlayed" icon="cog" type="is-grey" pack="fal" class="m-r-10 cup__add-result">-->
          <!--        </b-icon>-->
        </div>
        <div v-if="!isDisputed" class="buttons">
          <b-button
            v-if="canDelete && isAdmin"
            type="is-danger is-smaller-12 m-t-20 m-b-10"
            pack="fal"
            size="is-smaller"
            icon-right="times"
            rounded
            :loading="loading"
            @click.prevent="deleteResult()"
          >
            {{ $t('obrii') }}
          </b-button>
          <b-button
            v-if="canDispute && !isVerified"
            class="m-l-5 m-t-20"
            type="is-danger"
            pack="fal"
            size="is-smaller"
            icon-right="times"
            rounded
            :loading="loading1"
            @click.prevent="disputeResult()"
          >
            {{ $t('osporiRezultat') }}
          </b-button>
          <b-button
            v-if="(canVerify && !isVerified) || (isAdmin && isNotVerified)"
            class="m-l-5 m-t-20"
            type="green removeborder is-smaller-12 m-b-10"
            pack="fal"
            size="is-smaller"
            icon-right="check"
            rounded
            :loading="loading2"
            @click.prevent="verifyResult()"
          >
            {{ $t('potvrdiRezultat') }}
          </b-button>
        </div>
        <transition name="slidea">
          <div
            v-if="isVerified"
            class="fw600 green is-size-5 has-text-centered has-text-white p-t-5 p-b-5 radius__full"
          >
            {{ $t('rezultatJePotvren') }}
          </div>
        </transition>
        <transition name="slidea">
          <div
            v-if="isDisputed"
            class="fw600 m-t-10 has-background-danger is-size-5 has-text-centered has-text-white p-t-5 p-b-5 radius__full"
          >
            {{ $t('rezultatJeOsporen') }}
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'

import Result from '@/models/Result'
import Club from '@/models/Club'
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'ResultBox',
  components: { TennisImage },
  props: {
    result: {
      type: Object,
      required: true,
    },
    stream: {
      type: Boolean,
      requried: false,
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
      loading: false,
      loading1: false,
      loading2: false,
      isDeleted: false,
      isVerified: false,
      isDisputed: false,
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
          this.result.teams[0].players[0].id === this.user.id || this.result.teams[1].players[0]?.id === this.user.id
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
  methods: {
    getClubs() {
      if (this.$store.state.club.id === 26) {
        Club.limit(200)
          .get()
          .then((res) => {
            this.clubs = res.data
          })
      }
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
    openModalAdmin() {
      this.$emit('openItAdmin', this.result)
    },
    verifyResult() {
      this.loading2 = true
      const r = new Result({ id: this.result.id })
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loading2 = false
          this.isVerified = true
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading2 = false
        })
    },
    disputeResult() {
      this.loading1 = true
      const r = new Result({ id: this.result.id })
      Result.custom(r, 'dispute')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste osporili rezultat'),
            type: 'is-success',
          })
          this.loading1 = false
          this.isDisputed = true
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
    deleteResult() {
      const r = new Result({ id: this.result.id })
      r.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali rezultat'),
            type: 'is-success',
          })
          this.isDeleted = true
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
