<template>
  <div v-show="filteredList.length" class="activity x-container">
    <div class="activity__header m-b-10">
      <nuxt-link :to="localePath('/schedule')" class="fw600"
        >{{ $t('najaveMeeva') }}
        <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
      </nuxt-link>
    </div>
    <div class="results schedule">
      <div class="schedule activity__box">
        <div v-for="match in filteredList" :key="match.id" class="schedule-match results__list">
          <scheduleBox :result-item="match"></scheduleBox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'
import scheduleBox from '~/components/ScheduleBox'

export default {
  name: 'Schedule',
  components: {
    scheduleBox,
  },
  async fetch() {
    await this.getSchedule()
  },
  data() {
    return {
      selected_date: moment(),
      inactive: true,
      reservations: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    filteredList() {
      if (!this.reservations.length) {
        return false
      }
      return _.slice(
        _.filter(this.reservations, (item) => {
          return item.players.length === 2
        }),
        0,
        3
      )
    },
  },
  watch: {
    selected_date() {
      this.getSchedule()
    },
  },
  methods: {
    getSchedule() {
      this.$axios.get('club/schedule/' + this.selected_date.format('YYYY-MM-DD')).then((res) => {
        this.reservations = res.data.data
      })
    },
  },
}
</script>
