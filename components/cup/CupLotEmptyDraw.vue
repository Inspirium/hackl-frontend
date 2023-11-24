<template>
  <div class="bracket-item flex align__centar__y">
    <div class="live__action__box w100 flex-wrap">
      <div class="flex flex-column-reverse align__centar__x">
        <div
          v-if="player1"
          class="align__centar__y m-t-2 m-b-2"
          @click="
            $router.push(
              isDoubles
                ? localePath('/doubles/' + game.players[0].id)
                : localePath('/player/' + game.players[0].players[0].id)
            )
          "
        >
          <!--          <div v-if="isDoubles" class="for-doubles">-->
          <!--            <div-->
          <!--              v-if="game.players[0].image === 'https://api.tenis.plus/images/user.svg' && game.players.length"-->
          <!--              class="list__img"-->
          <!--            >-->
          <!--              <TennisImage-->
          <!--                :size="[42, 42]"-->
          <!--                :src="game.players[0].players[0].image"-->
          <!--                class="user_image border__white&#45;&#45;2"-->
          <!--                alt=""-->
          <!--              />-->
          <!--              <TennisImage-->
          <!--                :size="[42, 42]"-->
          <!--                :src="game.players[0].players[1].image"-->
          <!--                class="user_image m-l&#45;&#45;20 border__white&#45;&#45;2"-->
          <!--                alt=""-->
          <!--              />-->
          <!--            </div>-->
          <!--            <div v-else class="list__img">-->
          <!--              <TennisImage :size="[42, 42]" :src="game.players[0].image" class="user_image border__white&#45;&#45;2" alt="" />-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          <TennisImage v-else :size="[32, 32]" :src="game.players[0].image" class="user_image-small m-r-10" alt="" />-->
          <span
            v-if="game.players[0].seed"
            class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
            >{{ game.players[0].seed }}</span
          >
          <!--          <h3 class="is-size-6 fw600" :class="game.is_surrendered === 1 ? 'has-text-black30' : 'has-text-black80'">-->
          <!--            {{ game.players[0].display_name }}-->
          <!--          </h3>-->
          <div
            v-if="!isDoubles"
            class="fw600 is-size-65"
            :class="game.is_surrendered === 1 ? 'has-text-black30' : 'has-text-black80'"
          >
            {{ game.players[0].players[0].first_name[0] + '. ' + game.players[0].players[0].last_name }}
          </div>
          <div
            v-else
            class="fw600 is-size-65"
            :class="game.is_surrendered === 1 ? 'has-text-black30' : 'has-text-black80'"
          >
            {{ game.players[0].players[0].last_name + ' - ' + game.players[0].players[1].last_name }}
          </div>
          <b-icon
            v-if="game.is_surrendered !== null && game.is_surrendered !== 0 && game.players.length === 1"
            icon="check"
            type="is-darkgreen"
            pack="fal"
            size="is-small"
            class="m-r-10 m-l-5 is-size-6 m-t--16"
          >
          </b-icon>
          <b-icon
            v-if="game.is_surrendered === 2 && game.players.length === 2"
            icon="check"
            type="is-darkgreen"
            pack="fal"
            size="is-small"
            class="m-r-10 m-l-5 is-size-6 m-t--16"
          >
          </b-icon>
          <div v-if="game.is_surrendered === 1" class="add__icon" @click="openModal">
            <b-icon icon="times" type="is-danger" pack="fal" size="is-small" class="m-r-5 m-l-5 m-t--16 is-size-6">
            </b-icon>
          </div>
        </div>
        <div v-else class="align__centar__y">
          <template v-if="!isFirstRound">
            <b-icon icon="clock" type="is-danger" pack="fal" class="m-r-2 m-l--7 h16 m-b-3 m-t-3 is-size-7"> </b-icon>
            <h3 class="is-size-7 has-text-danger fw600">{{ $t('TBD') }}</h3>
            <!--            <h3 class="is-size-7 has-text-danger fw600">{{ $t('ekaProtivnika') }}</h3>-->
          </template>
          <!--        <template v-else>-->
          <!--          <b-icon icon="check" type="is-primary" pack="fal" size="is-small" class="m-r-10 m-l-5 is-size-6"> </b-icon>-->
          <!--          <h3 class="is-size-7 has-text-black20 fw600">Bez protivnika</h3>-->
          <!--        </template>-->
        </div>
        <div
          v-if="player2"
          class="align__centar__y m-t-2 m-b-2"
          @click="
            $router.push(
              isDoubles
                ? localePath('/doubles/' + game.players[1].id)
                : localePath('/player/' + game.players[1].players[0].id)
            )
          "
        >
          <!--          <template v-if="isDoubles" class="for-doubles">-->
          <!--            <div-->
          <!--              v-if="game.players[1].image === 'https://api.tenis.plus/images/user.svg' && game.players.length"-->
          <!--              class="list__img"-->
          <!--            >-->
          <!--              <TennisImage-->
          <!--                :size="[42, 42]"-->
          <!--                :src="game.players[1].players[0].image"-->
          <!--                class="user_image border__white&#45;&#45;2"-->
          <!--                alt=""-->
          <!--              />-->
          <!--              <TennisImage-->
          <!--                :size="[42, 42]"-->
          <!--                :src="game.players[1].players[1].image"-->
          <!--                class="user_image m-l&#45;&#45;20 border__white&#45;&#45;2"-->
          <!--                alt=""-->
          <!--              />-->
          <!--            </div>-->
          <!--            <div v-else class="list__img">-->
          <!--              <TennisImage :size="[42, 42]" :src="game.players[1].image" class="user_image border__white&#45;&#45;2" alt="" />-->
          <!--            </div>-->
          <!--          </template>-->

          <!--          <TennisImage v-else :size="[32, 32]" :src="game.players[1].image" class="user_image-small m-r-10" alt="" />-->
          <span
            v-if="game.players[1].seed"
            class="is-size-7 has-text-white x-tag is-primary seed-tag-result-lot-draw radius__full nav__notification m-r-5"
            >{{ game.players[1].seed }}</span
          >
          <!--          <h3 class="is-size-6 fw600" :class="game.is_surrendered === 2 ? 'has-text-black30' : 'has-text-black80'">-->
          <!--            {{ game.players[1].display_name }}-->
          <!--          </h3>-->
          <div
            v-if="!isDoubles"
            class="fw600 is-size-65"
            :class="game.is_surrendered === 2 ? 'has-text-black30' : 'has-text-black80'"
          >
            {{ game.players[1].players[0].first_name[0] + '. ' + game.players[1].players[0].last_name }}
          </div>
          <div
            v-else
            class="fw600 is-size-65"
            :class="game.is_surrendered === 1 ? 'has-text-black30' : 'has-text-black80'"
          >
            {{ game.players[0].players[0].last_name + ' - ' + game.players[1].players[0].last_name }}
          </div>
          <b-icon
            v-if="game.is_surrendered === 1 && game.players.length === 2"
            icon="check"
            type="is-darkgreen"
            pack="fal"
            size="is-small"
            class="m-r-10 m-l-5 m-t--16 is-size-6"
          >
          </b-icon>
          <div v-if="game.is_surrendered === 2 && game.players.length === 2" class="add__icon" @click="openModal">
            <b-icon icon="times" type="is-danger" pack="fal" size="is-small" class="m-r-5 m-l-5 m-t--16 is-size-6">
            </b-icon>
          </div>
        </div>
        <div v-else class="align__centar__y">
          <template v-if="!isFirstRound">
            <b-icon icon="clock" type="is-danger" pack="fal" class="m-r-2 m-l--7 h16 m-b-3 m-t-3 is-size-7"> </b-icon>
            <h3 class="is-size-7 has-text-danger fw600">{{ $t('TBD') }}</h3>
            <!--            <h3 class="is-size-7 has-text-danger fw600">{{ $t('ekaProtivnika') }}</h3>-->
          </template>
          <!--        <template v-else>-->
          <!--          <b-icon icon="check" type="is-primary" pack="fal" size="is-small" class="m-r-10 m-l-5 is-size-6"> </b-icon>-->
          <!--          <h3 class="is-size-7 has-text-black20 fw600">Bez protivnika</h3>-->
          <!--        </template>-->
        </div>
      </div>
      <div v-if="Object.keys(game).length" class="m-l-auto align__centar__all">
        <template v-if="game.is_surrendered !== null">
          <!--          <div v-if="game.is_surrendered === 1" class="add__icon" @click="openModal">-->
          <!--            <div class="x-tag m-l-auto is-red">Predaja: {{ game.players[0].last_name }}</div>-->
          <!--          </div>-->
          <!--          <div v-if="game.is_surrendered === 2 && game.players.length === 2" class="add__icon" @click="openModal">-->
          <!--            <div class="x-tag m-l-auto is-red">Predaja: {{ game.players[1].last_name }}</div>-->
          <!--          </div>-->
          <div
            v-if="game.is_surrendered !== null && game.players.length === 1"
            class="add__icon m-r-auto"
            @click="openModal"
          >
            <!--            <b-icon icon="check" type="is-darkgreen" pack="fal" size="is-medium" class="m-r-10 m-l-5 is-size-6">-->
            <!--            </b-icon>-->
            <!--            <div class="x-tag m-l-auto is-primary">Prolaz: {{ game.players[0].last_name }}</div>-->
          </div>
          <div v-if="game.is_surrendered === 3" class="add__icon" @click="openModal">
            <div class="x-tag m-l-auto is-red nowrap">{{ $t('meJeOtkazan') }}</div>
          </div>
        </template>

        <div v-if="game.result === null" class="m-l-auto align__centar__all">
          <div
            v-if="game.reservation && (game.is_surrendered === null || game.is_surrendered === 0)"
            class="fw600 flex__column flex"
            @click="$router.push(localePath('/courts/' + game.reservation.court.id + '/' + reservationLink()))"
          >
            <div class="x-tag m-l-auto is-primary nowrap m-b-5">{{ game.reservation.court.name }}</div>
            <div v-if="!isSameDate()" class="is-size-65 has-text-right m-t--5">
              <div class="has-text-black50 m-t-2 is-uppercase">{{ game.reservation.from | moment('DD. MMMM') }}</div>
              <div class="is-size-5 m-t--5">{{ game.reservation.from | moment('HH:mm') }}h</div>
            </div>
            <div v-else class="is-size-55 has-text-right m-t--5">{{ game.reservation.from | moment('HH:mm') }}h</div>
          </div>
          <!--          <template v-if="!isFinish">-->
          <!--            <div v-if="isAdmin || isligaadmin > 0" class="add__icon" @click="openModalAdmin">-->
          <!--              <b-icon v-show="true" icon="cog" type="is-grey" pack="fal" class="cup__add-result m-l-10"> </b-icon>-->
          <!--            </div>-->
          <!--          </template>-->
          <!--          <div-->
          <!--            v-if="(isAdmin || isligaadmin > 0) && !isFinish && !game.reservation && (!isFirstRound || player2)"-->
          <!--            class="add__icon"-->
          <!--            @click="openModalReservation"-->
          <!--          >-->
          <!--            <TennisImage :size="[32, 32]" class="user_image-small m-l-10" src="/reservation.svg" alt="" />-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <div
      v-if="!game.is_surrendered && player1 && player2"
      class="add__icon m-t-5 m-b-5 m-l-auto m-r-auto"
      @click="openModal"
    >
      <b-icon v-if="isInMatch.length" icon="plus-circle" type="is-green" pack="fal" class="m-r-10 cup__add-result">
      </b-icon>
      <!--      <div v-if="isInMatch.length" class="buttons">-->
      <!--        <b-button-->
      <!--          class="softshadow m-t-10 invert-small-button"-->
      <!--          type="is-small noborder is-primary has-text-white"-->
      <!--          pack="fal"-->
      <!--          icon-right="tennis-ball"-->
      <!--          rounded-->
      <!--        >-->
      <!--          {{ $t('unesiRezultat') }}-->
      <!--        </b-button>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import TennisImage from '@/components/TennisImage.vue'

