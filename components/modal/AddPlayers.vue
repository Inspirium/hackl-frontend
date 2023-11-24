<template>
  <div class="members addplayers">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <b-tabs position="is-centered">
      <b-tab-item :label="$t('sviIgrai')" class="p-b-100">
        <div class="search container p-t-0">
          <b-field>
            <b-input
              id="inputsearch"
              v-model="search_term"
              :placeholder="$t('pretraiIgrae')"
              type="search"
              pack="far"
              :icon-right="search_icon"
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
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0 p-r-0" field="first_name">
              <nuxt-link :to="localePath(props.row.link)">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <h3>{{ props.row.display_name }}</h3>
                  <h4>{{ props.row.range + ' ' + $t('godina') }}</h4>
                </div>
                <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>
              </nuxt-link>
            </b-table-column>
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
                  <h4>{{ props.row.range + ' ' + $t('godina') }}</h4>
                </div>
                <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>
              </nuxt-link>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nisteOdabraliIgrae') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="buttons is-fixed m-t-20">
      <b-button type="is-danger" rounded @click="$parent.close()"> {{ $t('zatvori') }} </b-button>
      <b-button :class="[{ blur_button: buttonsDisable }]" type="is-primary" rounded @click="send">
        {{ $t('odaberi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import Player from '~/models/Player'

export default {
  name: 'AddPlayers',
  components: {
    TennisImage,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    selectedPlayers: {
      type: Array,
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
      checkedRows: [...this.selectedPlayers],
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      ageRange: [],
      powerRange: [],
    }
  },
  computed: {
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    buttonsDisable() {
      if (this.checkedRows.length) {
        return false
      }
      return true
    },
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
    send() {
      this.$parent.close()
    },
  },
}
</script>
