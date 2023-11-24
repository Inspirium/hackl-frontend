<template>
  <div v-if="true" class="results">
    <transition name="slide-fade" mode="out-in">
      <div v-if="!isGameStarted" class="fw600 is-size-55 small-hero w100 m-b-10 is-red rounded-md has-text-white">
        <div class="has-text-centered">{{ $t('livePrijenos') }}</div>
      </div>
    </transition>
    <hero v-if="isGameStarted && startResults" :options="heroImage">
      <h1 class="has-text-white">{{ $t('liveRezultati') }}</h1>
    </hero>
    <div v-if="Object.keys(result).length" class="x-container disable-dbl-all">
      <template v-if="isGameStarted && startResults">
        <div class="tab__header m-b-10 m-t-20">
          <div class="is-size-4">{{ $t('unesiPoetniRezultat') }}</div>
        </div>
        <div class="results__list disable-dbl-all">
          <resultBox v-if="result.id" :result="result" @update="updateCurrentResult($event)"> </resultBox>
        </div>
        <div class="buttons m-b-20">
          <b-button
            :class="startResults ? '' : 'blur_button'"
            class="fw600 m-t-20"
            type="is-primary"
            pack="fal"
            icon-right="arrow-circle-right"
            rounded
            @click="
              startResults = false
              live.activeTab = 0
              start()
            "
          >
            {{ $t('zaponiPrijenos') }}
          </b-button>
        </div>
      </template>
      <template v-else>
        <div class="results__list m-t-10">
          <resultBoxLivePlaying v-if="result.id" :result="result" :live="live"> </resultBoxLivePlaying>
          <transition name="slide-fade" mode="out-in">
            <div
              v-if="live.isTieBreak && !live.pause"
              class="fw600 m-b-15 is-size-55 z--2 tie-break__live__label w100 m-b-10 m-t--10 is-red rounded-md has-text-white"
            >
              <div class="has-text-centered">Tie-break</div>
            </div>
          </transition>
          <transition name="slide-fade" mode="out-in">
            <div
              v-if="live.pause"
              class="fw600 m-b-15 is-size-55 z--2 tie-break__live__label w100 m-b-10 m-t--10 is-red rounded-md has-text-white"
            >
              <div class="has-text-centered">{{ $t('pauza') }}</div>
            </div>
          </transition>
          <b-tabs v-model="live.activeTab" position="is-centered" class="hide_tab_navigation">
            <b-tab-item v-if="!live.pause" :label="$t('1Korak')">
              <div class="fw600 is-size-4 w100 m-b-10 m-t--10">
                <div class="has-text-centered">{{ $t('tkoServira') }}</div>
              </div>
              <div class="live__action__box">
                <div class="live__actions">
                  <div
                    :class="live.whoServing === 0 ? 'live__box--selected--blue' : ''"
                    class="live__box min-h-15 border-top border-color-lightblue"
                    @click="live.whoServing = 0"
                  >
                    <TennisImage :size="[42, 42]" :src="result.players[0].image" class="user_image m-r-5" alt="" />
                    <p :class="live.whoServing === 0 ? 'has-text-white' : ''" class="fw600 is-size-6 m-t-5">
                      {{ result.players[0].display_name }}
                    </p>
                  </div>
                </div>
                <div class="live__actions">
                  <div
                    :class="live.whoServing === 1 ? 'live__box--selected--red' : ''"
                    class="live__box min-h-15 border-top border-color-red"
                    @click="live.whoServing = 1"
                  >
                    <TennisImage :size="[42, 42]" :src="result.players[1].image" class="user_image m-r-5" alt="" />
                    <p :class="live.whoServing === 1 ? 'has-text-white' : ''" class="fw600 is-size-6 m-t-5">
                      {{ result.players[1].display_name }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="buttons">
                <b-button
                  :class="live.whoServing !== null ? '' : 'blur_button'"
                  class="fw600 m-t-20"
                  type="is-primary"
                  pack="fal"
                  icon-right="arrow-circle-right"
                  rounded
                  @click="live.activeTab = 1"
                >
                  {{ $t('potvrdi') }}
                </b-button>
              </div>
            </b-tab-item>
            <b-tab-item v-if="live.whoServing !== null && !live.pause" :label="$t('2Korak')">
              <div v-if="live.isAdvanced" class="fw600 is-size-4 w100 m-b-10 m-t--10">
                <div class="has-text-centered transition p-t-5 p-b-5">
                  {{
                    $t('key', {
                      expr:
                        live.firstServe === 0
                          ? 'Prvi servis - ' + result.players[live.whoServing].display_name
                          : 'Drugi servis - ' + result.players[live.whoServing].display_name,
                    })
                  }}
                </div>
              </div>
              <div v-if="isGameStarted" class="buttons m-b-10">
                <b-button
                  class="m-b-0 softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="random"
                  rounded
                  @click="switchSidesPlayers()"
                >
                  {{ $t('zamijeniStraneIgraa') }}
                </b-button>
              </div>

              <transition name="slide-fade" mode="out-in">
                <div v-if="!isGameStarted" class="buttons m-t-10 m-b-5">
                  <transition name="slide-fade" mode="out-in">
                    <b-button
                      v-if="(!isEqualeGem || isNewSet) && !live.isTieBreak && isGemStarted"
                      class="m-b-15 softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="check"
                      rounded
                      @click.prevent="isModalActive = true"
                    >
                      {{ $t('gotovMe') }}
                    </b-button>
                  </transition>
                  <transition name="slide-fade" mode="out-in">
                    <b-button
                      v-if="live.sets.length < 5 && !isEqualeGem && isGemStarted"
                      class="m-b-15 softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="tennis-ball"
                      rounded
                      @click.prevent="finishSet()"
                    >
                      {{ $t('gotovSet') }}
                    </b-button>
                  </transition>
                  <transition name="slide-fade" mode="out-in">
                    <b-button
                      v-if="isEqualeGem && isGemStarted && !live.isTieBreak"
                      class="m-b-15 softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="check"
                      rounded
                      @click="startTiebreak()"
                    >
                      {{ $t('unesiTiebreak') }}
                    </b-button>
                  </transition>
                </div>
              </transition>

              <transition name="slide-fade" mode="out-in">
                <template v-if="live.isTieBreak">
                  <div class="buttons m-b-20">
                    <b-button
                      class="softshadow invert-small-button"
                      type="is-small noborder is-danger has-text-white"
                      pack="fal"
                      icon-right="times"
                      rounded
                      @click="cancelTieBreak()"
                    >
                      {{ $t('otkai') }}
                    </b-button>

                    <b-button
                      :class="{ blur_button: live.tieBreak[currentSet][0] === live.tieBreak[currentSet][1] }"
                      class="m-b-0 m-t--10 softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="check"
                      rounded
                      @click="finishTiebreak()"
                    >
                      {{ $t('gotovTiebreak') }}
                    </b-button>
                  </div>
                </template>
              </transition>

              <!--              isSimple tracking-->
              <div v-if="!live.isAdvanced" class="live__action__box" :class="{ rowreverse: switchSidesInSet1 }">
                <div class="live__actions">
                  <div class="align__centar__all m-b-10">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                  </div>
                  <div
                    :class="live.actionType === 'simple0' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-lightblue"
                    @click="simplePoint(0)"
                  >
                    <p class="fw600 is-size-6">{{ $t('Poen') + ' ' + result.players[0].display_name }}</p>
                  </div>
                </div>
                <div class="live__actions">
                  <div class="align__centar__all m-b-10">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                  </div>
                  <div
                    :class="live.actionType === 'simple1' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-red"
                    @click="simplePoint(1)"
                  >
                    <p class="fw600 is-size-6">{{ $t('Poen') + ' ' + result.players[1].display_name }}</p>
                  </div>
                </div>
              </div>

              <!--              isAdvnaced tracking-->
              <div v-else class="live__action__box">
                <transition name="fade">
                  <div class="live__actions no-double-zoom" :class="{ 'm-l-auto': switchSidesInSet1 }">
                    <div class="align__centar__all m-b-10">
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].image"
                        class="user_image-small m-r-10 border__white"
                        alt=""
                      />
                      <div class="is-text-center fw600 is-size-6">
                        {{ result.players[live.whoServing].display_name }}
                      </div>
                    </div>
                    <div
                      :class="live.actionType === 'ace' ? 'is-primary disable' : ''"
                      class="live__box min-h-10 border-top border-color-lightblue"
                      @click="serveAce(live.whoServing)"
                    >
                      <p class="fw600 is-size-6">{{ $t('asServis') }}</p>
                    </div>
                    <div class="live__box min-h-10 border-top border-color-lightblue" @click="live.activeTab = 2">
                      <p class="fw600 is-size-6">{{ $t('dobarServis') }}</p>
                    </div>
                    <div
                      :class="live.actionType === 'serveFault' ? 'is-red disable' : ''"
                      class="live__box min-h-10 border-top border-color-red"
                      @click="serveFault(live.whoServing)"
                    >
                      <p class="fw600 is-size-6">{{ $t('servisGreka') }}</p>
                    </div>
                  </div>
                </transition>
              </div>

              <div class="buttons p-b-20">
                <b-button
                  :class="{ blur_button: !canUndo }"
                  class="fw600 m-t-20"
                  type="is-primary"
                  pack="fal"
                  icon-right="undo-alt"
                  rounded
                  @click="undo()"
                >
                  {{ $t('vratiPoen') }}
                </b-button>
              </div>
            </b-tab-item>
            <b-tab-item v-if="!live.pause" :label="$t('igra2')">
              <!--              <div class="fw600 is-size-4 w100 m-b-10 m-t&#45;&#45;10">-->
              <!--                <div class="has-text-centered">Igra</div>-->
              <!--              </div>-->
              <!--              <b-icon icon="racquet" type="is-black50" pack="fal" size="is-medium" class="tranform__center top7">-->
              <!--              </b-icon>-->

              <div class="live__action__box m-t-5 no-double-zoom" :class="{ rowreverse: switchPlaySides }">
                <div class="live__actions m-r-auto">
                  <div class="align__centar__all">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[0].image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                    <div v-if="false" class="is-text-center fw600 is-size-6">
                      {{ result.players[0].first_name.charAt(0) + '. ' + result.players[0].last_name }}
                    </div>
                    <div class="is-text-center fw600 is-size-6">
                      {{ result.players[0].display_name }}
                    </div>
                  </div>
                  <!--                  <p class="fw600 is-size-6 has-text-centered m-t&#45;&#45;10">{{ result.players[0].last_name }}</p>-->
                  <b-icon icon="chevron-down" type="is-black50" pack="fal" class="tranform__center m-b-10"> </b-icon>
                  <div
                    :class="live.actionType === 'winner0' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-lightblue"
                    @click="winner(0)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('winner') }}</p>
                  </div>
                  <div
                    :class="live.actionType === 'forcedError0' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-lightblue"
                    @click="forcedError(0)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('prisiljenaPogreka') }}</p>
                  </div>
                  <div
                    :class="live.actionType === 'unforcedError0' ? 'is-red disable' : ''"
                    class="live__box min-h-10 border-top border-color-red"
                    @click="unforcedError(0)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('neprisiljenaPogreka') }}</p>
                  </div>
                </div>
                <div class="live__actions m-r-auto">
                  <div class="align__centar__all">
                    <TennisImage
                      :size="[42, 42]"
                      :src="result.players[1].image"
                      class="user_image-small m-r-10 border__white"
                      alt=""
                    />
                    <div v-if="false" class="is-text-center fw600 is-size-6">
                      {{ result.players[1].first_name.charAt(0) + '. ' + result.players[1].last_name }}
                    </div>
                    <div class="is-text-center fw600 is-size-6">
                      {{ result.players[1].display_name }}
                    </div>
                  </div>
                  <!--                  <p class="fw600 is-size-6 has-text-centered m-t&#45;&#45;10">{{ result.players[1].last_name }}</p>-->
                  <b-icon icon="chevron-down" type="is-black50" pack="fal" class="tranform__center m-b-10"> </b-icon>
                  <div
                    :class="live.actionType === 'winner1' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-lightblue"
                    @click="winner(1)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('winner') }}</p>
                  </div>
                  <div
                    :class="live.actionType === 'forcedError1' ? 'is-primary disable' : ''"
                    class="live__box min-h-10 border-top border-color-lightblue"
                    @click="forcedError(1)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('prisiljenaPogreka') }}</p>
                  </div>
                  <div
                    :class="live.actionType === 'unforcedError1' ? 'is-red disable' : ''"
                    class="live__box min-h-10 border-top border-color-red"
                    @click="unforcedError(1)"
                  >
                    <p class="fw600 is-size-6 has-text-centered">{{ $t('neprisiljenaPogreka') }}</p>
                  </div>
                </div>
              </div>
              <div class="buttons p-b-50">
                <b-button
                  class="fw600 m-t-20"
                  type="is-primary"
                  pack="fal"
                  icon-left="chevron-left"
                  rounded
                  @click="live.activeTab = 1"
                >
                  {{ $t('nazad') }}
                </b-button>
              </div>
            </b-tab-item>
          </b-tabs>
          <div class="divider"></div>
          <div class="buttons m-b-10 m-t-30">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              :icon-right="swich ? 'check' : 'times'"
              rounded
              @click="
                swich = !swich
                update()
                $buefy.toast.open({
                  message: swich ? 'Automatska zamjena igrača je uključena' : 'Isključena je automatska zamjena igrača',
                  type: swich ? 'is-success' : 'is-danger',
                })
              "
            >
              {{ $t('automatskaZamjenaIgraa') }}
            </b-button>

            <b-button
              v-if="!isGameStarted"
              class="m-b-10 softshadow"
              type="is-small noborder"
              pack="fal"
              icon-right="random"
              rounded
              @click="switchSidesPlayers()"
            >
              {{ $t('zamijeniStraneIgraa') }}
            </b-button>
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              :icon-right="live.showComments ? 'check' : 'times'"
              rounded
              @click="
                live.showComments = !live.showComments
                update()
                $buefy.toast.open({
                  message: live.showComments ? $t('Komentari su omogućeni') : $t('Komentari su onemogućeni'),
                  type: live.showComments ? 'is-success' : 'is-danger',
                })
              "
            >
              {{ $t(live.showComments ? $t('Komentari su omogućeni') : $t('Komentari su onemogućeni')) }}
            </b-button>
          </div>
          <div class="divider"></div>
          <div class="buttons m-b-10 m-t-30">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              rounded
              @click="
                live.isAdvanced = !live.isAdvanced
                update()
              "
            >
              {{ live.isAdvanced ? $t('Jednostavan unos rezultata') : $t('Napredan unos rezultata') }}
            </b-button>
          </div>
          <div class="divider"></div>
          <div class="buttons m-b-10 m-t-30">
            <b-button
              class="m-b-10 softshadow"
              type="is-small noborder"
              pack="fal"
              icon-right="play-circle"
              rounded
              @click="$router.push(localePath('/result/' + result.result.id))"
            >
              {{ $t('prikaiLivePrikaz') }}
            </b-button>
            <b-button
              class="m-b-10 softshadow"
              type="is-small noborder"
              pack="fal"
              :icon-right="!live.pause ? 'pause-circle' : 'play-circle'"
              rounded
              @click="
                live.pause = !live.pause
                update()
              "
            >
              {{ !live.pause ? 'Pauziraj' : 'Pokreni' }}
            </b-button>
          </div>
          <div class="buttons m-b-10 m-t-30 p-b-100">
            <b-button
              class="softshadow invert-small-button"
              type="is-medium noborder is-danger has-text-white"
              pack="fal"
              icon-right="times"
              rounded
              @click="isModalQuitActive = true"
            >
              {{ $t('prekiniPrijenos') }}
            </b-button>
          </div>
        </div>
      </template>
    </div>
    <!--    <div class="divider m-b-30"></div>-->

    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation :title="$t('susretJeZavrio')" @update="finishMatch()"></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalQuitActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiUnesenRezultatIIzaiIzLivePrijen')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="cancelLive()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import Result from '@/models/Result'
