<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div id="inputsearch" class="search container">
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
    <div class="for-list p-b-100">
      <transition-group name="list">
        <div
          v-for="player in players"
          v-show="[showMe ? true : player.id !== $auth.user.id]"
          :key="player.id"
          class="list__image-col cursor align__centar__y"
          @click.prevent="
            $emit('player', player)
            $parent.close()
          "
        >
          <TennisImage :size="[42, 42]" :src="player.image" class="user_image-small m-r-10" alt="" />
          <div class="list__content">
            <h3 class="has-text-white">{{ player.display_name }}</h3>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import Team from '~/models/Team'

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
    showMe: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async fetch() {
    await this.getPlayers(true)
  },
  data() {
    return {
      page: 1,
      last_page: 1,
      players: [],
      search_term: '',
      loading1: '',
    }
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.page = 1
        this.players = []
        this.debouncedGetPlayers()
      }
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    getPlayers() {
      this.loading1 = true
      Team.page(1)
        .where('club', this.$store.state.club.id)
        .where('display_name', this.search_term)
        .where('number_of_players', 1)
        .get()
        .then((res) => {
          this.players = [...this.players, ...res.data]
          this.loading1 = false
        })
    },
  },
}
</script>
