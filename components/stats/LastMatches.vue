<template>
  <div>
    <transition name="fade">
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
    </transition>
    <div v-if="results.length">
      <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered">
        {{ $t('posljednjiSusreti') }}
      </div>
      <div class="results">
        <div v-for="(game, index) in results" :key="index" class="m-b-10">
          <div class="activity__results">
            <div class="activity__box">
              <div class="results__list">
                <versusLotPlayed class="relative z-1" :show-options="true" :game="game"> </versusLotPlayed>
              </div>
            </div>
          </div>
        </div>
        <!--        Dodati team result i za singlove-->
        <div v-if="results.length" class="buttons m-t-20">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="long-arrow-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/team/' + team + '/results')"
          >
            {{ $t('vieRezultata') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Result from '~/models/Result'
import versusLotPlayed from '~/components/versusLotPlayed'

export default {
  name: 'PlayerStats',
  components: { versusLotPlayed },
  props: {
    team: {
      type: Number,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      results: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.getTeam()
  },
  methods: {
    getTeam() {
      this.loading = true
      Result.where('team', this.team)
        .limit(3)
        .get()
        .then((res) => {
          this.results = res.data
          this.loading = false
        })
    },
  },
}
</script>
