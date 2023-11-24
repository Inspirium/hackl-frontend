<template>
  <div class="modal-reservation">
    <div>
      <div class="modal-title has-text-light">{{ $t('predloiTermin') }}</div>
      <div class="modal-subtitle has-text-light m-b-20">{{ $t('teren', { name: court.name }) }}</div>
      <div class="filter-list p-b-75">
        <div
          v-for="(hours, index) in reservations"
          :key="hours.id + index"
          :class="getClass(hours)"
          @click="selectTime(hours)"
        >
          <div class="">
            {{ hours.time | parseTime(true) }} -
            {{ (hours.time + (court.reservation_duration / 30) * 50) | parseTime(true) }}
            <b-icon
              class="reservation__price-icon"
              pack="fal"
              icon="chevron-right"
              size="is-smaller"
              type="is-danger"
            />
            <span v-if="hours.price" class="price">{{ hoursPrice(hours.price) + ' €' }}</span>
            <span v-else class="price">{{ $t('rezervirano') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons is-fixed m-t-20">
      <b-button pack="far" :class="buttonDisable" type="is-primary" rounded @click="send">
        {{ $t('dodajTermin') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ModalCourtReservationTerm',
  filters: {
    parseTime(value, m) {
      const hour = Math.floor(value / 100)
      let minutes = ((value % 100) / 100) * 60
      if (minutes === 0) {
        minutes = '00'
      }
      if (m) {
        return hour + ':' + minutes
      }
      return hour
    },
  },
  props: {
    court: {
      type: Object,
      required: true,
    },
    reservations: {
      type: Object,
      required: true,
    },
    reservationDate: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    completeList: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      selected_times: [],
      newTerms: [],
      selected_times_sorted: [],
      timeDifference: '',
    }
  },
  computed: {
    buttonDisable() {
      if (this.newTerms.length > 0) {
        return ''
      } else {
        return 'blur_button'
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    date() {
      return this.$moment(this.$route.params.date).format('dddd' + ', ' + 'l')
    },
    realDate() {
      if (Object.keys(this.reservationDate).length) {
        return this.$moment(this.reservationDate).format('YYYY-MM-DD')
      }
      return this.$route.params.date
    },
  },
  watch: {
    newTerms: {
      handler() {
        // check if length of proposed term is longer than 2 hours
        const timeRange = _.map(this.newTerms, 'time')
        this.timeDifference = _.max(timeRange) - _.min(timeRange)
      },
    },
  },
  methods: {
    hoursPrice(item) {
      if (this.user.membership.has_discount) {
        if (this.user.membership.discount_type === 1) {
          return item - this.user.membership.discount_amount
        } else if (this.user.membership.discount_type === 2) {
          return Math.round(item - (item / 100) * this.user.membership.discount_amount)
        }
      } else {
        return item
      }
    },
    send() {
      this.$emit('update', this.newTerms)
      this.newTerms = []
      this.$parent.close()
    },
    selectTime(hour) {
      // check if already in array
      if (_.indexOf(this.newTerms, hour) > -1) {
        this.newTerms.splice(_.indexOf(this.newTerms, hour), 1)
      } else if (this.timeDifference > 100) {
        this.$buefy.toast.open({
          message: this.$t('Ne možete rezervirati termin duži od 2 sata'),
          type: 'is-danger',
        })
      } else {
        this.newTerms.push(hour)
        this.newTerms[_.indexOf(this.newTerms, hour)].court = { id: this.court.id, name: this.court.name }
        this.newTerms[_.indexOf(this.newTerms, hour)].surface = this.court.surface
        this.newTerms[_.indexOf(this.newTerms, hour)].date = this.reservationDate._d
      }
    },
    getClass(hour) {
      return {
        'select-item': true,
        active: _.indexOf(this.newTerms, hour) > -1,
        'modal-reserved-input': true,
        'modal-reserved': hour.id !== 0,
      }
    },
  },
}
</script>
