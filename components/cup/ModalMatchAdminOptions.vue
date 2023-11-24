<template>
  <div>
    <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div class="modal-title has-text-light">{{ title }}</div>
        <div class="modal-subtitle has-text-light m-b-20">{{ subtitle }}</div>
        <div class="members for-list">
          <div v-if="options.players.length === 2" class="filter-list">
            <div
              v-for="(item, index) in matchOptions"
              :key="index"
              :class="[
                'select-item',
                'flex__column',
                'p-t-5 p-b-10',
                { active: index === select, 'm-t-30': index === 4 },
              ]"
              :style="
                (index === 3 ? 'marginTop: 30px' : '',
                options.reservation === null && index === 4 ? 'display: none' : '')
              "
              @click="select = index"
            >
              <div class="">{{ item.name }}</div>
              <!--              <div class="liga__subtitle is-size-7 has-text-black50 m-t&#45;&#45;2">{{ item.subtitle }}</div>-->
            </div>
          </div>
        </div>
        <div v-if="options.players.length === 1" class="filter-list">
          <div :class="['select-item', 'flex__column', { active: 0 === select }]" @click="select = 0">
            <div>{{ $t('regularanMe') }}</div>
          </div>
          <div :class="['select-item', 'flex__column', { active: 2 === select }]" @click="select = 2">
            <div>{{ $t('Ide dalje') + ' ' + options.players[0].display_name }}</div>
          </div>
        </div>
        <!--    Court reservation cancel-->
        <div class="filter-list">
          <div
            v-if="options.reservation !== null"
            :class="['select-item', 'flex__column', { active: 10 === select }]"
            @click="select = 10"
          >
            <div class="align__centar__all">
              <b-icon icon="times" class="m-r-10 m-t--5" type="is-danger" size="is-smaller" pack="fal"></b-icon>
              <div class="m-t--5">{{ $t('otkaiRezervaciju') }}</div>
            </div>
          </div>
        </div>
        <!--    Players edit-->
        <div v-if="true" class="my-rank m-t-20">
          <h5 class="has-text-white">{{ $t('urediIgrae2') }}</h5>
          <div class="list__image-col softshadow">
            <div v-if="options.players.length > 0" class="align__centar__y">
              <div class="flex flex-shrink-0 m-r-10">
                <template v-if="isDoubles && true" class="for-doubles">
                  <div
                    v-if="options.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                    class="flex min-w-45"
                  >
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[0].players[0].image"
                      class="user_image-small border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[0].players[1].image"
                      class="user_image-small m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="flex min-w-45">
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[0].image"
                      class="user_image-small border__white--2 mr-3"
                      alt=""
                    />
                  </div>
                </template>

                <TennisImage v-else :size="[42, 42]" :src="options.players[0].image" class="user_image" alt="" />
              </div>
              <div class="list__content m-r-auto">
                <div class="has-text-black80 fw600">{{ options.players[0].display_name }}</div>
              </div>
              <div v-if="isAdmin || isLigaAdmin" class="buttons m-l-auto">
                <b-button
                  class="m-l-auto"
                  type="is-danger"
                  pack="fal"
                  rounded
                  size="is-smaller-75"
                  @click="deletePlayersInTournament(options.players[0].id)"
                  >{{ $t('ukloni') }}</b-button
                >
              </div>
            </div>
            <div v-else class="buttons">
              <div class="fw600 has-text-black50 p-b-10" @click="activeTab = 1">{{ $t('dodajIgraa') }}</div>
            </div>
          </div>
          <div v-if="options.players.length >= 1" class="list__image-col softshadow m-t-10">
            <div v-if="options.players.length > 1" class="align__centar__y">
              <div class="flex flex-shrink-0 m-r-10">
                <template v-if="isDoubles && true" class="for-doubles">
                  <div
                    v-if="options.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                    class="flex min-w-45"
                  >
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[1].players[0].image"
                      class="user_image-small border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[1].players[1].image"
                      class="user_image-small m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="flex min-w-45">
                    <TennisImage
                      :size="[42, 42]"
                      :src="options.players[1].image"
                      class="user_image-small border__white--2 mr-3"
                      alt=""
                    />
                  </div>
                </template>

                <TennisImage v-else :size="[42, 42]" :src="options.players[1].image" class="user_image" alt="" />
              </div>
              <div class="list__content m-r-auto">
                <div class="has-text-black80 fw600">{{ options.players[1].display_name }}</div>
              </div>
              <div v-if="isAdmin || isLigaAdmin" class="buttons m-l-auto">
                <b-button
                  class="m-l-auto"
                  type="is-danger"
                  pack="fal"
                  rounded
                  size="is-smaller"
                  @click="deletePlayersInTournament(options.players[1].id)"
                  >{{ $t('ukloni') }}</b-button
                >
              </div>
            </div>
            <div v-else class="buttons">
              <div class="fw600 has-text-black50 p-b-10" @click="activeTab = 1">{{ $t('dodajIgraa') }}</div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div v-if="true" class="members for-list p-b-75">
          <div class="modal-title has-text-light m-b-5">{{ $t('pronaiIgraa') }}</div>
          <div class="search container">
            <b-field>
              <b-input
                ref="filter"
                v-model="search_term"
                :placeholder="$t('pretraiIgrae')"
                type="search"
                pack="far"
                :icon-right="search_icon"
                icon-right-clickable
                @icon-right-click="search_term = ''"
              >
              </b-input>
            </b-field>
          </div>

          <div v-if="loadingPlayers" class="align__centar__x">
            <b-icon
              class="comment-send"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-white"
              pack="fal"
            ></b-icon>
          </div>
          <div
            v-for="(item, index) in members"
            :key="index + 'single'"
            class="list__image-col cursor align__centar__y"
            @click="addNewPlayer(item)"
          >
            <TennisImage :size="[42, 42]" :src="item.image" class="user_image-small m-r-10" alt="" />
            <div class="list__content">
              <h3>{{ item.display_name }}</h3>
            </div>
            <span v-if="item.is_doubles" class="is-size-7 x-tag nav__notification has-text-white">{{ $t('par') }}</span>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>

    <div class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button
        :loading="loading"
        pack="fal"
        icon-right="check"
        type="is-primary"
        rounded
        @click="updateResultSurrender()"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import Result from '~/models/Result'
