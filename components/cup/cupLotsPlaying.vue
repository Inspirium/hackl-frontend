<template>
  <div>
    <div
      v-for="result in results"
      :key="result.id"
      :class="{
        result__box: true,
        unplayed: !result.isPlayed,
        unverified: result.verified === 0,
      }"
    >
      <cupLotEmpty v-if="result.isPlayed !== true" :results="result" @openIt="openModalResult(result)"></cupLotEmpty>
      <cupLotPlayed v-else :results="result"></cupLotPlayed>
      <div class="line-container">
        <svg class="cup__line" height="30">
          <line x1="0" y1="0" x2="0" y2="30" style="stroke: rgb(32, 156, 238); stroke-width: 4" />
          <line x1="0" y1="15" x2="550" y2="15" style="stroke: rgb(32, 156, 238); stroke-width: 1" />
        </svg>
      </div>
    </div>
    <b-modal :active.sync="isCardModalActive" :width="640" scroll="clip">
      <modalResult :players="selectedPair" :title="$t('upiiRezultat')" @update="updateResult($event)"></modalResult>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import modalResult from '~/components/modal/ModalResultCupEmpty'
import cupLotEmpty from '~/components/cup/CupLotEmpty'
import cupLotPlayed from '~/components/cup/CupLotPlayed'

export default {
  name: 'CupLotsPlaying',
  components: {
    modalResult,
    cupLotEmpty,
    cupLotPlayed,
  },
  props: {
    results: {
      type: Array,
      required: true,
    },
    numOfPlayers: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isCardModalActive: false,
      selectedPair: [],
    }
  },
  computed: {
    filteredList() {
      return _.filter(this.results, (item) => {
        return item.id !== 0
      })
    },
  },
  methods: {
    // filteredListMetoda(item) {
    //   _.filter(item, (e) => {
    //     e.players[0].roundOfPlay === 1
    //   })
    // },
    openModalResult(item) {
      this.selectedPair = item
      this.isCardModalActive = true
    },
  },
}
</script>
