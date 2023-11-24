<template>
  <div class="members p-b-200">
    <PageHeader :title="$t('Pošalji obavijesti')" :back="true" :background="'is-primary'" />
    <div class="p-x-16">
      <div class="fw600 has-text-centered w100 m-t-20 is-size-3">{{ $t('Filtriraj članove') }}</div>
      <div class="fw600 has-text-centered w100 m-t-5 has-text-lightblue is-size-6">{{ $t('Prema tipu ovlasti') }}</div>
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
      <div class="fw600 has-text-centered w100 has-text-lightblue m-t-10 is-size-6">{{ $t('Poruka') }}</div>
      <div class="m-b--10 m-t-5">
        <b-input v-model="title" class="radius__full" type="text" :placeholder="$t('Napiši naslov')"></b-input>
        <b-input
          v-model="message"
          class="m-t-10"
          maxlength="300"
          type="textarea"
          :placeholder="$t('Napiši tekst poruke')"
        ></b-input>
        <div class="m-b-15 m-t--20 fw600 is-size-65">{{ $t('Poveznica') }} {{ $t('(Opcionalno)') }}</div>
        <b-input v-model="link" class="m-t--10" type="text" :placeholder="'www.' + $t('nekilink') + '.com'"></b-input>
      </div>
      <div class="buttons w100 m-t-30">
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
      <div class="tablelist softshadow radius__12 overflow-hidden relative">
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
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import Notification from '@/models/Notification'
import PageHeader from '~/components/headers/blankBack'
import Player from '~/models/Player'
import ExportPlayer from '~/models/Export/Player'

export default {
  name: 'Players',
  components: {
    TennisImage,
    PageHeader,
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
      bottom: false,
      nomore: false,
      loading: false,
      loadingMessage: false,
      total: 0,
      search_term: '',
      isModalRoleActive: false,
      isModalMembershipActive: false,
      filterMembershipDisplay: 'Sve',
      filterRoleDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      player_memberships: [],
      options_role: [{ name: 'all' }, { name: 'isAdmin' }, { name: 'isTrainer' }],
      status: [{ name: 'all' }, { name: 'member' }, { name: 'applicant' }, { name: 'blocked' }],
      is_admin: false,
      is_trainer: false,
      is_member_status: '',
      updateMemberData: { member: [], applicant: [], blocked: [] },
      memberships: [],
      selectedMemberships: '',
      message: '',
      title: '',
      link: '',
      selectedStatus: { name: 'all' },
      selectedType: { name: 'all' },
    }
  },
  computed: {
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
      const n = new Notification({
        title: this.title,
        link: this.link,
        body: this.message,
        filter: {
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
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Obavijest je uspješno poslana'),
            type: 'is-success',
          })
          this.title = ''
          this.link = ''
          this.message = ''
          this.loadingMessage = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingMessage = false
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
