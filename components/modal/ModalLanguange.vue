<template>
  <div class="members">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div id="inputsearch" class="search container placeholder-black80">
      <b-field class="w100">
        <b-input
          ref="filter"
          v-model="search_term"
          :placeholder="$t('pronadiJezik')"
          type="search"
          pack="far"
          :icon-right="search_term === '' ? 'search' : 'times'"
          icon-right-clickable
          @icon-right-click="search_term = ''"
        >
        </b-input>
      </b-field>
    </div>

    <transition name="fade">
      <div v-if="loading" class="align__centar__x loading_z_spinner m-t-50 m-b-20">
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

    <div v-if="true" class="for-list-clubs">
      <div v-for="c in filteredList" :key="c.id">
        <nuxt-link class="list__image-col cursor align__centar__y p-t-10 p-b-10" :to="switchLocalePath(c.local)">
          <img :src="'/lang/' + c.image" class="radius__full h35 m-r-10" alt="" />
          <div class="list__content" @click="$parent.close()">
            <h3 class="has-text-left">{{ c.name }}</h3>
          </div>
          <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" type="is-white" pack="fal"> </b-icon>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalLanguage',
  components: {},
  scrollToTop: true,
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
  },
  data() {
    return {
      loading: false,
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
    club() {
      return this.$store.state.club
    },
    languages() {
      return this.$store.state.languages.languages
    },
    currentLanguage() {
      return this.$i18n.locale
    },
    filteredList() {
      return this.languages.filter((club) => {
        return club.name.toString().toLowerCase().includes(this.search_term.toLowerCase())
      })
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
