<template>
  <div class="members">
    <hero :page="'doubles'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('popisParova') }}</h1>
    </hero>
    <div class="buttons m-t-30">
      <b-button
        class="fw600"
        type="is-danger"
        pack="fal"
        icon-right="plus-circle"
        rounded
        tag="nuxt-link"
        :to="localePath('/doubles/new')"
      >
        {{ $t('izradiNoviPar') }}
      </b-button>
    </div>

    <b-tabs v-model="activeTab" size="is-medium" position="is-centered">
      <b-tab-item :label="$t('parovi')" class="p-b-100">
        <div id="inputsearch" class="search container m-t--10">
          <b-field>
            <b-input
              v-model="search_term"
              :placeholder="$t('pretraiParove')"
              type="search"
              pack="far"
              :icon-right="search_icon"
              icon-right-clickable
              @icon-right-click="search_term = ''"
            >
              >
            </b-input>
          </b-field>
        </div>
        <div class="total__members">
          <h6 class="fw600 flex align__centar__all">
            {{ $t('ukupnoParova') }}
            <span>{{ total }}</span>
          </h6>
        </div>
        <div class="tablelist x-container">
          <b-table class="softshadow" :data="club_players" :mobile-cards="false" :bordered="false">
            <b-table-column v-slot="props" cell-class="list__image-col">
              <div class="flex">
                <nuxt-link :to="localePath('/team/' + props.row.id)" class="w100">
                  <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="props.row.players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="props.row.players[1].image"
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image border__white--2" alt="" />
                  </div>
                  <div class="list__content">
                    <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                  </div>
                  <!--                  <b-tag v-if="props.row.rating !== null" type="is-info" class="m-l-auto">{{-->
                  <!--                    Math.round(props.row.rating)-->
                  <!--                  }}</b-tag>-->
                </nuxt-link>
                <div v-if="checkIfEdit(props.row.players)" class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-primary"
                    rounded
                    size="is-smaller"
                    @click="$router.push(localePath('/doubles/' + props.row.id + '/edit'))"
                    >{{ $t('Uredi') }}</b-button
                  >
                </div>
              </div>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaParova') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('mojiParovi')" class="p-b-100">
        <div class="tablelist x-container">
          <b-table class="softshadow" :data="myTeams" :mobile-cards="false" :bordered="false">
            <b-table-column v-slot="props" cell-class="list__image-col">
              <div class="flex">
                <nuxt-link :to="localePath('/doubles/' + props.row.id)" class="w100">
                  <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="props.row.players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="props.row.players[1].image"
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image border__white--2" alt="" />
                  </div>
                  <div class="list__content">
                    <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                  </div>
                  <!--                  <b-tag v-if="props.row.rating !== null" type="is-info" class="m-l-auto">{{-->
                  <!--                    Math.round(props.row.rating)-->
                  <!--                  }}</b-tag>-->
                </nuxt-link>
                <div v-if="checkIfEdit(props.row.players)" class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-primary"
                    rounded
                    size="is-smaller"
                    @click="$router.push(localePath('/doubles/' + props.row.id + '/edit'))"
                    >{{ $t('Uredi') }}</b-button
                  >
                </div>
              </div>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemateUnesenihParova') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalAgeActive" :width="640" scroll="clip">
      <modal-range
        :title="$t('dob')"
        :subtitle="$t('Filtriraj popis prema dobi igrača')"
        :suffix="$t('godina')"
        @update="updateAge"
      ></modal-range>
    </b-modal>
    <b-modal :active.sync="isModalPowerActive" :width="640" scroll="clip">
      <modal-range
        :title="$t('snage')"
        :subtitle="$t('Filtriraj popis prema snazi igrača')"
        suffix="%"
        @update="updatePower"
      ></modal-range>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import modalRange from '~/components/modal/ModalSelectRange'
// import Player from '~/models/Player'
import Team from '~/models/Team'

export default {
  name: 'Doubles',
  components: {
    hero,
    modalRange,
    TennisImage,
  },
  async fetch() {
    await this.getTeams()
    await this.getMyTeams()
  },
  data() {
    return {
      heroImage: '/hero_doubles.jpg',
      activeTab: 0,
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      player_memberships: [],
      myTeams: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.offset = 1
        this.debouncedGetTeams()
      } else {
        this.getTeams()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getTeams()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  created() {
    this.debouncedGetTeams = _.debounce(this.getTeams, 500)
  },
  methods: {
    checkIfEdit(players) {
      if (players[0].id === this.user.id || players[1].id === this.user.id) {
        return true
      }
      return false
    },
    search_icon_click() {
      this.search_term = ''
    },
    getTeams() {
      if (this.last_page < this.offset) return
      Team.page(this.offset)
        .include('players')
        .where('display_name', this.search_term)
        .where('club', this.$store.state.club.id)
        .where('number_of_players', 2)
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
    getMyTeams() {
      Team.where('number_of_players', 2)
        .where('players', this.user.id)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.myTeams = res.data
          } else {
            this.myTeams = [...this.myTeams, ...res.data]
          }
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    updateAge(data) {
      this.offset = 1
      this.filterAgeDisplay = data.label
      this.ageRange = data.range
      this.getTeams()
    },
    updatePower(data) {
      this.offset = 1
      this.filterPowerDisplay = data.label
      this.powerRange = data.range
      this.getTeams()
    },
  },
}
</script>
