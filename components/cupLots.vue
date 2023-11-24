<template>
  <div class="members">
    <transition name="fade">
      <div v-show="playerList.length" class="activity__header m-b-5">
        <div class="fw600 is-size-5">{{ $t('nerasporeeniIgrai', { length: playerList.length }) }}</div>
      </div>
    </transition>
    <div class="cup__players-list">
      <div v-for="player in playerList" :key="player.id">
        <TennisImage :size="[42, 42]" :src="player.user_image" class="user_image" alt="" />
      </div>
    </div>
    <transition name="fade">
      <nuxt-link v-show="playerList.length === 0" :to="localePath('/cup/')" class="buttons m-t-30">
        <b-button
          class="m-l-10 fw600"
          size="is-large"
          type="is-primary"
          pack="fal"
          icon-right="tennis-ball"
          rounded
          @click="save"
        >
          {{ $t('spremiTurnir') }}
        </b-button>
      </nuxt-link>
    </transition>
    <b-tabs position="is-centered">
      <b-tab-item :label="$t('drijeb')">
        <div class="buttons m-t-20">
          <b-button class="m-l-10" type="is-danger" pack="far" icon-right="random" rounded @click="randomOrder">
            {{ $t('nasuminiRaspored') }}
          </b-button>
        </div>
        <transition name="fade"> </transition>
        <div class="tablelist cup-lots-table">
          <b-table
            :data="defaultPlayerList"
            :bordered="false"
            :selected.sync="selectedPlayerIndex"
            :mobile-cards="false"
            draggable
            @dragstart="dragstart"
            @drop="drop"
            @dragover="dragover"
            @dragleave="dragleave"
          >
            <template v-if="defaultPlayerList.length">
              <b-table-column v-slot="props" cell-class="list__image-col" field="first_name">
                <div v-if="props.row.name !== ''" class="align__centar__y" @click="removePlayer(props.row)">
                  <div class="counter">{{ props.row.order + 1 }}.</div>
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.user_image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h3>{{ props.row.name }}</h3>
                    <h4>{{ $t('godina3', { age: props.row.age }) }}</h4>
                  </div>
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                </div>
                <div v-else class="activity__header" @click="isModalMembersActive = true">
                  <div class="counter">{{ props.row.order + 1 }}.</div>
                  <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                  <div class="list__content">
                    <h3>{{ $t('dodajIgraa') }}</h3>
                  </div>
                </div>
              </b-table-column>
              <svg class="cup__line" height="20" width="10">
                <line x1="0" y1="0" x2="0" y2="200" style="stroke: rgb(32, 156, 238); stroke-width: 4" />
              </svg>
            </template>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-circle" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihIgraa') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('nositelji')">
        <div class="buttons m-t-20">
          <b-button
            class="m-l-10"
            type="is-danger"
            icon-right="chevron-down"
            pack="fal"
            rounded
            @click="isModaSelectActive = true"
          >
            {{ seedsNumber === 0 ? $t('Odaberi broj nositelja') : seedsNumber + ' ' + $t('nositelja') }}
          </b-button>
        </div>
        <div class="tablelist cup-seeds-table">
          <b-table
            :data="seeds"
            :bordered="false"
            :selected.sync="selectedSeedIndex"
            :mobile-cards="false"
            draggable
            @dragstart="dragstart"
            @drop="drop"
            @dragover="dragover"
            @dragleave="dragleave"
          >
            <template v-if="seeds">
              <b-table-column v-slot="props" cell-class="list__image-col" field="first_name">
                <div v-if="props.row.name !== ''" class="align__centar__y" @click="removeSeed(props.row)">
                  <div class="counter">{{ props.row.isSeed + 1 }}.</div>
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.user_image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h3>{{ props.row.name }}</h3>
                    <h4>{{ $t('godina3', { age: props.row.age }) }}</h4>
                  </div>
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                </div>
                <div v-else class="activity__header" @click="isModalSeedActive = true">
                  <div class="counter">{{ props.row.isSeed + 1 }}.</div>
                  <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                  <div class="list__content">
                    <h3>{{ $t('dodajNositelja') }}</h3>
                  </div>
                </div>
              </b-table-column>
            </template>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="arrow-up" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('odaberiteBrojNositelja') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers :player-list="playerList" :title="$t('dodajteIgraa')" @update="updatePlayerList"></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalSeedActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers :player-list="seedsList" :title="$t('dodajteNositelja')" @update="updateSeedList"></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
      <modalSelect
        :options="numOfSeeds"
        :title="$t('nositelji')"
        :subtitle="$t('Odaberite ukupni broj nositelja')"
        @update="seedsNumber = $event"
      ></modalSelect>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import modalMembers from '~/components/modal/ModalMembers'
