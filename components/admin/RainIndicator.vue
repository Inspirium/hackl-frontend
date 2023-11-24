<template>
  <div v-if="$store.state.club.weather" class="weather-info">
    <admin-cloud />
    <div class="has-text-centered is-size-5 has-text-white fw600">{{ $t('prekidIgreNaVanjskimTerenima') }}</div>
    <div class="flex align__centar__x flex-wrap">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="has-text-centered is-size-65 has-text-white fw600 m-r-5 opacity7"
      >
        • {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Court from '~/models/Court'

export default {
  name: 'Rain',
  components: {},
  data() {
    return {
      loadingCourts: false,
      courts: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    filtered() {
      return this.courts.filter((item) => item.weather && item.type === 'open')
    },
  },
  mounted() {
    if (this.$store.state.club.weather) {
      this.getCourts()
    }
  },
  methods: {
    getCourts() {
      this.loadingCourts = true
      Court.where('is_active', 1)
        .where('club_id', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.courts = res.data
          this.loadingCourts = false
        })
        .catch(() => {
          this.loadingCourts = false
        })
    },
  },
}
</script>
