<template>
  <div>
    <PageHeader :title="$t('Popis mjesnih odbora')" />

    <location class="" @location="setLocation" @update="noLocation()" />
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

        <template v-if="clubs.length">
          <div v-if="location.latitude !== 0" class="fw600 is-size-55 m-l-5 m-t-10 m-b-10">{{ $t('klubovi') }}</div>
          <b-table :data="clubs" :mobile-cards="false" :bordered="false" class="p-b-75">
            <b-table-column v-slot="props">
              <nuxt-link :to="localePath('/clubs/' + props.row.id)" class="fw600">
                <div class="list__img align__centar__y">
                  <TennisImage :size="[42, 42]" :src="props.row.logo" class="user_image" alt="" />
                  <h4 class="fw600 is-size-5 m-l-7">
                    {{ props.row.name }}
                  </h4>
                </div>
                <div class="flex align__centar__all justify-between w100">
                  <div class="list__content m-t-5">
                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon class="m-r-3 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                      <span class="has-text-black50">{{ props.row.city }}</span>
                    </h3>
                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon class="m-r-3 has-text-lightblue iw08" icon="fa-light fa-arrow-pointer" />
                      <span class="has-text-black50">{{ props.row.subdomain }}.inspirium.hr</span>
                    </h3>
                    <h3 class="fw600 has-text-lightblue is-size-65 flex align__centar__y">
                      <font-awesome-icon
                        :class="
                          props.row.validate_user === 1 ? 'm-r-3 has-text-danger iw08' : 'm-r-3 has-text-success iw08'
                        "
                        :icon="props.row.validate_user === 1 ? 'fa-light fa-shield-xmark' : 'fa-light fa-shield-check'"
                      />
                      <span class="has-text-black50">{{
                        props.row.validate_user === 1 ? $t('Potrebna potvrda voditelja') : $t('Slobodne rezervacije')
                      }}</span>
                    </h3>
                  </div>

                  <div class="action m-l-auto">
                    <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" type="is-black50" pack="fal">
                    </b-icon>
                  </div>
                </div>
              </nuxt-link>
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
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'
import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'
import location from '~/components/GeoLocation'

export default {
  name: 'Clubs',
  components: {
    PageHeader,
    TennisImage,
    location,
  },
  data() {
    return {
      heroImage: '/hero_clubs.jpg',
      clubs: [],
      clubsMeta: '',
      isModalActive: false,
      loading: false,
      nomore: false,
      paymentList: [],
      search_term: '',
      counter: 0,
      bottom: '',
      offset: 1,
      location: {
        latitude: 0,
        longitude: 0,
      },
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
      this.nomore = false
      this.debouncedGetClubs()
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getClubs()
      }
    },
  },
  created() {
    this.debouncedGetClubs = _.debounce(this.getClubs, 500)
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getClubs()
  },
  methods: {
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    search_icon_click() {
      this.search_term = ''
    },
    noLocation() {
      this.getClubs()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.getClubs()
    },
    schoolMembers(data) {
      this.$set(this.newSchoolGroup, 'users', data)
    },
    getClubs() {
      this.counter++
      this.loading = true
      if (this.location.latitude && this.location.longitude) {
        Club.page(this.offset)
          .where('is_active', true)
          .where('name', this.search_term)
          .params({
            latitude: this.location.latitude,
            longitude: this.location.longitude,
          })
          .orderBy('distance')
          .get()
          .then((res) => {
            if (this.offset === 1) {
              this.clubs = res.data
            } else {
              this.clubs = [...this.clubs, ...res.data]
            }
            if (res.meta.last_page === this.offset) {
              this.nomore = true
            }
            this.clubsMeta = res.meta
            this.loading = false
          })
      } else {
        Club.where('is_active', true)
          .get()
          .then((res) => {
            if (this.offset === 1) {
              this.clubs = res.data
            } else {
              this.clubs = [...this.clubs, ...res.data]
            }
            if (res.meta.last_page === this.offset) {
              this.nomore = true
            }
            this.loading = false
          })
      }
    },
  },
}
</script>
