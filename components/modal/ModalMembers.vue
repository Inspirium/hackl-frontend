<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="search container">
      <b-field>
        <b-input
          ref="filter"
          v-model="search_term"
          :placeholder="$t('pronaiIgraa')"
          type="search"
          pack="far"
          icon-right="search"
          icon-clickable
        >
        </b-input>
      </b-field>
    </div>
    <div class="modal-reservation">
      <div v-if="user.is_trainer && showTennisSchool" class="buttons m-t-20 m-b-20">
        <b-button
          type="is-small noborder"
          pack="far"
          :icon-right="selectedSchoolGroup ? 'times' : 'user-graduate'"
          :class="{ active: selectedSchoolGroup }"
          rounded
          @click="selectSchoolGroup()"
        >
          {{ $t('odaberiGrupuUKoliTenisa') }}
        </b-button>
      </div>
    </div>
    <div class="for-list relative min-height-100">
      <transition name="fade">
        <div v-if="loading" class="align__centar__x loading_z_spinner">
          <b-icon
            class="comment-send m-b-20"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-white"
            pack="far"
          ></b-icon>
        </div>
      </transition>
      <template v-if="!loading">
        <template v-if="!selectedSchoolGroup">
          <div
            v-for="(player, index) in members"
            :key="player.id + index + 'player'"
            class="list__image-col cursor align__centar__y"
            @click.prevent="
              $emit('player', player)
              invitePlayer(player)
            "
          >
            <template v-if="isDoubles" class="for-doubles">
              <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="flex m-r-20">
                <TennisImage
                  :size="[42, 42]"
                  :src="player.players[0].image"
                  class="user_image border__white--2"
                  alt=""
                />
                <TennisImage
                  :size="[42, 42]"
                  :src="player.players[1].image"
                  class="user_image m-l--20 border__white--2"
                  alt=""
                />
              </div>
              <div v-else class="list__img">
                <TennisImage :size="[42, 42]" :src="player.image" class="user_image border__white--2" alt="" />
              </div>
            </template>
            <TennisImage v-else :size="[42, 42]" :src="player.image" class="user_image-small m-r-10" alt="" />
            <div class="list__content">
              <h3>{{ player.display_name }}</h3>
            </div>
            <div v-if="player.is_doubles" class="fw600 is-size-7 has-text-danger">{{ $t('par') }}</div>
          </div>
        </template>

        <div v-else class="for-list p-b-40">
          <div
            v-for="(item, index) in schoolGroup"
            :key="item.id + index + 'school'"
            class="list__image-col cursor align__centar__y"
            @click.prevent="
              $emit('player', item)
              invitePlayer(item)
            "
          >
            <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
            <div class="list__content">
              <h3>{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import SchoolGroup from '@/models/SchoolGroup'

// import Player from '~/models/Player'
import Team from '~/models/Team'

import Reservation from '~/models/Reservation'

export default {
  name: 'ModalMembers',
  components: {
    TennisImage,
  },
  scrollToTop: true,
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    showTennisSchool: {
      type: Boolean,
      required: false,
      default: true,
    },
    reservation: {
      type: Object,
      required: false,
      default() {
        return { id: 0 }
      },
    },
  },
  async fetch() {
    await this.debouncedGetPlayers()
  },
  data() {
    return {
      loading: true,
      page: 1,
      last_page: 1,
      bottom: false,
      selectedSchoolGroup: false,
      players: [],
      search_term: '',
      members: [],
      reservationFull: {},
      schoolGroup: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.auth.club
    },
    isDoubles() {
      if (this.reservationFull) {
        if (this.reservationFull.players) {
          if (!this.reservationFull.players.length) {
            return false
          }
          if (this.reservationFull.players[0].players.length > 1) {
            return true
          }
          return false
        }
      }
      return false
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        this.debouncedGetPlayers()
      }
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  mounted() {
    this.focusInput()
    this.getReservation()
    this.getGroups()
  },
  methods: {
    selectSchoolGroup() {
      this.selectedSchoolGroup = !this.selectedSchoolGroup
      this.getGroups()
      this.getReservation()
    },

    focusInput() {
      this.$refs.filter.focus()
    },
    invitePlayer(player) {
      this.loading = true
      const r = new Reservation(this.reservation)
      if (this.selectedSchoolGroup) {
        r.group = player
        r.players.push(player)
      } else {
        r.players.push(player)
      }
      r.save()
        .then(() => {
          this.$emit('update')
          this.$parent.close()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    getGroups() {
      SchoolGroup.where('club', this.$store.state.club.id)
        .limit(40)
        .get()
        .then((res) => {
          this.schoolGroup = res.data
        })
    },
    getPlayers() {
      this.loading = true
      Team.where('display_name', this.search_term)
        .where('club', this.$store.state.club.id)
        .where('number_of_players', this.isDoubles ? 2 : 1)
        .get()
        .then((res) => {
          this.members = [...this.members, ...res.data]
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
    },
    getReservation() {
      Reservation.find(this.reservation.id).then((res) => {
        this.reservationFull = res
      })
    },
  },
}
</script>
