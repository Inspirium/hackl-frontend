<template>
  <div class="trainers p-b-200">
    <hero :page="'stringing'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('Pronađi uslugu špananja') }}</h1>
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

    <location class="" @location="setLocation" @update="noLocation()" />
    <div class="activity x-container">
      <!--      <div class="fw600 has-text-centered m-b-5 m-t-5 is-size-5 line-height-16">{{ $t('popis trenera') }}</div>-->
      <div v-if="stringing.length" class="m-t-10">
        <div v-for="(item, index) in stringing" :key="index" class="overflow-hidden br10">
          <div class="overflow-hidden br10 is-white softshadow m-b-10 p-t-10 p-b-7 p-r-7 p-l-10">
            <div class="active list__image-col">
              <nuxt-link :to="localePath('/services/stringing/' + item.id + '/global')" class="fw600 flex flex__column">
                <div v-if="item.main_image.link !== '/product_placeholder.png'" class="">
                  <TennisImage :size="[600, 300]" :src="item.main_image?.link" class="image_stringing_global" alt="" />
                </div>
                <div class="list__content">
                  <div class="flex align__centar__y">
                    <h4 class="fw600 is-size-4 m-t-7 is-size-5">
                      {{ item.name }}
                    </h4>
                  </div>
                  <div class="flex border-color-black10 p-t-3 m-t-5 align__centar__y">
                    <div class="fw600 is-size-65 has-text-black50 flex align__centar__y m-t-5">
                      {{ item.description }}
                    </div>
                  </div>
                  <div
                    class="fw600 is-size-6 m-t-10 p-t-5 p-b-5 has-text-black80 border-color-black10 flex align__centar__y"
                  >
                    <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                    {{ item.club.name }}, {{ item.club.city }}
                  </div>
                  <div class="fw600 is-size-6 p-t-5 p-b-5 has-text-black80 border-color-black10 flex align__centar__y">
                    <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-tag" />
                    {{ item.price | currency }}
                  </div>
                </div>
                <template> </template>
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
import hero from '~/components/Hero'
import City from '~/models/City'
import location from '~/components/GeoLocation'
import ShopProduct from '~/models/ShopProduct'

export default {
  name: 'StringingGlobal',
  components: {
    hero,
    TennisImage,
    location,
  },
  data() {
    return {
      heroImage: '/stringing.jpg',
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
      loading: 1,
      location: {
        latitude: 0,
        longitude: 0,
      },
      stringing: [],
      selected: {},
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
    city() {
      this.debouncedGetCity()
    },
    selected() {
      if (this.selected === null) {
        this.selected = {}
        this.getStringing()
      }
      if (Object.keys(this.selected).length) {
        this.getStringing()
      }
    },
    // bottom(bottom) {
    //   if (bottom && !this.nomore) {
    //     this.offset++
    //     this.getStringing()
    //   }
    // },
  },
  created() {
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
    noLocation() {
      this.getStringing()
    },
    setLocation(data) {
      this.$set(this.location, 'latitude', data.latitude)
      this.$set(this.location, 'longitude', data.longitude)
      this.getStringing()
    },
    getStringing() {
      // if (this.last_page < this.offset) return
      this.loading = true
      const s = ShopProduct.include('club').where('special', 'stringing').where('status', 'active')
      if (this.location.latitude && Object.keys(this.selected).length === 0) {
        s.params({
          latitude: this.location.latitude,
          longitude: this.location.longitude,
        }).orderBy('distance')
      }
      if (Object.keys(this.selected).length) {
        s.params({
          latitude: this.selected.latitude,
          longitude: this.selected.longitude,
        }).orderBy('distance')
      }
      s.limit(50)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.stringing = res.data
          } else {
            this.stringing = [...this.stringing, ...res.data]
          }
          this.total = res.meta.total
          this.last_page = res.meta.last_page
          this.loading = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
