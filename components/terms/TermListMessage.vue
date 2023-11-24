<template>
  <div class="home__reservation">
    <div class="activity__reservation">
      <div class="activity__box m-b-10">
        <div v-if="selected_terms_sorted.length" class="reservation__item" @click.prevent="send(user)">
          <div class="reservation__item__content terms-loading">
            <div
              :class="selected_terms_sorted[0].surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
              class="x-tag m-r-10"
            >
              {{ selected_terms_sorted[0].court.name }}
            </div>
            <div class="title-num is-size-6 fw600">
              <span class="fw400">{{ $moment(selected_terms_sorted[0].date).format('dddd') }}, </span>
              {{ timeRangeFirst | parseTime(true) }} - {{ timeRangeLast | parseTime(true) }}
            </div>
            <!--            <b-icon-->
            <!--              v-if="user.id !== player"-->
            <!--              class="m-l-10"-->
            <!--              icon="check-circle"-->
            <!--              size="is-small"-->
            <!--              pack="fal"-->
            <!--              type="is-lightblue"-->
            <!--            ></b-icon>-->
            <!--            <b-icon-->
            <!--              v-else-->
            <!--              class="m-l-10"-->
            <!--              icon="times-circle"-->
            <!--              size="is-small"-->
            <!--              pack="fal"-->
            <!--              type="is-danger"-->
            <!--              @click.prevent="cancelTerm"-->
            <!--            ></b-icon>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'TermListMessage',
  props: {
    index: {
      type: Number,
      required: true,
      default() {
        return 0
      },
    },
    player: {
      type: Object,
      required: true,
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
      selected_reservation: null,
      selected_terms_sorted: [],
      options: {
        index: this.index,
        players: [this.player, this.$store.state.auth.user],
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    timeRangeFirst() {
      return _.head(this.selected_terms_sorted).time
    },
    timeRangeLast() {
      return _.last(this.selected_terms_sorted).time + 50
    },
  },
  mounted() {
    this.selected_terms_sorted = this.completeList.sort((a, b) => a.time - b.time)
  },
  methods: {
    send() {
      if (this.user.id === this.player.id) {
        this.$buefy.toast.open({
          message: this.$t('Oooops! Ne možete sami sebi rezervirati termin :)'),
          type: 'is-primary',
          duration: 3000,
        })
      } else {
        this.$emit('submit', this.options)
      }
    },
  },
}
</script>
