<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">{{ subtitle }}</div>
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
    <div v-if="user.is_trainer && showTennisSchool" class="buttons m-t-20">
      <b-button icon-right="user-graduate" type="is-small noborder" pack="far" rounded>
        {{ $t('odaberiGrupuUKoliTenisa') }}
      </b-button>
    </div>
    <div class="for-list relative min-h-20">
      <template v-if="members.length">
        <div
          v-for="(player, index) in members"
          :key="index"
          :class="{ hidden: player.is_doubles }"
          class="list__image-col cursor align__centar__y"
          @click.stop="
            $emit('player', player)
            $parent.close()
          "
        >
          <template v-if="isDoubles" class="for-doubles">
            <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="flex m-r-20">
              <TennisImage :size="[42, 42]" :src="player.players[0].image" class="user_image border__white--2" alt="" />
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

          <TennisImage v-else :size="[32, 32]" :src="player.image" class="user_image-small m-r-10" alt="" />
          <div class="list__content">
            <h3>{{ player.display_name }}</h3>
          </div>
          <div v-if="player.is_doubles" class="fw600 is-size-7 has-text-white">{{ $t('par2') }}</div>
        </div>
      </template>
      <transition name="fade">
        <div v-if="!members.length && loading" class="align__centar__x loading_z_spinner">
          <b-icon
            class="comment-send m-b-20"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Team from '~/models/Team'
import Player from '~/models/Player'

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
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    isPlayer: {
      type: Boolean,
      required: false,
      default: false,
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
    if (this.isPlayer) {
      await this.debouncedGetPlayer()
    } else {
      await this.debouncedGetTeams()
    }
  },
  data() {
    return {
      page: 1,
      last_page: 1,
      loading: false,
      bottom: false,
      players: [],
      search_term: '',
      members: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        this.members = []
        if (this.isPlayer) {
          this.debouncedGetPlayer()
        } else {
          this.debouncedGetTeams()
        }
      }
      if (term === '') {
        if (this.isPlayer) {
          this.debouncedGetPlayer()
        } else {
          this.debouncedGetTeams()
        }
      }
    },
  },
  mounted() {
    this.focusInput()
  },
  created() {
    this.debouncedGetTeams = _.debounce(this.getTeam, 500)
    this.debouncedGetPlayer = _.debounce(this.getPlayers, 500)
  },
  methods: {
    focusInput() {
      this.$refs.filter.focus()
    },
    getTeam() {
      this.loading = true
      Team.page(1)
        .where('club', this.$store.state.club.id)
        .where('display_name', this.search_term)
        .where('number_of_players', this.isDoubles ? 2 : 1)
        .get()
        .then((res) => {
          this.members = [...this.members, ...res.data]
          this.loading = false
        })
    },
    getPlayers() {
      this.loading = true
      Player.page(1)
        .include('wallets')
        .where('club', this.$store.state.club.id)
        .where('display_name', this.search_term)
        .get()
        .then((res) => {
          this.members = [...this.members, ...res.data]
          this.loading = false
        })
    },
  },
}
</script>
