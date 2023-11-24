<template>
  <div class="liga-lot-empty-box" :style="game.is_surrendered ? 'border: 2px solid red' : ''">
    <div class="liga-lot-empty">
      <div class="flex justify-between w100 align__centar__y">
        <div class="">
          <div
            class="align__centar__y m-b-10"
            @click="$router.push(localePath('/liga/' + $route.params.id + '/' + game.players[0].id))"
          >
            <template v-if="game.players[0].type === 'team'" class="for-doubles">
              <div
                v-if="game.players[0].image === 'https://api.tenis.plus/images/user.svg' && game.players.length"
                class="list__img"
              >
                <TennisImage
                  :size="[42, 42]"
                  :src="game.players[0].players[0].image"
                  class="user_image border__white--2"
                  alt=""
                />
                <TennisImage
                  :size="[42, 42]"
                  :src="game.players[0].players[1].image"
                  class="user_image m-l--20 border__white--2"
                  alt=""
                />
              </div>
              <div v-else class="list__img">
                <TennisImage :size="[42, 42]" :src="game.players[0].image" class="user_image border__white--2" alt="" />
              </div>
            </template>
            <TennisImage v-else :size="[42, 42]" :src="game.players[0].image" class="user_image-small m-r-10" alt="" />
            <h3 class="is-size-6 has-text-black80 fw600">
              {{ game.players[0].display_name }}
            </h3>
          </div>
          <div
            v-if="game.players[1]"
            class="align__centar__y"
            @click="$router.push(localePath('/liga/' + $route.params.id + '/' + game.players[1].id))"
          >
            <template v-if="game.players[1].type === 'team'" class="for-doubles">
              <div
                v-if="game.players[1].image === 'https://api.tenis.plus/images/user.svg' && game.players.length"
                class="list__img"
              >
                <TennisImage
                  :size="[42, 42]"
                  :src="game.players[1].players[0].image"
                  class="user_image border__white--2"
                  alt=""
                />
                <TennisImage
                  :size="[42, 42]"
                  :src="game.players[1].players[1].image"
                  class="user_image m-l--20 border__white--2"
                  alt=""
                />
              </div>
              <div v-else class="list__img">
                <TennisImage :size="[42, 42]" :src="game.players[1].image" class="user_image border__white--2" alt="" />
              </div>
            </template>

            <TennisImage v-else :size="[42, 42]" :src="game.players[1].image" class="user_image-small m-r-10" alt="" />
            <h3 class="is-size-6 has-text-black80 fw600">{{ game.players[1].display_name }}</h3>
          </div>
        </div>
        <template v-if="game.is_surrendered">
          <div v-if="game.is_surrendered === 3" class="add__icon" @click="openModal">
            <div class="x-tag m-l-auto is-red nowrap">{{ $t('meJeOtkazan') }}</div>
          </div>
          <div v-else class="add__icon" @click="openModal">
            <div class="x-tag m-l-auto is-red">
              {{
                $t('predaja2', {
                  expr: isDoubles
                    ? game.players[game.is_surrendered - 1].display_name
                    : game.players[game.is_surrendered - 1].players[0].last_name,
                })
              }}
            </div>
          </div>
        </template>
        <!--        Show reservation if has-->
        <div
          v-if="game.reservation && (game.is_surrendered === null || game.is_surrendered === 0)"
          class="m-l-auto align__centar__all"
        >
          <p>{{ getClubName() }}</p>
          <div
            class="fw600 flex__column flex"
            @click="$router.push(localePath('/courts/' + game.reservation.court.id + '/' + reservationLink()))"
          >
            <div class="x-tag m-l-auto is-primary nowrap m-b-5">{{ game.reservation.court.name }}</div>
            <div v-if="!isSameDate()" class="is-size-65 has-text-right m-t--5">
              <div class="has-text-black50 m-t-2 is-uppercase">{{ game.reservation.from | moment('DD. MMMM') }}</div>
              <div class="is-size-5 m-t--5">{{ game.reservation.from | moment('HH:mm') }}h</div>
            </div>
            <div v-else class="is-size-55 has-text-right m-t--5">{{ game.reservation.from | moment('HH:mm') }}h</div>
            <div v-if="game.reservation.court.club_id !== club.id" class="is-size-65 has-text-right m-t--5">
              {{ clubName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w100 flex flex-wrap align__centar__x">
      <div v-if="game.result === null" class="action-horisontal">
        <b-button
          v-if="isInMatch.length && !game.is_surrendered"
          type="is-primary is-smaller-12"
          class="m-l-5 m-t-7"
          pack="fal"
          rounded
          size="is-smaller"
          @click.prevent="openModal"
          >{{ $t('unesiRezultat') }}</b-button
        >
        <b-button
          v-if="isInMatch.length || isAdminAll"
          type="is-primary removeborder is-smaller-12"
          class="m-l-5 m-t-7"
          pack="fal"
          rounded
          size="is-smaller"
          @click.prevent="openModalAdmin"
          >{{ $t('opcijeMea') }}</b-button
        >
        <b-button
          v-if="(isInMatch.length && !game.is_surrendered && !game.reservation) || (isAdminAll && !game.reservation)"
          type="is-danger removeborder is-smaller-12"
          class="m-l-5 m-t-7"
          pack="fal"
          rounded
          size="is-smaller"
          @click.prevent="openModalReservation"
          >{{ $t('rezervirajTeren') }}</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'

export default {
  name: 'LigaLotsEmpty',
  components: {
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
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      clubName: '',
    }
  },
  computed: {
    isAdminAll() {
      return !!(this.isAdmin || this.isligaadmin === 1)
    },
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
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
  },
  watch: {
    game() {
      if (this.game.reservation) {
        if (this.game.reservation.court?.club_id !== this.club.id) {
          this.getClubName()
        }
      }
    },
  },
  methods: {
    getClubName() {
      Club.find(this.game.reservation.court.club_id).then((res) => {
        this.clubName = res.name
      })
    },
    reservationLink() {
      return this.$moment(this.game.reservation.from).format('YYYY-MM-DD')
    },
    isSameDate() {
      return this.$moment(this.game.reservation.from).isSame(new Date(), 'day')
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
