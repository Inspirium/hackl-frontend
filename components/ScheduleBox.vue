<template>
  <div
    :class="{
      result__box: true,
      unverified: result.verified === null,
    }"
  >
    <div class="">
      <div class="result__header m-b-10">
        <div class="modal-subtitle is-size-5 align__centar__y">
          <b-icon icon="clock" type="is-primary" pack="fal" size="is-smaller-12" class="m-r-5"> </b-icon>
          <span class="is-size-7 capitalise"> </span>{{ result.from | moment('LT') }}
        </div>
        <div :class="['x-tag', 'is-' + result.court.surface.badge]">
          {{ result.court.name }}
        </div>
      </div>
      <div v-if="result.players.length > 1">
        <div class="comments__box">
          <div class="">
            <div :class="{ result__score: true, 'm-b-5': true }">
              <nuxt-link :to="localePath(result.players[0].link)">
                <TennisImage :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-10" alt="" />
                <h3 class="result__score__box player__name">
                  {{ result.players[0].display_name }}
                </h3>
              </nuxt-link>
            </div>
            <div :class="{ result__score: true }">
              <nuxt-link :to="localePath(result.players[0].link)">
                <TennisImage :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-10" alt="" />
                <h3 class="result__score__box player__name">
                  {{ result.players[1].display_name }}
                </h3>
              </nuxt-link>
            </div>
          </div>
          <div class="results__comments" @click="saveWatchers">
            <div class="buttons">
              <b-icon v-if="userWatching.length > 0" icon="map-marker-minus" type="is-danger" pack="fal"> </b-icon>
              <b-icon v-else icon="map-marker-plus" pack="fal" type="is-grey-lighter"> </b-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-if="false" :class="['attenders__list', { 'attenders__list--expand': attenders_expand }]">
        <span class="is-size-7 fw600"
          >{{ $t('najaviliDolazak') }}
          <span class="x-tag primary-light m-l-auto m-r-5">{{ result.watchers.length }}</span></span
        >
        <div v-for="player in result.watchers" :key="player.id" @click="attenders_expand = !attenders_expand">
          <div class="fw600 is-size-65 name m-r-10">{{ player.display_name }}</div>
          <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import Reservation from '~/models/Reservation'
import Result from '~/models/Result'

export default {
  name: 'ScheduleBox',
  components: {
    TennisImage,
  },
  props: {
    resultItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      result: this.resultItem,
      attenders_expand: false,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    userWatching() {
      return _.filter(this.result.watchers, (item) => {
        return item.id === this.user.id
      })
    },
  },
  mounted() {
    this.getVSResults()
  },
  methods: {
    getVSResults() {
      Result.where('players', this.resultItem.players[1].id + ',' + this.resultItem.players[0].id)
        .get()
        .then((res) => {
          this.my_results = res.data
        })
    },
    saveWatchers() {
      if (this.userWatching.length < 1) {
        const r = new Reservation({ id: this.result.id, watcher: { id: this.user.id } })
        r.save().then((res) => {
          this.result = res
        })
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste najavili dolazak'),
          type: 'is-success',
        })
      } else {
        const r = new Reservation({ id: this.result.id, watcher: { id: this.user.id } })
        r.save().then((res) => {
          this.result = res
        })
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste odjavili dolazak'),
          type: 'is-danger',
        })
      }
    },
  },
}
</script>
