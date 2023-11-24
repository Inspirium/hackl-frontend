<template>
  <div class="p-b-500">
    <hero :page="'cup'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('turniri') }}</h1>
    </hero>
    <div class="home-menu">
      <div class="home-menu-middle">
        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <img src="/kup.svg" class="custom-icon" alt="" />
            <div class="is-size-6 fw600">{{ $t('turniri') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(1)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="trophy" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('rankLjestvica') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 2 ? 'active-menu-item' : 'menu-item']" @click="goToTab(2)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="user" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('mojiTurniri') }}</div>
          </div>
        </div>
      </div>
    </div>
    <location class="m-t-20 m-b-20" @location="setLocation($event)" @update="noLocation()" />
    <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div class="x-container registration">
          <div class="tablelist">
            <div v-if="club.show_competitions || isAdmin" class="buttons m-t-10">
              <b-button
                class="fw600"
                type="is-primary"
                pack="fal"
                icon-right="plus-circle"
                rounded
                tag="nuxt-link"
                :to="localePath('/cup/new')"
              >
                {{ $t('izradiNoviTurnir') }}
              </b-button>
            </div>
            <div class="activity__reservation">
              <div class="buttons m-t-30 m-b-3">
                <b-button
                  v-for="(court, index) in filters"
                  :key="index"
                  :class="{
                    softshadow: true,
                    'invert-small-button': selectedCourts.includes(court),
                    blur_button: search_term !== '',
                  }"
                  :icon-right="selectedCourts.includes(court) ? 'check' : ''"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'has-text-white': selectedCourts.includes(court),
                  }"
                  pack="fal"
                  :style="returnBckg(court)"
                  rounded
                  @click.prevent="selectCourt(court)"
                >
                  {{ $t(court) }}
                </b-button>
              </div>
            </div>
            <div v-if="league.length" id="inputsearch" class="search container">
              <b-field>
                <b-input
                  v-model="search_term"
                  :placeholder="$t('pretrazi turnire')"
                  type="search"
                  pack="far"
                  class="search-icon-right"
                  :icon-right="search_icon"
                  icon-right-clickable
                  @icon-right-click="search_icon_click()"
                >
                  >
                </b-input>
              </b-field>
            </div>

            <div class="relative">
              <template>
                <transition name="fade">
                  <div v-if="loading1" class="align__centar__x loading_z_spinner m-b-10">
                    <b-icon
                      class="comment-send"
                      custom-class="rotating"
                      icon="spinner"
                      size="is-large"
                      type="is-primary"
                      pack="far"
                    ></b-icon>
                  </div>
                </transition>
              </template>
              <template v-if="league.length">
                <div v-if="loading1 && offset === 1">
                  <b-skeleton :count="5" width="100%" height="60px" :animated="true"></b-skeleton>
                </div>
                <div
                  v-for="(item, index) in league"
                  v-else
                  :key="index + item.id + 'league'"
                  class="overflow-hidden br10"
                >
                  <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
                    <div class="active list__image-col">
                      <nuxt-link
                        :to="localePath('/cup/' + item.id + '/' + link(item.status, item.access_level))"
                        class="fw600 flex align__centar__all"
                      >
                        <div class="list__content">
                          <!--                        <div class="align__centar__y">-->
                          <!--                          <h4 class="has-text-grey-light fw600 is-size-7 is-uppercase">-->
                          <!--                            <span class="">{{ item.type === 'private' ? 'Privatna liga' : 'Otvorena liga' }}</span>-->
                          <!--                          </h4>-->
                          <!--                        </div>-->
                          <div
                            class="fw600 m-t--2 flex align__centar__y"
                            :class="
                              item.status === '5' ? 'tournament-archive-heading-style p-t-10 m-b--2' : 'is-size-5'
                            "
                          >
                            <div class="fw600 has-text-black80 is-size-5 flex align__centar__all m-r-7">
                              <span>{{ item.name }}</span>
                              <span
                                v-if="item.cup_scoring"
                                class="x-tag is-black30 nav__notification has-text-white m-l-5"
                                >{{ item.cup_scoring }}</span
                              >
                            </div>
                          </div>
                          <div class="flex align__centar__y w100">
                            <div v-if="item.status === '5'" class="flex align__centar__y flex1">
                              <template v-if="item.is_doubles" class="for-doubles">
                                <div
                                  v-if="
                                    item.winner_user.image === 'https://api.tenis.plus/images/user.svg' &&
                                    item.winner_user.players.length
                                  "
                                  class="flex"
                                >
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="item.winner_user.players[0].image"
                                    class="user_image-small border__white--2"
                                    alt=""
                                  />
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="item.winner_user.players[1].image"
                                    class="user_image-small m-l--10 border__white--2"
                                    alt=""
                                  />
                                </div>
                                <div v-else class="">
                                  <TennisImage
                                    :size="[42, 42]"
                                    :src="item.winner_user.image"
                                    class="user_image border__white--2"
                                    alt=""
                                  />
                                </div>
                              </template>

                              <TennisImage
                                v-else
                                :size="[42, 42]"
                                :src="isWinner(item.winner_user)"
                                class="user_image-small"
                                alt=""
                              />
                              <div v-if="item.winner_user" class="flex align__centar__all">
                                <div class="is-size-6 has-text-black50 m-t-0 flex m-l-7">
                                  {{ item.winner_user ? item.winner_user.display_name : '' }}
                                </div>
                                <span
                                  ><b-icon
                                    class="m-t-5 m-l-10"
                                    pack="fas"
                                    icon="trophy"
                                    type="is-primary m-r-4 turnament-players-icon"
                                  >
                                  </b-icon
                                ></span>
                              </div>
                              <div v-if="item.status === '5'" class="flex flex__column m-l-auto">
                                <div class="flex align__centar__y">
                                  <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                                  <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                                  <img
                                    v-if="item.is_doubles"
                                    src="/topnav/players_1.svg"
                                    class="turnament-players-icon m-l--5"
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                            <!--                      If tournament is open and onboarding-->
                            <!--                          <div v-if="item.status === '3' && item.access_level === 'open'" class="">-->
                            <!--                            <div class="fw600 is-size-65 has-text-black50 w100 m-r-10">-->
                            <!--                              {{ $t('prijavljenihIgraa') }}-->
                            <!--                              <span class="has-text-lightblue">{{-->
                            <!--                                item.players_count ? item.players_count : 'nema prijava'-->
                            <!--                              }}</span>-->
                            <!--                            </div>-->
                            <!--                          </div>-->

                            <!--                      If tournament is private and playing-->
                          </div>
                          <!--      Universal club-->
                          <template>
                            <div
                              v-if="howManyDaysOnboarding(item) && item.application_deadline && item.status !== '4'"
                              class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                            >
                              <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-flag" />
                                {{ $t('prijaveIstiu') }}
                                <span class="has-text-success m-l-4">{{
                                  $moment().to($moment(item.application_deadline))
                                }}</span>
                              </div>
                            </div>

                            <div class="flex justify-between m-t-5 border-color-black10 p-t-3 align__centar__y">
                              <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon
                                  class="m-r-5 has-text-lightblue iw08"
                                  icon="fa-light fa-location-dot"
                                />
                                {{ item.club.name }}{{ ' • ' + item.club.city }}
                              </div>
                            </div>
                            <!--                        Show only if is open type tournament and-->
                            <div
                              v-if="item.status !== '3'"
                              class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                            >
                              <div
                                v-if="item.access_level === 'open'"
                                class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                              >
                                <font-awesome-icon
                                  class="m-r-5 has-text-lightblue iw08"
                                  icon="fa-light fa-door-closed"
                                />
                                {{ $t('Otvoreno natjecanje') }}
                              </div>

                              <div v-else class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon
                                  class="m-r-5 has-text-lightblue iw08"
                                  icon="fa-light fa-door-closed"
                                />
                                {{ $t('Privatno natjecanje') }}
                              </div>
                            </div>
                            <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                              <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-clock" />
                                <span class="hideonmobile">{{ $t('Početak') }}: </span>
                                {{ item.active_from | moment('DD.MM.YYYY.') }}
                              </div>
                              <div class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon
                                  class="m-r-5 has-text-lightblue iw08"
                                  icon="fa-light fa-flag-checkered"
                                />
                                <span class="hideonmobile">{{ $t('Kraj') }}: </span>
                                {{ item.active_to | moment('DD.MM.YYYY.') }}
                              </div>
                            </div>
                            <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                              <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                                <font-awesome-icon
                                  class="m-r-5 has-text-lightblue iw08"
                                  icon="fa-light fa-money-bill-1-wave"
                                />
                                <span v-if="item.price">{{ $t('Cijena') }}: {{ item.price | currency }}</span>
                                <span v-else>{{ $t('Cijena') }}: {{ $t('besplatno') }}</span>
                              </div>
                            </div>
                            <b-button
                              v-if="item.status === '4' && !item.is_doubles"
                              class="m-r-10 m-l--5 fw600 invert-small-button m-t-15"
                              type="is-danger is-smaller noborder__small has-text-white"
                              pack="fal"
                              rounded
                              @click.prevent="openPlayersModal(item)"
                            >
                              {{ $t('Prikaži igrače') }}
                            </b-button>
                            <b-button
                              v-if="item.status === '4' && !item.is_doubles"
                              class="m-r-10 m-l--5 fw600 invert-small-button m-t-15"
                              type="is-danger is-smaller noborder__small has-text-white"
                              pack="fal"
                              rounded
                              @click.prevent="openDrawModal(item)"
                            >
                              {{ $t('Prikaži ždrijeb') }}
                            </b-button>
                          </template>
                        </div>
                        <div class="flex flex__column align-items-end">
                          <div
                            v-if="item.status !== '5' && item.status !== '4'"
                            class="x-tag--xl m-l-auto nowrap m-l-10"
                            :style="tagColor(item.status)"
                          >
                            {{ status(item.status) }}
                          </div>
                          <!--                        Show numer of players and if is doubles for open and onboarding-->
                          <div v-if="item.status === '3' && item.access_level === 'open'" class="m-t-5">
                            <div class="flex flex__column m-l-auto">
                              <div class="flex align__centar__y">
                                <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                                <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                                <img
                                  v-if="item.is_doubles"
                                  src="/topnav/players_1.svg"
                                  class="turnament-players-icon m-l--5"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <!--                        Show numer of players and if is doubles for open and active-->
                          <div v-if="item.status === '4'" class="m-t-5 p-l-7 p-r-7">
                            <div class="flex flex__column m-l-auto">
                              <div class="flex align__centar__y">
                                <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                                <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                                <img
                                  v-if="item.is_doubles"
                                  src="/topnav/players_1.svg"
                                  class="turnament-players-icon m-l--5"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </nuxt-link>
                      <div v-if="false" class="">
                        <div
                          v-if="realPositionLabel(item)"
                          class="flex justify-between border-color-black10 p-t-3 m-t-10 align__centar__y"
                        >
                          <div class="fw600 is-size-65 has-text-black50">
                            {{ $t('pozicija') }}
                            <span class="has-text-lightblue"> {{ positionLabel(item) }}</span>
                          </div>
                          <trend
                            :final="realPositionLabel(item)"
                            :limit="10"
                            class="m-b-2 m-t-2 m-l-auto vstrend-left min-w-100"
                          >
                          </trend>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <section v-if="!league.length && !loading1" class="">
                <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                  <p class="fw600 is-size-6 has-text-centered has-text-black50 m-b-10">
                    {{ $t('Nema otvorenih natjecanja u klubu') }}
                  </p>
                </div>
              </section>
              <allLigas
                v-if="$store.state.club.id !== 26 && selectedCourts[0] !== 'završene'"
                :competition="'tournament'"
                :filter-status="selectedCourts[0]"
              />
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="x-container">
          <TimeRange :show="timeRangeShow" :default-selected="'this_year'" @timespan="timerange($event)" />
          <div class="filters container">
            <div class="filter">
              <div class="buttons">
                <b-button
                  :type="is_doubles ? 'is-primary' : 'is-danger'"
                  pack="fal"
                  size="is-smaller"
                  :icon-right="!is_doubles ? 'user-friends' : 'user-alt'"
                  @click="
                    offset2 = 1
                    is_doubles = !is_doubles
                    score = []
                    scoring()
                  "
                >
                  {{ is_doubles ? $t('Prikaži pojedinačno') : $t('Prikaži parove') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="score.length" class="flex align__centar__y justify-end m-t-25 p-r-15">
          <div class="fw600 has-text-right is-size-6 m-r-10">Sortiraj:</div>
          <div class="has-text-right sort-button">
            <b-button
              :type="by_average ? 'is-primary' : 'is-light'"
              pack="fas"
              size="is-smaller"
              @click="by_average = !by_average"
            >
              {{ $t('Prosjek bodova') }}
            </b-button>
            <b-button
              :type="!by_average ? 'is-orange' : 'is-light'"
              pack="fas"
              size="is-smaller"
              @click="by_average = !by_average"
            >
              {{ $t('Ukupno bodova') }}
            </b-button>
          </div>
        </div>
        <div class="relative">
          <transition name="fade">
            <div v-if="true" class="relative">
              <div
                v-for="(item, index) in by_average ? sortedData : score"
                :key="item.id + 'score'"
                class="bottom-border-line is-white p-b-10 p-t-10 p-l-10 p-r-10"
              >
                <div class="flex align__centar__y" @click="isOpen === index ? (isOpen = null) : (isOpen = index)">
                  <div class="fw600 is-size-4 has-text-white is-primary rank-high m-r-10">
                    {{ index + 1 }}
                  </div>
                  <div class="w100 flex justify-between">
                    <div class="flex align__centar__y">
                      <template v-if="is_doubles" class="for-doubles">
                        <div v-if="item.image === 'https://api.tenis.plus/images/user.svg'" class="flex m-r-7">
                          <TennisImage
                            :size="[42, 42]"
                            :src="item.players[0].image"
                            class="user_image-small border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="item.players[1].image"
                            class="user_image-small m-l--16 border__white--2"
                            alt=""
                          />
                        </div>
                        <TennisImage v-else :size="[42, 42]" :src="item.image" class="user_image m-r-7" alt="" />
                      </template>

                      <TennisImage v-else :size="[42, 42]" :src="item.image" class="user_image m-r-7" alt="" />
                      <div class="flex flex__column align__centar__x">
                        <h3 class="is-size-55 has-text-black80 fw600 align__centar__y">{{ item.display_name }}</h3>
                        <div v-if="item.tournament_scores" class="fw600 is-size-65 has-text-black30 m-r-15 m-t-5">
                          {{ $t('odigranihTurnira') }}
                          <span class="has-text-lightblue">{{ item.tournament_scores.length }}</span>
                        </div>
                        <div v-if="item.tournament_scores" class="fw600 is-size-65 has-text-black30 m-r-15 m-t-2">
                          {{ $t('Prosjek bodova') }}
                          <span class="has-text-lightblue">{{
                            Math.round(
                              item.tournament_total_score /
                                (item.tournament_scores.length === 1 ? 2 : item.tournament_scores.length)
                            )
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex__column m-t-4 align__centar__x">
                      <div class="flex flex__column">
                        <transition name="fade">
                          <div
                            :class="!by_average ? 'x-tag--m' : 'x-tag--small'"
                            class="is-orange transition-1 m-l-auto m-t-2"
                          >
                            {{ item.tournament_total_score }}
                          </div>
                        </transition>
                        <div
                          :class="!by_average ? 'x-tag--small' : 'x-tag--m'"
                          class="is-primary transition-1 m-l-auto m-t-2"
                        >
                          {{
                            Math.round(
                              item.tournament_total_score /
                                (item.tournament_scores.length === 1 ? 2 : item.tournament_scores.length)
                            )
                          }}
                        </div>
                      </div>

                      <div
                        v-if="howManyTimesWinner(item)"
                        class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y m-t-4"
                      >
                        <span class="has-text-black80">{{ howManyTimesWinner(item) }}</span>
                        <b-icon
                          class="turnament-players-icon m-l-5"
                          pack="fal"
                          icon="trophy"
                          type="is-black50"
                        ></b-icon>
                      </div>
                    </div>
                  </div>
                  <b-icon
                    icon="chevron-down"
                    size="is-small-9"
                    pack="far"
                    class="m-t--3 m-l-7"
                    :class="[isOpen === index ? 'chevron-animated-open' : 'chevron-animated-close']"
                  ></b-icon>
                </div>
                <template v-if="isOpen === index">
                  <template v-for="tournament in item.tournament_scores.slice().reverse()">
                    <div
                      v-if="tournament.tournament"
                      :key="tournament.id + 't'"
                      class="border-color-black10 m-t-7"
                      @click="$router.push(localePath(tournament.tournament.link))"
                    >
                      <div class="flex align__centar__y m-t-4">
                        <div class="fw600 is-size-65 has-text-black80 m-r-15">
                          <span class="fw600 has-text-primary">{{ tournament.tournament.name }}</span>
                          <span v-if="tournament.tournament.data.cup_scoring" class="has-text-black30 m-r-5"
                            >({{ tournament.tournament.data.cup_scoring }})</span
                          >
                        </div>
                        <div class="fw600 is-size-65 has-text-black30 m-l-auto flex align__centar__y">
                          <span v-if="tournament.final_score" class="has-text-green m-r-10"
                            >+{{ tournament.final_score }}</span
                          >
                          <span v-if="tournament.final_status" class="has-text-black80 has-text-right"
                            >{{ ranksPositionLabel(tournament.final_status) }}
                          </span>
                          <b-icon
                            class="turnament-players-icon m-l-5"
                            :pack="tournament.final_status === '*' ? 'fas' : 'fal'"
                            icon="trophy"
                            :type="tournament.final_status === '*' ? 'is-primary' : 'is-black50'"
                          >
                          </b-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="buttons m-t-10 m-b-2">
                    <b-button
                      class="m-l-5 m-t-7 removeborder softshadow"
                      type="is-primary is-smaller-12"
                      pack="fal"
                      rounded
                      size="is-smaller"
                      @click="$router.push(localePath('/player/' + item.players[0].id))"
                      >{{ $t('vidiIgraevProfil') }}
                    </b-button>
                  </div>
                </template>
              </div>
              <transition name="fade">
                <div v-if="loading" class="align__centar__x m-t-5 loading_z_spinner--bottom">
                  <b-icon
                    class="comment-send"
                    custom-class="rotating"
                    icon="spinner"
                    size="is-large"
                    type="is-primary"
                    pack="far"
                  ></b-icon>
                </div>
              </transition>
            </div>
          </transition>
          <template v-if="!score.length && !loading">
            <div class="rounded-md has-text-centered m-t-20">
              <b-icon icon="exclamation-square" pack="fal" type="is-danger" class="is-medium m-t-5"> </b-icon>
              <div class="has-text-centered is-size-5 has-text-black50 fw600">
                {{ $t('nemaPodatakaZaUneseneVrijednosti') }}
              </div>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="x-container registration p-b-150">
          <template v-if="tournamentAdmin.length">
            <div class="fw600 is-black80 is-size-3 m-b-5">
              {{ $t('administrator') }}
              <span class="fw600 has-text-lightblue is-size-65 relative top--10">({{ tournamentAdminTotal }})</span>
            </div>
            <div
              v-for="(item, index) in tournamentAdmin"
              :key="item.id + item.club_id + index + 'ta'"
              class="overflow-hidden br10"
            >
              <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
                <div class="active list__image-col">
                  <nuxt-link
                    :to="localePath('/cup/' + item.id + '/' + link(item.status, item.access_level))"
                    class="fw600 flex align__centar__all"
                  >
                    <div v-if="true" class="list__content">
                      <div
                        class="fw600 m-t--2 flex align__centar__y"
                        :class="item.status === '5' ? 'tournament-archive-heading-style p-t-10 m-b--2' : 'is-size-5'"
                      >
                        <div class="fw600 has-text-black80 is-size-5 flex align__centar__all m-r-7">
                          <span>{{ item.name }}</span>
                          <span
                            v-if="item.cup_scoring"
                            class="x-tag is-black30 nav__notification has-text-white m-l-5"
                            >{{ item.cup_scoring }}</span
                          >
                        </div>
                      </div>
                      <div v-if="true" class="flex align__centar__y w100">
                        <div v-if="item.status === '5'" class="flex align__centar__y flex1">
                          <template v-if="item.is_doubles" class="for-doubles">
                            <div
                              v-if="
                                item.winner_user.image === 'https://api.tenis.plus/images/user.svg' &&
                                item.winner_user.players.length
                              "
                              class="flex"
                            >
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.players[0].image"
                                class="user_image-small border__white--2"
                                alt=""
                              />
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.players[1].image"
                                class="user_image-small m-l--10 border__white--2"
                                alt=""
                              />
                            </div>
                            <div v-else class="">
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.image"
                                class="user_image border__white--2"
                                alt=""
                              />
                            </div>
                          </template>

                          <TennisImage
                            v-else
                            :size="[42, 42]"
                            :src="isWinner(item.winner_user)"
                            class="user_image-small"
                            alt=""
                          />
                          <div v-if="item.winner_user" class="flex align__centar__all">
                            <div class="is-size-6 has-text-black50 m-t-0 flex m-l-7">
                              {{ item.winner_user ? item.winner_user.display_name : '' }}
                            </div>
                            <span
                              ><b-icon
                                class="m-t-5 m-l-10"
                                pack="fas"
                                icon="trophy"
                                type="is-primary m-r-4 turnament-players-icon"
                              >
                              </b-icon
                            ></span>
                          </div>
                          <div v-if="item.status === '5'" class="flex flex__column m-l-auto">
                            <div class="flex align__centar__y">
                              <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                              <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                              <img
                                v-if="item.is_doubles"
                                src="/topnav/players_1.svg"
                                class="turnament-players-icon m-l--5"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <!--                      If tournament is open and onboarding-->
                        <!--                          <div v-if="item.status === '3' && item.access_level === 'open'" class="">-->
                        <!--                            <div class="fw600 is-size-65 has-text-black50 w100 m-r-10">-->
                        <!--                              {{ $t('prijavljenihIgraa') }}-->
                        <!--                              <span class="has-text-lightblue">{{-->
                        <!--                                item.players_count ? item.players_count : 'nema prijava'-->
                        <!--                              }}</span>-->
                        <!--                            </div>-->
                        <!--                          </div>-->

                        <!--                      If tournament is private and playing-->
                      </div>
                      <!--      Universal club-->
                      <template>
                        <div
                          v-if="howManyDaysOnboarding(item) && item.application_deadline"
                          class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                        >
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-flag" />
                            {{ $t('prijaveIstiu') }}
                            <span class="has-text-success m-l-4">{{
                              $moment().to($moment(item.application_deadline))
                            }}</span>
                          </div>
                        </div>

                        <div class="flex justify-between m-t-5 border-color-black10 p-t-3 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                            {{ item.club.name }}{{ ' • ' + item.club.city }}
                          </div>
                        </div>
                        <!--                        Show only if is open type tournament and-->
                        <div
                          v-if="item.status !== '3'"
                          class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                        >
                          <div
                            v-if="item.access_level === 'open'"
                            class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                          >
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                            {{ $t('Otvoreno natjecanje') }}
                          </div>

                          <div v-else class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                            {{ $t('Privatno natjecanje') }}
                          </div>
                        </div>
                        <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-clock" />
                            <span class="hideonmobile">{{ $t('Početak') }}: </span>
                            {{ item.active_from | moment('DD.MM.YYYY.') }}
                          </div>
                          <div class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon
                              class="m-r-5 has-text-lightblue iw08"
                              icon="fa-light fa-flag-checkered"
                            />
                            <span class="hideonmobile">{{ $t('Kraj') }}: </span>
                            {{ item.active_to | moment('DD.MM.YYYY.') }}
                          </div>
                        </div>
                        <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon
                              class="m-r-5 has-text-lightblue iw08"
                              icon="fa-light fa-money-bill-1-wave"
                            />
                            <span v-if="item.price">{{ $t('Cijena') }}: {{ item.price | currency }}</span>
                            <span v-else>{{ $t('Cijena') }}: {{ $t('besplatno') }}</span>
                          </div>
                        </div>
                      </template>
                    </div>

                    <div class="flex flex__column align-items-end">
                      <div
                        v-if="item.status !== '5'"
                        class="x-tag--xl m-l-auto nowrap m-l-10"
                        :style="tagColor(item.status)"
                      >
                        {{ status(item.status) }}
                      </div>
                      <!--                        Show numer of players and if is doubles for open and onboarding-->

                      <div v-if="item.status === '3' && item.access_level === 'open'" class="m-t-5">
                        <div class="flex flex__column m-l-auto">
                          <div class="flex align__centar__y">
                            <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                            <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                            <img
                              v-if="item.is_doubles"
                              src="/topnav/players_1.svg"
                              class="turnament-players-icon m-l--5"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <!--                      Show if is active an sum number of player-->
                      <div v-if="item.status === '4'" class="m-t-5">
                        <div class="flex flex__column m-l-auto">
                          <div class="flex align__centar__y">
                            <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                            <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                            <img
                              v-if="item.is_doubles"
                              src="/topnav/players_1.svg"
                              class="turnament-players-icon m-l--5"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nuxt-link>
                  <div v-if="item.status === '5'" class="">
                    <div
                      v-if="realPositionLabel(item) !== '*'"
                      class="flex justify-between border-color-black10 p-t-3 m-t-10 align__centar__y"
                    >
                      <div class="fw600 is-size-65 has-text-black50">
                        {{ $t('zavrnaPozicija') }}
                        <span class="has-text-lightblue"> {{ positionLabel(item) }}</span>
                      </div>
                      <trend
                        v-if="realPositionLabel(item)"
                        :final="realPositionLabel(item)"
                        :limit="10"
                        class="m-b-2 m-t-2 m-l-auto vstrend-left min-w-100"
                        style="scale: 0.8; transform-origin: right"
                      >
                      </trend>
                    </div>
                    <div
                      v-if="item.status === '5' && finalScore(item)"
                      class="fw600 is-size-65 has-text-black50 border-color-black10 p-t-3 m-t-5"
                    >
                      {{ $t('osvojeniBodovi') }}
                      <span class="has-text-lightblue">{{ finalScore(item) }}</span>
                    </div>
                  </div>
                  <div
                    v-if="item.status === '5' && item.cup_scoring"
                    class="fw600 is-size-65 has-text-black50 border-color-black10 p-t-3 m-t-5"
                  >
                    {{ $t('jainaTurnira') }}
                    <span class="has-text-lightblue">
                      {{
                        item.cup_scoring === 125 ? 'Challanger ' + item.cup_scoring : 'ATP ' + item.cup_scoring
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="leagueMy.length">
            <div v-if="leagueMy.length" class="fw600 is-black80 is-size-3 m-t-30 m-b-5">
              {{ $t('igra') }}
              <span class="fw600 has-text-lightblue is-size-65 relative top--10">({{ total1 }})</span>
            </div>
            <div v-for="(item, index) in leagueMy" :key="item.id + index + 'my'" class="overflow-hidden br10">
              <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
                <div class="active list__image-col">
                  <nuxt-link
                    :to="localePath('/cup/' + item.id + '/' + link(item.status, item.access_level))"
                    class="fw600 flex align__centar__all"
                  >
                    <div v-if="true" class="list__content">
                      <!--                        <div class="align__centar__y">-->
                      <!--                          <h4 class="has-text-grey-light fw600 is-size-7 is-uppercase">-->
                      <!--                            <span class="">{{ item.type === 'private' ? 'Privatna liga' : 'Otvorena liga' }}</span>-->
                      <!--                          </h4>-->
                      <!--                        </div>-->
                      <div
                        class="fw600 m-t--2 flex align__centar__y"
                        :class="item.status === '5' ? 'tournament-archive-heading-style p-t-10 m-b--2' : 'is-size-5'"
                      >
                        <div class="fw600 has-text-black80 is-size-5 flex align__centar__all m-r-7">
                          <span>{{ item.name }}</span>
                          <span
                            v-if="item.cup_scoring"
                            class="x-tag is-black30 nav__notification has-text-white m-l-5"
                            >{{ item.cup_scoring }}</span
                          >
                        </div>
                      </div>
                      <div v-if="true" class="flex align__centar__y w100">
                        <div v-if="item.status === '5'" class="flex align__centar__y flex1">
                          <template v-if="item.is_doubles" class="for-doubles">
                            <div
                              v-if="
                                item.winner_user.image === 'https://api.tenis.plus/images/user.svg' &&
                                item.winner_user.players.length
                              "
                              class="flex"
                            >
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.players[0].image"
                                class="user_image-small border__white--2"
                                alt=""
                              />
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.players[1].image"
                                class="user_image-small m-l--10 border__white--2"
                                alt=""
                              />
                            </div>
                            <div v-else class="">
                              <TennisImage
                                :size="[42, 42]"
                                :src="item.winner_user.image"
                                class="user_image border__white--2"
                                alt=""
                              />
                            </div>
                          </template>

                          <TennisImage
                            v-else
                            :size="[42, 42]"
                            :src="isWinner(item.winner_user)"
                            class="user_image-small"
                            alt=""
                          />
                          <div v-if="item.winner_user" class="flex align__centar__all">
                            <div class="is-size-6 has-text-black50 m-t-0 flex m-l-7">
                              {{ item.winner_user ? item.winner_user.display_name : '' }}
                            </div>
                            <span
                              ><b-icon
                                class="m-t-5 m-l-10"
                                pack="fas"
                                icon="trophy"
                                type="is-primary m-r-4 turnament-players-icon"
                              >
                              </b-icon
                            ></span>
                          </div>
                          <div v-if="item.status === '5'" class="flex flex__column m-l-auto">
                            <div class="flex align__centar__y">
                              <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                              <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                              <img
                                v-if="item.is_doubles"
                                src="/topnav/players_1.svg"
                                class="turnament-players-icon m-l--5"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <!--                      If tournament is open and onboarding-->
                        <!--                          <div v-if="item.status === '3' && item.access_level === 'open'" class="">-->
                        <!--                            <div class="fw600 is-size-65 has-text-black50 w100 m-r-10">-->
                        <!--                              {{ $t('prijavljenihIgraa') }}-->
                        <!--                              <span class="has-text-lightblue">{{-->
                        <!--                                item.players_count ? item.players_count : 'nema prijava'-->
                        <!--                              }}</span>-->
                        <!--                            </div>-->
                        <!--                          </div>-->

                        <!--                      If tournament is private and playing-->
                      </div>
                      <!--      Universal club-->
                      <template>
                        <div class="flex justify-between m-t-5 p-t-3 border-color-black10 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 p-t-3 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                            {{ item.club.name }}{{ ' • ' + item.club.city }}
                          </div>
                        </div>
                        <!--                        Show only if is open type tournament and-->
                        <div
                          v-if="item.status !== '3'"
                          class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                        >
                          <div
                            v-if="item.access_level === 'open'"
                            class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                          >
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                            {{ $t('Otvoreno natjecanje') }}
                          </div>

                          <div v-else class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                            {{ $t('Privatno natjecanje') }}
                          </div>
                        </div>
                        <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-clock" />
                            <span class="hideonmobile">{{ $t('Početak') }}: </span>
                            {{ item.active_from | moment('DD.MM.YYYY.') }}
                          </div>
                          <div class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon
                              class="m-r-5 has-text-lightblue iw08"
                              icon="fa-light fa-flag-checkered"
                            />
                            <span class="hideonmobile">{{ $t('Kraj') }}: </span>
                            {{ item.active_to | moment('DD.MM.YYYY.') }}
                          </div>
                        </div>
                        <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                          <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                            <font-awesome-icon
                              class="m-r-5 has-text-lightblue iw08"
                              icon="fa-light fa-money-bill-1-wave"
                            />
                            <span v-if="item.price">{{ $t('Cijena') }}: {{ item.price | currency }}</span>
                            <span v-else>{{ $t('Cijena') }}: {{ $t('besplatno') }}</span>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div class="flex flex__column align-items-end">
                      <div
                        v-if="item.status !== '5'"
                        class="x-tag--xl m-l-auto nowrap m-l-10"
                        :style="tagColor(item.status)"
                      >
                        {{ status(item.status) }}
                      </div>
                      <!--                        Show numer of players and if is doubles for open and onboarding-->

                      <div v-if="item.status === '3' && item.access_level === 'open'" class="m-t-5">
                        <div class="flex flex__column m-l-auto">
                          <div class="flex align__centar__y">
                            <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                            <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                            <img
                              v-if="item.is_doubles"
                              src="/topnav/players_1.svg"
                              class="turnament-players-icon m-l--5"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <!--                      Show if is active an sum number of player-->
                      <div v-if="item.status === '4'" class="m-t-5">
                        <div class="flex flex__column m-l-auto">
                          <div class="flex align__centar__y">
                            <div class="has-text-black80 is-size-5">{{ item.players_count }}</div>
                            <img src="/topnav/players_1.svg" class="turnament-players-icon m-l-5" alt="" />
                            <img
                              v-if="item.is_doubles"
                              src="/topnav/players_1.svg"
                              class="turnament-players-icon m-l--5"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nuxt-link>
                  <div v-if="item.status === '5'" class="">
                    <div
                      v-if="realPositionLabel(item) !== '*'"
                      class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
                    >
                      <div class="fw600 is-size-65 has-text-black50">
                        {{ $t('zavrnaPozicija') }}
                        <span class="has-text-lightblue"> {{ positionLabel(item) }}</span>
                      </div>
                      <trend
                        v-if="realPositionLabel(item)"
                        :final="realPositionLabel(item)"
                        :limit="10"
                        class="m-b-2 m-t-2 m-l-auto vstrend-left min-w-100"
                        style="scale: 0.8; transform-origin: right"
                      >
                      </trend>
                    </div>
                    <div
                      v-if="item.status === '5' && finalScore(item)"
                      class="fw600 is-size-65 has-text-black50 border-color-black10 p-t-3 m-t-5"
                    >
                      {{ $t('osvojeniBodovi') }}
                      <span class="has-text-lightblue">{{ finalScore(item) }}</span>
                    </div>
                  </div>
                  <div
                    v-if="item.status === '5' && item.cup_scoring"
                    class="fw600 is-size-65 has-text-black50 border-color-black10 p-t-3 m-t-5"
                  >
                    {{ $t('jainaTurnira') }}
                    <span class="has-text-lightblue">
                      {{
                        item.cup_scoring === 125 ? 'Challanger ' + item.cup_scoring : 'ATP ' + item.cup_scoring
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                <p class="fw600 is-size-5 has-text-centered has-text-black50 m-b-10 m-t-5">
                  {{ $t('nisteSudjeloviliUNatjecanjima') }}
                </p>
              </div>
            </section>
          </template>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalPlayerOpen" class="hidescrollbar">
      <modalPlayers :tour="selectedTour" />
    </b-modal>
    <b-modal :active.sync="showDraw" class="hidescrollbar draw-modal" :width="640" scroll="clip">
      <cupDraw :tournament="selectedTour"></cupDraw>
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Tournament from '@/models/Tournament'
import TournamentScore from '@/models/TournamentScore'
import _ from 'lodash'
import hero from '~/components/Hero'
import trend from '~/components/stats/trend-cup'
import TimeRange from '~/components/reports/TimeRange'
import location from '~/components/GeoLocation'
import allLigas from '~/components/liga/allLigas'
import modalPlayers from '~/components/modal/ModalTourPlayers'

export default {
  name: 'Turniri',
  components: {
    hero,
    trend,
    TimeRange,
    TennisImage,
    allLigas,
    location,
    modalPlayers,
  },
  async fetch() {
    await this.getLeagueAdmin()
    await this.getLeagueAdminOnly()
  },
  data() {
    return {
      activeMainTab: 0,
      showDraw: false,
      isModalActive: false,
      isModalPlayerOpen: false,
      heroImage: '/liga.jpg',
      league: [],
      leagueAdmin: [],
      leagueMy: [],
      tournamentAdmin: [],
      selectedLeague: {},
      loading: false,
      loading1: false,
      nomore: false,
      search_term: '',
      nomore1: false,
      nomore2: false,
      total: 0,
      total1: 0,
      last_page: 1,
      last_page1: 1,
      bottom: '',
      bottom1: '',
      bottom2: '',
      offset: 1,
      offset1: 1,
      offset2: 1,
      isOpen: null,
      timeRangeShow: {
        day: false,
        yesterday: false,
        week: false,
        last_week: false,
        month: true,
        last_month: true,
        last_365: true,
        this_year: true,
        last_year: true,
        custom: true,
      },
      score: [],
      scoreTimeRange: 'this_year',
      is_doubles: false,
      by_average: false,
      test: false,
      selectedCourts: ['otvorene'],
      filters: ['otvorene', 'aktivne', 'završene'],
      tournamentAdminTotal: null,
      location: {
        latitude: 0,
        longitude: 0,
      },
      selectedTour: {},
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
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    sortedData() {
      return this.score.slice().sort((a, b) => {
        const scoreA = a.tournament_total_score / (a.tournament_scores.length === 1 ? 2 : a.tournament_scores.length)
        const scoreB = b.tournament_total_score / (b.tournament_scores.length === 1 ? 2 : b.tournament_scores.length)

        return scoreB - scoreA // Sort in descending order (highest score first)
      })
    },
  },
  watch: {
    '$route.hash': {
      immediate: true,
      handler(newHash) {
        if (!newHash) {
          this.$router.replace({ hash: '0' })
        } else if (newHash.startsWith('#')) {
          const tab = parseInt(newHash.substring(1))
          if (!isNaN(tab)) {
            if (tab === 4) {
              this.selectedCourts = ['aktivne']
              this.activeMainTab = 0
            } else if (tab === 5) {
              this.selectedCourts = ['završene']
              this.activeMainTab = 0
            } else {
              this.activeMainTab = tab
              window.history.replaceState(null, null, `#${tab}`)
            }
          }
        }
      },
    },
    search_term(term) {
      if (term.length) {
        this.offset = 1
        this.league = []
        this.debouncedGetLeague()
      } else {
        this.getLeague()
      }
    },
    bottom(bottom) {
      if (bottom) {
        switch (this.activeMainTab) {
          case 0:
            this.offset++
            this.getLeague()
            break
          case 1:
            if (!this.loading) {
              this.offset2++
              this.scoring()
            }
            break
          case 2:
            this.offset1++
            this.getLeagueAdmin()
            break
        }
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  created() {
    this.debouncedGetLeague = _.debounce(this.getLeague, 500)
  },
  methods: {
    openDrawModal(item) {
      this.selectedTour = item
      this.showDraw = true
    },
    openPlayersModal(item) {
      this.selectedTour = item
      this.isModalPlayerOpen = true
    },
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    returnBckg(item) {
      if (this.selectedCourts[0] === 'otvorene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #73c03d'
      } else if (this.selectedCourts[0] === 'aktivne' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #209cee'
      } else if (this.selectedCourts[0] === 'završene' && item === this.selectedCourts[0]) {
        return 'backgroundColor: #f03a5f'
      } else {
        return 'tra'
      }
    },
    search_icon_click() {
      this.offset = 1
      this.search_term = ''
      this.getLeague()
    },
    noLocation() {
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.offset = 1
      this.last_page = 1
      this.league = []
      this.getLeague()
    },
    selectCourt(item) {
      if (item === 'aktivne') {
        window.history.replaceState(null, null, '#4')
      } else if (item === 'završene') {
        window.history.replaceState(null, null, '#5')
      } else {
        window.history.replaceState(null, null, '#0')
      }
      this.selectedCourts[0] = item
      this.league = []
      this.offset = 1
      this.last_page = 1
      this.getLeague()
    },
    howManyDaysOnboarding(liga) {
      if (liga.application_deadline) {
        if (this.$moment(liga.application_deadline) <= this.$moment()) {
          return false
        }
      } else if (liga.finish_onboarding) {
        if (this.$moment(liga.finish_onboarding) <= this.$moment()) {
          return false
        }
      }
      return 'još ' + this.$moment(liga.active_to).endOf('day').fromNow('String')
    },
    timerange(item) {
      if (item === 'Sve') {
        this.score = []
        this.offset2 = 1
        this.scoring()
      } else if (item === 'Custom') {
        this.scoreTimeRange = item
        this.score = []
        this.offset2 = 1
        this.scoring()
      }
      this.scoreTimeRange = item
      this.score = []
      this.offset2 = 1
      this.scoring()
    },
    howManyTimesWinner(item) {
      let agg = 0
      if (item.tournament_scores === undefined) {
        return []
      }
      for (let i = 0; i < item.tournament_scores.length; i++) {
        if (item.tournament_scores[i].tournament) {
          if (item.tournament_scores[i].tournament.winner_user) {
            if (item.tournament_scores[i].tournament.winner_user.id === item.id) {
              agg++
            }
          }
        }
      }
      return agg
    },
    ranksPositionLabel(item) {
      if (item === '*') {
        return 'Pobjednik'
      }
      if (item === null) {
        return 'Prvo kolo'
      }
      const position = item[0]
      const total = item[2]
      const currentTotal = total - position
      switch (currentTotal) {
        case 0:
          return 'Finale'
        case 1:
          return 'Polufinale'
        case 2:
          return 'Četvrtfinale'
        case 3:
          return 'Osmina finala'
        case 4:
          return 'Šesnaestina finala'
        case 5:
          return '1/32 finala'
        case 6:
          return '1/64 finala'
        case 7:
          return '1/128 finala'
      }
    },
    positionLabel(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return ''
      }
      const user = tr.pivot.final_status
      if (user) {
        if (user === '*') {
          return 'Pobjednik'
        }
        const position = user[0]
        const total = user[2]
        const currentTotal = total - position
        switch (currentTotal) {
          case 0:
            return 'Finale'
          case 1:
            return 'Polufinale'
          case 2:
            return 'Četvrtfinale'
          case 3:
            return 'Osmina finala'
          case 4:
            return 'Šesnaestina finala'
          case 5:
            return '1/32 finala'
          case 6:
            return '1/64 finala'
          case 7:
            return '1/128 finala'
        }
      }
      return ''
    },
    realPositionLabel(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return false
      }
      const user = tr.pivot.final_status
      return user
    },
    finalScore(item) {
      const tr = this.myFinalRound(item)
      if (tr === undefined || tr === -1) {
        return '0'
      }
      const user = tr.pivot.final_score
      return user
    },
    myFinalRound(cup) {
      if (cup.is_doubles) {
        const userTeam = _.intersectionWith(cup.players, this.user.teams, (a, b) => a.id === b.id)
        const myPosition = cup.players.findIndex((obj) => obj.id === userTeam[0].id)
        return cup.players[myPosition]
      }
      const myPosition = cup.players.findIndex((obj) => obj.id === this.user.team.id)
      return cup.players[myPosition]
    },
    isWinner(item) {
      if (item === null) {
        return 'https://tenis.plus/players.svg'
      }
      return item.image
    },
    getLeague() {
      if (this.last_page < this.offset) return
      this.loading1 = true
      let t = Tournament.include('club', 'players')
      if (this.selectedCourts[0] === 'otvorene') {
        t = t.whereIn('status', ['3'])
      } else if (this.selectedCourts[0] === 'aktivne') {
        t = t.whereIn('status', ['4'])
      } else if (this.selectedCourts[0] === 'završene') {
        t = t.whereIn('status', ['5'])
      }
      if (this.$store.state.club.id !== 26) {
        t = t.where('club', this.$store.state.club.id).orderBy('-active_to')
      } else {
        t = t
          .where('show_on_tenisplus', true)
          .params({
            latitude: this.location.latitude,
            longitude: this.location.longitude,
          })
          .orderBy('distance')
      }
      if (this.selectedCourts[0] === 'završene') {
        t = t.orderBy('-active_to')
      }
      if (this.search_term !== '') {
        t = t.where('name', this.search_term).whereIn('status', ['3', '4', '5']).orderBy('-active_to')
      }
      t.page(this.offset)
        .get()
        .then((res) => {
          if (this.offset > 1) {
            this.league = [...this.league, ...res.data]
          } else {
            this.league = res.data
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading1 = false
        })
    },
    // .where('admins', this.user.id)
    getLeagueAdmin() {
      if (this.last_page1 < this.offset1) return
      Tournament.include(['players', 'club'])
        .whereIn('status', ['3', '4', '5'])

        .where('mine', this.user.id)
        // .where('club', this.$store.state.club.id)
        .page(this.offset1)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.leagueMy = [...this.leagueMy, ...res.data]
          this.total1 = res.meta.total
          this.last_page1 = res.meta.last_page
        })
    },
    getLeagueAdminOnly() {
      Tournament.include('club')
        .whereIn('status', ['1', '2', '3', '4'])
        .where('admins', this.user.id)
        .orderBy('-active_to')
        .get()
        .then((res) => {
          this.tournamentAdminTotal = res.meta.total
          this.tournamentAdmin = res.data
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    status(s) {
      switch (s) {
        case '0': // Kreirana liga
          return this.$t('U izradi')
        case '1': // Ždrijeb
          return this.$t('Ždrijebanje')
        case '2': // Privatna liga - priprema prijave
          return this.$t('U izradi')
        case '3': // Otvorena liga - otvorene prijave
          return this.$t('Prijave')
        case '4':
          return this.$t('Aktivna')
        case '5':
          return this.$t('Završena')
      }
      return ''
    },
    tagColor(s) {
      switch (s) {
        case '0':
          return 'backgroundColor:#cccccc'
        case '1':
          return 'backgroundColor:#F18F01'
        case '2':
          return 'backgroundColor:#ff3860'
        case '3':
          return 'backgroundColor:#9acd32'
        case '4':
          return 'backgroundColor:#209CEE'
        case '5':
          return 'backgroundColor:#777777'
      }
      return ''
    },
    link(s, tr) {
      switch (s) {
        case '0':
          return tr === 'private' ? 'privat' : 'open'
        case '1':
          return 'liga_create'
        case '2':
          return 'open'
        case '3':
          return 'open-onboarding'
        case '4':
          return ''
        case '5':
          return ''
      }
      return ''
    },
    scoring() {
      this.loading = true
      const ts = TournamentScore.include(['tournament_scores', 'tournament_scores.tournament'])
      if (this.scoreTimeRange !== 'Sve') {
        ts.where('final_between', this.scoreTimeRange)
      }
      ts
        // .where('team', 10)
        // .where('tournament', 1000)
        .where('club', this.$store.state.club.id)
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .page(this.offset2)
        .get()
        .then((res) => {
          if (this.offset2 === 1) {
            this.score = []
            this.score = res
          } else {
            this.score = [...this.score, ...res]
          }
          this.loading = false
        })
    },
  },
  head() {
    return {
      title: 'Turniri',
    }
  },
}
</script>
<style scoped>
.rank-high {
  margin-left: -20px;
}
.table {
  background-color: transparent !important;
}
</style>
