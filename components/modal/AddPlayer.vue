<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="search container">
      <b-field>
        <b-input
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
    <div class="for-list">
      <transition-group name="list">
        <div
          v-for="player in players"
          v-show="player.id !== $auth.user.id"
          :key="player.id"
          class="list__image-col cursor align__centar__y"
          @click.prevent="invitePlayer(player)"
        >
          <TennisImage :size="[42, 42]" :src="player.image" class="user_image-small m-r-10" alt="" />
          <div class="list__content">
            <h3>{{ player.display_name }}</h3>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Player from '~/models/Player'

export default {
  name: 'ModalMembers',
  components: {
    TennisImage,
  },
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
    reservation: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    await this.getPlayers(true)
  },
  data() {
    return {
      players: [],
      search_term: '',
    }
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
  methods: {
    invitePlayer(player) {
      this.$emit('update', player)
      this.$parent.close()
    },
    async getPlayers(initial) {
      if (initial) {
        this.players = await Player.where('frequent', true).get()
      } else {
        Player.where('display_name', this.search_term)
          .where('club', this.$store.state.club.id)
          .get()
          .then((res) => {
            this.players = res.data
          })
      }
    },
  },
}
</script>