import TennisImage from '@/components/TennisImage.vue'

import Player from '@/models/Player'
import Team from '@/models/Team'
import _ from 'lodash'
import Game from '~/models/Game'
import Reservation from '~/models/Reservation'

export default {
  name: 'ModalOptions',
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
      default: 'Filtriraj po tipu',
    },
    options: {
      type: Object,
      required: true,
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLigaAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async fetch() {
    await this.debouncedGetPlayers()
  },
  data() {
    return {
      activeTab: 0,
      search_term: '',
      select: 0,
      loading: false,
      last_page: 1,
      offset: 1,
      page: 1,
      bottom: false,
      nomore: false,
      loadingPlayers: false,
      members: [],
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
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    matchOptions() {
      return [
        { name: this.$t('Regularan meč'), subtitle: '' },
        {
          name: this.$t('Predaja:') + ' ' + this.player1,
          subtitle: this.player2 + ' ' + this.$t('ide dalje'),
        },
        {
          name: this.$t('Predaja:') + ' ' + this.player2,
          subtitle: this.player1 + ' ' + this.$t('ide dalje'),
        },
        { name: this.$t('Upiši rezultat'), subtitle: this.$t('Ukoliko igrači nisu u mogućnosti') },
      ]
    },
    player1() {
      if (this.options.players[0] !== undefined) {
        return this.options.players[0].display_name
      } else {
        return ''
      }
    },
    player2() {
      if (this.options.players[1] !== undefined) {
        return this.options.players[1].display_name
      } else {
        return ''
      }
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        this.debouncedGetPlayers()
      }
    },
  },
  mounted() {
    if (this.options.is_surrendered !== null) {
      this.select = this.options.is_surrendered
    }
  },
  created() {
    this.getPlayers(true)
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    getPlayers() {
      // if (this.last_page < this.page) return
      this.loadingPlayers = true
      Team.page(1)
        .where('display_name', this.search_term)
        .where('number_of_players', this.isDoubles ? 2 : 1)
        .where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.members = res.data
          this.last_page = res.meta.last_page
          this.page++
          this.loadingPlayers = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loadingPlayers = false
        })
    },
    cancelTerm() {
      const r = new Reservation({ id: this.options.reservation.id })
      r.delete()
        .then(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Rezervacija je uklonjena'),
            type: 'is-success',
            duration: 3000,
          })
          this.$emit('update')
          this.loading = false
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Promjena nije unesena'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loading = false
          this.$parent.close()
        })
    },
    send() {
      this.$emit('result', this.options.players)
      this.$parent.close()
    },
    addNewPlayer(item) {
      const players = this.options.players
      players.push(item)
      const g = new Game({ id: this.options.id })
      g.players()
        .attach({ players })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u kup'),
            type: 'is-success',
            duration: 500,
          })
          this.$emit('refresh')
          this.activeTab = 0
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
        })
    },
    deletePlayersInTournament(playerId) {
      const g = new Game({ id: this.options.id })
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
          this.$emit('refresh')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    updateResultSurrender() {
      if (this.select === 3) {
        this.send()
      } else if (this.select === 4) {
        this.cancelTerm()
      } else if (this.select === 10) {
        this.cancelTerm()
      } else {
        // 0 - regular; 1 - surrender first player; 2 - second player; 3 - match canceled
        this.loading = true
        const g = new Game({ id: this.options.id, is_surrendered: this.select })
        g.save()
          .then(() => {
            this.$parent.close()
            this.$buefy.toast.open({
              message: this.$t('Promjena je unesena'),
              type: 'is-success',
              duration: 3000,
            })
            this.$emit('update')
            this.loading = false
            this.$parent.close()
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Promjena nije unesena'),
              type: 'is-danger',
              duration: 3000,
            })
            this.loading = false
          })
      }
    },
  },
}
</script>
