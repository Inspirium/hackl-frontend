<template>
  <div class="">
    <div class="member__info liga__header" :class="ligaHeaderColor">
      <!--      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10" @click="isPopulateda">-->
      <!--        {{ liga.type === 'open' ? 'Korak 5. - Raspored igrača' : 'Korak 4. - Raspored igrača' }}-->
      <!--      </div>-->
    </div>

    <hero
      :options="heroImage"
      :second="{
        name: $t('Turniri'),
        link: '/cup',
      }"
      class="liga__hero--options"
    >
      <!--      <h1 class="has-text-white">{{ liga.name }}</h1>-->
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          @click="deleteLiga"
        >
          {{ $t('obriiKup') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath(`/cup/${$route.params.id}/edit`)"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediKup') }}
        </b-button>
      </div>
    </hero>
    <b-tabs v-model="activeTabPlayers" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div class="x-container activity">
          <transition name="fade">
            <div v-if="filteredLeftovers.length" class="activity__header m-b-5">
              <div class="fw600 is-size-5">
                {{
                  $t('nerasporeeni', { expr: cup.is_doubles ? 'parovi' : 'igrači', length: filteredLeftovers.length })
                }}
              </div>
            </div>
            <div v-else class="activity__header--center m-b-5 m-t-0">
              <div class="fw600 is-size-5">
                {{ $t('Dodaj nove igrače') }}
              </div>
            </div>
          </transition>

          <div class="cup__players-list">
            <div v-for="(player, index) in filteredLeftovers" :key="index">
              <template v-if="cup.is_doubles && true" class="for-doubles">
                <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                  <TennisImage
                    :size="[42, 42]"
                    :src="player.players[0].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                  <TennisImage
                    :size="[42, 42]"
                    :src="player.players[1].image"
                    class="user_image m-l--30 border__white--2"
                    alt=""
                  />
                </div>
                <div v-else class="list__img">
                  <TennisImage :size="[42, 42]" :src="player.image" class="user_image border__white--2" alt="" />
                </div>
              </template>

              <TennisImage v-else :size="[42, 42]" :src="player.image" class="user_image" alt="" />
            </div>
          </div>
          <div v-if="true" class="buttons m-t-20 m-b-0">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="user-edit"
              rounded
              @click="activeTabPlayers = 1"
            >
              {{ $t('uredi2', { expr: cup.is_doubles ? 'parove' : 'igrače' }) }}
            </b-button>
          </div>
          <template v-if="cup.number_of_players !== 0 && !is_edited">
            <transition v-if="cup.players.length === 0">
              <div class="empty_red_empty activity__header--center m-b-5 m-t-20">
                <div class="fw600 is-size-6 has-text-centered">
                  {{ $t('kupMoetePokrenutiNakonToUneseteIgraeUKup') }}
                </div>
              </div>
            </transition>
            <transition v-else name="fade">
              <div class="buttons m-t-30">
                <template v-if="isPopulated.length">
                  <b-button
                    v-if="tournamentRound.games"
                    class="fw600"
                    size="is-medium"
                    type="is-primary"
                    pack="far"
                    icon-right="long-arrow-right"
                    rounded
                    :loading="loading2"
                    @click="save"
                  >
                    {{ $t('dalje') }}
                  </b-button>
                </template>
                <b-button
                  v-if="!tournamentRound.games"
                  class="fw600"
                  size="is-medium"
                  type="is-primary"
                  pack="far"
                  icon-right="check"
                  rounded
                  :loading="loading2"
                  @click="generateGames"
                >
                  {{ $t('generirajDrijeb') }}
                </b-button>
              </div>
            </transition>

            <transition v-if="!isPopulated.length && tournamentRound.games">
              <div class="empty_red_empty activity__header--center m-b-5 m-t--20">
                <div class="fw600 is-size-6 has-text-centered">
                  {{ $t('unesiteIgraeUDrijebPrijeNegoZapoeneteKup') }}
                </div>
              </div>
            </transition>

            <b-tabs v-model="activeTab" position="is-centered" size="is-medium" class="show_tab_navigation">
              <b-tab-item :label="$t('drijeb')">
                <div class="activity__header--center m-b-5 m-t-10">
                  <div class="fw600 is-size-5 has-text-centered">{{ $t('automatskoRasporeivanje') }}</div>
                </div>

                <div class="buttons">
                  <b-button
                    class="softshadow m-t-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="racquet"
                    rounded
                    :loading="loading1"
                    @click="strength"
                  >
                    {{ $t('poJaini') }}
                  </b-button>
                  <b-button
                    class="softshadow m-t-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="random"
                    rounded
                    :loading="loading4"
                    @click="random"
                  >
                    {{ $t('nasumino') }}
                  </b-button>
                  <b-button
                    class="softshadow m-t-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="user-graduate"
                    rounded
                    :loading="loading3"
                    @click="seedsOrder"
                  >
                    {{ $t('sNositeljima') }}
                  </b-button>
                </div>
                <!--              <p v-if="tournamentRound.games !== undefined" class="2323232">-->
                <!--                {{ tournamentRound.games }}{{ typeof tournamentRound.games }}-->
                <!--              </p>-->
                <template v-if="Object.keys(tournamentRound).length">
                  <div v-if="tournamentRound.games !== undefined" class="tablelist cup-lots-table">
                    <b-table
                      class="cup-table--ligacreate"
                      :class="loadingDelete || loadingLeague ? 'blur_button' : ''"
                      :data="tournamentRound.games"
                      :bordered="false"
                      :selected.sync="selectedPlayerIndex"
                      :mobile-cards="false"
                      draggable
                      @dragstart="dragstart"
                      @drop="drop"
                      @dragover="dragover"
                      @dragleave="dragleave"
                    >
                      <b-table-column v-slot="props" field="first_name">
                        <div class="player-one">
                          <div
                            v-if="props.row.players[0] !== undefined"
                            class="align__centar__y"
                            @click="removePlayer(props.row)"
                          >
                            <div class="counter-sm">{{ (props.index + 1) * 2 - 1 + '.' }}</div>
                            <div class="list__img">
                              <template v-if="cup.is_doubles" class="for-doubles">
                                <div
                                  v-if="props.row.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                                  class="flex"
                                >
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[0].players[0].image"
                                    class="user_image border__white--2"
                                    alt=""
                                  />
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[0].players[1].image"
                                    class="user_image m-l--20 border__white--2"
                                    alt=""
                                  />
                                </div>
                                <div v-else class="flex">
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[0].image"
                                    class="user_image border__white--2"
                                    alt=""
                                  />
                                </div>
                              </template>

                              <TennisImage
                                v-else
                                :size="[42, 42]"
                                :src="props.row.players[0].image"
                                class="user_image"
                                alt=""
                              />
                            </div>
                            <div class="list__content">
                              <h3 class="has-text-black80 fw600">{{ props.row.players[0].display_name }}</h3>
                              <h4 class="m-t-2">
                                <span v-if="props.row.players[0].seed !== null" class="seeds m-r-5">{{
                                  $t('nositelj', { seed: props.row.players[0].seed })
                                }}</span>
                                {{ $t('bodova', { score: props.row.players[0].score_club }) }}
                              </h4>
                            </div>
                            <div class="" @click="deletePlayer(props.row.players[0].id, props.index, props.row.id)">
                              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                            </div>
                          </div>
                          <div
                            v-else
                            class="activity__header"
                            @click="
                              isModalMembersActive1 = true
                              selectedGame = props.row.id
                              selectedGameIndex = props.index
                              selectedGamePlayerOrder = 0
                            "
                          >
                            <div class="counter-sm">{{ (props.index + 1) * 2 - 1 }}.</div>
                            <b-icon icon="plus-circle" type="is-darkgreen" pack="fal" class="m-r-10"> </b-icon>
                            <div class="list__content">
                              <h3 class="has-text-darkgreen fw600">{{ $t('dodajIgraa') }}</h3>
                            </div>
                          </div>
                        </div>
                        <div class="player-two">
                          <div
                            v-if="props.row.players[1] !== undefined"
                            class="align__centar__y"
                            @click="removePlayer(props.row)"
                          >
                            <div class="counter-sm">{{ (props.index + 1) * 2 }}.</div>
                            <div class="list__img">
                              <template v-if="cup.is_doubles" class="for-doubles">
                                <div
                                  v-if="props.row.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                                  class="flex"
                                >
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[1].players[0].image"
                                    class="user_image border__white--2"
                                    alt=""
                                  />
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[1].players[1].image"
                                    class="user_image m-l--20 border__white--2"
                                    alt=""
                                  />
                                </div>
                                <div v-else class="flex">
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="props.row.players[1].image"
                                    class="user_image border__white--2"
                                    alt=""
                                  />
                                </div>
                              </template>

                              <TennisImage
                                v-else
                                :size="[42, 42]"
                                :src="props.row.players[1].image"
                                class="user_image"
                                alt=""
                              />
                            </div>
                            <div class="list__content">
                              <h3 class="has-text-black80 fw600">{{ props.row.players[1].display_name }}</h3>
                              <h4>
                                <span v-if="props.row.players[1].seed !== null" class="seeds m-r-5">{{
                                  $t('nositelj', { seed: props.row.players[1].seed })
                                }}</span
                                >{{ $t('bodova', { score: props.row.players[1].score_club }) }}
                              </h4>
                            </div>
                            <div class="" @click="deletePlayer(props.row.players[1].id, props.index, props.row.id)">
                              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                            </div>
                          </div>
                          <div
                            v-else
                            class="activity__header"
                            @click="
                              isModalMembersActive1 = true
                              selectedGame = props.row.id
                              selectedGameIndex = props.index
                              selectedGamePlayerOrder = 1
                            "
                          >
                            <div class="counter-sm">{{ (props.index + 1) * 2 }}.</div>
                            <b-icon icon="plus-circle" type="is-darkgreen" pack="fal" class="m-r-10"> </b-icon>
                            <div class="list__content">
                              <h3 class="has-text-darkgreen fw600">{{ $t('dodajIgraa') }}</h3>
                            </div>
                          </div>
                        </div>
                      </b-table-column>
                      <div class="line-container--ligacreate">
                        <svg class="cup__line--ligacreate" height="30">
                          <line x1="0" y1="0" x2="0" y2="30" style="stroke: rgb(32, 156, 238); stroke-width: 4" />
                          <line x1="0" y1="15" x2="550" y2="15" style="stroke: rgb(32, 156, 238); stroke-width: 1" />
                        </svg>
                      </div>

                      <div class="line-container--small--ligacreate">
                        <svg class="cup__line--small--ligacreate" height="15">
                          <line x1="0" y1="0" x2="0" y2="15" style="stroke: rgb(32, 156, 238); stroke-width: 4" />
                        </svg>
                      </div>
                      <template #empty>
                        <section class="section">
                          <div class="content has-text-grey has-text-centered">
                            <b-icon icon="exclamation-circle" size="is-large" pack="fal"> </b-icon>
                            <p class="modal-title">{{ $t('razvrstajIgrae') }}</p>
                          </div>
                        </section>
                      </template>
                    </b-table>
                  </div>
                </template>
              </b-tab-item>
              <b-tab-item :label="$t('nositelji')" class="p-b-75">
                <div v-if="seeds.length" class="buttons">
                  <b-button
                    class="softshadow m-t-20"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="user-graduate"
                    rounded
                    :loading="loading3"
                    @click="seedsOrder"
                  >
                    {{ $t('izradiDrijebSNositeljima') }}
                  </b-button>
                </div>

                <div :class="['fw600', 'has-text-centered', 'm-b-10', 'm-t-20', 'is-size-5', 'line-height-16']">
                  {{ $t('nostiteljiTurnira') }}
                </div>

                <!--          <ValidationProvider v-slot="{ errors, valid }" name="Uplata" rules="required">-->
                <!--            <b-field-->
                <!--              class="login__input__container m-b-20"-->
                <!--              :type="{ 'is-danger': errors[0], 'is-success': valid }"-->
                <!--              :message="errors"-->
                <!--            >-->
                <!--              <b-numberinput-->
                <!--                v-model="seedsNumber"-->
                <!--                placeholder="Upiši..."-->
                <!--                :min="seeds.length"-->
                <!--                step="1"-->
                <!--                type="is-white"-->
                <!--                rounded-->
                <!--                controls-rounded-->
                <!--              ></b-numberinput>-->
                <!--            </b-field>-->
                <!--          </ValidationProvider>-->

                <div v-if="seeds.length" class="tablelist cup-seeds-table">
                  <b-table
                    :data="seeds"
                    :bordered="false"
                    :selected.sync="selectedSeedIndex"
                    :mobile-cards="false"
                    default-sort="pivot.seed"
                    default-sort-direction="asc"
                    draggable
                    @dragstart="dragstart"
                    @drop="drop"
                    @dragover="dragover"
                    @dragleave="dragleave"
                  >
                    <b-table-column v-slot="props" field="first_name" class="list__image-col">
                      <div v-if="props.row.name !== ''" class="align__centar__y">
                        <div v-show="props.row.pivot.seed !== null" class="counter-sm">
                          {{ props.row.pivot.seed + '.' }}
                        </div>
                        <div class="list__img">
                          <template v-if="cup.is_doubles && seeds.length && true" class="for-doubles">
                            <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="flex">
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
                            <div v-else class="flex">
                              <TennisImage
                                :size="[42, 42]"
                                :src="props.row.image"
                                class="user_image border__white--2"
                                alt=""
                              />
                            </div>
                          </template>

                          <TennisImage v-else :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                        </div>
                        <div class="list__content">
                          <h3>{{ props.row.display_name }}</h3>
                          <h4>{{ $t('bodova', { score: props.row.score_club }) }}</h4>
                        </div>
                        <div class="" @click="removeSeed(props.row)">
                          <b-icon
                            v-if="props.index === seeds.length - 1"
                            icon="times-circle"
                            type="is-danger"
                            pack="fal"
                            class="m-l-auto"
                          >
                          </b-icon>
                        </div>
                      </div>
                      <!--                  <div v-else class="activity__header" @click="isModalSeedActive = true">-->
                      <!--                    <div class="counter-sm">{{ props.row.seed }}.</div>-->
                      <!--                    <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>-->
                      <!--                    <div class="list__content">-->
                      <!--                      <h3>Dodaj nositelja</h3>-->
                      <!--                    </div>-->
                      <!--                  </div>-->
                    </b-table-column>
                  </b-table>
                </div>
                <div class="buttons m-t-20 m-b-0">
                  <b-button
                    class="softshadow m-t-10 invert-small-button"
                    type="is-small noborder is-primary has-text-white"
                    pack="fal"
                    rounded
                    icon-right="plus-circle"
                    :loading="loading5"
                    @click="isModalSeedActive = true"
                  >
                    {{ $t('dodajNositelja') }}
                  </b-button>
                </div>
              </b-tab-item>
            </b-tabs>
          </template>
          <template v-else>
            <div class="divider-line-1"></div>
            <div class="x-container m-b-0 m-t-10">
              <div class="fw600 is-size-4 has-text-centered">{{ $t('odaberiteBrojNatjecatelja') }}</div>
            </div>

            <div :label="$t('eljeniBrojIgraaUTurniru')" class="m-t-10">
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="item in [4, 8, 16, 32, 64, 128, 256]"
                      :key="item"
                      :class="cup.number_of_players === item ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="
                        $set(cup, 'number_of_players', item)
                        is_edited = true
                      "
                    >
                      {{ item }} {{ $t('natjecatelja') }}
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="m-l-10 fw600"
                type="is-primary"
                pack="fal"
                icon-right="check"
                rounded
                :loading="loading7"
                @click="
                  submit()
                  is_edited = false
                "
              >
                {{ $t('izradiNatjecanje') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="activity__header--center m-b-5 m-t-15">
          <div class="fw600 is-size-5">{{ $t('urediIgraeKupa') }}</div>
        </div>
        <div v-if="true" class="buttons m-t-20 m-b-0">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-left="arrow-left"
            rounded
            @click="activeTabPlayers = 0"
          >
            {{ $t('nazad') }}
          </b-button>
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-plus"
            rounded
            :loading="loading"
            @click="isModalMembersActive = true"
          >
            {{ $t('dodajIgraa') }}
          </b-button>
        </div>
        <template v-if="filteredLeftovers.length">
          <membersSearch
            :is-doubles="cup.is_doubles"
            :prepopulated="filteredLeftovers"
            @update="deletePlayerToTurnament($event.id)"
          ></membersSearch>
        </template>
      </b-tab-item>
    </b-tabs>

    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="hidescrollbar modal__members">
      <modalMembers
        :show-tennis-school="false"
        :is-doubles="cup.is_doubles ? true : false"
        :title="$t('dodajteIgraa')"
        @player="addNewPlayerToTurnament($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalSeedActive" :width="640" scroll="clip" class="modal__members">
      <modalMembersCustom
        :players="cup.players"
        :title="$t('dodajteNositelja')"
        @update="updateSeedList($event)"
      ></modalMembersCustom>
    </b-modal>
    <b-modal :active.sync="isModalMembersActive1" :width="640" scroll="clip" class="hidescrollbar modal__members">
      <modalMembersCustom
        :players="filteredLeftovers"
        :title="$t('dodajteIgraa')"
        @update="addNewPlayer($event)"
      ></modalMembersCustom>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import Tournament from '@/models/Tournament'
// import League from '@/models/League'
import TennisImage from '@/components/TennisImage.vue'
import Game from '@/models/Game'
import Player from '@/models/Player'
import TournamentRound from '@/models/TournamentRound'
import hero from '~/components/Hero'
import modalMembersCustom from '~/components/modal/ModalMembersCustom'
import modalMembers from '~/components/modal/ModalMembersAll'
import membersSearch from '~/components/membersSearchWithEdit'

export default {
  name: 'CupLots',
  components: {
    modalMembersCustom,
    modalMembers,
    membersSearch,
    hero,
    TennisImage,
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      activeTab: 0,
      activeTabPlayers: 0,
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loadingDelete: false,
      isModalAddPlayerActive: false,
      isModalMembersActive: false,
      isModalMembersActive1: false,
      isModalSeedActive: false,
      isModaSelectActive: false,
      playersList: [],
      selectedSeedIndex: {},
      seedsNumber: null,
      seeds: [],
      tournamentRound: [],
      selectedGame: null,
      selectedGameIndex: null,
      selectedGamePlayerOrder: null,
      playersIn: [],
      players: [],
      test: null,
      league: [],
      cup: {
        name: '',
        id: '',
        access_level: 'private',
        application_deadline: new Date(),
        active_to: new Date(),
        active_from: new Date(),
        players_in_groups: 0,
        number_of_players: null,
        playing_sets: null,
        players: [],
        price: 0,
        game_in_set: null,
        last_set: null,
        description: '',
        status: '0',
      },
      seedsList: [],
      defaultPlayerList: [],
      selectedPlayer: [],
      selectedPlayerIndex: {},
      draggingRow: null,
      draggingRowIndex: null,
      droppedOnRowIndex: null,
      is_edited: false,
      macthRules: {
        playingSets: {
          1: '1 set',
          2: '2 seta',
          3: '3 seta',
        },
        gameInSet: {
          4: 'Set do 4 gema (Nextgen)',
          6: 'Set do 6 gemova (Klasično)',
          8: 'Set do 8 gemova',
          10: 'Set do 10 gemova',
        },
        lastGame: {
          classic: 'Klasičan (6 gemova)',
          advantage: 'Prednost 2 gema',
          tie7: 'Tie-break 7',
          tie10: 'Tie-break 10',
        },
      },
    }
  },
  computed: {
    checkIfToMany() {
      return this.cup.players.length > this.cup.number_of_players
    },
    isLigaCup() {
      return !!this.cup.league_id
    },
    ligaHeaderColor() {
      switch (this.cup.status) {
        case '0': // Kreirana liga
          return 'primary-light'
        case '1': // Ždrijeb
          return 'primary-light'
        case '2': // Privatna liga - priprema prijave
          return 'primary-light'
        case '3': // Otvorena liga - otvorene prijave
          return 'green'
        case '4':
          return 'green'
        case '5':
          return 'is-red'
      }
      return ''
    },
    filteredLeftovers() {
      return _.differenceWith(this.cup.players, this.playersIn, (all, out) => {
        return all.id === out.id
      })
    },
    isPopulated() {
      if (this.tournamentRound.games !== undefined) {
        return this.tournamentRound.games.filter((item) => {
          return item.players.length
        })
      }
      return []
    },
  },
  watch: {
    // players: {
    //   handler() {
    //     this.playerList = _.clone(this.players)
    //     this.seedsList = this.playerList
    //   },
    // },
    defaultPlayerList: {
      handler() {
        if (this.defaultPlayerList.length > 0) {
          for (let i = 0; i < this.defaultPlayerList.length; i++) {
            this.defaultPlayerList[i].order = i
          }
        }
      },
    },
    // seeds: {
    //   handler() {
    //     if (this.seeds.length > 0) {
    //       for (let i = 0; i < this.seeds.length; i++) {
    //         this.seeds[i].seed = i + 1
    //       }
    //     }
    //   },
    // },
    'cup.number_of_players': {
      handler() {
        this.defaultPlayerList = []
        for (let i = 0; i < this.cup.number_of_players; i++) {
          this.defaultPlayerList.push({
            order: i,
            name: '',
          })
        }
      },
    },
  },
  mounted() {
    this.getLeague()
  },
  methods: {
    updatePlayers(data) {
      this.players = data
    },
    adminResultInput(item) {
      this.adminResultPlayers = item
      this.isResultPrepopulatedModalActive = true
    },
    distributedPlayers() {
      this.playersIn = []
      for (let i = 0; i < this.tournamentRound.games.length; i++) {
        this.playersIn = [...this.playersIn, ...this.tournamentRound.games[i].players]
      }
    },
    getLeague() {
      this.loadingLeague = true
      Tournament.include(['admins', 'players', 'rounds', 'league'])
        .find(this.$route.params.id)
        .then((res) => {
          this.cup = res
          if (res.league_id && !this.cup.players.length) {
            this.$axios.get(`v2/tournament/${this.cup.id}/import/${this.cup.league.id}`).then(() => {
              this.getLeague()
            })
          }
          this.loadingLeague = false
          this.getTournamentRound()
          this.getSeeds()
        })
    },
    getSeeds() {
      Player.where('seed', true)
        .for(new Tournament({ id: this.$route.params.id }))
        .get()
        .then((res) => {
          this.seeds = res.data
          this.seeds = [...this.seeds].sort((a, b) => a.pivot.seed - b.pivot.seed)
        })
    },
    getTournamentRound() {
      // if (this.cup.status !== '1') {
      //   return
      // }
      TournamentRound.include(['games'])
        .params({ seed: 1 })
        .find(this.cup.rounds[0].id)
        .then((res) => {
          this.tournamentRound = res
          this.distributedPlayers()
        })
    },
    removePlayer(item) {
      const index = this.defaultPlayerList.indexOf(item)
      this.cup.players.push(item)
      this.defaultPlayerList.splice(index, 1, { order: 1, name: '' })
    },
    addNewPlayerToTurnament(item) {
      this.loading = true
      const l = new Tournament({ id: this.cup.id })
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u kup'),
            type: 'is-success',
          })
          this.getLeague()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    deletePlayerToTurnament(item) {
      this.loading = true
      const t = new Tournament({ id: this.cup.id })
      const p = new Player({ id: item }).for(t)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u kup'),
            type: 'is-success',
          })
          this.getLeague()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    addSeedsToTurnament(item) {
      this.loading5 = true
      const l = new Tournament({ id: this.cup.id })
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali nositelja u kup'),
            type: 'is-success',
          })
          this.getLeague()
          this.loading5 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading5 = false
        })
    },
    deleteSeedsFromTurnament(item) {
      this.loading6 = true
      item.seed = null
      const l = new Tournament({ id: this.cup.id })
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili nositelja iz kupa'),
            type: 'is-success',
          })
          this.getSeeds()
          this.loading6 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading6 = false
        })
    },
    addNewPlayer(item) {
      if (!this.filteredLeftovers.length) {
        this.$buefy.toast.open({
          message: this.$t('Dodajte prvo nove igrače u kup prije nego ih rasporedite u ždrijbu'),
          type: 'is-danger',
          duration: 2500,
        })
      }
      this.loading = true
      this.playersList = this.tournamentRound.games[this.selectedGameIndex].players
      this.playersList.splice(this.selectedGamePlayerOrder, 1, item)
      this.cup.players.splice(this.cup.players.indexOf(item), 1)
      const g = new Game({ id: this.selectedGame })
      g.players()
        .attach({ players: this.playersList })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u kup'),
            type: 'is-success',
            duration: 500,
          })
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
        })

      this.loading = false
    },
    deletePlayer(playerId, index, game) {
      this.loadingDelete = true
      const g = new Game({ id: game })
      const p = new Player({ id: playerId }).for(g)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno je uklonjen igrač'),
            type: 'is-success',
            queue: false,
            duration: 500,
          })
          this.loadingDelete = false
          this.getLeague()
        })
        .catch(() => {
          this.loadingDelete = false
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    deleteLiga() {
      this.loading = true
      const l = new Tournament({ id: this.cup.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Kup je obrisan'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/cup'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    random() {
      this.loading4 = true
      const l = new Tournament({ id: this.$route.params.id })
      Tournament.custom(l, 'random')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače nasumično po grupama'),
            type: 'is-success',
            queue: false,
          })
          this.loading4 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            queue: false,
          })
          this.loading4 = false
        })
    },
    strength() {
      this.loading1 = true
      const l = new Tournament({ id: this.$route.params.id })
      Tournament.custom(l, 'strength')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače po jačini'),
            type: 'is-success',
          })
          this.loading1 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading1 = false
        })
    },
    seedsOrder() {
      this.loading3 = true
      if (this.activeTab === 1) {
        this.activeTab = 0
      }
      if (!this.seeds.length) {
        this.activeTab = 1
        this.$buefy.toast.open({
          message: this.$t('Prvo odaberite nositelje kupa'),
          type: 'is-info',
        })
        this.loading3 = false
        return
      }
      const l = new Tournament({ id: this.$route.params.id })
      Tournament.custom(l, 'seed')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače s nositeljima'),
            type: 'is-success',
          })
          this.loading3 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading3 = false
        })
    },
    updatePlayerList(player) {
      this.selectedPlayer.splice(0, 1, player)
      this.cup.players.splice(this.cup.players.indexOf(player), 1)
      player.order = this.selectedPlayerIndex.order
      this.defaultPlayerList.splice(player.order, 1, player)
    },
    updateSeedList(player) {
      this.seedsList.splice(this.seedsList.indexOf(player), 1)
      // this.selectedPlayer.splice(0, 1, player)
      // this.seeds.splice(this.selectedSeedIndex.seed - 1, 1, player)
      player.seed = this.seeds.length + 1
      this.seeds.push(player)
      // this.$set(player, 'seed', 1)
      this.addSeedsToTurnament(player)
    },
    removeSeed(item) {
      this.seedsList.push(item)
      const index = this.seeds.indexOf(item)
      this.seeds.splice(index, 1, { seed: 0, order: 1, name: '' })
      this.$set(item, 'seed', 0)
      this.deleteSeedsFromTurnament(item)
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
      // if (!this.isPopulated) {
      //   this.$buefy.toast.open({
      //     message: this.$t('Popunite sve pozicije igračima prije nego započnete kup'),
      //     type: 'is-danger',
      //     duration: 5000,
      //   })
      //   return
      // }
      this.loading2 = true
      this.cup.status = '4'
      this.cup
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Kup je aktiviran'),
            type: 'is-success',
          })
          this.$router.push(this.localePath(`/cup/${this.cup.id}`))
          this.loading2 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading2 = false
        })
    },
    generateGames() {
      this.loading2 = true
      const t = new Tournament({ id: this.cup.id, createGames: true })
      t.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Ždrijeb je spreman'),
            type: 'is-success',
          })
          this.loading2 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading2 = false
        })
    },
    submit() {
      this.loading7 = true
      this.cup.createGames = true
      this.cup
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.loading7 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading7 = false
        })
    },
  },
}
</script>
