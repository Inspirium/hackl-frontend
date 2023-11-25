<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Prijave')" />
    <div class="fw600 has-text-centered has-text-black50 w100 is-size-6 m-t-20 m-b-5 p-x-16">
      {{ $t('Zaprimljene prijave') }}
    </div>

    <div class="activity x-container relative">
      <template>
        <div v-if="reservations.length" class="is-white radius__5 softshadow">
          <div class="bb1-10"></div>
          <div v-for="(item, index) in reservations" :key="index + 'ob'" class="">
            <nuxt-link
              v-if="item.created_by"
              :to="localePath('/reservation/' + item.created_by.id)"
              class="fw600 align__centar__all p-r-10 p-l-10 p-t-7 p-b-7 bb1-10"
            >
              <div v-if="item.created_by.image" class="list__img">
                <TennisImage :size="[42, 42]" :src="item.created_by.image" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <h4 class="fw600 is-size-55 m-t--2 m-b--5">{{ item.created_by.display_name }}</h4>
                <template v-if="item.players.length">
                  <div
                    v-if="item.canceled_by?.id === item.created_by?.id && item.created_by?.id !== item.players[0].id"
                    class="fw600 is-size-65 has-text-black30 m-r-5 m-t-3 m-b--2"
                  >
                    {{ $t('Za') }}:<span class="has-text-black80"> {{ item.players[0].display_name }}</span>
                  </div>
                </template>
                <div class="x-tag--small is-primary m-l-auto inlineblock m-b-2">
                  {{ item.court.name }}
                </div>

                <div class="fw600 is-size-65 has-text-black30">
                  <!--                  <b-icon-->
                  <!--                    icon="ban"-->
                  <!--                    pack="far"-->
                  <!--                    type="is-danger"-->
                  <!--                    size="is-small-10 top-5"-->
                  <!--                    class="relative has-text-black30"-->
                  <!--                  ></b-icon>-->
                  <span class="has-text-black30">{{ $t('Vrijeme otkazivanja') }}:</span
                  ><span class="m-l-4 has-text-danger"
                    >{{ item.deleted_at | moment('DD.MM.' + ', ' + 'HH:mm') }}h
                  </span>
                </div>
                <div class="fw600 is-size-65 has-text-black30 m-r-5">
                  {{ $t('Rezervacija') }}:<span class="has-text-black80">
                    {{ item.from | moment('DD.MM.' + ', ' + 'HH:mm') }} - {{ item.to | moment('HH:mm') }}h</span
                  ><span v-if="$store.state.auth.user.id === 1">{{ item.id }}</span>
                </div>
                <div class="fw600 is-size-65 has-text-black30 m-r-5">
                  {{ $t('Otkazao') }}:<span class="has-text-black80"> {{ item.canceled_by?.display_name }}</span>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <template v-if="loading">
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
        </template>
        <section v-if="!reservations.length && !loading" class="">
          <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <p class="fw600 is-size-6 has-text-centered has-text-black50 m-b-10">
              {{ $t('nemaPodatakaZaUneseneVrijednosti') }}
            </p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import Reservervation from '~/models/Reservation'
import PageHeader from '~/components/headers/blankBack'
import TennisImage from '~/components/TennisImage'

export default {
  name: 'Reports',
  components: {
    PageHeader,
    TennisImage,
  },
  filters: {
    parseTime(hours) {
      return hours + ':00 - ' + (hours + 1) + ':00' + ' h'
    },
    parseCron(value, type) {
      const cron = value.split(' ')
      if (type === 'days') {
        if (cron[4] === '*') {
          return 'Svaki dan'
        }
        return cron[4]
          .replace('0', 'Ned')
          .replace('1', 'Pon')
          .replace('2', 'Uto')
          .replace('3', 'Sri')
          .replace('4', 'Čet')
          .replace('5', 'Pet')
          .replace('6', 'Sub')
          .replace('7', 'Ned')
      }
      if (type === 'hours') {
        const hours = cron[1].split('-')
        return hours[0] + ':00 - ' + hours[1] + ':00'
      }
      return value
    },
  },
  data() {
    return {
      loading: false,
      reservations: [],
      heroImage: '/hero_court.jpg',
    }
  },
  mounted() {
    this.getReservations()
  },
  methods: {
    getReservations() {
      this.loading = true
      const rc = new Reservervation()
      rc.where('status', 'pending')
        .orderBy('-deleted_at')
        .get()
        .then((res) => {
          this.reservations = res.data
          this.loading = false
        })
    },
  },
}
</script>
