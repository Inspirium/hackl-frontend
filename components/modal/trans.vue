<template>
  <div class="members">
    <div class="modal-title m-b-5">{{ title }}</div>
    <div class="modal-subtitle m-b-20">
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Player from '~/models/Player'

export default {
  name: 'ModalMembers',
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
      required: false,
      default() {
        return {}
      },
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
          .get()
          .then((res) => {
            this.players = res.data
          })
      }
    },
  },
}
</script>
