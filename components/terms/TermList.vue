<template>
  <div class="home__reservation">
    <div class="activity__reservation">
      <div class="activity__box m-b-10">
        <div v-if="selected_terms_sorted.length" class="reservation__item" @click.prevent="send">
          <div class="reservation__item__content">
            <div
              :class="selected_terms_sorted[0].surface.badge === 'clay' ? 'is-clay' : 'is-primary'"
              class="x-tag m-r-10"
            >
              {{ selected_terms_sorted[0].court.name }}
            </div>
            <div class="title-num is-size-6 fw600">
              <span class="fw600">{{ $moment(selected_terms_sorted[0].date).format('dddd') }}, </span>
              {{ timeRangeFirst | parseTime(true) }} - {{ timeRangeLast | parseTime(true) }}
            </div>
            <b-icon icon="times-circle" class="m-t--5" pack="fal" type="is-danger"></b-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'TermList',
  props: {
    index: {
      type: Number,
      required: true,
      default() {
        return 0
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
    }
  },
  computed: {
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
      this.$emit('delete', this.index)
    },
  },
}
</script>
