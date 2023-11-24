<template>
  <div class="trainers">
    <hero :page="'trainer'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('pronaiTrenera') }}</h1>
    </hero>
    <div class="fw600 has-text-centered w100 has-text-lightblue m-t-30 m-b-10 is-size-6">{{ $t('Grad') }}</div>

    <b-field class="p-x-16">
      <b-autocomplete
        v-model="city"
        rounded
        field="name"
        :data="cities"
        :placeholder="$t('Odaberi grad')"
        clearable
        @select="(option) => (selected = option)"
      >
        <template #empty>{{ $t('Nema rezultata pretrage') }}</template>
      </b-autocomplete>
    </b-field>

    <!--    <div id="inputsearch" class="search container placeholder-black80 m-t-20">-->
    <!--      <b-field class="w100">-->
    <!--        <b-input-->
    <!--          ref="filter"-->
    <!--          v-model="search_term"-->
    <!--          :placeholder="$t('pronaiTrenera')"-->
    <!--          type="search"-->
    <!--          pack="far"-->
    <!--          :icon-right="search_term === '' ? 'search' : 'times'"-->
    <!--          icon-right-clickable-->
    <!--          @icon-right-click="search_icon_click()"-->
    <!--        >-->
    <!--        </b-input>-->
    <!--      </b-field>-->
    <!--    </div>-->

    <location class="" @location="setLocation" @update="noLocation()" />
    <div v-if="loading" class="align__centar__x m-t-30 loading_z_spinner--bottom">
      <b-icon
        class="comment-send"
        custom-class="rotating"
        icon="spinner"
        size="is-large"
        type="is-primary"
        pack="far"
      ></b-icon>
    </div>
    <div class="activity x-container">
      <!--      <div class="fw600 has-text-centered m-b-5 m-t-5 is-size-5 line-height-16">{{ $t('popis trenera') }}</div>-->
      <div v-if="trainers.length" class="m-t-10">
        <div v-for="(item, index) in trainers" :key="index" class="overflow-hidden br10">
          <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
            <div class="active list__image-col">
              <nuxt-link :to="localePath('/trainer/' + item.id)" class="fw600 flex align__centar__y">
                <div class="list__content">
                  <div class="flex align__centar__y">
                    <div class="list__img">
                      <TennisImage :size="[42, 42]" :src="item.image" class="user_image" alt="" />
                    </div>
                    <h4 class="fw600 is-size-5 m-t--2 is-size-5">
                      {{ item.display_name }}
                    </h4>
                  </div>
                  <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                    <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                      <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-cake-candles" />
                      {{ $t('godina range', { range: item.range }) }}
                    </div>
                    <div class="fw600 m-l-10 is-size-65 has-text-black50 flex align__centar__y">
                      <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                      {{ item.city }}
                    </div>
                  </div>
                  <h4 class="fw600 is-size-5 m-t-7 m-b--2 is-size-6 is-uppercase">
                    {{ $t('klubovi') }}
                  </h4>
                  <div v-for="(club, key, i) in item.club_member" v-show="i < 3" :key="key">
                    <div class="flex justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                      <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                        <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                        {{ club.name }}
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="item.trainer">
                  <div v-if="item.trainer.price" class="x-tag--xl is-primary m-l-auto nowrap m-l-10">
                    {{ item.trainer.price | currency }}/{{ $t('sat') }}
                  </div>
                  <div v-else class="x-tag--xl is-primary m-l-auto nowrap m-l-10">
                    {{ $t('Po dogovoru') }}
                  </div>
                </template>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import City from '~/models/City'
import hero from '~/components/Hero'
import Trainer from '~/models/Trainer'
import location from '~/components/GeoLocation'

export default {
  name: 'Trainers',
  components: {
    hero,
    TennisImage,
    location,
  },
  async fetch() {
    await this.$auth.fetchUser()
    if (this.$auth.user.is_trainer) {
      this.trainer = await Trainer.$find(this.user.is_trainer)
    }
  },
  data() {
    return {
      heroImage: '/hero_trainer.jpg',
      activeTab: 0,
      isCardModalActive: false,
      trainer: {
        available: false,
        description: '',
        price: '',
        show_phone: true,
        court_included: false,
      },
      trainers: [],
      total: 0,
      bottom: false,
      nomore: false,
      last_page: 1,
      offset: 1,
      loading: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
      selected: {},
      search_term: '',
      city: '',
      cities: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getPlayers()
      }
    },
    selected() {
      if (this.selected === null) {
        this.selected = {}
        this.getPlayers()
      }
      if (Object.keys(this.selected).length) {
        this.getPlayers()
      }
    },
    search_term() {
      this.debouncedGetClubs()
    },
    city() {
      this.debouncedGetCity()
    },
  },
  created() {
    this.debouncedGetClubs = _.debounce(this.getPlayers, 500)
    this.debouncedGetCity = _.debounce(this.getCity, 500)
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
    this.getCity()
  },
  methods: {
    getCity() {
      const c = City
      c.where('name', this.city)
        .where('country', 1)
        .include('country')
        .get()
        .then((res) => {
          this.cities = res.data
        })
    },
    search_icon_click() {
      this.search_term = ''
      this.getPlayers()
    },
    noLocation() {
      this.getPlayers()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.getPlayers()
    },
    getPlayers() {
      if (this.last_page < this.offset) return
      const t = Trainer.where('available', true).where('display_name', this.search_term)
      if (this.$store.state.club.id !== 26) {
        t.where('club', this.$store.state.club.id)
      } else {
        this.loading = true
        if (this.location.latitude && Object.keys(this.selected).length === 0) {
          t.params({
            latitude: this.location.latitude,
            longitude: this.location.longitude,
          }).orderBy('distance')
        }
        if (Object.keys(this.selected).length) {
          t.params({
            latitude: this.selected.latitude,
            longitude: this.selected.longitude,
          }).orderBy('distance')
        }
      }
      t.limit(100)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.trainers = res.data
          } else {
            this.trainers = [...this.trainers, ...res.data]
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
    },
    submit() {
      const trainer = new Trainer(this.trainer)
      trainer.save().then(() => {
        // TODO: toast
      })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
