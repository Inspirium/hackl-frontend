<template>
  <div>
    <div class="court-header">
      <div class="flex align__centar__all">
        <cloud v-if="court.weather" class="m-r-2" />
        <div class="modal-subtitle">{{ court.name }}</div>
      </div>
      <div class="badge badge-acrylic x-tag">
        {{ $t(court.surface.title) }}
      </div>
    </div>
    <div class="court-slots d-flex">
      <div v-for="hour in hours" :key="hour" class="court-slot">
        <div class="heading-num-small text-center">
          {{ hour | parseTime(false) }}
        </div>
        <template v-if="hourHasReservation(hour)">
          <div :class="getSvgClass(hour)">
            <svg v-if="hasSecondHalf(hour)" width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none">
              <polygon :fill="fill(hour, true)" stroke-width="0" points="0,10 10,10 10,0" />
            </svg>
            <svg
              v-if="!hasSecondHalf(hour)"
              class="test"
              width="100%"
              height="100%"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon :fill="fill(hour)" stroke-width="0" points="0 0,0 10,10 0" />
            </svg>
          </div>
        </template>
        <template v-else>
          <div class="indicator"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import cloud from '~/components/admin/CloudCourt'

export default {
  name: 'CourtSlot',
  components: {
    cloud,
  },
  props: {
    court: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isAdmin() {
      return this.$auth.loggedIn && this.$store.state.auth.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    hours() {
      const start = this.court.working_span[0]?.hour * 100
      const end = (this.court.working_span[this.court.working_span.length - 1]?.hour + 1) * 100
      return _.range(start, end, 100)
    },
  },
  methods: {
    checkOverlap(start1, end1, start2, end2) {
      return Math.max(start1, start2) < Math.min(end1, end2)
    },
    hasFirstHalf(hour) {
      return !!Object.values(this.court.parsed_reservations).filter((item) => {
        if (item.id !== 0) {
          const start = item.time
          const end = item.time + (this.court.reservation_duration / 30) * 50 - 1
          const hourStart = hour
          const hourEnd = hour + 50
          return this.checkOverlap(start, end, hourStart, hourEnd)
        }
      }).length
    },
    hourHasReservation(hour) {
      return !!Object.values(this.court.parsed_reservations).filter((item) => {
        if (item.id !== 0) {
          const start = item.time
          const end = item.time + (this.court.reservation_duration / 30) * 50 - 1
          const hourStart = hour
          const hourEnd = hour + 100
          return this.checkOverlap(start, end, hourStart, hourEnd)
        }
      }).length
    },
    hasSecondHalf(hour) {
      if (this.court.reservation_duration === 60) {
        return true
      }
      return !!Object.values(this.court.parsed_reservations).filter((item) => {
        if (item.id !== 0) {
          const start = item.time
          const end = item.time + (this.court.reservation_duration / 30) * 50 - 1
          const hourStart = hour + 50
          const hourEnd = hour + 100
          return this.checkOverlap(start, end, hourStart, hourEnd)
        }
      }).length
    },
    matchReservationToHour(hour, secondHalf = false) {
      if (this.court.reservation_duration !== 60 && secondHalf) {
        // TODO: check for 90
        hour = hour + 50
      }
      if (this.court.parsed_reservations[hour]) {
        return this.court.parsed_reservations[hour]
      }

      return Object.values(this.court.parsed_reservations).find((item) => {
        if (item.id !== 0) {
          const start = item.time
          const end = item.time + (this.court.reservation_duration / 30) * 50 - 1
          const hourStart = hour
          const hourEnd = hour + 50
          return this.checkOverlap(start, end, hourStart, hourEnd)
        }
      })[0]
    },
    fill(hour, secondHalf = false) {
      if (this.isAdmin) {
        const reservation = this.matchReservationToHour(hour, secondHalf)
        if (reservation && (reservation.is_paid || reservation.category?.is_paid)) {
          return '#73c03d'
        }
      }
      return '#3e8ed0'
    },
    getSvgClass(hour) {
      let c = ''
      if (this.hasFirstHalf(hour) && this.hasSecondHalf(hour)) {
        c = 'is-infoblue'
        const reservation = this.matchReservationToHour(hour)
        if (this.isAdmin && reservation && (reservation.is_paid || reservation.category?.is_paid)) {
          c = 'green'
        }
      }
      return ['indicator', c]
    },
  },
}
</script>
