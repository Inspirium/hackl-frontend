<template>
  <div class="">
    <slot></slot>
    <div v-if="loading" class="align__centar__x loading_z_spinner">
      <b-icon
        class="comment-send m-b-20"
        custom-class="rotating"
        icon="spinner"
        size="is-large"
        type="is-primary"
        pack="far"
      ></b-icon>
    </div>

    <div v-if="results.length > 1" class="trend-box flex align__centar__x rowreverse">
      <div
        v-for="result in results"
        :key="result.id"
        class="trend-indicator m-l-1 m-r-1"
        :class="isWinner(result)"
      ></div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Result from '~/models/Result'

export default {
  name: 'Trend',
  components: {},
  props: {
    player: {
      type: Number,
      required: true,
      default: null,
    },
    limit: {
      type: Number,
      required: false,
      default: 30,
    },
  },
  data() {
    return {
      loading: true,
      results: [],
      totalMatches: [],
      meta: [],
    }
  },
  mounted() {
    this.getResults()
  },
  methods: {
    isWinner(item) {
      if (!item.winner && item.players[0].id === this.player) {
        return 'green'
      } else if (item.winner && item.players[1].id === this.player) {
        return 'green'
      } else {
        return 'is-red m-t-10'
      }
    },
    getResults() {
      this.loading = true
      Result.where('team', this.player)
        .limit(this.limit)
        .orderBy('-date')
        .get()
        .then((res) => {
          this.results = res.data
          this.totalMatches = res.meta.total
          this.meta = res.meta
          this.loading = false
        })
    },
  },
}
</script>
