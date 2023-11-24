<template>
  <div>
    <div :class="{ 'is-loading': loading }">
      <p class="fw600 is-size-5 m-t-15">{{ $t('predloeniTermini') }}</p>
      <p class="fw600 is-size-7 m-b-10">
        {{ $t('terminePredlae') }} <span class="has-text-lightblue">{{ comment.player.display_name }}</span>
      </p>
      <div
        v-for="(item, index) in comment.message"
        :key="item[0].court + item[0].time"
        :class="{ inactive: unavailableTermClass(index) }"
      >
        <termList :index="index" :complete-list="item" :player="comment.player" @submit="selectTime"></termList>
      </div>
      <p class="fw600 is-size-7 m-b-10 m-t-5">
        <span class="has-text-lightblue">{{ $t('rezervirajteTermin') }}</span> {{ $t('klikomNaNjega') }}
      </p>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Reservation from '@/models/Reservation'
import termList from '~/components/terms/TermListMessage'
export default {
  name: 'TermMessage',
  components: { termList },
  props: {
    players: {
      type: Array,
      required: true,
    },
    comment: {
      type: Object,
      required: true,
      default() {
        return {
          id: 0,
          player: {
            display_name: '',
            image: '',
          },
          created_at: null,
          message: '',
        }
      },
    },
  },
  data() {
    return {
      unavailableTerm: [],
      loading: false,
    }
  },
  methods: {
    unavailableTermClass(index) {
      return _.indexOf(this.unavailableTerm, index) > -1
    },
    selectTime(options) {
      this.loading = true
      const time = this.comment.message[options.index]
      options.players.map((item) => {
        item.type = 'player'
      })
      const reservation = new Reservation({
        date: this.$moment(time[0].date).format('YYYY-MM-DD'),
        times: time,
        players: options.players,
        court_id: time[0].court.id,
        message_id: this.comment.id,
      })
      reservation
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste rezervirali teren'),
            type: 'is-success',
            duration: 3000,
          })
          this.unavailableTerm.push(options.index)
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Odabrani termin nije više moguće rezervirati'),
            type: 'is-danger',
            duration: 3000,
          })
          this.unavailableTerm.push(options.index)
          this.loading = false
        })
    },
  },
}
</script>

<style scoped></style>
