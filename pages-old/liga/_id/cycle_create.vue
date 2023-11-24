<template>
  <div v-if="Object.keys(liga).length">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('noviCiklusLige') }}</div>
    </div>
    <hero :options="heroImage" class="liga__hero--options">
      <h1 class="has-text-white">{{ liga.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          @click="deleteLiga"
        >
          {{ $t('obriiLigu') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/liga/' + $route.params.id + '/edit')"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediLigu') }}
        </b-button>
      </div>
    </hero>
    <b-tabs v-model="activeTabPlayers" size="is-medium" class="hide-only-one" position="is-centered">
      <b-tab-item>
        <div class="members x-container">
          <template>
            <transition-group name="fade">
              <div v-if="filteredLeftovers.length" key="1" class="activity__header--center m-b-5 m-t-20">
                <div class="fw600 is-size-5">{{ $t('nerasporeeniIgrai', { length: filteredLeftovers.length }) }}</div>
              </div>
              <div v-else key="2" class="activity__header--center m-b-5 m-t-20">
                <div class="fw600 is-size-5">{{ $t('dodajNoveIgraeULigu') }}</div>
              </div>
            </transition-group>
            <div class="cup__players-list">
              <div v-for="(player, index) in filteredLeftovers" :key="index">
                <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
              </div>
              <!--          <div v-show="filteredLeftovers.length" @click="isModalActive = true">-->
              <!--            <b-icon icon="times-circle" size="is-larger" type="is-danger" class="m-l-30 m-t-10" pack="fal"></b-icon>-->
              <!--          </div>-->
            </div>
            <div v-if="true" class="buttons m-t-0 m-b-0">
              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                icon-right="user-edit"
                rounded
                @click="activeTabPlayers = 1"
              >
                {{ $t('urediIgrae2') }}
              </b-button>
            </div>
          </template>
          <transition v-if="!isPopulated">
            <div class="empty_red_empty activity__header--center m-b-5 m-t-20">
              <div class="fw600 is-size-6 has-text-centered">
                {{ $t('liguMoetePokrenutiNakonToSvaMjestaULigiBuduPopunje') }}
              </div>
            </div>
          </transition>
          <transition v-else name="fade">
            <div class="buttons m-t-30">
              <b-button
                class="fw600"
                size="is-medium"
                type="is-primary"
                pack="far"
                icon-right="check"
                rounded
                :loading="loading2"
                @click="save"
              >
                {{ $t('pokreniNoviCiklus') }}
              </b-button>
            </div>
          </transition>

          <div class="p-b-100">
            <div class="activity__header--center m-t-10">
              <div class="fw600 is-size-5 has-text-centered">{{ $t('automatskoRasporeivanje') }}</div>
            </div>
            <div class="fw600 is-size-7 has-text-centered m-b-5">
              {{ $t('moeteRasporeditiIgraePremaRezultatimaPrologCiklusa') }}
              <span class="has-text-lightblue">(Prema rezultatu)</span>
              {{ $t('iliPremaPoetnomRasporeduPrologCiklusa') }}
              <span class="has-text-lightblue">(Početni raspored)</span>
            </div>
            <div class="buttons">
              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                rounded
                :loading="loading8"
                @click="lastCycleGenerate"
              >
                {{ $t('premaRezultatu') }}
              </b-button>

              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                rounded
                :loading="loading9"
                @click="copy"
              >
                {{ $t('poetniRaspored') }}
              </b-button>
              <b-button
                class="softshadow m-t-10"
                type="is-small noborder"
                pack="fal"
                rounded
                :loading="loading10"
                @click="clear"
              >
                {{ $t('ukloniSve') }}
              </b-button>
            </div>
            <draggable
              v-model="liga.groups"
              handle=".drag__item"
              group="people"
              @start="isCollapsed = true"
              @end="reorder"
            >
              <transition-group name="slide">
                <div
                  v-for="(group, indexGroup) in liga.groups"
                  :key="indexGroup + 'a'"
                  class="liga__create__box"
                  :class="[isCollapsed ? 'collapsed' : '']"
                >
                  <div class="activity__header m-b-10 m-t-30">
                    <div class="fw600 is-size-3">{{ group.name }}</div>
                    <div class="m-l-auto m-b--10">
                      <span @click="openSettings(group, indexGroup)">
                        <b-button
                          v-if="showGroupSettings !== indexGroup"
                          class="m-l-auto m-r-10 m-t--2 tansition-on"
                          type="is-danger"
                          rounded
                          size="is-smaller"
                          >{{ $t('urediGrupu') }}</b-button
                        >
                        <!--                  <b-icon-->
                        <!--                    v-if="showGroupSettings !== indexGroup"-->
                        <!--                    icon="cog"-->
                        <!--                    style="transition: 0.2s all"-->
                        <!--                    type="is-black50"-->
                        <!--                    pack="fal"-->
                        <!--                    class="m-l-5 m-r-20 collapsed-item"-->
                        <!--                  >-->
                        <!--                  </b-icon-->
                        <!--                  >-->
                        <b-icon
                          v-else
                          style="transform: scale(1.4); transition: 0.2s all"
                          icon="times-circle"
                          type="is-danger"
                          pack="fal"
                          class="m-l-5 m-r-20 collapsed-item"
                        >
                        </b-icon
                      ></span>
                      <span v-if="showGroupSettings !== indexGroup" style="transition: 0.2s all"
                        ><b-icon
                          style="transition: 0.2s all"
                          class="m-r-10 m-l-5 drag__item"
                          pack="far"
                          type="is-black50"
                          icon="line-height"
                        >
                        </b-icon
                      ></span>
                      <span
                        v-else
                        style="transform: scale(1.4); transition: 0.2s all"
                        @click.stop="saveLigaGroup(liga.groups[showGroupSettings].id)"
                        ><b-icon
                          style="transform: scale(1.4); transition: 0.2s all"
                          class="m-r-10 m-l-5"
                          pack="fal"
                          type="is-lightblue"
                          icon="check-circle"
                          :loading="loading5"
                        >
                        </b-icon
                      ></span>
                    </div>
                  </div>
                  <div
                    v-if="showGroupSettings !== indexGroup"
                    class="activity__box action__buttons liga__group__list collapsed-item"
                  >
                    <div
                      v-for="(player, index) in group.players"
                      :key="index + 'b'"
                      class="action__item__small--liga"
                      :class="[
                        index < group.move_up ? 'move__up--true' : '',
                        index > group.players_in_group - (group.move_down + 1) ? 'move__down--true' : '',
                      ]"
                    >
                      <div v-if="Object.keys(player).length" class="align__centar__y">
                        <div class="rank fw600">{{ $t('key3', { expr: index + 1 }) }}</div>
                        <div class="list__img">
                          <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
                        </div>
                        <div class="list__content">
                          <h3>{{ player.display_name }}</h3>
                          <h4>{{ $t('bodova', { score: player.score }) }}</h4>
                        </div>
                        <div
                          class=""
                          @click.stop="
                            deletePlayerObject = player
                            selectedMainGroup = indexGroup
                            deletePlayer()
                          "
                        >
                          <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto remove"> </b-icon>
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="item in group.players_in_group - group.players.length"
                      :key="item"
                      class="action__item__small--liga"
                    >
                      <div class="align__centar__y">
                        <div class="activity__header p-t-5 p-b-5" @click="insertPlayer(indexGroup)">
                          <div class="rank fw600 m-r-15">{{ $t('key3', { expr: item + group.players.length }) }}</div>
                          <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                          <div class="list__content">
                            <h3 class="has-text-black50 fw600">{{ $t('dodajIgraa') }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="liga__group__settings">
                    <section>
                      <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                        {{ $t('brojIgraaUGrupi') }}
                      </div>
                      <div class="liga__new__settings__group">
                        <span @click="removePlayerFromGroup">
                          <b-icon size="is-large" icon="minus-circle" type="is-white" pack="fal" class="m-l-5">
                          </b-icon>
                        </span>
                        <div class="fw600 is-size-1 m-l-30 m-r-30 has-text-white">
                          {{ liga.groups[showGroupSettings].players_in_group }}
                        </div>
                        <span @click="addPlayerToGroup">
                          <b-icon size="is-large" icon="plus-circle" type="is-white" pack="fal" class="m-l-5"> </b-icon>
                        </span>
                      </div>
                      <div class="is-size-55 fw600 has-text-centered has-text-white m-b-10">
                        {{ $t('nazivGrupe2') }}
                      </div>
                      <b-field class="login__input__container m-b-30">
                        <b-input v-model="liga.groups[showGroupSettings].name" pack="fal" rounded> </b-input>
                      </b-field>
                      <b-field :label="$t('brojNapredovanja')">
                        <b-numberinput
                          v-model="liga.groups[showGroupSettings].move_up"
                          :placeholder="$t('nema')"
                          min="0"
                          :max="
                            liga.groups[showGroupSettings].players_in_group - liga.groups[showGroupSettings].move_down
                          "
                          type="is-white"
                          size="is-small"
                          controls-rounded
                          rounded
                        ></b-numberinput>
                      </b-field>
                      <b-field :label="$t('brojIspadanja')">
                        <b-numberinput
                          v-model="liga.groups[showGroupSettings].move_down"
                          :placeholder="$t('nema')"
                          min="0"
                          :max="
                            liga.groups[showGroupSettings].players_in_group - liga.groups[showGroupSettings].move_up
                          "
                          type="is-white"
                          size="is-small"
                          controls-rounded
                          rounded
                        ></b-numberinput>
                      </b-field>
                      <div v-if="true" class="buttons m-t-35 m-b-0">
                        <b-button
                          class="softshadow m-t-10"
                          type="is-small noborder"
                          pack="fal"
                          icon-right="times-circle"
                          rounded
                          @click="
                            showGroupSettings = null
                            getLeague()
                          "
                        >
                          {{ $t('otkai') }}
                        </b-button>
                        <b-button
                          class="softshadow m-t-10 invert-small-button"
                          type="is-small noborder is-primary has-text-white"
                          pack="fal"
                          icon-right="check-circle"
                          rounded
                          :loading="loading5"
                          @click="saveLigaGroup(group.id)"
                        >
                          {{ $t('spremi') }}
                        </b-button>
                      </div>
                    </section>
                  </div>
                  <div v-if="liga.groups.length >= 2" class="buttons">
                    <b-button
                      class="softshadow m-t-20"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="times-circle"
                      rounded
                      :loading="loading7"
                      @click="deleteLigaGroup(group)"
                    >
                      {{ $t('obriiGrupu') }}
                    </b-button>
                  </div>
                </div>
              </transition-group>
            </draggable>
            <div v-if="!isCollapsed" class="buttons">
              <b-button
                class="softshadow m-t-20 invert-small-button"
                type="is-small noborder is-primary has-text-white"
                pack="fal"
                icon-right="plus-circle"
                rounded
                :loading="loading6"
                @click="addNewGroup()"
              >
                {{ $t('dodajNovuGrupu') }}
              </b-button>
            </div>
          </div>

          <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
            <modalMembersCustom
              :players="filteredLeftovers"
              :title="$t('dodajteIgraa')"
              @update="updatePlayerList($event)"
            ></modalMembersCustom>
          </b-modal>
          <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
            <modalMembers
              :show-tennis-school="false"
              :title="$t('dodajteNoveIgraeULigu')"
              @player="addNewPlayer($event)"
            ></modalMembers>
          </b-modal>
          <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
            <modalSelect :title="$t('nositelji')" :subtitle="$t('Odaberite ukupni broj nositelja')"></modalSelect>
          </b-modal>
          <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
            <modalConfirmation
              :title="$t('potvrdomEteIzbrisatiSveNerasporeeneIgraeIzLige')"
              :subtitle="$t('Jeste li sigurni?')"
            ></modalConfirmation>
          </b-modal>
        </div>
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
            :loading="loading11"
            @click="isModalMembersAddToTournament = true"
          >
            {{ $t('dodajIgraa') }}
          </b-button>
        </div>

        <membersSearch :prepopulated="liga.players" @update="deletePlayerLiga($event.id)"></membersSearch>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersAddToTournament" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :is-doubles="liga.is_doubles ? true : false"
        :title="$t('dodajteIgraa')"
        @player="addNewPlayer($event)"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import draggable from 'vuedraggable'
import League from '@/models/League'
import Player from '@/models/Player'
import LeagueGroup from '@/models/LeagueGroup'
import hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembersCustom from '~/components/modal/ModalMembersCustom'
import modalSelect from '~/components/modal/ModalSelect'
import modalMembers from '~/components/modal/ModalMembersAll'
import membersSearch from '~/components/membersSearchWithEdit'

export default {
  name: 'LigaCreate',
  components: {
    modalMembersCustom,
    modalConfirmation,
    modalSelect,
    hero,
    modalMembers,
    membersSearch,
    draggable,
    TennisImage,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      playersIn: [],
      leftovers: [],
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loading8: false,
      loading9: false,
      loading10: false,
      loading11: false,
      showGroupSettings: null,
      isModalActive: false,
      activeTabPlayers: 0,
      isModalMembersActive: false,
      isModalAddPlayerActive: false,
      isModaSelectActive: false,
      isModalMembersAddToTournament: false,
      playerList: [],
      defaultPlayerList: [],
      selectedPlayer: [],
      selectedPlayerIndex: {},
      selectedMainGroup: null,
      selectedIndex: null,
      deletePlayerObject: {},
      liga: {},
      isCollapsed: false,
      ress: {},
      test: '',
      setingsSelectedGroup: {
        move_down: null,
        move_up: null,
        name: '',
        order: null,
        players: [],
        players_in_group: null,
      },
    }
  },
  computed: {
    filteredLeftovers() {
      return _.differenceWith(this.liga.players, this.playersIn, (all, out) => {
        return all.id === out.id
      })
    },
    isPopulated() {
      let totalSlotsAll = null
      for (let i = 0; i < this.liga.groups.length; i++) {
        totalSlotsAll = totalSlotsAll + this.liga.groups[i].players_in_group
      }
      if (totalSlotsAll === this.playersIn.length) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    isPopulateda() {
      let totalSlotsAll = null
      for (let i = 0; i < this.liga.groups.length; i++) {
        totalSlotsAll = totalSlotsAll + this.liga.groups[i].players_in_group
      }
      this.tes = totalSlotsAll
    },
    addNewGroup() {
      this.loading6 = true
      this.liga.number_of_groups = this.liga.number_of_groups + 1
      this.liga
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.loading6 = false
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
          this.loading6 = false
        })
    },
    assignPlayerToGroup() {
      if (this.filteredLeftovers.length !== 0) {
        this.isModalAddPlayerActive = true
      } else {
        this.$buefy.toast.open({
          message: this.$t('Dodajte igrače u ligu te ih zatim rasporedite po grupama'),
          type: 'is-danger',
          duration: 5000,
        })
      }
    },
    distributedPlayers() {
      this.playersIn = []
      for (let i = 0; i < this.liga.groups.length; i++) {
        this.playersIn = [...this.playersIn, ...this.liga.groups[i].players]
      }
    },
    submit() {
      this.loading = true
      const l = new LeagueGroup({ id: this.liga.groups[this.selectedMainGroup].id })
      l.players()
        .attach({ players: this.liga.groups[this.selectedMainGroup].players })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrača'),
            type: 'is-success',
            duration: 500,
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
    saveLigaGroup(item) {
      this.loading5 = true
      const group = this.liga.groups[this.showGroupSettings]
      const l = new LeagueGroup({
        id: item,
        name: group.name,
        players_in_group: group.players_in_group,
        move_up: group.move_up,
        move_down: group.move_down,
      })
      l.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili postavke liga grupe'),
            type: 'is-success',
          })
          this.loading5 = false
          this.ress = res
          this.getLeague()
          // deselect group settings
          this.showGroupSettings = null
          // this.$router.push(this.localePath('/liga/' + this.$route.params.id + '/liga_create'))
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
    resetLiga(item) {
      this.loading3 = true
      const lg = new LeagueGroup({ id: item.id })
      League.custom(lg, 'clear_players')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Igrači su maknuti'),
            type: 'is-success',
            queue: false,
          })
          this.getLeague()
          this.loading3 = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading3 = false
        })
    },
    deletePlayer() {
      const l = new LeagueGroup({ id: this.liga.groups[this.selectedMainGroup].id })
      const p = new Player({ id: this.deletePlayerObject.id }).for(l)
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
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    removePlayerFromGroup() {
      if (
        this.liga.groups[this.showGroupSettings].players.length <
        this.liga.groups[this.showGroupSettings].players_in_group
      ) {
        this.liga.groups[this.showGroupSettings].players_in_group--
      } else {
        this.$buefy.toast.open({
          message: this.$t('Uklonite postojeće igrače iz grupe ako želite smanjiti broj pozicija u grupi'),
          type: 'is-danger',
        })
      }
    },
    addPlayerToGroup() {
      this.liga.groups[this.showGroupSettings].players_in_group++
    },
    openSettings(group, indexGroup) {
      if (this.showGroupSettings !== indexGroup) {
        this.showGroupSettings = indexGroup
        this.setingsSelectedGroup = _.clone(this.liga.groups[indexGroup])
      } else {
        this.showGroupSettings = null
        this.setingsSelectedGroup = {}
        this.getLeague()
      }
    },
    insertPlayer(indexGroup, index) {
      if (this.filteredLeftovers.length !== 0) {
        this.isModalMembersActive = true
        this.selectedMainGroup = indexGroup
        this.selectedIndex = index
      } else {
        this.$buefy.toast.open({
          message: this.$t('Nema više neraspoređenih igrača. Dodajte igrače u ligu te ih zatim rasporedite po grupama'),
          type: 'is-danger',
          duration: 5000,
        })
      }
    },
    getLeague() {
      League.include(['players', 'admins', 'groups'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.distributedPlayers()
        })
    },
    addNewPlayer(item) {
      this.loading11 = true
      const l = new League({ id: this.liga.id })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u ligu'),
            type: 'is-success',
            duration: 500,
          })
          this.loading11 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading11 = false
        })
    },
    deletePlayerLiga(item) {
      this.loading = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: item }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili igrače iz lige'),
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
    deleteLiga() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je obrisana'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/liga'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deleteLigaGroup(group) {
      if (group.players.length !== 0) {
        this.$buefy.toast.open({
          message: this.$t('Uklonite sve igrače iz grupe prije brisanja'),
          type: 'is-danger',
        })
      } else {
        this.loading7 = true
        this.test = group.id
        const l = new LeagueGroup({ id: group.id })
        l.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Grupa je obrisana'),
              type: 'is-success',
            })
            this.loading7 = false
            this.getLeague()
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loading7 = false
          })
      }
    },
    updatePlayerList(player) {
      this.selectedPlayer = player
      this.$set(player, 'order', this.selectedIndex)
      this.liga.players.splice(this.liga.players.indexOf(player), 1)
      this.liga.groups[this.selectedMainGroup].players.splice(this.selectedIndex, 1, player)
      this.submit()
    },
    randomOrder() {
      this.defaultPlayerList = _.shuffle(this.players)
      this.playerList = []
    },
    save() {
      this.loading2 = true
      const l = new League({ id: this.liga.id, status: '4' })
      this.$buefy.toast.open({
        message: this.$t('Aktiviranje lige može potrajati nešto više vremena. Pričekajte...'),
        type: 'is-primary',
        duration: 5000,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je aktivirana'),
            type: 'is-success',
          })
          this.loading2 = false
          this.$router.push(this.localePath('/liga/' + this.$route.params.id))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading2 = false
        })
    },
    reorder() {
      this.isCollapsed = false
      const order = _.map(this.liga.groups, (court) => {
        return court.id
      })
      this.$axios.post(`v2/league/${this.liga.id}/order`, { order }).then(() => {
        this.$buefy.toast
          .open({
            message: this.$t('Redoslijed je spremljen'),
            type: 'is-success',
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      })
    },
    random() {
      this.loading4 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'random')
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
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'strength')
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
    lastCycleGenerate() {
      this.softClear()
      this.loading8 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'inherit')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače prema rezultatima prošlog ciklusa'),
            type: 'is-success',
          })
          this.loading8 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading8 = false
        })
    },
    copy() {
      this.softClear()
      this.loading9 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'copy')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače prema rezultatima prošlog ciklusa'),
            type: 'is-success',
          })
          this.loading9 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading9 = false
        })
    },
    softClear() {
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'clear')
        .get()
        .then(() => {
          this.getLeague()
        })
    },
    clear() {
      this.loading10 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'clear')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače prema rezultatima prošlog ciklusa'),
            type: 'is-success',
          })
          this.loading10 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading10 = false
        })
    },
  },
}
</script>
