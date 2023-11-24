<template>
  <div class="members">
    <b-tabs position="is-centered">
      <b-tab-item :label="$t('sviIgrai')" class="p-b-100">
        <div class="filters--two container p-t-0 m-b-10">
          <div class="filter">
            <div class="label">{{ $t('jainaIgraa') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalPowerActive = true">
                {{ filterPowerDisplay }}
              </b-button>
            </div>
          </div>
          <div class="filter">
            <div class="label">{{ $t('dobIgraa') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalAgeActive = true">
                {{ $t(filterAgeDisplay) }}
              </b-button>
            </div>
          </div>
        </div>

        <div class="search container p-t-0">
          <b-field>
            <b-input
              id="inputsearch"
              v-model="search_term"
              :placeholder="$t('pretraiIgrae')"
              type="search"
              pack="far"
              icon-right="search"
              icon-right-clickable
              @icon-right-click="search_term = ''"
            >
            </b-input>
          </b-field>
        </div>

        <div class="tablelist">
          <b-table
            :data="club_players"
            :checkbox-position="checkboxPosition"
            :checked-rows.sync="checkedRows"
            :bordered="false"
            :mobile-cards="false"
            checkbox-type="is-info"
            checkable
          >
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0" field="first_name">
              <nuxt-link :to="localePath(props.row.link)">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <h3>{{ props.row.display_name }}</h3>
                  <h4>{{ $t('godina range', { range: props.row.players[0].range }) }}</h4>
                </div>
                <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>
              </nuxt-link>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihIgraa') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('odabrani')">
        <div class="tablelist">
          <b-table
            :data="checkedRows"
            :checkbox-position="checkboxPosition"
            :checked-rows.sync="checkedRows"
            :bordered="false"
            :mobile-cards="false"
            checkbox-type="is-info"
            checkable
          >
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0" field="first_name">
              <nuxt-link :to="localePath(props.row.link)">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <h3>{{ props.row.display_name }}</h3>
                  <h4>{{ $t('godina range', { range: props.row.players[0].range }) }}</h4>
                </div>
                <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>
              </nuxt-link>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('naalostNemaLanovaPodTimUvjetima') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalAgeActive" :width="640" scroll="clip">
      <modalrange
        :title="$t('dob')"
        :subtitle="$t('Filtriraj popis prema dobi igrača')"
        :suffix="$t('godina')"
        @update="updateAge"
      ></modalrange>
    </b-modal>
    <b-modal :active.sync="isModalPowerActive" :width="640" scroll="clip">
      <modalrange
        :title="$t('snage')"
        :subtitle="$t('Filtriraj popis prema snazi igrača')"
        suffix="%"
        @update="updatePower"
      ></modalrange>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import ModalRange from '~/components/modal/ModalSelectRange'
import Player from '~/models/Player'

export default {
  name: 'MemberSearchMulti',
  components: {
    modalrange: ModalRange,
    TennisImage,
  },
  props: {
    players: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    await this.getPlayers()
  },
  data() {
    return {
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      last_page: 1,
      activeTab: 0,
      checkboxPosition: 'left',
      checkedRows: [],
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      ageRange: [],
      powerRange: [],
    }
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.offset = 1
        this.debouncedGetPlayers()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getPlayers()
      }
    },
    checkedRows: {
      handler() {
        this.$emit('update', this.checkedRows)
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  search_icon() {
    if (this.search_term !== '') {
      return 'times'
    } else {
      return 'search'
    }
  },
  methods: {
    async getPlayers() {
      if (this.last_page < this.offset) return
      await Player.page(this.offset)
        .where('age', this.ageRange.join(','))
        .where('power', this.powerRange.join(','))
        .where('display_name', this.search_term)
        .where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.club_players = res.data
          } else {
            this.club_players = [...this.club_players, ...res.data]
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    updateAge(data) {
      this.offset = 1
      this.filterAgeDisplay = data.label
      this.ageRange = data.range
      this.getPlayers()
    },
    updatePower(data) {
      this.offset = 1
      this.filterPowerDisplay = data.label
      this.powerRange = data.range
      this.getPlayers()
    },
    next() {
      this.$emit('next')
    },
  },
}
</script>
