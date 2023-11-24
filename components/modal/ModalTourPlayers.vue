<template>
  <div class="p-b-300">
    <div class="modal-title has-text-light">{{ $t('Popis igrača') }}</div>
    <div class="modal-subtitle has-text-light m-b-20 m-t-10">
      {{ tour.name }}
    </div>
    <div class="for-list">
      <div v-for="(item, index) in sortedData" :key="index">
        <template v-if="sortedData.length">
          <div
            v-if="
              item.pivot.final_status !==
              sortedData[index === 0 ? index + sortedData.length - 1 : index - 1].pivot.final_status
            "
            class="is-size-6 has-text-white m-b-2 m-t-15"
          >
            {{ $t(positionLabel(item)) }}
          </div>
        </template>
        <div
          class="list__image-col cursor align__centar__y"
          @click="$router.push(localePath('/player/' + item.players[0].id))"
        >
          <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
          <div class="list__content">
            <h3 class="fw500 is-size-5">{{ item.display_name }}</h3>
          </div>
        </div>
      </div>
      <div v-if="notPlayed.length" class="has-text-danger fw600 m-t-30 m-b-2">{{ $t('Nisu odigrali mečeve') }}</div>
      <div
        v-for="(item, index) in notPlayed"
        :key="index"
        class="list__image-col cursor align__centar__y"
        @click="
          select = index
          selectObject = item
        "
      >
        <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
        <div class="list__content">
          <h3 class="fw600 is-size-5 has-text-black80">{{ item.display_name }}</h3>
        </div>
      </div>
    </div>
    <div v-if="confirm" class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'ModalTourPlayers',
  props: {
    tour: {
      type: Array,
      required: true,
    },
    confirm: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      select: null,
      selectObject: {},
    }
  },
  computed: {
    tourRounds() {
      const players = this.tour.players.length
      if (players <= 4) {
        return 2
      } else if (players > 4 && players <= 8) {
        return 3
      } else if (players > 8 && players <= 16) {
        return 4
      } else if (players > 16 && players <= 32) {
        return 5
      } else if (players > 32 && players <= 64) {
        return 6
      } else if (players > 64 && players <= 128) {
        return 7
      } else if (players > 128 && players <= 256) {
        return 8
      }
      return 2
    },
    filterPlayers() {
      return this.tour.players.filter((item) => {
        return item.pivot.final_status !== null
      })
    },
    notPlayed() {
      return this.tour.players.filter((item) => {
        return item.pivot.final_status === null
      })
    },
    sortedData() {
      return this.filterPlayers.slice().sort((a, b) => {
        const aValue = Number(a.pivot.final_status.split('/')[0])
        const bValue = Number(b.pivot.final_status.split('/')[0])
        return bValue - aValue
      })
    },
  },
  watch: {
    select() {
      if (!this.confirm) {
        this.send()
      }
    },
  },
  methods: {
    positionLabel(item) {
      if (item.pivot.final_status === null) {
        return 'Nije odigrao prvi meč'
      }
      const tr = this.tourRounds
      const pp = item.pivot.final_status[0]
      const currentTotal = tr - pp

      if (tr === undefined || tr === -1) {
        return ''
      }
      const user = item.pivot.final_status
      if (user) {
        if (user === '*') {
          return 'Pobjednik'
        }
        switch (currentTotal) {
          case 0:
            return 'Finale'
          case 1:
            return 'Polufinale'
          case 2:
            return 'Četvrtfinale'
          case 3:
            return 'Osmina finala'
          case 4:
            return 'Šesnaestina finala'
          case 5:
            return '1/32 finala'
          case 6:
            return '1/64 finala'
          case 7:
            return '1/128 finala'
        }
      }
      return ''
    },
  },
}
</script>
