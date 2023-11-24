<template>
  <div v-if="Object.keys(liga).length">
    <!--    Prikaži ako si admin ili liga admin-->
    <div v-if="isLigaAdmin.length || isAdmin" class="liga__active__header">
      <div v-if="!hasDatePassed" class="member__info liga__header is-primary">
        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
          {{ $t('ligaSeIgraJo', { howManyDays: howManyDays }) }}
        </div>
      </div>
      <div v-else class="member__info liga__header is-red">
        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
          {{ $t('ligaJeZavrena') }}<span v-if="liga.finish_date">: {{ liga.finish_date | moment('DD.MM.YYYY') }}</span>
        </div>
      </div>
      <hero
        :options="heroImage"
        :second="{
          name: $t('Lige'),
          link: '/liga',
        }"
        class="liga__hero--options"
      >
        <h1 class="has-text-white">{{ liga.name }}</h1>
        <div class="buttons m-t-10">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-edit"
            rounded
            @click="editLink()"
          >
            {{ $t('urediLigu') }}
          </b-button>
        </div>
      </hero>
    </div>
    <div v-else class="liga__active__header">
      <div class="member__info liga__header is-primary">
        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
          {{ $t('ligaSeIgraJo', { howManyDays: howManyDays }) }}
        </div>
      </div>
      <hero
        :options="heroImage"
        :second="{
          name: $t('Lige'),
          link: '/liga',
        }"
        class="liga__hero"
      >
        <h1 class="has-text-white">{{ liga.name }}</h1>
      </hero>
    </div>

    <b-tabs v-model="activeTabResult" size="is-medium" class="hide-only-one" position="is-centered">
      <b-tab-item>
        <div v-if="liga.parent !== null || liga.child" class="buttons m-t-30">
          <b-button
            v-if="liga.parent !== null"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click="goBackCycle()"
          >
            {{ $t('prethodniCiklus') }}
          </b-button>
          <b-button
            v-if="liga.child"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="tennis-ball"
            rounded
            @click="getLeague()"
          >
            {{ $t('trenutniCiklus') }}
          </b-button>
        </div>
        <div v-if="isLigaAdmin.length || isAdmin" class="x-container m-b-30 m-t-20">
          <div class="buttons admin_box m-t-0">
            <b-button
              v-if="liga.status !== '5'"
              class="fw600 m-t-10"
              type="is-danger"
              pack="fal"
              icon-right="lock-alt"
              rounded
              :loading="loading"
              @click="finishLiga()"
            >
              {{ $t('zakljuiLigu') }}
            </b-button>
            <b-button
              v-else
              class="fw600 m-t-10"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              tag="nuxt-link"
              :to="localePath(`/liga/elo/${$route.params.id}/finish`)"
            >
              {{ $t('nastaviSNatjecanjem') }}
            </b-button>
            <b-button
              class="fw600 m-t-20 softshadow"
              type="is-small noborder"
              pack="fal"
              icon-right="user-edit"
              rounded
              @click="activeTabResult = 1"
            >
              {{ $t('urediIgrae2') }}
            </b-button>
          </div>
        </div>
        <div v-if="userInGroupSingleAndDouble && liga.status !== '5'" class="buttons m-t-30">
          <div class="button__big" @click="isResultModalActive = true">{{ $t('unesiRezultat') }}</div>
        </div>
        <b-tabs v-model="activeTab" size="is-medium" position="is-centered">
          <b-tab-item :label="$t('liga')">
            <div class="members x-container">
              <div class="p-b-100">
                <div
                  v-for="(group, indexGroup) in liga.groups"
                  :key="indexGroup"
                  ref="groupItem"
                  class="m-t--10 liga__create__box"
                >
                  <div class="activity__header m-b-10 m-t-30">
                    <div
                      v-if="showGroupinfo !== indexGroup"
                      class="fw600 is-size-3"
                      @click="openInfo(group, indexGroup)"
                    >
                      {{ $t('liga') }}
                    </div>
                    <div v-else class="fw600 is-size-3" @click="openInfo(group, indexGroup)">
                      <span
                        ><b-icon
                          style="transform: scale(1.4); transition: 0.2s all"
                          icon="times-circle"
                          type="is-danger"
                          pack="fal"
                          class="m-l-5 m-r-5 collapsed-item"
                        >
                        </b-icon
                      ></span>
                      {{ $t('zatvori') }}
                    </div>

                    <div v-if="showGroupinfo !== indexGroup" class="m-l-auto" @click="openSettings(group, indexGroup)">
                      <b-button
                        v-if="showGroupSettings !== indexGroup"
                        class="m-l-auto"
                        type="is-primary"
                        rounded
                        size="is-smaller"
                        >{{ $t('prikaiRezultate') }}</b-button
                      >
                      <b-button v-else class="m-l-auto" type="is-danger" rounded size="is-smaller">{{
                        $t('ljestvica')
                      }}</b-button>
                    </div>
                  </div>
                  <template v-if="showGroupinfo === indexGroup">
                    <div class="liga__group__settings liga__bckg__red">
                      <section>
                        <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                          {{ $t('odigraniMeevi') }}
                        </div>
                        <div class="liga__new__settings__group">
                          <div class="fw600 is-size-1 m-l-30 m-r-30 has-text-white">
                            {{
                              liga.groups[indexGroup].games.length - totalUnplayedMatchesInGroup(indexGroup).length
                            }}/{{ liga.groups[indexGroup].games.length }}
                          </div>
                        </div>
                        <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                          {{
                            Math.round(
                              ((liga.groups[indexGroup].games.length - totalUnplayedMatchesInGroup(indexGroup).length) /
                                liga.groups[indexGroup].games.length) *
                                100
                            )
                          }}%
                        </div>
                      </section>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-if="showGroupSettings !== indexGroup"
                      class="activity__box action__buttons liga__group__list"
                    >
                      <div class="liga__legend__status w100">
                        <div class="liga__legend__status_box m-l-auto">
                          <div cass="liga__matches">{{ $t('meevi') }}</div>
                          <div class="liga__gems">{{ $t('gemRazlika') }}</div>
                          <div class="liga__sets">{{ $t('setRazlika') }}</div>
                          <div class="liga__points">{{ $t('bodovi') }}</div>
                        </div>
                      </div>
                      <div
                        v-for="(player, index) in group.players"
                        :key="index"
                        class="action__item__small--liga p-r-10"
                      >
                        <nuxt-link
                          v-if="liga.groups[indexGroup].stats[player.id] !== undefined"
                          :to="localePath('/liga/' + $route.params.id + '/' + player.id)"
                          class="align__centar__y"
                        >
                          <div class="rank fw600">{{ $t('key3', { expr: index + 1 }) }}</div>
                          <div class="list__img">
                            <template v-if="liga.is_doubles" class="for-doubles">
                              <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="flex">
                                <TennisImage
                                  :size="[42, 42]"
                                  :src="player.players[0].image"
                                  class="user_image border__white--2"
                                  alt=""
                                />
                                <TennisImage
                                  :size="[42, 42]"
                                  :src="player.players[1].image"
                                  class="user_image m-l--20 border__white--2"
                                  alt=""
                                />
                              </div>
                              <div v-else class="list__img">
                                <TennisImage
                                  :size="[42, 42]"
                                  :src="player.image"
                                  class="user_image border__white--2"
                                  alt=""
                                />
                              </div>
                            </template>

                            <TennisImage v-else :size="[42, 42]" :src="player.image" class="user_image-small" alt="" />
                          </div>
                          <div class="list__content">
                            <h3 class="fw600 has-text-black80 is-size-6">{{ player.display_name }}</h3>
                          </div>
                          <div class="liga__legend">
                            <div v-if="group.stats[player.id]" lass="liga__matches">
                              {{ group.stats[player.id].matches.total }}
                            </div>
                            <div
                              class="liga__gems"
                              :class="[
                                setGems(player.id, indexGroup) === 0
                                  ? 'has-text-black80'
                                  : setGems(player.id, indexGroup) > 0
                                  ? 'has-text-success'
                                  : 'has-text-danger',
                              ]"
                            >
                              {{ setGems(player.id, indexGroup) > 0 ? '+' : '' }}{{ setGems(player.id, indexGroup) }}
                            </div>

                            <div
                              class="liga__sets"
                              :class="[
                                setStats(player.id, indexGroup) === 0
                                  ? 'has-text-black80'
                                  : setStats(player.id, indexGroup) > 0
                                  ? 'has-text-success'
                                  : 'has-text-danger',
                              ]"
                            >
                              {{ setStats(player.id, indexGroup) > 0 ? '+' : '' }}{{ setStats(player.id, indexGroup) }}
                            </div>
                            <div class="liga__points">
                              {{ player.pivot.score !== null ? Math.round(player.pivot.score) : 0 }}
                            </div>
                          </div>
                        </nuxt-link>
                        <div
                          v-else-if="liga.groups[indexGroup].stats[player.id] === undefined"
                          class="activity__header p-t-5 p-b-5"
                        >
                          <div class="rank fw600 m-r-15">{{ $t('key3', { expr: index + 1 }) }}</div>
                          <b-icon icon="clock" type="is-primary" pack="fal" class="m-r-10"> </b-icon>
                          <div class="list__content">
                            <h3 class="has-text-black50 fw600">{{ $t('igraEUbrzoBitiDodan') }}</h3>
                          </div>
                        </div>
                        <div v-else class="activity__header p-t-5 p-b-5" @click="insertPlayer(indexGroup, index)">
                          <div class="rank fw600 m-r-15">{{ $t('key3', { expr: index + 1 }) }}</div>
                          <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                          <div class="list__content">
                            <h3 class="has-text-black50 fw600">{{ $t('dodajIgraa') }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="liga__group__settings">
                      <!--                  Ljestvica-->
                      <div v-for="game in group.games.slice().reverse()" :key="game.id" class="m-b-10">
                        <ligaLotPlayed :game="game" :is-doubles="liga.is_doubles" :show-date="true"></ligaLotPlayed>
                      </div>
                    </div>
                  </template>
                  <template v-if="userInGroup === indexGroup">
                    <div v-if="messages.length" class="is-size-5 fw600 has-text-centered m-t-20 m-b-5">
                      {{ $t('grupnePoruke') }}
                    </div>
                    <div v-if="messages.length" class="schoolgroup__messages">
                      <template>
                        <div v-chat-scroll="{ always: false, smooth: true, window: true }" class="comments p-b-10">
                          <div
                            v-for="comment in messages"
                            :key="comment.id"
                            :class="{
                              'comments-item': true,
                              my_comments: $auth.user.id === comment.player.id && comment.multimedia_type !== 'terms',
                              terms: comment.multimedia_type === 'terms',
                            }"
                          >
                            <text-message v-if="!comment.multimedia_type" :comment="comment" />
                            <term-message
                              v-if="comment.multimedia_type === 'terms'"
                              :players="thread.players"
                              :comment="comment"
                            />
                            <image-message v-if="comment.multimedia_type === 'image'" :comment="comment" />
                          </div>
                        </div>
                      </template>
                    </div>
                    <div v-if="messages.length" class="buttons m-t-20">
                      <b-button
                        tag="nuxt-link"
                        :to="localePath('/messages/' + liga.thread.id)"
                        class="m-l-10 softshadow"
                        pack="fal"
                        type="is-small noborder"
                        icon-right="comments"
                        rounded
                      >
                        {{ $t('prikaiOstalePoruke') }}
                      </b-button>
                    </div>
                    <template v-else>
                      <div class="buttons m-t-20">
                        <b-button
                          class="softshadow m-b-20"
                          type="is-small noborder"
                          pack="fal"
                          icon-right="comments"
                          rounded
                          @click="submitMessage(indexGroup)"
                        >
                          {{ $t('poaljiGrupnuPoruku') }}
                        </b-button>
                      </div>
                    </template>
                  </template>
                </div>
                <div class="buttons">
                  <b-button
                    class="fw600 m-t-20 softshadow"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="plus"
                    rounded
                    @click="isModalAddPlayerActive = true"
                  >
                    {{ $t('dodajNovogIgraa') }}
                  </b-button>
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item
            v-if="userInGroup !== false || isLigaAdmin.length > 0 || isAdmin"
            :label="$t('poruke')"
            class="p-b-100 x-container"
          >
            <template v-if="messagesLiga.length">
              <div class="is-size-5 fw600 m-t-20 m-b-5">{{ $t('poruke') }}</div>
              <div class="schoolgroup__messages">
                <template>
                  <div v-chat-scroll="{ always: false, smooth: true, window: true }" class="comments p-b-10">
                    <div
                      v-for="comment in messagesLiga"
                      :key="comment.id"
                      :class="{
                        'comments-item': true,
                        my_comments: $auth.user.id === comment.player.id && comment.multimedia_type !== 'terms',
                        terms: comment.multimedia_type === 'terms',
                      }"
                    >
                      <text-message v-if="!comment.multimedia_type" :comment="comment" />
                      <term-message
                        v-if="comment.multimedia_type === 'terms'"
                        :players="thread.players"
                        :comment="comment"
                      />
                      <image-message v-if="comment.multimedia_type === 'image'" :comment="comment" />
                    </div>
                  </div>
                </template>
              </div>
              <div class="buttons m-t-20">
                <b-button
                  tag="nuxt-link"
                  :to="localePath('/messages/' + liga.thread.id)"
                  class="m-l-10 softshadow"
                  pack="fal"
                  type="is-small noborder"
                  icon-right="comments"
                  rounded
                >
                  {{ $t('prikaiOstalePoruke') }}
                </b-button>
              </div>
            </template>
            <template v-else>
              <div class="buttons m-t-20">
                <b-button
                  class="softshadow m-b-20"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="comments"
                  rounded
                  :loading="loadingMessage"
                  @click="submitMessageLiga()"
                >
                  {{ $t('poaljiGrupnuPoruku') }}
                </b-button>
              </div>
            </template>
          </b-tab-item>
          <b-tab-item :label="$t('info')" class="p-b-100 x-container">
            <div class="activity__header m-b-10 m-t-10">
              <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
            </div>
            <div class="display-data__box m-t-10">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivLige') }}</div>
              <div class="fw600 is-size-5">{{ liga.name }}</div>
            </div>
            <div v-if="liga.type !== 'private'" class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rokZaPrijavu') }}</div>
              <div class="fw600 is-size-5">
                {{ $moment(liga.finish_onboarding).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
              </div>
            </div>
            <div class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaLige') }}</div>
              <div class="fw600 is-size-5">
                {{ $moment(liga.finish_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
              </div>
            </div>
            <div class="m-t-10 m-b-15 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('trenutniBrojNatjecatelja') }}
              </div>
              <div v-if="liga.players !== undefined" class="fw600 is-size-5">
                {{ liga.groups[0].players.length ? liga.groups[0].players.length : 'Nema prijavljenih' }}
              </div>
            </div>
            <adminEdit class="m-t--20 m-b-10" :options="liga"></adminEdit>

            <div v-if="liga.description" class="m-t-15 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
              <!-- eslint-disable-next-line -->
              <div class="has-text-left is-size-6 content-tiny m-t-10" v-html="liga.description"></div>
            </div>
            <template v-if="liga.documents.length">
              <div class="m-b-10 m-t-20">
                <div class="fw600 is-size-3">{{ $t('dokumenti') }}</div>
                <div
                  v-for="(item, index) in liga.documents"
                  :key="index"
                  class="list__documents list__image-col softshadow m-b-10"
                >
                  <a :href="item.path" class="align__centar__y w100 document-list">
                    <div class="m-r-10 m-t-10">
                      <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
                    </div>
                    <div class="list__content m-r-auto doc-icons">
                      <h3 class="fw600 m-b-5">{{ item.title }}</h3>
                    </div>
                    <div class="m-l-auto m-t-10">
                      <b-icon icon="cloud-download" size="is-medium" type="is-primary" pack="fal"></b-icon>
                    </div>
                  </a>
                </div>
              </div>
            </template>
          </b-tab-item>
        </b-tabs>
      </b-tab-item>
      <b-tab-item>
        <div class="activity__header--center m-b-5 m-t-15">
          <div class="fw600 is-size-5">{{ $t('urediIgraeLige') }}</div>
        </div>
        <div v-if="true" class="buttons m-t-20 m-b-0">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-left="arrow-left"
            rounded
            @click="activeTabResult = 0"
          >
            {{ $t('nazad') }}
          </b-button>
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-plus"
            rounded
            :loading="loading || loading1"
            @click="isModalAddPlayerActive = true"
          >
            {{ $t('dodajIgraa') }}
          </b-button>
        </div>

        <membersSearch
          :prepopulated="liga.players"
          :is-doubles="liga.is_doubles"
          @update="deletePlayer($event)"
        ></membersSearch>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :is-doubles="!!liga.is_doubles"
        :is-player="false"
        :title="$t('dodajteNoveIgraeULigu')"
        @player="addPlayer($event)"
      ></modalMembers>
    </b-modal>

    <b-modal :active.sync="isResultModalActive" :width="640" scroll="clip">
      <modalResult
        :title="$t('upiiRezultatLige')"
        :is-doubles="!!liga.is_doubles"
        :elo="1"
        :options="{
          customlistplayer: true,
          league_id: liga.id,
          bothPlayers: adminResultPlayers,
          prepopulated: true,
          focus: false,
        }"
        :partner="liga.is_doubles ? isTeamDoubles : [user.team]"
        :customlistplayer="liga.players"
      ></modalResult>
    </b-modal>

    <b-modal :active.sync="isResultPrepopulatedModalActive" :width="640" scroll="clip">
      <modalResult
        :title="$t('upiiRezultatLige')"
        :is-doubles="!!liga.is_doubles"
        :partner="selectedPartner"
        :options="{ prepopulated: true, game_id: gameid, bothPlayers: adminResultPlayers, elo: true }"
      ></modalResult>
    </b-modal>

    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="selectedResult"
        :title="$t('opcijeMea')"
        :subtitle="$t('Ako je došlo po problema u dogovoru za meč, imate sljedeće opcije:')"
        @update="getLeague()"
        @result="adminResultInput($event)"
      ></modalOptions>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Player from '@/models/Player'
import TextMessage from '@/components/messages/textMessage'
import TermMessage from '@/components/messages/termsMessage'
import ImageMessage from '@/components/messages/imageMessage'
import Thread from '@/models/Thread'
import League from '@/models/League'
import hero from '~/components/Hero'
import adminEdit from '~/components/liga/adminEdit'
import modalResult from '~/components/modal/ModalResult'
import modalMembers from '~/components/modal/ModalMembersAll'
import ligaLotPlayed from '~/components/liga/LigaLotPlayed'
import modalOptions from '~/components/liga/ModalMatchAdminOptions'
import membersSearch from '~/components/membersSearchWithEdit'

export default {
  name: 'LigaEloActive',
  components: {
    modalMembers,
    modalResult,
    ligaLotPlayed,
    modalOptions,
    membersSearch,
    adminEdit,
    hero,
    ImageMessage,
    TermMessage,
    TextMessage,
    TennisImage,
  },
  async fetch() {
    if (process.client) {
      this.$nextTick(() => {
        this.$root.$loading.start()
      })
    }
    await this.getLeague()
  },
  data() {
    return {
      activeTabResult: 0,
      activeTab: 0,
      isMatchOptionsModal: false,
      heroImage: '/liga.jpg',
      showGroupinfo: null,
      showGroupSettings: null,
      isResultModalActive: false,
      isResultPrepopulatedModalActive: false,
      partner: [],
      adminResultPlayers: [],
      gameid: null,
      isModalMembersActive: false,
      isModalAddPlayerActive: false,
      isModaSelectActive: false,
      selectedResult: {},
      playerList: [],
      playersNotPlayedList: [],
      selectedPlayer: [],
      selectedPlayerforMatchList: {},
      selectedPlayerIndex: {},
      selectedMainGroup: null,
      selectedIndex: null,
      draggingRow: null,
      draggingRowIndex: null,
      droppedOnRowIndex: null,
      messages: [],
      thread: [],
      messagesLiga: [],
      threadLiga: [],
      liga: {},
      test: '',
      loading: false,
      loading1: false,
      loadingMessage: false,
      newPlayer: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.user.id
      })
    },
    isTeamDoubles() {
      if (this.liga.is_doubles) {
        const result = _.intersectionWith(this.liga.players, this.user.teams, (a, b) => a.id === b.id)
        return result
      }
      return 'Not doubles'
    },
    userInGroup() {
      for (let i = 0; i < this.liga.number_of_groups; i++) {
        const y = _.filter(this.liga.groups[i].players, (item) => {
          return item.id === this.user.id
        })
        if (y.length > 0) {
          return i
        }
      }
      return false
    },
    userInGroupElo() {
      const y = _.filter(this.liga.players, (item) => {
        return item.id === this.user.team.id
      })
      return y.length > 0
    },
    userInGroupDoubles() {
      for (let i = 0; i < this.liga.number_of_groups; i++) {
        for (let p = 0; p < this.liga.groups[i].players.length; p++) {
          const y = _.filter(this.liga.groups[i].players[p].players, (item) => {
            return item.id === this.user.id
          })
          if (y.length > 0) {
            return i
          }
        }
      }
      return false
    },
    userInGroupSingleAndDouble() {
      if (this.userInGroupElo !== false) {
        return true
      }
      if (this.userInGroupDoubles !== false) {
        return true
      }
      return false
    },
    hasDatePassed() {
      const a = this.$moment.utc(this.liga.finish_date)
      const b = this.$moment()
      if (a.diff(b, 'hours') >= 0) {
        return false
      } else {
        return true
      }
    },
    howManyDays() {
      return this.$moment(this.liga.finish_date).endOf('day').fromNow('String')
    },
    isInLiga() {
      return _.filter(this.liga.players, (item) => {
        return item.id === this.user.id
      })
    },
    selectedPartner() {
      return _.filter(this.partner, (item) => {
        return item.id !== this.$store.state.auth.user.id
      })
    },
    userMatchList() {
      return _.filter(this.liga.groups[this.userInGroup].games, (item) => {
        return item.players[0].id === this.user.id || item.players[1].id === this.user.id
      })
    },
    notPlayedList() {
      if (this.userInGroup === null) {
        return
      }
      return _.filter(this.liga.groups[this.userInGroup].games, (item) => {
        return item.result === null && (item.players[0].id === this.user.id || item.players[1].id === this.user.id)
      })
    },
  },
  methods: {
    adminResultInput(item) {
      this.adminResultPlayers = item
      this.isResultPrepopulatedModalActive = true
    },
    goBackCycle() {
      League.include(['players', 'admins', 'groups', 'parent', 'child', 'groups.games', 'documents'])
        .find(this.liga.parent.id)
        .then((res) => {
          this.liga = res
          this.getMessagesLiga()
        })
    },
    goForwardCycle() {
      League.include(['players', 'admins', 'groups', 'parent', 'child', 'groups.games', 'documents'])
        .find(this.liga.child.id)
        .then((res) => {
          this.liga = res
          this.getMessagesLiga()
        })
    },
    setStats(player, indexGroup) {
      const path = this.liga.groups[indexGroup].stats[player].sets
      return path.wins - path.losses
    },
    setGems(player, indexGroup) {
      const path = this.liga.groups[indexGroup].stats[player].points
      return path.wins - path.losses
    },
    totalUnplayedMatchesInGroup(groupIndex) {
      const tbd = _.filter(this.liga.groups[groupIndex].games, (item) => {
        return item.played_at === null
      })
      return tbd
    },
    editLink() {
      this.$router.push(this.localePath('/liga/elo/' + this.$route.params.id + '/edit'))
    },
    finishLiga() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 5,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je zaključena'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/elo/' + this.$route.params.id + '/finish'))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
    submitMessageLiga() {
      this.loadingMessage = true
      const t = new Thread({
        id: this.liga.thread.id,
        message: this.$t('Teniska liga') + ' ' + this.liga.name,
        title: this.liga.name,
      })
      t.save()
        .then((res) => {
          this.$router.push(this.localePath(`/messages/${res.id}`))
          this.loadingMessage = false
        })
        .catch(() => {
          this.loadingMessage = false
        })
    },
    openMatchAdmin(item) {
      this.selectedResult = item
      this.isMatchOptionsModal = true
    },
    openSettings(group, indexGroup) {
      if (this.showGroupSettings !== indexGroup) {
        this.showGroupSettings = indexGroup
      } else {
        this.showGroupSettings = null
      }
    },
    openInfo(group, indexGroup) {
      if (this.showGroupinfo !== indexGroup) {
        this.showGroupinfo = indexGroup
      } else {
        this.showGroupinfo = null
      }
    },
    getLeague() {
      if (process.client) {
        this.$nextTick(() => {
          this.$root.$loading.start()
        })
      }
      League.include(['players', 'admins', 'groups', 'parent', 'child', 'groups.games', 'documents', 'thread'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.getMessagesLiga()
          this.$root.$loading.finish()
        })
        .catch(() => {
          this.$root.$loading.finish()
        })
    },
    getMessagesLiga() {
      this.thread = new Thread({ id: this.liga.thread.id })
      this.thread
        .messages()
        .limit(3)
        .get()
        .then((res) => {
          this.messagesLiga = res.data.reverse()
        })
    },
    updatePlayerList(player) {
      this.$root.$loading.start()
      const l = new League({ id: this.liga.id, players: player })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Dodan je novi igrač u ligu'),
            type: 'is-success',
          })
          this.$root.$loading.finish()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.$root.$loading.finish()
        })
    },
    deletePlayer(item) {
      this.loading1 = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: item.id }).for(l)
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
          this.getLeague()
          this.loading1 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
    addPlayer(item) {
      this.loading = true
      const l = new League({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili novog igrača u ligu'),
            type: 'is-success',
          })
          this.loading = false
          this.getLeague()
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
  },
}
</script>
<style scoped>
.liga__group__settings {
  padding: 0;
  background-color: transparent;
}
.schoolgroup__messages {
  background-color: #ffffff50;
}
</style>