import _ from 'lodash'

export default {
  name: 'CupLotsEmpty',
  components: {
    // TennisImage,
  },
  props: {
    game: {
      type: Object,
      required: true,
      default() {
        return {
          game: {
            players: [],
          },
        }
      },
    },
    isligaadmin: {
      type: Number,
      required: false,
      default: 0,
    },
    isFirstRound: {
      type: Boolean,
      required: false,
      default: false,
    },
    isFinish: {
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
      test: '',
    }
  },
  computed: {
    player1() {
      return this.game.players[0] !== undefined
    },
    player2() {
      return this.game.players[1] !== undefined
    },
    isInMatch() {
      if (this.isDoubles) {
        return _.filter(this.game.players, (item) => {
          return item.players[0].id === this.user.id || item.players[1].id === this.user.id
        })
      } else {
        return _.filter(this.game.players, (item) => {
          return item.id === this.user.team.id
        })
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    // isInMatch() {
    //   return _.filter(this.games.players, (item) => {
    //     return item.id === this.user.id
    //   })
    // },
  },
  methods: {
    isSameDate() {
      const iscurrentDate = this.$moment(this.game.reservation.from).isSame(new Date(), 'day')
      if (iscurrentDate) {
        return true
      }
      return false
    },
    reservationLink() {
      return this.$moment(this.game.reservation.from).format('YYYY-MM-DD')
    },
    openModal() {
      this.$emit('openIt')
    },
    openModalAdmin() {
      this.$emit('openItAdmin')
    },
    openModalReservation() {
      this.$emit('openItReservation')
    },
  },
}
</script>
<style scoped>
.tie-break__num__display {
  font-size: 0.4rem;
  margin-left: 0px;
  margin-top: 1px;
}
</style>
