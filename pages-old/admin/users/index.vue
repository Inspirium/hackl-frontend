<template>
  <div v-if="isAdmin" class="members">
    <hero :back="true">
      <h1 class="has-text-white">{{ $t('upravljanjeKorisnicima') }}</h1>
    </hero>
    <div v-if="false" class="filters--two container">
      <div class="filter">
        <div class="label m-t-0">{{ $t('roleKorisnika') }}</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalRoleActive = true">
            {{ filterRoleDisplay }}
          </b-button>
        </div>
      </div>
      <div class="filter">
        <div class="label m-t-0">{{ $t('statusLanstva') }}</div>
        <div class="buttons">
          <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalMembershipActive = true">
            {{ filterMembershipDisplay }}
          </b-button>
        </div>
      </div>
    </div>
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
    <template v-if="selectedStatus.name === 'Članovi'">
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
    <div class="buttons m-t-30 m-b--10">
      <b-button
        class="softshadow"
        type="is-small noborder"
        pack="fas"
        icon-right="file-excel"
        rounded
        @click="exportMembers"
      >
        {{ $t('Spremi popis korisnika kao Excel') }}
      </b-button>
    </div>
    <div id="inputsearch" class="search container">
      <b-field>
        <b-input
          v-model="search_term"
          :placeholder="$t('pretraiKorisnike')"
          type="search"
          pack="far"
          :icon-right="search_icon"
          icon-right-clickable
          @icon-right-click="search_term = ''"
        >
          >
        </b-input>
      </b-field>
    </div>
    <div v-if="is_member_status === 'applicant' && checkedRows.length" class="buttons m-t-10 m-b-0">
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-primary has-text-white"
        pack="fal"
        icon-right="user-plus"
        rounded
        @click="
          updateMemberData.member = checkedRows
          updateMember()
        "
      >
        {{ $t('potvrdiNoveLanove') }}
      </b-button>
    </div>
    <div v-if="is_member_status === 'blocked' && checkedRows.length" class="buttons m-t-10 m-b-0">
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-primary has-text-white"
        pack="fal"
        icon-right="user-shield"
        rounded
        @click="
          updateMemberData.member = checkedRows
          updateMember()
        "
      >
        {{ $t('odblokirajKorisnike') }}
      </b-button>
    </div>
    <div v-if="is_member_status === '' && checkedRows.length" class="buttons m-t-10 m-b-0">
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-danger has-text-white"
        pack="fal"
        icon-right="user-shield"
        rounded
        @click="
          updateMemberData.blocked = checkedRows
          updateMember()
        "
      >
        {{ $t('blokiraj') }}
      </b-button>
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-primary has-text-white"
        pack="fal"
        rounded
        @click="
          updateMemberData.applicant = checkedRows
          updateMember()
        "
      >
        {{ $t('prebaciUAplikante') }}
      </b-button>
    </div>

    <div v-if="!checkedRows.length" class="total__members">
      <h6 class="fw600 flex align__centar__all">
        {{ $t('ukupnoKorisnika') }}
        <span>{{ total }}</span>
      </h6>
    </div>
    <div v-else class="total__members">
      <h6 class="fw600 flex align__centar__all">
        {{ $t('oznaenoKorisnika') }}
        <span>{{ checkedRows.length }}</span>
      </h6>
    </div>
    <div class="tablelist relative p-b-100">
      <b-table
        :data="club_players"
        :checkbox-position="checkboxPosition"
        :checked-rows.sync="checkedRows"
        :bordered="false"
        :mobile-cards="false"
        checkbox-type="is-info"
        checkable
      >
        <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
          <nuxt-link :to="localePath(props.row.link)">
            <div class="list__img">
              <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
            </div>
            <div class="list__content">
              <div class="fw600 is-size-6 has-text-black80">{{ props.row.display_name }}</div>
              <div
                v-if="$user.wallet(props.row.wallets)"
                class="fw600 is-size-7"
                :class="$user.wallet(props.row.wallets).amount > 0 ? 'has-text-lightblue' : 'has-text-danger'"
              >
                {{ $user.wallet(props.row.wallets).amount | currency }}
              </div>
            </div>
            <div class="has-text-right">
              <b-tag v-if="props.row.is_admin" type="is-success">{{ $t('admin') }}</b-tag>
              <b-tag
                v-if="props.row.club_member[club.id].type === 'member' && !props.row.is_trainer && !props.row.is_admin"
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
              <b-tag v-if="props.row.club_member[club.id].cashier" type="is-warning" class="m-l-5">{{
                $t('Blagajnik')
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
    <b-modal :active.sync="isModalRoleActive" :width="640" scroll="clip" class="modal__members">
      <modalOptions
        :confirm="false"
        :send-object="true"
        :options="options_role"
        :title="$t('role')"
        :subtitle="$t('Filtrirajte po sljedećim rolama')"
        @update="updateRole"
      ></modalOptions>
    </b-modal>

    <b-modal :active.sync="isModalMembershipActive" :width="640" scroll="clip">
      <modalOptions
        :confirm="false"
        :send-object="true"
        :options="memberships"
        :title="$t('lanstva')"
        :subtitle="$t('Filtrirajte po sljedećim članstvima')"
        @update="updateStatus"
      ></modalOptions>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import hero from '~/components/Hero'
import modalOptions from '~/components/modal/ModalOptions'
import Player from '~/models/Player'
import ExportPlayer from '~/models/Export/Player'

export default {
  name: 'Players',
  components: {
    hero,
    modalOptions,
    TennisImage,
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
      options_role: [{ name: 'Sve' }, { name: 'Admin' }, { name: 'Trener' }, { name: 'Blagajnik' }],
      status: [{ name: 'Sve' }, { name: 'Članovi' }, { name: 'Aplikanti' }, { name: 'Blokirani' }],
      is_admin: false,
      is_trainer: false,
      is_cashier: false,
      is_member_status: '',
      updateMemberData: { member: [], applicant: [], blocked: [] },
      memberships: [],
      selectedMemberships: '',
      selectedStatus: { name: 'Sve' },
      selectedType: { name: 'Sve' },
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
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
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
        .where('is_cashier', this.is_cashier)
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
      if (item.name === 'Članovi') {
        this.is_member_status = 'member'
      }
      if (item.name === 'Aplikanti') {
        this.is_member_status = 'applicant'
      }
      if (item.name === 'Sve') {
        this.is_member_status = ''
      }
      if (item.name === 'Blokirani') {
        this.is_member_status = 'blocked'
      }
      this.getPlayers()
    },
    updateRole(item) {
      this.selectedType = item
      this.offset = 1
      if (item.name === 'Admin') {
        this.is_admin = true
      } else {
        this.is_admin = false
      }
      if (item.name === 'Trener') {
        this.is_trainer = true
      } else {
        this.is_trainer = false
      }
      if (item.name === 'Blagajnik') {
        this.is_cashier = true
      } else {
        this.is_cashier = false
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
