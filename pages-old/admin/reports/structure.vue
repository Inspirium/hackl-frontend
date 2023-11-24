<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Izvještaji')" :background="'is-primary'" />
    <div class="activity x-container">
      <div class="fw600 has-text-centered m-b-10 m-t-5 is-size-3 line-height-19">{{ $t('strukturaRezervacija') }}</div>
      <div class="activity__box action__buttons m-t-10">
        <div
          v-for="(item, index) in structureType"
          :key="index"
          class="action__item__small fw600"
          :class="{ active: selectedStructure === item.name }"
          @click="selectedStructure = item.name"
        >
          <div class="is-size-55 has-text-black80 m-r-5" :class="{ 'has-text-white': selectedStructure === item.name }">
            {{ item.name }}
          </div>
          <span
            class="m-l-auto has-text-lightblue m-t--2"
            :class="{ 'has-text-white': selectedStructure === item.name }"
            >{{ item.precentage }}%</span
          >
        </div>
      </div>
      <template v-if="memberships.length > 1 && selectedStructure === 'Članovi'">
        <div class="fw600 has-text-centered m-b-15 is-size-5 line-height-19 m-t-20">
          {{ $t('odaberiVrsteLanstva') }}
        </div>
        <div v-if="true" class="buttons m-t-5">
          <b-button
            v-for="item in memberships"
            :key="item.id"
            :class="{ softshadow: true, 'invert-small-button': selectedMembership.includes(item.id) }"
            :icon-right="selectedMembership.includes(item.id) ? 'times' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedMembership.includes(item.id),
            }"
            pack="fal"
            rounded
            @click.prevent="selectMembership(item.id)"
          >
            {{ item.name }}
          </b-button>
        </div>
      </template>
      <template v-if="selectedStructure === 'Škola tenisa'">
        <div class="fw600 has-text-centered m-b-15 is-size-5 line-height-19 m-t-20">{{ $t('odaberiKoleTenisa') }}</div>
        <div v-if="true" class="buttons m-t-5">
          <b-button
            v-for="item in schoolGroups"
            :key="item.id"
            :class="{ softshadow: true, 'invert-small-button': selectedSchools.includes(item.id) }"
            :icon-right="selectedSchools.includes(item.id) ? 'times' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedSchools.includes(item.id),
            }"
            pack="fal"
            rounded
            @click.prevent="selectSchool(item.id)"
          >
            {{ item.name }}
          </b-button>
        </div>
      </template>
      <template v-if="selectedStructure === 'Treneri'">
        <div class="fw600 has-text-centered m-b-15 is-size-5 line-height-19 m-t-20">{{ $t('odaberiTrenere') }}</div>
        <div v-if="true" class="buttons m-t-5">
          <b-button
            v-for="item in trainers"
            :key="item.id"
            :class="{ softshadow: true, 'invert-small-button': selectedTrainers.includes(item.id) }"
            :icon-right="selectedTrainers.includes(item.id) ? 'times' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedTrainers.includes(item.id),
            }"
            pack="fal"
            rounded
            @click.prevent="selectTrainers(item.id)"
          >
            {{ item.display_name }}
          </b-button>
        </div>
      </template>

      <div class="divider-line-1 m-t-5"></div>
      <div class="fw600 has-text-centered m-t-10 m-b-5 is-size-3 line-height-19">{{ $t('ukupno') }}</div>
      <div class="statistics_new m-b-10 m-t-10 p-t-10 p-b-5 softshadow is-primary">
        <div class="statistic__item">
          <div class="label--center has-text-white">{{ $t('prihodi') }}</div>
          <div class="border-top-transparent"></div>
          <div class="label__num-light is-size-4 has-text-white">
            <span class="has-text-white">{{ '5.458 €' }}</span>
          </div>
        </div>
        <div v-if="Object.keys(reservationsMeta).length" class="statistic__item">
          <div class="label--center has-text-white">{{ $t('ukupnoRezervacija') }}</div>
          <div class="border-top-transparent"></div>
          <div class="label__num-light is-size-4 has-text-white">
            <span class="has-text-white">{{ reservationsMeta.total }}</span>
          </div>
        </div>
      </div>
      <div class="fw600 has-text-centered m-t-10 m-b-5 is-size-5">{{ $t('Najviše rezervacija') }}</div>
      <div class="activity__reservation">
        <transition name="fade">
          <div class="activity__box action__buttons">
            <div v-for="player in players" :key="player.id" class="action__item__small fw600">
              <TennisImage :size="[42, 42]" :src="player.image" class="user_image-small m-r-10 border__white" alt="" />
              <div>{{ player.display_name }}</div>
              <div class="buttons m-l-auto">55h</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import SchoolGroup from '@/models/SchoolGroup'
import Player from '~/models/Player'
import Court from '~/models/Court'
import PageHeader from '~/components/headers/blankBack'
import Reservation from '~/models/Reservation'

export default {
  name: 'Reports',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      selectedType: 'all',
      selectedCourtsActive: 1,
      selectedTimeSpan: 'day',
      selectedStructure: 'Članovi',
      selectedMembership: [],
      selectedSchools: [],
      selectedTrainers: [],
      players: [],
      courts: [],
      schoolGroups: [],
      trainers: [],
      reservations: [],
      reservationsMeta: {},
      heroImage: '/hero_court.jpg',
      structureType: [
        { name: 'Članovi', precentage: 67 },
        { name: 'Škola tenisa', precentage: 21 },
        { name: 'Treneri', precentage: 9 },
        { name: 'Gosti', precentage: 4 },
      ],
    }
  },
  computed: {
    memberships() {
      return this.$store.state.club.memberships
    },
  },
  watch: {
    memberships() {
      for (let i = 0; i < this.memberships.length; i++) {
        this.selectedMembership.push(this.memberships[i].id)
      }
    },
  },
  mounted() {
    this.getCourts()
    this.getPlayers()
    this.getTrainers()
    this.getGroups()
    this.loadReservations()
  },
  methods: {
    selectMembership(item) {
      if (this.selectedMembership.includes(item)) {
        this.selectedMembership.splice(this.selectedMembership.indexOf(item), 1)
      } else {
        this.selectedMembership.push(item)
      }
    },
    selectSchool(item) {
      if (this.selectedSchools.includes(item)) {
        this.selectedSchools.splice(this.selectedSchools.indexOf(item), 1)
      } else {
        this.selectedSchools.push(item)
      }
    },
    selectTrainers(item) {
      if (this.selectedTrainers.includes(item)) {
        this.selectedTrainers.splice(this.selectedTrainers.indexOf(item), 1)
      } else {
        this.selectedTrainers.push(item)
      }
    },
    getGroups() {
      SchoolGroup.include('players')
        .where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.schoolGroups = res.data
        })
    },
    getTrainers() {
      Player.where('is_trainer', true)
        .where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.trainers = res.data
        })
    },
    getPlayers() {
      Player.where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.players = res.data
        })
    },
    getCourts() {
      this.loading = true
      Court.where('is_active', this.selectedCourtsActive)
        .get()
        .then((res) => {
          // this.$buefy.toast.open({
          //   message: this.$t('Uspješno ste izmjenili osnovno članstvo'),
          //   type: 'is-success',
          // })

          this.courts = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    loadReservations() {
      this.loading = true
      Reservation.page(1)
        .where('team', 10)
        .where('club', 1)
        .where('from', '0000-00-00')
        .get()
        .then((res) => {
          this.reservations = res.data
          this.reservationsMeta = res.meta
          this.loading = false
        })
    },
  },
}
</script>
