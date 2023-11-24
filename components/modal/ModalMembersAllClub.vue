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
    <div v-if="user.is_trainer && showTennisSchool" class="buttons m-t-20">
      <b-button icon-right="user-graduate" type="is-small noborder" pack="far" rounded>
        {{ $t('odaberiGrupuUKoliTenisa') }}
      </b-button>
    </div>
    <div class="for-list">
      <div
        v-for="(player, index) in members"
        :key="index"
        class="list__image-col cursor align__centar__y"
        @click.prevent="
          $emit('player', player)
          $parent.close()
        "
      >
        <TennisImage :size="[42, 42]" :src="player.image" class="user_image-small m-r-10" alt="" />
        <div class="list__content">
          <h3>{{ player.display_name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
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
    await this.getPlayers()
  },
  data() {
    return {
      page: 1,
      last_page: 1,
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
        this.debouncedGetPlayers()
      }
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    getPlayers() {
      Player.page(1)
        .where('display_name', this.search_term)
        .get()
        .then((res) => {
          this.members = [...this.members, ...res.data]
        })
    },
  },
}
</script>
