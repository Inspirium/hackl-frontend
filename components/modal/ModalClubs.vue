<template>
  <div class="members p-b-150 relative">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-10">
      {{ subtitle }}
    </div>
    <div id="inputsearch" class="search container placeholder-black80">
      <b-field class="w100">
        <b-input
          ref="filter"
          v-model="search_term"
          :placeholder="$t('pronaiKlub')"
          type="search"
          pack="far"
          :icon-right="search_term === '' ? 'search' : 'times'"
          icon-right-clickable
          @icon-right-click="search_icon_click()"
        >
        </b-input>
      </b-field>
    </div>
    <transition name="fade">
      <div v-if="loading" class="align__centar__x loading_z_spinner m-t-100 m-b-20">
        <b-icon
          class="comment-send m-b-20 m-t-20"
          custom-class="rotating"
          icon="spinner"
          size="is-large"
          type="is-white"
          pack="far"
        ></b-icon>
      </div>
    </transition>

    <div v-if="true" class="for-list-clubs">
      <div v-for="c in clubs" :key="c.id">
        <div
          v-if="c.is_active === true || (c.id === 4 && user.id === 2)"
          class="list__image-col cursor align__centar__y"
          @click.prevent="submit(c)"
        >
          <TennisImage :size="[60, 60]" :src="c.logo" class="user_image-smallish m-r-10" alt="" />
          <div class="list__content">
            <h3>{{ c.name }}</h3>
          </div>
          <b-icon class="m-l-auto" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Club from '@/models/Club'
import { Capacitor } from '@capacitor/core'
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'

export default {
  name: 'ModalClubs',
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
    switchClub: {
      type: Boolean,
      required: false,
      default: true,
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
      clubs: [],
      location: {
        latitude: 0,
        longitude: 0,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    filteredList() {
      return this.clubs.filter((club) => {
        return club.name.toString().toLowerCase().includes(this.search_term.toLowerCase())
      })
    },
  },
  watch: {
    search_term() {
      this.debouncedGetClubs()
    },
  },
  created() {
    this.debouncedGetClubs = _.debounce(this.getClubs, 500)
  },
  mounted() {
    this.getClubs()
  },
  methods: {
    search_icon_click() {
      this.search_term = ''
    },
    async getClubs() {
      this.loading = true
      try {
        await this.$store.dispatch('location/getLocation')
      } finally {
        const c = Club.where('is_active', true).limit(100).where('name', this.search_term).orderBy('distance')

        if (this.$store.state.location.latitude) {
          c.params({
            latitude: this.$store.state.location.latitude,
            longitude: this.$store.state.location.longitude,
          })
        }

        this.clubs = await c.$get()
        this.loading = false
      }
    },
    submit(club) {
      if (!this.switchClub) {
        this.$emit('club', club)
        this.$parent.close()
        return
      }
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://${club.subdomain}.tenis.plus`
        this.$parent.close()
      } else {
        this.$store.commit('club/setId', club.id)
        this.$store.dispatch('club/init_club', { force: true })
        this.$router.push(this.localePath('/'))
        this.$parent.close()
      }
    },
  },
}
</script>
