<template>
  <div class="members">
    <PageHeader :title="$t('Pošalji poruku')" :back="true" :background="'is-primary'" />
    <div class="p-x-16">
      <div class="fw600 has-text-centered w100 m-t-20 is-size-3">{{ $t('Filtriraj članove') }}</div>
      <template v-if="isAdmin">
        <div class="buttons m-t-20 m-b-5">
          <b-button
            v-for="(item, index) in main_select"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': selectedMain_select.name === item.name }"
            :icon-right="selectedMain_select.name === item.name ? 'check' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedMain_select.name === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="selectedMain_select = item"
          >
            {{ $t(item.name) }}
          </b-button>
        </div>

        <div class="divider-line-1 m-t-0"></div>
      </template>
      <template v-if="selectedMain_select.name === 'Korisnici'">
        <div v-if="playerList.length" class="fw600 is-size-6 m-t-10">
          {{ $t('Korisnici kojima se šalje poruka') }}<span class="has-text-lightblue"> ({{ playerList.length }})</span>
        </div>

        <div v-if="playerList.length" class="tablelist softshadow radius__12 overflow-hidden relative m-b-20 m-t-7">
          <b-table :data="playerList" :bordered="false" :mobile-cards="false">
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
              <div class="flex align__centar__y">
                <div class="list__img m-l-10">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="fw600 is-size-6 has-text-black80">{{ props.row.display_name }}</div>
                </div>
                <div class="m-l-auto" @click="removePlayer(props.row)">
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                </div>
              </div>
            </b-table-column>
          </b-table>
        </div>
        <div class="buttons m-t-30">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-plus"
            rounded
            @click="isModalMembersActive = true"
          >
            {{ $t('Dodaj korisnika') }}
          </b-button>
        </div>

        <div class="m-t-20">
          <b-input
            v-if="playerList.length > 1"
            v-model="group_name"
            class="radius__full m-b-20"
            type="text"
            :placeholder="$t('Napiši ime grupe')"
          ></b-input>
          <b-input v-model="message" type="textarea" :placeholder="$t('Napiši tekst poruke')"></b-input>
        </div>
        <div class="buttons w100 m-t-20">
          <b-button
            class="fw600"
            :class="{ blur_button: !playerList.length || message === '' }"
            type="is-success"
            pack="fal"
            size="is-medium"
            icon-right="paper-plane"
            rounded
            :loading="loadingMessage"
            @click="send"
          >
            {{ $t('Pošalji') }}
          </b-button>
        </div>
      </template>

      <template v-if="selectedMain_select.name === 'Grupe korisnika'">
        <div class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">
          {{ $t('Prema tipu ovlasti') }}
        </div>
        <div class="buttons m-t-5 m-b-5">
          <b-button
            v-for="(item, index) in options_role"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': selectedType.name === item.name }"
            :icon-right="selectedType.name === item.name ? 'check' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedType.name === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="updateRole(item)"
          >
            {{ $t(item.name) }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t-0"></div>
        <div class="fw600 has-text-centered w100 has-text-lightblue m-t-10 is-size-6">{{ $t('Prema statusu') }}</div>
        <div class="buttons m-t-5 m-b-5">
          <b-button
            v-for="(item, index) in status"
            :key="index"
            class="m-t-5 m-b-5 m-l-5 m-r-5"
            :class="{ softshadow: true, 'invert-small-button': selectedStatus.name === item.name }"
            :icon-right="selectedStatus.name === item.name ? 'check' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedStatus.name === item.name,
            }"
            pack="fal"
            rounded
            @click.prevent="updateStatus(item)"
          >
            {{ $t(item.name) }}
          </b-button>
        </div>
        <div class="divider-line-1 m-t-0"></div>
        <template v-if="selectedStatus.name === 'member'">
          <div class="fw600 has-text-centered has-text-lightblue w100 m-t-10 is-size-6">Prema vrsti članstva</div>
          <div class="buttons m-t-5 m-b-5">
            <b-button
              v-for="(item, index) in memberships"
              :key="index"
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': selectedMemberships === item.id }"
              :icon-right="selectedMemberships === item.id ? 'check' : ''"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': selectedMemberships === item.id,
              }"
              pack="fal"
              rounded
              @click.prevent="updateMembership(item)"
            >
              {{ item.name }}
            </b-button>
          </div>

          <div class="divider-line-1 m-t-0"></div>
        </template>
        <div class="m-t-20">
          <b-input
            v-if="club_players.length > 1"
            v-model="group_name"
            class="radius__full m-b-20"
            type="text"
            :placeholder="$t('Napiši ime grupe')"
          ></b-input>
          <b-input v-model="message" type="textarea" :placeholder="$t('Napiši tekst poruke')"></b-input>
        </div>

        <div class="buttons w100 m-t-20">
          <b-button
            class="fw600"
            :class="{ blur_button: !club_players.length || message === '' }"
            type="is-success"
            pack="fal"
            size="is-medium"
            icon-right="paper-plane"
            rounded
            :loading="loadingMessage"
            @click="send"
          >
            {{ $t('Pošalji') }}
          </b-button>
        </div>

        <div v-if="club_players.length" class="fw600 is-size-6 m-b-10">
          {{ $t('Korisnici kojima se šalje poruka') }}<span class="has-text-lightblue"> ({{ total }})</span>
        </div>

        <div class="tablelist relative p-b-100">
          <b-table :data="club_players" :bordered="false" :mobile-cards="false">
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
              <nuxt-link :to="localePath(props.row.link)">
                <div class="list__img m-l-10">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="fw600 is-size-6 has-text-black80">{{ props.row.display_name }}</div>
                  <div
                    v-if="props.row.wallets.length"
                    class="fw600 is-size-7"
                    :class="props.row.wallets[0].amount > 0 ? 'has-text-lightblue' : 'has-text-danger'"
                  ></div>
                </div>
                <div class="has-text-right">
                  <b-tag v-if="props.row.is_admin" type="is-success">{{ $t('admin') }}</b-tag>
                  <b-tag
                    v-if="
                      props.row.club_member[club.id].type === 'member' && !props.row.is_trainer && !props.row.is_admin
                    "
                    type="is-info"
                    >{{ $t('lan') }}</b-tag
                  >
                  <b-tag v-if="props.row.club_member[club.id].type === 'applicant'" type="is-danger">{{
                    $t('aplikant')
                  }}</b-tag>
                  <b-tag v-if="props.row.is_trainer" type="is-info" class="m-l-5">{{ $t('trener') }}</b-tag>
                  <b-tag v-if="props.row.club_member[club.id].type === 'blocked'" type="is-danger" class="m-l-5">{{
                    $t('blokiran')
                  }}</b-tag>
                </div>
              </nuxt-link>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihLanova') }}</p>
                </div>
              </section>
            </template>
          </b-table>
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner m-t-20">
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
        </div>
      </template>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Pronađi člana')"
        :show-tennis-school="false"
        :is-player="true"
        @player="addNewPlayer"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import Thread from '@/models/Thread'
