<template>
  <div class="modal-simple members results">
    <div class="input__result">
      <div class="input__result__navigation"></div>
      <b-tabs v-model="activeTab" position="is-centered">
        <b-tab-item :label="$t('1Korak')">
          <div class="members modal__members">
            <div class="modal-title has-text-light m-b-5 title__set">
              <span>{{ activeSet + 1 }}</span
              >{{ titleSets }}
            </div>
            <div class="modal__content__width">
              <div
                class="navigation"
                @click="
                  leftArrow()
                  rightArrowStyle = true
                "
              >
                <b-icon icon="chevron-left" size="is-large" pack="fal"> </b-icon>
              </div>
              <div class="input__result__box">
                <div class="player__score">
                  <div class="display__name">
                    {{ results[0].players[0].name }}
                  </div>
                  <div class="display__sets">
                    <TennisImage :size="[42, 42]" :src="results[0].players[0].user_image" class="user_image" alt="" />
                    <div
                      v-for="set in [0, 1, 2, 3, 4, 5, 6, 7]"
                      :key="set"
                      :class="{
                        display__sets__item: true,
                        active: selectedItem(set, 0),
                      }"
                      @click.stop="
                        updateScorePlayer(set, 0)
                        rightArrow()
                      "
                    >
                      <div class="select-item">{{ set }}</div>
                    </div>
                  </div>
                </div>
                <div class="player__score m-l-15">
                  <div class="display__sets">
                    <TennisImage :size="[42, 42]" :src="results[0].players[1].user_image" class="user_image" alt="" />
                    <div
                      v-for="set in [0, 1, 2, 3, 4, 5, 6, 7]"
                      :key="set"
                      :class="{
                        display__sets__item: true,
                        active: selectedItem(set, 1),
                      }"
                      @click.stop="
                        updateScorePlayer(set, 1)
                        rightArrow()
                      "
                    >
                      <div class="select-item">{{ set }}</div>
                    </div>
                  </div>
                  <div class="display__name">
                    {{
                      results[0].players[1].name ? results[0].players[1].name : $t('Nije odabran partner'),
                    }}
                  </div>
                </div>
              </div>
              <div
                :class="rightArrowStyle ? 'right-arrow' : ''"
                :style="activeSet === 4 ? 'display: none' : ''"
                class="navigation"
                @click="
                  activeSet++
                  rightArrow()
                "
              >
                <b-icon icon="chevron-right" size="is-large" pack="fal" @click="activeSet++"> </b-icon>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('2Korak')">
          <div class="members modal__members">
            <div class="modal-title has-text-light m-b-5 title__set">{{ $t('vrstaPodloge') }}</div>
            <div class="modal-subtitle has-text-light m-b-20">{{ $t('naKojojSePodloziOdigraoMe') }}</div>
            <div class="modal__content__width">
              <div
                class="navigation"
                @click="
                  activeTab--
                  rightArrowStyle = true
                "
              >
                <b-icon icon="chevron-left" size="is-large" pack="fal"> </b-icon>
              </div>

              <div class="filter-list">
                <div
                  v-for="court in courts"
                  :key="court"
                  :class="{
                    'select-item': true,
                    active: selectedCourt === court,
                  }"
                  @click="
                    courtSelected(court)
                    activeTab++
                  "
                >
                  <div>{{ court.title }} {{ results[0].court[0] }}</div>
                </div>
              </div>
              <div
                :class="{ 'right-arrow': true }"
                class="navigation"
                @click="
                  activeSet++
                  rightArrow()
                "
              >
                <b-icon icon="chevron-right" size="is-large" pack="fal" @click="activeSet++"> </b-icon>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('3Korak')">
          <div class="activity__results invert">
            <div class="modal-title has-text-light m-b-5">{{ $t('potvrdaRezultata') }}</div>
            <div class="modal-subtitle has-text-light m-b-20">
              {{ $t('potvrdomRezultataVaPartnerDobitiEZahtjevZaPotvrduR') }}
            </div>
            <div class="activity__box">
              <div class="results__list">
                <div v-for="(result, index) in results" :key="result.id" class="result__box">
                  <div class="result__header">
                    <div class="modal-subtitle">
                      {{ result.created_at }}
                    </div>
                    <div class="x-tag is-clay">{{ result.court.title }}</div>
                  </div>
                  <p class="modal-subtitle">
                    {{ result.players[0].name }}
                  </p>
                  <div class="comments__box">
                    <div class="">
                      <div
                        :class="
                          (!result.winner ? '' : 'is-won',
                          {
                            result__score: true,
                          })
                        "
                      >
                        <nuxt-link :to="localePath('/member')">
                          <TennisImage
                            :size="[42, 42]"
                            :src="results[0].players[0].user_image"
                            class="user_image m-r-5"
                            alt=""
                          />
                          <div class="result__score__box">
                            <div
                              v-for="(set, i) in result.sets"
                              v-show="set[0] !== set[1]"
                              :key="'set' + i"
                              :class="{
                                result__score__item: true,
                                'is-set': set[0] > set[1],
                                'is-set-lose': result.winner,
                              }"
                            >
                              {{ set[0] }}
                            </div>
                          </div>
                        </nuxt-link>
                      </div>
                      <div
                        :class="
                          (result.winner ? '' : 'is-won',
                          {
                            result__score: true,
                            'm-t-5': true,
                          })
                        "
                      >
                        <nuxt-link :to="localePath('/member')">
                          <TennisImage
                            :size="[42, 42]"
                            :src="results[0].players[1].user_image"
                            class="user_image m-r-5"
                            alt=""
                          />
                          <div class="result__score__box">
                            <div
                              v-for="(set, i) in result.sets"
                              v-show="set[0] !== set[1]"
                              :key="'set' + i"
                              :class="{
                                result__score__item: true,
                                'is-set': set[1] > set[0],
                                'is-set-lose': !result.winner,
                              }"
                            >
                              {{ set[1] }}
                            </div>
                          </div>
                        </nuxt-link>
                      </div>
                    </div>
                    <div class="results__comments">
                      <div class="buttons">
                        <div class="results__comments__number">
                          {{ results[index].comment_count }}
                        </div>
                        <b-icon icon="comment-alt" pack="fal"> </b-icon>
                      </div>
                    </div>
                  </div>
                  <p class="modal-subtitle">
                    {{ result.players[1].name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade">
            <div class="modal-confirmation">
              <div class="buttons m-t-20">
                <b-button
                  class="m-l-10"
                  type="is-danger"
                  pack="far"
                  icon-right="undo-alt"
                  rounded
                  @click="
                    activeTab = 0
                    activeSet = 0
                  "
                >
                  {{ $t('izmijeni') }}
                </b-button>
                <b-button class="m-l-10" type="is-primary" pack="far" icon-right="check" rounded @click="send">
                  {{ $t('potvrdi') }}
                </b-button>
              </div>
            </div>
          </transition>
        </b-tab-item>
      </b-tabs>
      <div class="input__result__navigation"></div>
    </div>
    <transition name="fade">
      <div :style="activeTab === 2 || activeTab === 3 ? 'display: none' : ''" class="modal-confirmation">
        <div class="buttons is-full-modal is-fixed only-one-button m-t-20">
          <b-button
            type="primary-light"
            pack="fal"
            icon-right="tennis-ball"
            class="large__icon"
            rounded
            @click="
              activeTab = 1
              rightArrow()
            "
          >
            {{ $t('gotovMe') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'ModalResult',
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
      default: 'Podnaslov',
    },
    players: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      titleSets: '. set',
      activeTab: 0,
      activeSet: 0,
      rightArrowStyle: false,
      bla: '',
      search: '',
      isConfirmation: false,
      selectedCourt: [],
      selected: {},
      courts: [
        {
          id: 1,
          badge: 'clay',
          title: 'Zemlja',
          fill: '#d96d00',
        },
        {
          id: 2,
          badge: 'clay',
          title: 'Beton',
          fill: '#d96d00',
        },
        {
          id: 3,
          badge: 'clay',
          title: 'Akril',
          fill: '#d96d00',
        },
        {
          id: 4,
          badge: 'clay',
          title: 'Tepih',
          fill: '#d96d00',
        },
        {
          id: 5,
          badge: 'clay',
          title: 'Trava',
          fill: '#d96d00',
        },
      ],
      results: [
        {
          comment_count: 0,
          isPlayed: false,
          winner: false,
          verified: 1,
          points: 15.26,
          created_at: '2018-04-27 22:01:50',
          court: {
            id: 6,
            badge: 'clay',
            title: 'zemlja',
            fill: '#d96d00',
          },
          players: [
            {
              id: 1,
              name: 'Stjepan Drmic',
              user_image: require('../../assets/img/members.jpg'),
              elo: 1303,
              age: 21,
              rank: 2,
            },
            {
              id: 0,
              name: '',
              user_image: require('../../assets/img/members.jpg'),
              elo: 0,
              age: 0,
              rank: 0,
            },
          ],
          sets: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        },
      ],
    }
  },
  watch: {
    selected: {
      handler() {
        this.results[0].players.splice(1, 1, this.selected)
      },
    },
    selectedCourt: {
      handler() {
        this.results[0].court = this.selectedCourt
      },
    },
  },
  mounted() {
    this.results.splice(0, 1, this.players)
  },
  methods: {
    courtSelected(e) {
      this.selectedCourt = e
    },
    leftArrow() {
      if (this.activeSet === 0) {
        this.activeTab--
      } else {
        this.activeSet--
      }
    },
    rightArrow() {
      // check if set has a winner
      if (this.results[0].sets[this.activeSet][0] !== this.results[0].sets[this.activeSet][1]) {
        this.rightArrowStyle = true
        // disable next button if no winner
      } else {
        this.rightArrowStyle = false
      }
      if (this.activeSet === 5) {
        this.rightArrowStyle = true
        this.activeTab = 2
      }
      if (this.activeTab === 2) {
        this.rightArrowStyle = true
        this.activeTab = 3
      }
    },
    selectedItem(set, player) {
      if (set === this.results[0].sets[this.activeSet][player]) {
        return 'active'
      }
    },
    updateScorePlayer(e, player) {
      this.results[0].sets[this.activeSet].splice(player, 1, e)
    },
    send() {
      this.results[0].isPlayed = true
      this.$parent.close()
    },
  },
}
</script>
