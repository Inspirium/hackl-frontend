<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div v-if="subtitle" class="modal-subtitle has-text-light m-b-20">
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
          v-for="player in filteredList.length ? filteredList : players"
          :key="player.id"
          class="list__image-col cursor align__centar__y"
          @click.prevent="
            $emit('update', player)
            $parent.close()
          "
        >
          <TennisImage :size="[42, 42]" :src="player.image" class="user_image-small m-r-10" alt="" />
          <div class="list__content">
            <h3>{{ player.display_name }}</h3>
          </div>
          <div v-if="player.is_doubles" class="fw600 is-size-7 has-text-danger">{{ $t('par') }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'ModalMembersCustom',
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
    players: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      filter: null,
      page: 1,
      last_page: 1,
      bottom: false,
      search_term: '',
      members: [],
    }
  },
  computed: {
    filteredList() {
      return this.players.filter((player) => {
        return player.display_name.toString().toLowerCase().includes(this.search_term.toLowerCase())
      })
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        this.members = []
      }
    },
  },
}
</script>