import PageHeader from '~/components/headers/blankBack'
import Player from '~/models/Player'
import ExportPlayer from '~/models/Export/Player'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'NewMessages',
  components: {
    TennisImage,
    PageHeader,
    modalMembers,
  },
  async fetch() {
    await this.getPlayers()
  },
  data() {
    return {
      checkboxPosition: 'left',
      checkedRows: [],
      club_players: [],
      offset: 1,
      isModalMembersActive: false,
      bottom: false,
      nomore: false,
      loading: false,
      total: 0,
      search_term: '',
      isModalRoleActive: false,
      isModalMembershipActive: false,
      loadingMessage: false,
      filterMembershipDisplay: 'Sve',
      group_name: '',
      filterRoleDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      playerList: [],
      player_memberships: [],
      main_select: [{ name: 'Korisnici' }, { name: 'Grupe korisnika' }],
      options_role: [{ name: 'all' }, { name: 'isAdmin' }, { name: 'isTrainer' }],
      status: [{ name: 'all' }, { name: 'member' }, { name: 'applicant' }, { name: 'blocked' }],
      is_admin: false,
      is_trainer: false,
      is_member_status: '',
      updateMemberData: { member: [], applicant: [], blocked: [] },
      memberships: [],
      selectedMemberships: '',
      message: '',
      selectedStatus: { name: 'all' },
      selectedType: { name: 'all' },
      selectedMain_select: { name: 'Korisnici' },
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
    basicMembership() {
      return this.memberships.filter((item) => {
        return item.basic
      })
    },
    // memberships() {
    //   return [
    //     { name: 'Sve' },
    //     { name: 'Članovi' },
    //     { name: 'Aplikanti' },
    //     { name: 'Blokirani' },
    //     // ...this.$store.state.club.memberships,
    //   ]
    // },
    club() {
      return this.$store.state.club
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
        this.debouncedGetPlayers()
      } else {
        this.getPlayers()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getPlayers()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
    this.getMembership()
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    send() {
      this.loadingMessage = true
      const n = new Thread({
        message: this.message,
        title: this.group_name,
        players: this.selectedMain_select.name === 'Korisnici' ? this.playerList : [],
        filter:
          this.selectedMain_select.name === 'Korisnici'
            ? {}
            : {
                club: this.$store.state.club.id,
                club_member_status: this.is_member_status,
                is_doubles: false,
                membership: this.selectedMemberships,
                is_admin: this.is_admin,
                is_trainer: this.is_trainer,
                display_name: this.search_term,
              },
      })
      n.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Obavijest je uspješno poslana'),
            type: 'is-success',
          })
          this.loadingMessage = false
          this.$router.push(this.localePath(`/messages/${res.id}`))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingMessage = false
        })
    },
    removePlayer(item) {
      this.playerList = this.playerList.filter((player) => {
        return player.id !== item.id
      })
    },
    addNewPlayer(item) {
      this.playerList.push(item)
    },
    submitMessage() {
      const t = new Thread({ players: this.players, message: this.new_message, title: this.group_name })
      t.save().then((res) => {
        this.$router.push(this.localePath(`/messages/${res.id}`))
      })
    },
    search_icon_click() {
      this.search_term = ''
    },
    getPlayers() {
      if (this.last_page < this.offset) return
      this.loading = true
      Player.page(this.offset)
        .include('wallets')
        .where('club', this.$store.state.club.id)
        .where('club_member_status', this.is_member_status)
        .where('is_doubles', false)
        .where('membership', this.selectedMemberships)
        .where('is_admin', this.is_admin)
        .where('is_trainer', this.is_trainer)
        .where('display_name', this.search_term)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.club_players = res.data
          } else {
            this.club_players = [...this.club_players, ...res.data]
          }
          this.checkedRows = []
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateMember() {
      this.$axios
        .put('v2/club/member', this.updateMemberData)
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Izmjene su spremljene'),
            type: 'is-success',
          })
          this.getPlayers()
          this.updateMemberData = { member: [], applicant: [], blocked: [] }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.updateMemberData = { member: [], applicant: [], blocked: [] }
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    updateStatus(item) {
      this.selectedStatus = item
      this.selectedMemberships = ''
      this.offset = 1
      if (item.name === 'member') {
        this.is_member_status = 'member'
      }
      if (item.name === 'applicant') {
        this.is_member_status = 'applicant'
      }
      if (item.name === 'all') {
        this.is_member_status = ''
      }
      if (item.name === 'blocked') {
        this.is_member_status = 'blocked'
      }
      this.getPlayers()
    },
    updateRole(item) {
      this.selectedType = item
      this.offset = 1
      if (item.name === 'isAdmin') {
        this.is_admin = true
      } else {
        this.is_admin = false
      }
      if (item.name === 'isTrainer') {
        this.is_trainer = true
      } else {
        this.is_trainer = false
      }
      this.getPlayers()
    },
    updateMembership(item) {
      this.selectedMemberships !== item.id ? (this.selectedMemberships = item.id) : (this.selectedMemberships = '')
      this.offset = 1
      this.getPlayers()
    },
    async exportMembers() {
      // window.location.href = `https://api.tenis.plus/v2/export/players?filter[club]=${this.$store.state.club.id}`
      const file = await ExportPlayer.where('club', this.$store.state.club.id)
        .where('club_member_status', this.is_member_status)
        .where('membership', this.selectedMemberships)
        .where('is_admin', this.is_admin)
        .where('is_trainer', this.is_trainer)
        .file()
      const url = window.URL.createObjectURL(new Blob([file]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'players.xlsx')
      document.body.appendChild(link)
      link.click()
    },
    getMembership() {
      this.memberships = this.$store.state.club.memberships
    },
  },
}
</script>
