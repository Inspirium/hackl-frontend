/* eslint-disable */
<template>
  <div class="login">
    <PageHeader :title="$t('odaberiKlub')" :background="'is-primary'">
      <div class="flex w100 align__centar__x m-t--15 m-b-10">
        <img class="logo__login__page" src="/logo__login-sign.svg" alt="" />
      </div>
      <div class="fw600 has-text-white has-text-centered is-size-4">{{ $t('odaberiKlub') }}</div>
    </PageHeader>
    <div class="x-container registration relative">
      <div class="tablelist">
        <div id="inputsearch" class="search container placeholder-black80 m-t-20">
          <b-field class="w100">
            <b-input
              ref="filter"
              v-model="search_term"
              :placeholder="$t('pronaiKlub')"
              type="search"
              pack="far"
              :icon-right="search_term === '' ? 'search' : 'times'"
              icon-right-clickable
              @icon-right-click="search_icon_click()"
            >
            </b-input>
          </b-field>
        </div>
        <location class="m-t-20 m-b-20" @location="setLocation" @update="noLocation()" />
        <transition name="fade">
          <div v-if="loading" class="align__centar__x loading_z_spinner m-t-100 m-b-20">
            <b-icon
              class="comment-send m-b-20 m-t-20"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-primary"
              pack="far"
            ></b-icon>
          </div>
        </transition>
        <div v-if="Object.keys(myClub).length && search_term === ''" class="">
          <div class="fw600 is-size-6 m-b-5">{{ $t('Odaberi krovnu TenisPlus aplikaciju') }}</div>
          <div class="fw600 radius__12 p-all-12 empty__box cursor is-white has-text-white" @click="submit(myClub)">
            <div class="flex align__centar__all justify-between w100">
              <div class="list__content">
                <div class="flex align__centar__y m-b-5">
                  <TennisImage :size="[42, 42]" :src="myClub.logo" class="user_image m-r-7 softshadow" alt="" />
                  <h4 class="fw600 is-size-5 m-t--2">
                    {{ myClub.name }}
                  </h4>
                </div>
                <h3 class="fw600 has-text-black50 is-size-65 flex align__centar__y m-t-10">
                  <font-awesome-icon class="m-r-3 iw08" icon="fa-light fa-arrow-right" />
                  <span class="m-l-3">{{ $t('Rezerviraj terene iz svih klubova na jednom mjestu') }}</span>
                </h3>
                <h3 class="fw600 has-text-black50 is-size-65 flex align__centar__y">
                  <font-awesome-icon class="m-r-3 iw08" icon="fa-light fa-arrow-right" />
                  <span class="m-l-3">{{ $t('Pronađi trenera, špananje reketa, klub...') }}</span>
                </h3>
                <h3 class="fw600 has-text-black50 is-size-65 flex align__centar__y">
                  <font-awesome-icon class="m-r-3 iw08" icon="fa-light fa-arrow-right" />
                  <span class="m-l-3">{{ $t('Prijavi se u ligu ili turnir u raznim klubovima') }}</span>
                </h3>
              </div>
              <div class="action m-l-auto">
                <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" type="is-black50" pack="fal"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <template v-if="clubs.length">
          <div v-if="search_term === ''" class="fw600 is-size-6 m-t-20 m-b-5">
            {{ $t('...ili odaberi klub') }}
          </div>
          <b-table :data="clubs" :mobile-cards="false" :bordered="false" class="p-b-75">
            <b-table-column v-slot="props">
              <div class="fw600" @click="submit(props.row)">
                <div class="flex align__centar__all justify-between w100 cursor">
                  <div class="list__content">
                    <div class="flex align__centar__y m-b-5">
                      <TennisImage :size="[42, 42]" :src="props.row.logo" class="user_image m-r-7 softshadow" alt="" />

                      <h4 class="fw600 is-size-5 m-t--2">
                        {{ props.row.name }}
                      </h4>
                    </div>

                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon class="m-r-3 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                      <span class="has-text-black50 m-l-3">{{ props.row.city }}</span>
                    </h3>
                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon class="m-r-3 has-text-lightblue iw08" icon="fa-light fa-arrow-pointer" />
                      <span class="has-text-black50 m-l-3">{{ props.row.domain }}</span>
                    </h3>
                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon
                        :class="
                          props.row.validate_user === 1 ? 'm-r-3 has-text-danger iw08' : 'm-r-3 has-text-success iw08'
                        "
                        :icon="props.row.validate_user === 1 ? 'fa-light fa-shield-xmark' : 'fa-light fa-shield-check'"
                      />
                      <span class="has-text-black50 m-l-3">{{
                        props.row.validate_user === 1 ? $t('Potrebna potvrda voditelja') : $t('Slobodne rezervacije')
                      }}</span>
                    </h3>
                  </div>

                  <div class="action m-l-auto">
                    <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" type="is-black50" pack="fal">
                    </b-icon>
                  </div>
                </div>
              </div>
            </b-table-column>
          </b-table>
        </template>
        <section v-if="!clubs.length && !loading" class="">
          <div class="m-t-15 m-b-25 has-text-grey has-text-centered">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <p class="fw600 is-size-6 has-text-centered has-text-black50 m-b-10">
              {{ $t('Nema podataka za navedene kriterije') }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'
import { Capacitor } from '@capacitor/core'
import location from '~/components/GeoLocation'
import _ from "lodash";
import PageHeader from '~/components/headers/blankBack'

export default {
  layout: 'noTop',
  components: {
    TennisImage,
    location,
    PageHeader,
  },
  data() {
    return {
      clubs: [],
      clubNika: {},
      loading: false,
      search_term: '',
      location: {
        latitude: 0,
        longitude: 0,
      },
      myClub: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    search_term() {
      this.debouncedGetClubs()
    },
  },
  created() {
    this.debouncedGetClubs = _.debounce(this.getClubs, 500)
  },
  mounted() {
    this.getClubs()
    this.myTenisPlus()
  },
  methods: {
    search_icon_click() {
      this.search_term = ''
    },
    getClubs() {
      this.loading = true
      if (this.location.latitude && this.location.longitude) {
        Club.where('is_active', true).limit(100)
            .where('name', this.search_term)
            .params({
              latitude: this.location.latitude,
              longitude: this.location.longitude,
            })
            .orderBy('distance')
            .get()
            .then((res) => {
              this.clubs = res.data
              this.loading = false
            })
      } else {
        Club.where('is_active', true).limit(100)
            .where('name', this.search_term)
            .get()
            .then((res) => {
              this.clubs = res.data
              this.loading = false
            })
      }
    },
    myTenisPlus() {
      Club.find(26).then((res) => {
        this.myClub = res
      })
    },
    noLocation() {
      this.getClubs()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.getClubs()
    },
    submit(club) {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://${club.subdomain}.inspirium.hr`
      } else {
        this.$store.commit('club/setId', club.id)
        this.$store.dispatch('club/init_club', { force: true })
        this.$router.push(this.localePath('/'))
      }
    },
  },
}
</script>
<style scoped>
  body {
    max-width: 100%;
    margin: 0 auto;
    padding-left: 2rem;
  }
</style>