import TennisImage from '@/components/TennisImage.vue'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import Player from '~/models/Player'
import Game from '~/models/Game'
import hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBoxLive'
import ResultBoxLivePlaying from '~/components/ResultBoxLivePlaying'

export default {
  name: 'LiveInput',
  components: {
    resultBox,
    ResultBoxLivePlaying,
    hero,
    modalConfirmation,
    TennisImage,
  },
  async fetch() {
    if (process.client) {
      this.$nextTick(() => {
        this.$root.$loading.start()
      })
    }
    await this.$nextTick(() => {
      this.getGame()
    })
  },
  data() {
    return {
      heroImage: '/live.jpg',
      isModalActive: false,
      isModalQuitActive: false,
      result: {},
      sending: false,
      result_id: null,
      startResults: true,
      test: true,
      test1: true,
      canUndo: false,
      newValue: {},
      oldValue: {},
      game: {},
      umpire: {},
      initial: true,
      shouldUpdateLive: false,
      previousSwitchState: null,
      switchSides: false,
      switchPlaySides: false,
      switchSidesInSet1: false,
      swich: true,
      live: {
        isAdvanced: false,
        umpire: null,
        activeTab: 0,
        actionType: '',
        pause: false,
        gemOver: null,
        whoServing: null,
        showComments: true,
        serverAfterTieBreak: null,
        wonPoint: null,
        firstServe: 0,
        firstPlayerPoints: 0,
        secondPlayerPoints: 0,
        sets: [[0, 0]],
        isTieBreak: false,
        tieBreak: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    currentSet() {
      return this.live.sets.length - 1
    },
    // isGameStarted() {
    //   return (
    //     this.live.firstPlayerPoints === 0 &&
    //     this.live.secondPlayerPoints === 0 &&
    //     this.live.sets[0][0] + this.live.sets[0][1] === 0
    //   )
    // },
    isGameStarted() {
      if (Object.keys(this.result).length) {
        if (this.result.result !== null) {
          if (this.result.result.live_data !== null) {
            return (
              this.result.result.live_data.firstPlayerPoints === 0 &&
              this.result.result.live_data.secondPlayerPoints === 0 &&
              this.result.result.live_data.sets[0][0] + this.result.result.live_data.sets[0][1] === 0
            )
          }
        }
      }
      return true
    },
    isGemStarted() {
      return !!(this.live.firstPlayerPoints === 0 && this.live.secondPlayerPoints === 0)
    },
    isFirstSet() {
      return this.live.sets.length === 1
    },
    isNewSet() {
      return !!(
        this.live.sets[this.currentSet][0] + this.live.sets[this.currentSet][1] === 0 &&
        this.live.firstPlayerPoints === 0 &&
        this.live.secondPlayerPoints === 0
      )
    },
    isEqualeGem() {
      return this.live.sets[this.currentSet][0] === this.live.sets[this.currentSet][1]
    },
  },
  watch: {
    // result: {
    //   deep: true,
    //   handler() {
    //     if (this.isGameStarted) {
    //       this.live = this.result.result.live_data
    //     }
    //   },
    // },
    live: {
      deep: true,
      handler() {
        if (this.live.isTieBreak) {
          this.tieBreak()
        }
        if (!this.live.isTieBreak) {
          this.playerSwitchCounter()
          this.playerPlaySwitchCounter()
          if (this.live.firstPlayerPoints > 3 && this.live.firstPlayerPoints - this.live.secondPlayerPoints > 1) {
            this.live.gemOver = 0
            this.gemOverAction()
            this.history()
          }
          if (this.live.secondPlayerPoints > 3 && this.live.secondPlayerPoints - this.live.firstPlayerPoints > 1) {
            this.live.gemOver = 1
            this.gemOverAction()
            this.history()
          }
        }
        if (this.shouldUpdateLive) {
          this.update()
        }
      },
    },
  },
  mounted() {
    this.clonedItems()
  },
  methods: {
    switchSidesPlayers() {
      if (this.swich) {
        this.switchSides = !this.switchSides
        this.switchSidesInSet1 = !this.switchSidesInSet1
      }
    },
    tieBreak() {
      if (this.swich) {
        const tiebreakCount = this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]
        if (this.live.isAdvanced) {
          if (tiebreakCount !== 0 && tiebreakCount % 2 !== 0) {
            this.switchSidesInSet1 = !this.switchSidesInSet1
          }
        }
        if (tiebreakCount !== 0 && tiebreakCount % 6 === 0) {
          this.switchSidesInSet1 = !this.switchSidesInSet1
        }
      }
    },
    playerSwitchCounter() {
      if (this.swich) {
        const combine = []
        let setCount = null
        for (let i = 0; i < this.live.sets.length; i++) {
          combine.push(this.live.sets[i][0] + this.live.sets[i][1])
        }
        const reducer = (accumulator, curr) => accumulator + curr
        setCount = combine.reduce(reducer)
        if (this.live.isAdvanced) {
          if (
            setCount === 0 ||
            setCount === 1 ||
            setCount === 4 ||
            setCount === 5 ||
            setCount === 8 ||
            setCount === 9 ||
            setCount === 12 ||
            setCount === 13 ||
            setCount === 16 ||
            setCount === 17 ||
            setCount === 20 ||
            setCount === 21 ||
            setCount === 24 ||
            setCount === 25 ||
            setCount === 28 ||
            setCount === 29 ||
            setCount === 32 ||
            setCount === 33 ||
            setCount === 36 ||
            setCount === 37 ||
            setCount === 40 ||
            setCount === 41 ||
            setCount === 44 ||
            setCount === 45 ||
            setCount === 48 ||
            setCount === 49 ||
            setCount === 52 ||
            setCount === 53 ||
            setCount === 56 ||
            setCount === 57 ||
            setCount === 60 ||
            setCount === 61 ||
            setCount === 64 ||
            setCount === 65
          ) {
            this.switchSidesInSet1 = !!this.switchSides
          } else {
            this.switchSidesInSet1 = !this.switchSides
          }
        } else if (
          setCount === 0 ||
          setCount === 3 ||
          setCount === 4 ||
          setCount === 7 ||
          setCount === 8 ||
          setCount === 11 ||
          setCount === 12 ||
          setCount === 15 ||
          setCount === 16 ||
          setCount === 19 ||
          setCount === 20 ||
          setCount === 23 ||
          setCount === 24 ||
          setCount === 27 ||
          setCount === 28 ||
          setCount === 31 ||
          setCount === 32 ||
          setCount === 35 ||
          setCount === 36 ||
          setCount === 39 ||
          setCount === 40 ||
          setCount === 43 ||
          setCount === 44 ||
          setCount === 47 ||
          setCount === 48 ||
          setCount === 51 ||
          setCount === 52 ||
          setCount === 55 ||
          setCount === 56 ||
          setCount === 59 ||
          setCount === 60 ||
          setCount === 63 ||
          setCount === 64
        ) {
          this.switchSidesInSet1 = !!this.switchSides
        } else {
          this.switchSidesInSet1 = !this.switchSides
        }
      }
    },
    playerPlaySwitchCounter() {
      if (this.swich) {
        const combine = []
        let setCount = null
        for (let i = 0; i < this.live.sets.length; i++) {
          combine.push(this.live.sets[i][0] + this.live.sets[i][1])
        }
        const reducer = (accumulator, curr) => accumulator + curr
        setCount = combine.reduce(reducer)
        if (
          setCount === 0 ||
          setCount === 3 ||
          setCount === 4 ||
          setCount === 7 ||
          setCount === 8 ||
          setCount === 11 ||
          setCount === 12 ||
          setCount === 15 ||
          setCount === 16 ||
          setCount === 19 ||
          setCount === 20 ||
          setCount === 23 ||
          setCount === 24 ||
          setCount === 27 ||
          setCount === 28 ||
          setCount === 31 ||
          setCount === 32 ||
          setCount === 35 ||
          setCount === 36 ||
          setCount === 39 ||
          setCount === 40 ||
          setCount === 43 ||
          setCount === 44 ||
          setCount === 47 ||
          setCount === 48 ||
          setCount === 51 ||
          setCount === 52 ||
          setCount === 55 ||
          setCount === 56 ||
          setCount === 59 ||
          setCount === 60 ||
          setCount === 63 ||
          setCount === 64
        ) {
          setTimeout(() => {
            this.switchPlaySides = !!this.switchSides
          }, 500)
        } else {
          setTimeout(() => {
            this.switchPlaySides = !this.switchSides
          }, 500)
        }
      }
    },
    async hapticsVibrate() {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light })
      }
    },
    async getPlayer() {
      this.umpire = await Player.$find(this.live.umpire)
    },
    start() {
      this.live.umpire = this.user.id
      this.$axios.post('v2/game/' + this.$route.params.id + '/live', { live_data: this.live }).then(() => {
        this.$buefy.toast.open({
          message: this.$t('Prijenos je započeo'),
          type: 'is-primary',
          duration: 4000,
        })
        this.activeTab = 0
        this.getPlayer()
      })
    },
    update() {
      this.$axios.put('v2/game/' + this.$route.params.id + '/live', { live_data: this.live, live: 1 }).then((res) => {
        this.shouldUpdateLive = false
        if (res.data.live === 1) {
          this.live = res.data.live_data
        }
        this.getGame()
      })
    },
    updateCurrentResult(sets) {
      if (sets[0][0] === 0 && sets[0][1] === 0) {
      } else if (sets[1][0] === 0 && sets[1][1] === 0) {
        this.live.sets.splice(0, 1, sets[0])
      } else if (sets[2][0] === 0 && sets[2][1] === 0) {
        this.live.sets.splice(1, 1, sets[1])
      } else if (sets[2][0] !== 0 || sets[2][1] !== 0) {
        this.live.sets.splice(2, 1, sets[2])
      }
    },
    undo() {
      this.shouldUpdateLive = true
      this.live = JSON.parse(JSON.stringify(this.oldValue))
      this.oldValue = JSON.parse(JSON.stringify(this.newValue))
      this.newValue = JSON.parse(JSON.stringify(this.live))
      this.live.actionType = ''
      this.live.firstServe = 0
      this.canUndo = false
    },
    history() {
      this.canUndo = true
      this.oldValue = JSON.parse(JSON.stringify(this.newValue))
      this.newValue = JSON.parse(JSON.stringify(this.live))
    },
    clonedItems() {
      this.newValue = JSON.parse(JSON.stringify(this.live))
    },
    cancelLive() {
      this.$axios.put('v2/game/' + this.$route.params.id + '/live', { live: 0 }).then((res) => {
        const g = new Result({ id: this.result.result.id })
        g.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Prekinuli ste prijenos uživo'),
              type: 'is-success',
              duration: 3000,
            })
            this.loading = false
            this.$router.push(this.localePath('/schedule'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do grešek. Pokušajte ponovno'),
              type: 'is-danger',
              duration: 3000,
            })
            this.loading = false
          })
      })
    },
    finishMatch() {
      this.shouldUpdateLive = true
      this.$axios.put('v2/game/' + this.$route.params.id + '/live', { live: 0 }).then((res) => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste otkazali live prijenos'),
          type: 'is-success',
        })
      })
      this.$router.push(this.localePath('/schedule'))
    },
    cancelTieBreak() {
      this.live.isTieBreak = false
      this.live.tieBreak[this.currentSet][0] = 0
      this.live.tieBreak[this.currentSet][1] = 0
      this.live.firstPlayerPoints = 0
      this.live.secondPlayerPoints = 0
      this.live.whoServing = this.live.serverAfterTieBreak
    },
    finishTiebreak() {
      this.shouldUpdateLive = true
      this.live.whoServing = this.live.serverAfterTieBreak === 0 ? 1 : 0
      this.live.isTieBreak = false
      this.live.firstPlayerPoints = 0
      this.live.secondPlayerPoints = 0
      this.live.sets.push([0, 0])
      this.live.sets[this.currentSet - 1][this.live.wonPoint] =
        this.live.sets[this.currentSet - 1][this.live.wonPoint] + 1
    },
    startTiebreak() {
      this.shouldUpdateLive = true
      this.live.isTieBreak = true
      this.live.serverAfterTieBreak = this.live.whoServing
    },
    finishSet() {
      this.previousSwitchState = this.switchSidesInSet
      this.shouldUpdateLive = true
      this.live.sets.push([0, 0])
      this.history()
    },
    gemOverAction() {
      this.live.sets[this.currentSet].splice(
        this.live.gemOver,
        1,
        this.live.sets[this.currentSet][this.live.gemOver] + 1
      )
      this.live.firstPlayerPoints = 0
      this.live.secondPlayerPoints = 0
      this.live.whoServing === 0 ? (this.live.whoServing = 1) : (this.live.whoServing = 0)
    },
    simplePoint(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      if (this.live.isTieBreak) {
        this.live.tieBreak[this.currentSet].splice(player, 1, this.live.tieBreak[this.currentSet][player] + 1)
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.wonPoint = player
      this.live.actionType = 'simple' + player
      if (player === 0) {
        this.live.firstPlayerPoints++
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
      }
      this.history()
      setTimeout(() => {
        this.live.actionType = ''
      }, 500)
    },
    serveAce(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      if (this.live.isTieBreak) {
        this.live.tieBreak[this.currentSet].splice(player, 1, this.live.tieBreak[this.currentSet][player] + 1)
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.wonPoint = player
      this.live.actionType = 'ace'
      if (player === 0) {
        this.live.firstPlayerPoints++
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
      }
      this.history()
      setTimeout(() => {
        this.live.actionType = ''
      }, 500)
    },
    serveFault(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      if (this.live.isTieBreak && this.live.firstServe === 1) {
        this.live.tieBreak[this.currentSet].splice(
          player === 0 ? 1 : 0,
          1,
          this.live.tieBreak[this.currentSet][player === 0 ? 1 : 0] + 1
        )
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.actionType = 'serveFault'
      if (this.live.firstServe === 0) {
        this.live.firstServe = 1
      } else if (player === 1) {
        this.live.firstPlayerPoints++
        this.live.wonPoint = 0
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
        this.live.wonPoint = 1
        this.live.firstServe = 0
      }
      setTimeout(() => {
        this.live.actionType = ''
      }, 500)
      this.history()
    },
    winner(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      if (this.live.isTieBreak) {
        this.live.tieBreak[this.currentSet].splice(player, 1, this.live.tieBreak[this.currentSet][player] + 1)
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.wonPoint = player
      this.live.actionType = 'winner' + player
      if (player === 0) {
        this.live.firstPlayerPoints++
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
        this.live.firstServe = 0
      }
      setTimeout(() => {
        this.live.actionType = ''
        this.live.activeTab = 1
      }, 500)
      this.history()
    },
    forcedError(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      if (this.live.isTieBreak) {
        this.live.tieBreak[this.currentSet].splice(
          player === 0 ? 1 : 0,
          1,
          this.live.tieBreak[this.currentSet][player === 0 ? 1 : 0] + 1
        )
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.wonPoint = player
      this.live.actionType = 'forcedError' + player
      if (player === 1) {
        this.live.firstPlayerPoints++
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
        this.live.firstServe = 0
      }
      this.history()

      setTimeout(() => {
        this.live.actionType = ''
        this.live.activeTab = 1
      }, 500)
    },
    unforcedError(player) {
      this.shouldUpdateLive = true
      this.hapticsVibrate()
      this.history()
      if (this.live.isTieBreak) {
        this.live.tieBreak[this.currentSet].splice(
          player === 0 ? 1 : 0,
          1,
          this.live.tieBreak[this.currentSet][player === 0 ? 1 : 0] + 1
        )
        if ((this.live.tieBreak[this.currentSet][0] + this.live.tieBreak[this.currentSet][1]) & 1) {
          this.live.whoServing = this.live.whoServing === 0 ? 1 : 0
        }
      }
      this.live.wonPoint = player
      this.live.actionType = 'unforcedError' + player
      if (player === 1) {
        this.live.firstPlayerPoints++
        this.live.firstServe = 0
      } else {
        this.live.secondPlayerPoints++
        this.live.firstServe = 0
      }
      setTimeout(() => {
        this.live.actionType = ''
        this.live.activeTab = 1
      }, 500)
    },
    // getResults() {
    //   Result.find(this.result.game_id).then((res) => {
    //     this.result1 = new Result(res)
    //     this.$root.$loading.finish()
    //   })
    // },
    getGame() {
      Game.find(this.$route.params.id).then((res) => {
        this.result = res
        if (this.initial === true && !this.isGameStarted) {
          this.live = res.result.live_data
          this.live.actionType = ''
          this.initial = false
        }
        this.$root.$loading.finish()
      })
    },
    deleteResult() {
      if (this.result_id) {
        const r = new Result({ id: this.result_id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.$router.push(this.localePath('/result'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
  },
}
</script>