import modalSelect from '~/components/modal/ModalSelect'

export default {
  name: 'CupLots',
  components: {
    modalMembers,
    modalSelect,
    TennisImage,
  },
  props: {
    players: {
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
      isModalMembersActive: false,
      isModalSeedActive: false,
      isModaSelectActive: false,
      playerList: [],
      selectedSeedIndex: {},
      seedsNumber: 0,
      seeds: [],
      seedsList: [],
      defaultPlayerList: [],
      selectedPlayer: [],
      selectedPlayerIndex: {},
      draggingRow: null,
      draggingRowIndex: null,
      droppedOnRowIndex: null,
    }
  },
  computed: {
    numOfSeeds() {
      switch (this.numOfPlayers) {
        case 4:
          return [2]
        case 8:
          return [2, 4]
        case 16:
          return [2, 4, 8]
        case 32:
          return [2, 4, 8, 16]
        case 64:
          return [2, 4, 8, 16, 32]
        case 128:
          return [2, 4, 8, 16, 32, 64]
        case 256:
          return [2, 4, 8, 16, 32, 64]
      }
      return ''
    },
  },
  watch: {
    players: {
      handler() {
        this.playerList = _.clone(this.players)
        this.seedsList = this.playerList
      },
    },
    defaultPlayerList: {
      handler() {
        if (this.defaultPlayerList.length > 0) {
          for (let i = 0; i < this.defaultPlayerList.length; i++) {
            this.defaultPlayerList[i].order = i
          }
        }
      },
    },
    seeds: {
      handler() {
        if (this.seeds.length > 0) {
          for (let i = 0; i < this.seeds.length; i++) {
            this.seeds[i].isSeed = i
          }
        }
      },
    },
    numOfPlayers: {
      handler() {
        this.defaultPlayerList = []
        for (let i = 0; i < this.numOfPlayers; i++) {
          this.defaultPlayerList.push({
            order: i,
            name: '',
          })
        }
      },
    },
    seedsNumber: {
      handler() {
        this.seeds = []
        for (let i = 0; i < this.seedsNumber; i++) {
          this.seeds.push({
            order: i,
            name: '',
          })
        }
      },
    },
  },
  methods: {
    removePlayer(item) {
      const index = this.defaultPlayerList.indexOf(item)
      this.playerList.push(item)
      this.defaultPlayerList.splice(index, 1, { order: 1, name: '' })
    },
    randomOrder() {
      this.defaultPlayerList = _.shuffle(this.players)
      this.playerList = []
    },
    updatePlayerList(player) {
      this.selectedPlayer.splice(0, 1, player)
      this.playerList.splice(this.playerList.indexOf(player), 1)
      player.order = this.selectedPlayerIndex.order
      this.defaultPlayerList.splice(this.selectedPlayerIndex.order, 1, player)
    },
    updateSeedList(player) {
      this.seedsList.splice(this.seedsList.indexOf(player), 1)
      // this.selectedPlayer.splice(0, 1, player)
      this.seeds.splice(this.selectedSeedIndex.isSeed, 1, player)
      this.$set(player, 'isSeed', 1)
    },
    removeSeed(item) {
      this.seedsList.push(item)
      const index = this.seeds.indexOf(item)
      this.seeds.splice(index, 1, { isSeed: 0, order: 1, name: '' })
      this.$set(item, 'isSeed', 0)
    },
    dragstart(payload) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'copy'
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = 'copy'
      payload.event.target.closest('tr').classList.add('is-selected')
      payload.event.preventDefault()
    },
    dragleave(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      payload.event.preventDefault()
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      this.droppedOnRowIndex = payload.index
      const droppedOnRowIndex = payload.index
      this.defaultPlayerList.splice(payload.index, 1, this.defaultPlayerList[this.draggingRowIndex])
      this.defaultPlayerList.splice(this.draggingRowIndex, 1, payload.row)
      this.$buefy.toast.open(
        `Premješten igrač ${this.draggingRow.name} s pozicije ${this.draggingRowIndex + 1} na ${droppedOnRowIndex + 1}`
      )
    },
    save() {
      return ''
    },
  },
}
</script>
