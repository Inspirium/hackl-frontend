<template>
  <div class="">
    <slot></slot>
    <div v-if="final" class="trend-box flex align__centar__x">
      <div
        v-for="(result, index) in parseInt(final[2])"
        :key="index"
        class="trend-indicator m-l-1 m-r-1"
        :class="[index < parseInt(final[0] - 1) ? 'green' : 'is-red m-t-10']"
      ></div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'Trend',
  components: {},
  props: {
    final: {
      type: [Number, String],
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
      loading: false,
      results: [],
      totalMatches: [],
      meta: [],
    }
  },
  methods: {},
}
</script>
