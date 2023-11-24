<template>
  <div
    id="inputsearchTio"
    class="modal-simple members results p-b-100"
    :class="showTieBreakInputBox || showMatchTieBreakInputBox ? 'tie-break-grid-extend' : ''"
  >
    <b-tabs v-model="activeTab" position="is-centered">
      <b-tab-item :label="$t('1Korak')">
        <div class="modal-title has-text-light m-b-40">{{ $t('dodajSuigraa') }}</div>
        <div class="modal-reservation m-t-20 m-b-20">
          <div v-if="options.customlistplayer !== true" class="buttons">
            <b-button
              type="is-small noborder"
              pack="far"
              :icon-right="isItDoubles ? 'times' : ''"
              :class="[!isAdmin ? 'm-t-15 m-b--10' : '', { active: isItDoubles }]"
              rounded
              @click="getDoubles()"
            >
              {{ $t('unesiRezultatParova') }}
            </b-button>
          </div>
        </div>
        <div v-if="isItDoubles" class="for-list p-b-40">
          <div class="my-rank m-t-20">
            <div class="has-text-white fw500 has-text-centered is-size-4 m-b--5">
              {{
                selected_teams.length === 0
                  ? $t('Odaberi prvi par')
                  : selected_teams.length === 1
                  ? $t('Odaberi drugi par')
                  : $t('Parovi su odabrani')
              }}
            </div>
            <div v-if="selected_teams.length > 0" class="list__image-col softshadow m-t-15">
              <div v-if="selected_teams.length > 0" class="align__centar__y">
                <div v-if="selected_teams[0].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[0].players[0].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[0].players[1].image"
                    class="user_image m-l--20 border__white--2"
                    alt=""
                  />
                </div>
                <div v-else class="list__img">
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[0].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                </div>
                <div class="list__content m-r-auto">
                  <div class="has-text-black80 fw600">{{ selected_teams[0].display_name }}</div>
                </div>
                <div class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-danger"
                    pack="fal"
                    rounded
                    size="is-smaller"
                    @click="selected_teams.splice(0, 1)"
                    >{{ $t('ukloni') }}</b-button
                  >
                </div>
              </div>
              <div v-else class="buttons">
                <div class="fw600 has-text-white is-size-5 p-b-10">{{ $t('odaberiPrviParSListe') }}</div>
              </div>
            </div>
            <div v-if="selected_teams.length > 1" class="list__image-col softshadow">
              <div v-if="selected_teams.length > 1" class="align__centar__y">
                <div v-if="selected_teams[1].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[1].players[0].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[1].players[1].image"
                    class="user_image m-l--20 border__white--2"
                    alt=""
                  />
                </div>
                <div v-else class="list__img">
                  <TennisImage
                    :size="[42, 42]"
                    :src="selected_teams[1].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                </div>
                <div class="list__content m-r-auto">
                  <div class="has-text-black80 fw600">{{ selected_teams[1].display_name }}</div>
                </div>
                <div class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-danger"
                    rounded
                    size="is-smaller"
                    @click="selected_teams.splice(1, 1)"
                    >{{ $t('ukloni') }}</b-button
                  >
                </div>
              </div>
              <div v-else class="buttons">
                <div class="fw600 has-text-black20 p-b-10">{{ $t('odaberiDrugiParSListe') }}</div>
              </div>
            </div>
          </div>
          <div v-if="result.players.length !== 2 && !elo" class="search container m-t--10">
            <b-field>
              <b-input
                ref="filter"
                v-model="search_term"
                :placeholder="$t('pretraiParove')"
                type="search"
                pack="far"
                :icon-right="search_icon"
                icon-right-clickable
                @icon-right-click="search_term = ''"
              >
              </b-input>
            </b-field>
          </div>

          <!--            For Doubles list-->

          <template v-if="isItDoubles && result.players.length !== 2">
            <div v-if="loadingPlayers" class="align__centar__x">
              <b-icon
                class="comment-send fa-spin"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-white"
                pack="far"
              ></b-icon>
            </div>
            <div
              v-for="item in options.customlistplayer === true ? customlistplayer : players"
              v-show="selected_teams.length ? item.id !== selected_teams[0].id : true"
              :key="item.id"
              class="is-black-list p-t-10 p-b-10 p-l-10 p-r-10 rounded-md m-t-5 flex align__centar__y"
              @click="
                addTeam(item)
                is_group = false
              "
            >
              <template v-if="isItDoubles" class="for-doubles">
                <div
                  v-if="item.image === 'https://api.tenis.plus/images/user.svg' && item.players.length"
                  class="list__img"
                >
                  <TennisImage
                    :size="[42, 42]"
                    :src="item.players[0].image"
                    class="user_image-small border__white"
                    alt=""
                  />
                  <TennisImage
                    :size="[42, 42]"
                    :src="item.players[1].image"
                    class="user_image-small m-l--16 border__white"
                    alt=""
                  />
                </div>
                <div v-else class="list__img">
                  <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small border__white" alt="" />
                </div>
              </template>

              <TennisImage v-else :size="[42, 42]" :src="item.image" class="user_image-small m-r-10" alt="" />
              <div class="list__content">
                <h3>{{ item.display_name }}</h3>
              </div>
            </div>
          </template>
          <template v-if="!players.length && !loadingPlayers">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" type="is-white" size="is-large" pack="fal"> </b-icon>
              <div class="has-text-centered is-size-5 has-text-white has-text-centered fw600 w50 m-l-auto m-r-auto">
                {{ $t('nemateTeniskiPar') }}
              </div>
              <div class="buttons m-t-30">
                <b-button
                  class="fw600"
                  type="is-primary"
                  pack="fal"
                  icon-right="plus-circle"
                  rounded
                  tag="nuxt-link"
                  :to="localePath('/doubles/new')"
                >
                  {{ $t('izradiNoviPar') }}
                </b-button>
              </div>
            </div>
          </template>
        </div>
        <transition name="fade">
          <div class="modal-confirmation">
            <div class="buttons m-t-20">
              <b-button
                v-if="result.players.length === 2"
                class="m-l-10"
                type="is-primary"
                pack="far"
                icon-right="chevron-right"
                rounded
                @click="activeTab++"
              >
                {{ $t('dalje') }}
              </b-button>
            </div>
          </div>
        </transition>

        <div v-if="!isItDoubles" class="tablelist">
          <div v-if="options.customlistplayer === true" class="fw600 is-size-55 has-text-light m-b-10">
            {{ $t('popisIgraaULigi') }}
          </div>
          <div v-else id="inputsearch" class="search container">
            <b-field>
              <b-input
                ref="filter"
                v-model="search_term"
                :placeholder="$t('pronaiProtivnika')"
                type="search"
                pack="far"
                :icon-right="search_term === '' ? 'search' : 'times'"
                icon-right-clickable
                @icon-right-click="
                  search_term = ''
                  debouncedGetPlayers()
                "
              >
              </b-input>
            </b-field>
          </div>

          <transition name="fade">
            <div v-if="loadingPlayers" class="align__centar__x">
              <b-icon
                class="comment-send"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-white"
                pack="far"
              ></b-icon>
            </div>
            <div v-else class="for-list">
              <template
                v-if="lastPlayersOnReservation.length && search_term === '' && options.customlistplayer === false"
              >
                <div class="fw600 is-size-6 has-text-warning m-b-5 m-t-7">
                  {{ $t('Posljednji igrači koje ste dodali') }}
                </div>
                <div
                  v-for="(player, index) in lastPlayersOnReservation"
                  v-show="player.id !== $auth.user.id"
                  :key="index + 'single'"
                  class="list__image-col cursor align__centar__y"
                  @click="addPlayer(player)"
                >
                  <TennisImage :size="[42, 42]" :src="player.image" class="user_image m-r-10" alt="" />
                  <div class="list__content">
                    <h3 class="fw600 is-size-5 has-text-black80">{{ player.display_name }}</h3>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="player in options.customlistplayer === true ? customlistplayer : players"
                  v-show="player.id !== $auth.user.team.id"
                  :key="player.id"
                  class="list__image-col cursor align__centar__y"
                  @click.prevent="addPlayer(player)"
                >
                  <div class="activity__box flex align__centar__y">
                    <div class="">
                      <div class="align__centar__y">
                        <div v-if="isItDoubles" class="flex align__centar__y">
                          <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                            <TennisImage
                              :size="[32, 32]"
                              :src="player.players[0].image"
                              class="user_image border__white--2"
                              alt=""
                            />
                            <TennisImage
                              :size="[32, 32]"
                              :src="player.players[1].image"
                              class="user_image m-l--20 border__white--2"
                              alt=""
                            />
                          </div>
                          <div v-else class="list__img">
                            <TennisImage
                              :size="[32, 32]"
                              :src="player.players[0].image"
                              class="user_image border__white--2"
                              alt=""
                            />
                          </div>
                          <div class="list__content">
                            <h3 class="fw600 is-size-55 has-text-white line-height-14">
                              {{ player.display_name }}
                            </h3>
                          </div>
                        </div>

                        <template v-else>
                          <div class="list__img">
                            <TennisImage :size="[32, 32]" :src="player.image" class="user_image" alt="" />
                          </div>
                          <div class="list__content">
                            <h3 class="fw600 is-size-55 has-text-white line-height-14">{{ player.display_name }}</h3>
                          </div>
                        </template>

                        <!--                      <img :src="player.image" class="user_image-small m-r-10" alt="" />-->
                        <!--                      <h3 class="is-size-55 has-text-white fw600">-->
                        <!--                        {{ player.display_name }}-->
                        <!--                      </h3>-->
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </transition>
        </div>
      </b-tab-item>
      <b-tab-item v-if="true" :label="$t('2Korak')">
        <div v-if="activeTab > 0" v-touch:swipe="swipeHandler" class="modal__members">
          <div class="modal-title has-text-light m-b-5 title__set">
            <span>{{ activeSet + 1 }}</span>
            {{ $t('set') }}
          </div>
          <div class="modal__content__width">
            <div
              :class="hidePlayerSelectionButton()"
              class="navigation"
              @click="
                leftArrow()
                rightArrowStyle = true
              "
            >
              <b-icon icon="chevron-left" size="is-large" pack="fal"> </b-icon>
            </div>
            <div v-if="true" class="input__result__box">
              <div class="player__score">
                <div v-if="!isItDoubles" class="display__name">{{ result.players[0].display_name }}</div>
                <div v-else class="display__name">
                  {{ selected_teams[0].display_name }}
                </div>
                <div
                  :style="showTieBreakInputBox || showMatchTieBreakInputBox ? 'opacity: 0' : 'opacity: 100'"
                  class="display__sets"
                >
                  <template v-if="(!showTieBreakInputBox && isItDoubles) || (!showTieBreakInputBox && isItDoubles)">
                    <div
                      v-if="result.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                      class="flex align__centar__x m-b-10"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].players[0].image"
                        class="user_image-smallish border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].players[1].image"
                        class="user_image-smallish m-l--30 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="m-b-10 align__centar__x">
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].image"
                        class="user_image-smallish border__white--2"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-if="!showTieBreakInputBox && !isItDoubles"
                    :size="[42, 42]"
                    :src="result.players[0].image"
                    class="user_image"
                    alt=""
                  />

                  <div
                    v-for="set in isPickleball ? setsPickleball : sets"
                    :key="set"
                    :class="{
                      display__sets__item: true,
                      active: selectedItem(set, 0),
                    }"
                    @click.stop="updateScorePlayer(set, 0)"
                  >
                    <div class="select-item">
                      {{ set
                      }}<span v-if="set === result.sets[activeSet][0]" class="tie-break__num__input-result">{{
                        displayTieBreak(0)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="player__score">
                <div
                  v-if="isItDoubles ? true : result.players[1]"
                  :style="showTieBreakInputBox || showMatchTieBreakInputBox ? 'opacity: 0' : 'opacity: 100'"
                  class="display__sets"
                >
                  <template v-if="(!showTieBreakInputBox && isItDoubles) || (!showTieBreakInputBox && isDoubles)">
                    <div
                      v-if="result.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                      class="flex align__centar__x m-b-10"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].players[0].image"
                        class="user_image-smallish border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].players[1].image"
                        class="user_image-smallish m-l--30 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="m-b-10 align__centar__x">
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].image"
                        class="user_image-smallish border__white--2"
                        alt=""
                      />
                    </div>
                  </template>
                  <TennisImage
                    v-if="(!showTieBreakInputBox || !showMatchTieBreakInputBox) && !isItDoubles"
                    :size="[42, 42]"
                    :src="result.players[1].image"
                    class="user_image"
                    alt=""
                  />
                  <div
                    v-for="set in isPickleball ? setsPickleball : sets"
                    :key="set"
                    :class="{
                      display__sets__item: true,
                      active: selectedItem(set, 1),
                    }"
                    @click.stop="updateScorePlayer(set, 1)"
                  >
                    <div class="select-item">
                      {{ set
                      }}<span v-if="set === result.sets[activeSet][1]" class="tie-break__num__input-result">{{
                        displayTieBreak(1)
                      }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="!isItDoubles" class="display__name">
                  {{ result.players[1] ? result.players[1].display_name : $t('Nije odabran partner') }}
                </div>
                <div v-else class="display__name">
                  {{ selected_teams[1].display_name }}
                </div>
              </div>
              <transition name="fade">
                <template v-if="showTieBreakPopup">
                  <div v-if="showTieBreakPopupMini && !showMatchTieBreakInputBox" class="tie-break__popup--mini">
                    <div class="fw600 has-text-centered has-text-white">{{ $t('urediRezultatTiebreakea') }}</div>
                    <div class="buttons m-t--5">
                      <b-button
                        class="fw600 m-t-20"
                        type="is-white"
                        pack="fal"
                        size="is-small noborder"
                        icon-right="pen"
                        rounded
                        @click="showTieBreakInputBox = true"
                      >
                        {{ $t('Uredi') }}
                      </b-button>
                    </div>
                  </div>
                  <div v-if="!showTieBreakPopupMini && !showMatchTieBreakInputBox" class="tie-break__popup">
                    <div class="fw600 has-text-centered has-text-white">{{ $t('eliteLiUpisatiTiebreak') }}</div>
                    <div class="buttons m-t--5">
                      <b-button
                        class="fw600 m-t-20"
                        type="is-white"
                        pack="fal"
                        size="is-small noborder"
                        icon-right="check"
                        rounded
                        @click="showTieBreakInputBox = true"
                      >
                        {{ $t('da') }}
                      </b-button>
                    </div>
                  </div>
                </template>
                <div v-if="showTieBreakInputBox" class="tie-break__box p-all-24">
                  <div class="has-text-white has-text-centered fw600 is-size-4 m-t--12 m-b-5">Tie-break</div>
                  <div class="input__result__box p-b-150">
                    <div class="player__score">
                      <div class="display__name"></div>
                      <div class="display__sets">
                        <div
                          v-for="set in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                          :key="set"
                          :class="{
                            display__sets__item: true,
                            active: selectedItemTieBreak(set, 0),
                          }"
                          @click.stop="updateTieBreak(set, 0)"
                        >
                          <div class="select-item">{{ set }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="player__score">
                      <div v-if="result.players[1]" class="display__sets">
                        <div
                          v-for="set in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                          :key="set"
                          :class="{
                            display__sets__item: true,
                            active: selectedItemTieBreak(set, 1),
                          }"
                          @click.stop="updateTieBreak(set, 1)"
                        >
                          <div class="select-item">{{ set }}</div>
                        </div>
                      </div>
                      <div class="display__name"></div>
                    </div>
                  </div>
                </div>
              </transition>
              <div v-if="showMatchTieBreakInputBox" class="tie-break__box p-all-24 p-b-150">
                <div class="has-text-white has-text-centered fw600 is-size-4 m-t--12 m-b-5">{{ $t('meTiebreak') }}</div>
                <div class="input__result__box p-b-150">
                  <div class="player__score m-l-15 m-r-7">
                    <div class="display__name"></div>
                    <div class="display__sets">
                      <div
                        v-for="set in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                        :key="set"
                        :class="{
                          display__sets__item: true,
                          active: selectedItem(set, 0),
                        }"
                        @click.stop="updateScorePlayer(set, 0)"
                      >
                        <div class="select-item">{{ set }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="player__score">
                    <div v-if="result.players[1]" class="display__sets">
                      <div
                        v-for="set in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                        :key="set"
                        :class="{
                          display__sets__item: true,
                          active: selectedItem(set, 1),
                        }"
                        @click.stop="updateScorePlayer(set, 1)"
                      >
                        <div class="select-item">{{ set }}</div>
                      </div>
                    </div>
                    <div class="display__name"></div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="!showTieBreakInputBox">
              <div :class="rightArrowStyle ? 'right-arrow' : ''" class="navigation" @click="activeSet++">
                <b-icon
                  :style="[!showTieBreakInputBox ? 'display: none' : '']"
                  icon="chevron-right"
                  size="is-large"
                  pack="fal"
                  @click="activeSet++"
                >
                </b-icon>
              </div>
            </template>
          </div>
          <template v-if="showButtonMatchTieBreak">
            <div
              v-if="!showMatchTieBreakInputBox"
              class="match-tie-break m-t-10"
              @click="showMatchTieBreakInputBox = true"
            >
              {{ $t('unesiMeTiebreak') }}
            </div>
            <!--            <div v-else class="match-tie-break m-t-10" @click="showMatchTieBreakInputBox = true">-->
            <!--              <b-icon class="m-r-5" icon="long-arrow-left" size="is-small" pack="fal"></b-icon> Nazad-->
            <!--            </div>-->
          </template>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('3Korak')">
        <div class="modal__members">
          <div class="modal-title has-text-light m-b-5 title__set">{{ $t('vrstaPodloge') }}</div>
          <div class="modal-subtitle has-text-light m-b-20">{{ $t('naKojojSePodloziOdigraoMe') }}</div>
          <div class="">
            <div></div>
            <div class="modal__members">
              <div class="">
                <div
                  v-for="surface in sortedSurfaces"
                  :key="surface.id"
                  class="select-item--menu--invert line-height-14 is-size-5 has-text-white p-l-15"
                  :class="[{ active: result.surface.id === surface.id }]"
                  @click="result.surface = surface"
                >
                  <div>{{ $t(surface.title) }}</div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div class="buttons is-fixed m-t-20">
            <b-button
              class="m-l-10"
              type="is-danger"
              pack="far"
              icon-right="undo-alt"
              rounded
              @click="
                activeTab = 1
                activeSet = 0
              "
            >
              {{ $t('izmijeni') }}
            </b-button>
            <b-button
              :loading="loading"
              class="m-l-10"
              type="is-primary"
              pack="far"
              icon-right="arrow-right"
              rounded
              @click="activeTab++"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item v-if="true" :label="$t('4Korak')">
        <div class="activity__results invert">
          <div class="modal-title has-text-light m-b-5">{{ $t('potvrdaRezultata') }}</div>
          <div class="modal-subtitle has-text-light m-b-20">
            {{ $t('potvrdomRezultataVaPartnerDobitiEZahtjevZaPotvrduR') }}
          </div>
          <div class="activity__box">
            <div class="results__list">
              <resultBox v-if="result.surface.id" :result="result" :is-doubles="isItDoubles"> </resultBox>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div class="modal-confirmation">
            <div class="buttons is-fixed m-t-20">
              <b-button
                class="m-l-10"
                type="is-danger"
                pack="far"
                icon-right="undo-alt"
                rounded
                @click="
                  activeTab = 1
                  activeSet = 0
                "
              >
                {{ $t('izmijeni') }}
              </b-button>
              <b-button
                :loading="loading"
                class="m-l-10"
                type="is-primary"
                pack="far"
                icon-right="check"
                rounded
                @click="saveResult"
              >
                {{ $t('potvrdi') }}
              </b-button>
            </div>
          </div>
        </transition>
      </b-tab-item>
      <b-tab-item :label="$t('5Korak')">
        <profile
          v-if="!isItDoubles && result.players.length === 2"
          :player="profilePlayerCheck()"
          :black="true"
          :is-reprofile="playerProfile"
          @close="closeProfiling()"
        ></profile>
      </b-tab-item>
      <b-tab-item :label="$t('6Korak')">
        <div class="modal-title has-text-light m-b-20">{{ $t('vrstaMea') }}</div>
        <competitions
          @competition="isInCompetition()"
          @friendly="activeTab = 0"
          @elo="eloSelected($event)"
          @liga="ligaCupSelected($event)"
        ></competitions>
      </b-tab-item>
    </b-tabs>
    <transition name="fade">
      <div v-if="activeTab === 1" class="modal-confirmation">
        <!--        Buttons for tie-break regular-->
        <div v-if="showTieBreakInputBox" :class="['buttons', 'is-fixed', 'm-t-20']">
          <b-button
            type="is-small noborder"
            pack="fal"
            icon-left="arrow-circle-left"
            class="softshadow m-t-10"
            rounded
            @click.prevent="showTieBreakInputBox = false"
          >
            {{ $t('nazad') }}
          </b-button>
          <b-button
            type="is-primary"
            pack="fal"
            icon-right="arrow-circle-right"
            class="large__icon"
            rounded
            @click.prevent="showTieBreakInputBox = false"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
        <div v-if="!showTieBreakInputBox && !showMatchTieBreakInputBox" :class="['buttons', 'is-fixed', 'm-t-20']">
          <b-button
            :class="[{ blur_button: buttonMatchDisable || buttonsDisable }]"
            type="is-primary"
            pack="fal"
            icon-right="tennis-ball"
            class="large__icon"
            rounded
            @click.prevent="activeTab = 2"
          >
            {{ $t('gotovMe') }}
          </b-button>
          <b-button
            v-show="activeSet !== 4 && !isPickleball"
            :class="[{ blur_button: buttonsDisable }]"
            icon-right="arrow-circle-right"
            class="softshadow m-t-10"
            type="is-small noborder"
            pack="fal"
            rounded
            @click.prevent="
              activeSet++
              showTieBreakInputBox = false
            "
          >
            {{ $t('sljedeiSet') }}
          </b-button>
        </div>

        <!--        Buttons for match tie-brek-->
        <div v-if="showMatchTieBreakInputBox" :class="['buttons', 'is-fixed', 'm-t-20']">
          <b-button
            icon-left="arrow-circle-left"
            class="softshadow m-t-10"
            type="is-small noborder"
            pack="fal"
            rounded
            @click.prevent="resetMatchTieBreak"
          >
            {{ $t('nazad') }}
          </b-button>
          <b-button
            type="is-primary"
            pack="fal"
            icon-right="tennis-ball"
            class="large__icon"
            :class="[{ blur_button: result.sets[activeSet + 1][0] === result.sets[activeSet + 1][1] }]"
            rounded
            @click.prevent="activeTab = 2"
          >
            {{ $t('gotovMe') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import Result from '@/models/Result'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import TennisImage from '@/components/TennisImage.vue'
import PlayerProfile from '~/models/PlayerProfile'
import resultBox from '~/components/ResultBoxVerified'
import profile from '~/components/stats/profile'
import competitions from '~/components/liga/userCompetitions'
import Team from '~/models/Team'

export default {
  name: 'ModalResult',
  components: {
    resultBox,
    competitions,
    profile,
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
    options: {
      type: Object,
      required: false,
      default() {
        return {
          prepopulated: false,
          customlistplayer: false,
          bothPlayers: [],
          updateResult: false,
          league_id: null,
          focus: true,
          elo: false,
        }
      },
    },
    partner: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    customlistplayer: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    bothPlayers: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    elo: {
      type: [Number, String],
      required: false,
      default() {
        return ''
      },
    },
    resultUpdate: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    redirect: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  async fetch() {
    await this.debouncedGetPlayers()
    await this.getSurfaces()
    await this.skipPlayer()
  },
  data() {
    return {
      selected_teams: [],
      is_doubles: false,
      loadingPlayers: true,
      showTieBreakInputBox: false,
      showMatchTieBreakInputBox: false,
      page: 1,
      page1: 1,
      last_page: 1,
      last_page1: 1,
      bottom: false,
      resultNew: {},
      result: {
        created_at: this.$moment(),
        verified: null,
        points: 0,
        sets: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        tie_break: [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        surface: {},
        players: [this.$auth.user],
      },
      edited: true,
      players: [],
      players_double: [],
      teams: [],
      loading: false,
      activeTab: 0,
      activeSet: 0,
      search_term: '',
      selectedCourt: {},
      test: null,
      offset: 0,
      playerProfile: [],
      sets: [0, 1, 2, 3, 4, 5, 6, 7],
      setsPickleball: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      skipme: false,
      liga: {},
    }
  },
  computed: {
    isPickleball() {
      const isSportInClub = this.$store.state.club.sports.some((sport) => sport.name === 'Pickleball')
      const multisport = this.$store.state.club.sports.length > 1
      const isSelectedSport = this.$store.state.userPreference.preference.selectedSport.name === 'Pickleball'

      return isSportInClub && (!multisport || isSelectedSport)
    },
    lastPlayersOnReservation() {
      return this.$store.state.userPreference.preference.lastPlayersOnReservation
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    showTieBreakPopup() {
      if (this.activeTab !== 0 && !this.showTieBreakInputBox) {
        if (Math.abs(this.result.sets[this.activeSet][0] - this.result.sets[this.activeSet][1]) === 1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    showTieBreakPopupMini() {
      if (
        this.showTieBreakPopup === true &&
        (this.result.tie_break[this.activeSet][0] !== 0 || this.result.tie_break[this.activeSet][1] !== 0)
      ) {
        return true
      } else {
        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    surfaces() {
      return this.$store.state.club.surfaces
    },
    buttonMatchDisable() {
      if (this.edited) {
        let p1 = 0
        let p2 = 0
        _.forEach(this.result.sets, (set) => {
          if (set[0] > set[1]) {
            p1++
          }
          if (set[0] < set[1]) {
            p2++
          }
        })
        if (p1 !== p2) {
          return false
        }
        return true
      }
      return true
    },
    showButtonMatchTieBreak() {
      if (this.edited) {
        let p1 = 0
        let p2 = 0
        _.forEach(this.result.sets, (set) => {
          if (set[0] > set[1]) {
            p1++
          }
          if (set[0] < set[1]) {
            p2++
          }
        })
        if (p1 === p2 && p1 !== 0) {
          return true
        }
        return false
      }
      return false
    },
    rightArrowStyle() {
      return (
        this.result.sets[0][0] !== 0 || this.result.sets[0][1] !== 0 || this.activeSet === 5 || this.activeSet === 2
      )
    },
    buttonsDisable() {
      return !(this.result.sets[0][0] !== 0 || this.result.sets[0][1] !== 0)
    },
    isItDoubles() {
      return this.is_doubles || this.isDoubles
    },
    surfacesStore() {
      return this.$store.state.club.surfaces
    },
    sortedSurfaces() {
      return this.surfacesStore.slice().sort((a, b) => {
        if (a.badge === 'clay') {
          return -1 // "clay" comes before all other surfaces
        } else if (b.badge === 'clay') {
          return 1 // "clay" comes after all other surfaces
        } else if (a.badge === 'concrete') {
          return -1 // "hard court" comes after "clay" but before other surfaces
        } else if (b.badge === 'concrete') {
          return 1 // "hard court" comes after "clay" but before other surfaces
        } else {
          return 0 // Maintain the order for other surfaces
        }
      })
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearchTio').scrollTop = 20
        this.loadingPlayers = true
        this.page = 1
        this.players = []
        this.debouncedGetPlayers()
      }
    },
    selected_teams() {
      if (this.isItDoubles) {
        this.result.players = this.selected_teams
      }
      if (this.selected_teams.length === 1 && this.isItDoubles) {
        this.page = 1
        this.getPlayers()
      }
      if (this.selected_teams.length === 0 && this.isItDoubles) {
        this.page = 1
        this.getPlayers()
      }
    },
    activeTab(tab) {
      if (tab === 1 && !this.isItDoubles) {
        this.getPlayerProfile()
      }
      if (tab === 2) {
        Object.assign(this.result.surface, this.sortedSurfaces[0])
      }
    },
    partner: {
      handler() {
        if (this.partner.length === 2) {
          this.result.players = this.partner
        }
      },
    },
    options: {
      handler() {
        this.skipPlayer()
      },
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  mounted() {
    this.checkLigaFor9()
    // this.focusInput()
    // this.getTeams()
    // this.copyResultUpdate()
  },
  methods: {
    closeProfiling() {
      this.$parent.close()
      this.$emit('close')
      if (this.redirect) {
        this.$router.push(this.localePath('/result/' + this.resultNew.id))
      }
    },
    profilePlayerCheck() {
      if (this.result.players[0].type === 'player') {
        return this.result.players[0].id === this.user.id ? this.result.players[1] : this.result.players[0]
      } else {
        return this.result.players[0].players[0].id === this.user.id ? this.result.players[1] : this.result.players[0]
      }
    },
    checkLigaFor9() {
      if (this.options.league_id === 644) {
        this.sets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    },
    skipPlayer() {
      // If doubles from tournament
      if (this.isDoubles && this.options.bothPlayers.length === 2 && this.options.prepopulated) {
        this.selected_teams = this.options.bothPlayers
      }
      // If doubles from liga
      if (
        this.isDoubles &&
        this.partner.length === 2 &&
        !this.options.bothPlayers.length &&
        this.options.prepopulated
      ) {
        this.selected_teams = this.partner
      }
      if (this.options.prepopulated && this.elo) {
        this.selected_teams = this.partner
        this.result.players = this.partner
      } else if (this.partner.length && this.options.bothPlayers.length < 2 && !this.options.prepopulated) {
        this.result.players.push(this.partner[1])
        this.activeTab++
      } else if (this.partner.length === 2) {
        this.result.players = this.partner
        this.activeTab++
      } else if (this.options.bothPlayers.length === 2) {
        this.result.players = this.options.bothPlayers
        this.activeTab++
      } else if (this.isDoubles && this.options.bothPlayers.length === 2 && this.options.prepopulated) {
        this.selected_teams = this.options.bothPlayers
        this.activeTab++
      }
    },
    eloSelected(item) {
      this.skipme = true
      const x = item
      if (x.isDoubles) {
        this.is_doubles = true
        const y = []
        y.push(x.player)
        y.push(x.usersTeam[0])
        this.result.players = y
        this.selected_teams = y
      } else {
        const y = []
        y.push(x.player)
        y.push(this.user.team)
        this.result.players = y
        this.result.league_id = x.selectedLeague.id
      }
      this.activeTab = 1
    },
    ligaCupSelected(item) {
      if (item.players[0].players.length === 2) {
        this.is_doubles = true
        this.selected_teams = item.players
      }
      // if (item.players[0].id === this.user.id) {
      //   this.result.players.push(item.players[1])
      //   this.partner.push(item.players[1])
      // } else {
      //   this.result.players.push(item.players[0])
      //   this.partner.push(item.players[0])
      // }
      this.result.players = item.players
      this.result.game_id = item.id
      this.activeTab = 1
    },
    isInCompetition() {
      if (this.customlistplayer.length || this.partner.length || this.options.prepopulated) {
        return
      }
      this.activeTab = 5
    },
    getPlayerProfile() {
      PlayerProfile.where('player', this.result.players[1].id)
        .where('owner', this.user.id)
        .include('owner')
        .get()
        .then((res) => {
          this.playerProfile = res.data
        })
    },
    resetMatchTieBreak() {
      this.showMatchTieBreakInputBox = false
      this.$set(this.result.sets[this.activeSet + 1], 0, 0)
      this.$set(this.result.sets[this.activeSet + 1], 1, 0)
    },
    copyResultUpdate() {
      if (this.options.updateResult) {
        this.result = this.resultUpdate
      }
    },
    focusInput() {
      if ((!this.options.prepopulated || !this.options.updateResult) && this.options.focus) {
        this.$refs.filter.focus()
      }
    },
    addTeam(item) {
      if (this.selected_teams.length < 2) {
        this.selected_teams.push(item)
      } else {
        this.$buefy.toast.open({
          message: this.$t('Uklonite prvo jedan od odabrana para'),
          type: 'is-danger',
        })
      }
    },
    displayTieBreak(player) {
      // ako je tie-break
      if (Math.abs(this.result.sets[this.activeSet][0] - this.result.sets[this.activeSet][1]) === 1) {
        // ako je tie-break upisan
        if (this.result.tie_break[this.activeSet][0] !== 0 || this.result.tie_break[this.activeSet][1] !== 0) {
          return this.result.tie_break[this.activeSet][player]
        }
      }
    },
    hidePlayerSelectionButton() {
      if (this.options.prepopulated === true && this.activeSet === 0) {
        return 'disable_opaq'
      } else {
        return ''
      }
    },
    addPlayer(player) {
      if (this.result.players.length <= 1) {
        this.result.players.push(player)
      }
      if (this.result.players.length > 1) {
        this.result.players.splice(1, 1, player)
      }
      this.activeTab++
      this.edited = true
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.leftArrow()
      } else if (direction === 'left') {
        this.activeSet++
      }
    },
    getDoubles() {
      this.is_doubles = !this.is_doubles
      this.result.players = [this.user]
      this.selected_teams = []
      this.search_term = ''
      this.page = 1
      this.getPlayers()
    },
    getPlayers() {
      if (this.last_page < this.page) return
      this.loadingPlayers = true
      const t = Team.page(this.page)
        .where('display_name', this.search_term)
        .where('club', this.$store.state.club.id)
        .where('number_of_players', this.isItDoubles ? 2 : 1)
      if (this.isItDoubles && this.selected_teams.length === 0) {
        t.where('players', this.user.id)
      }
      t.get()
        .then((res) => {
          this.players = res.data
          this.last_page = res.meta.last_page
          this.page++
          this.loadingPlayers = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loadingPlayers = false
        })
    },
    async hapticsVibrate() {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Medium })
      }
    },
    saveResult() {
      if (this.options.updateResult) {
        this.updateResult()
        return
      }
      if (this.options.game_id) {
        this.result.game_id = this.options.game_id
      }
      if (this.options.league_id) {
        this.result.league_id = this.options.league_id
      }
      if (this.is_doubles) {
        this.result.players = this.selected_teams
      }
      const r = new Result(this.result)
      this.loading = true
      r.save()
        .then((res) => {
          this.resultNew = res
          if (!this.isItDoubles && this.activeTab === 3) {
            this.activeTab++
          }
          this.edited = false
          if (this.activeTab === 3) {
            this.$parent.close()
            this.$router.push(this.localePath('/result/' + this.resultNew.id))
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste upisali rezultat'),
              type: 'is-success',
              duration: 3000,
            })
          }
          this.loading = false
          this.hapticsVibrate()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Upis rezultata nije uspio'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loading = false
        })
    },
    closeFromProfile() {
      this.$parent.close()
      this.$router.push(this.localePath('/result/' + this.resultNew.id))
      this.$buefy.toast.open({
        message: this.$t('Uspješno ste upisali rezultat'),
        type: 'is-success',
        duration: 3000,
      })
    },
    updateResult() {
      const r = new Result({ id: this.resultUpdate.id, sets: this.result.sets, tie_break: this.result.tie_break })
      this.loading = true
      r.save()
        .then((res) => {
          this.$emit('close')
          this.$parent.close()
          this.$router.push(this.localePath('/result/' + res.id))
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili rezultat'),
            type: 'is-success',
            duration: 3000,
          })
          this.loading = false
          this.hapticsVibrate()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Izmjena rezultata nije uspio'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loading = false
        })
    },
    leftArrow() {
      if (this.activeSet === 0) {
        this.activeTab--
      } else {
        this.activeSet--
      }
    },
    selectedItem(set, player) {
      if (this.showMatchTieBreakInputBox) {
        if (this.activeTab > 0 && set === this.result.sets[this.activeSet + 1][player]) {
          return 'active'
        }
      } else if (this.activeTab > 0 && set === this.result.sets[this.activeSet][player]) {
        return 'active'
      }
    },
    updateScorePlayer(e, player) {
      if (this.showMatchTieBreakInputBox) {
        this.result.sets[this.activeSet + 1].splice(player, 1, e)
      } else {
        this.result.sets[this.activeSet].splice(player, 1, e)
      }
    },
    selectedItemTieBreak(set, player) {
      if (this.activeTab > 0 && set === this.result.tie_break[this.activeSet][player]) {
        return 'active'
      }
    },
    updateTieBreak(e, player) {
      this.result.tie_break[this.activeSet].splice(player, 1, e)
    },
    getSurfaces() {
      if (!this.$store.state.club.surfaces.length) {
        this.$store.dispatch('club/surfaces')
      }
    },
  },
}
</script>
<style scoped></style>
