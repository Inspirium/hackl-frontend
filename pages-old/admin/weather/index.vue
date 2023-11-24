<template>
  <div class="home p-b-200">
    <PageHeader :title="$t('Vremenske neprilike')" :background="'is-primary'" />
    <div class="relative p-x-16 m-t-20">
      <template>
        <!--        <div class="fw600 has-text-centered w100 m-t-20 has-text-lightblue is-size-6">-->
        <!--          {{ $t('Prema statusu') }}-->
        <!--        </div>-->
        <!--        <div class="buttons m-t-5 m-b-5">-->
        <!--          <b-button-->
        <!--            v-for="(item, index) in status"-->
        <!--            :key="index"-->
        <!--            class="m-t-5 m-b-5 m-l-5 m-r-5"-->
        <!--            :class="{ softshadow: true, 'invert-small-button': selectedStatus.name === item.name }"-->
        <!--            :icon-right="selectedStatus.name === item.name ? 'check' : ''"-->
        <!--            :type="{-->
        <!--              'is-small': true,-->
        <!--              noborder: true,-->
        <!--              'is-primary has-text-white': selectedStatus.name === item.name,-->
        <!--            }"-->
        <!--            pack="fal"-->
        <!--            rounded-->
        <!--            @click.prevent="updateStatus(item)"-->
        <!--          >-->
        <!--            {{ $t(item.name) }}-->
        <!--          </b-button>-->
        <!--        </div>-->
        <div class="fw600 has-text-centered w100 m-t-20 is-size-5 m-b-15">
          {{ $t('Popis posljednjih prekida igre') }}
        </div>
        <div v-if="groupedEvents.length" class="is-white radius__12 overflow-hidden softshadow">
          <div class="bb1-10"></div>
          <div v-for="(item, index) in groupedEvents" :key="index" class="p-r-10 p-l-10 p-t-5 p-b-10 bb1-10">
            <div class="fw600 align__centar__all">
              <div class="list__content">
                <div class="align__centar__y">
                  <h4 class="has-text-grey fw600 is-size-7">
                    {{ item[0].created_at | moment('DD. MMMM YYYY.') }}
                  </h4>
                </div>
                <span v-for="court in item" :key="court.id" class="m-r-5 inlineblock">
                  <span class="fw600 is-size-6 m-t--2 has-text-lightblue line-height-12"
                    >{{ court.court.name }} •
                  </span>
                </span>
                <h3 class="fw600 has-text-black80 is-size-65 m-t-4">
                  {{ $t('Zadao') }}:
                  <span class="">{{ item[0].created_by.display_name }}</span>
                </h3>
                <h3 class="fw600 has-text-black80 is-size-65 m-t-2">
                  {{ $t('Vrijeme prekida') }}:
                  <span class="has-text-danger"
                    >{{ item[0].from | moment('HH:mm') }} — {{ item[0].to | moment('HH:mm') }} h</span
                  >
                </h3>
              </div>
              <div class="flex flex__column justify-start">
                <!--                              <h3 v-if="item[0].orderable_id" class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">-->
                <!--                                {{ $t('key5', { currency: item[0].orderable.total }) | currency }}-->
                <!--                              </h3>-->
                <div v-if="true" class="fw600 is-size-5">
                  {{ formatTimeDifference(item[0].from, item[0].to) }}
                </div>
              </div>
            </div>
          </div>
          <div class="buttons m-t-20 m-b-5">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="plus"
              rounded
              :loading="loading"
              @click="
                offset++
                getClosedRange()
              "
            >
              {{ $t('Učitaj više') }}
            </b-button>
          </div>
        </div>
        <template v-if="!loading && !closedRange.length">
          <section class="section has-text-centered m-t-20">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
              {{ $t('nemaPodataka') }}
            </div>
          </section>
        </template>
      </template>
      <!--      <transition v-if="loading" name="fade">-->
      <!--        <div class="align__centar__x m-t-30 loading_z_spinner&#45;&#45;bottom">-->
      <!--          <b-icon-->
      <!--            class="comment-send"-->
      <!--            custom-class="rotating"-->
      <!--            icon="spinner"-->
      <!--            size="is-large"-->
      <!--            type="is-primary"-->
      <!--            pack="far"-->
      <!--          ></b-icon>-->
      <!--        </div>-->
      <!--      </transition>-->
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'
import CourtWeatherUpdate from '~/models/CourtWeatherUpdate'

export default {
  name: 'WeatherBreaks',
  components: {
    PageHeader,
  },
  data() {
    return {
      closedRange: [],
      total: 0,
      bottom: false,
      status: [{ name: 'all' }, { name: 'pending' }, { name: 'completed' }, { name: 'cancelled' }],
      selectedStatus: { name: 'all' },
      last_page: 0,
      offset: 1,
      loading: false,
      reservationTimeRange: '',
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    groupedEvents() {
      const tolerance = 60000 // 1 minute in milliseconds
      const grouped = []
      this.closedRange.forEach((event) => {
        const group = grouped.find((group) => {
          // Check if the "from" and "to" values are within the tolerance range
          return (
            Math.abs(new Date(event.from) - new Date(group[0].from)) <= tolerance &&
            Math.abs(new Date(event.to) - new Date(group[0].to)) <= tolerance
          )
        })
        if (group) {
          group.push(event)
        } else {
          grouped.push([event])
        }
      })
      return grouped
    },
  },
  watch: {
    // bottom(bottom) {
    //   if (bottom) {
    //     this.offset++
    //     this.getClosedRange()
    //   }
    // },
  },
  mounted() {
    this.getClosedRange()
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  methods: {
    formatTimeDifference(from, to) {
      // Parse the 'from' and 'to' timestamps using Moment.js
      const fromTime = this.$moment(from)
      const toTime = this.$moment(to)

      // Calculate the time difference
      const duration = this.$moment.duration(toTime.diff(fromTime))

      // Format the duration
      const hours = duration.hours()
      const minutes = duration.minutes()
      const formattedMinutes = String(minutes).padStart(2, '0')

      if (hours === 0) {
        return `:${formattedMinutes}`
      }
      return `${hours}:${formattedMinutes}`
    },
    getClosedRange() {
      this.loading = true
      CourtWeatherUpdate.include('court', 'createdBy')
        .page(this.offset)
        .where('club', this.club.id)
        .orderBy('-created_at')
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.closedRange = res.data
          } else {
            this.closedRange = [...this.closedRange, ...res.data]
          }
          this.last_page = res.meta.last_page
          this.loading = false
          if (this.offset === 1) {
            this.offset++
            this.getClosedRange()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    returnBckg(item) {
      if (item.status === 'pending') {
        return 'is-primary has-text-white'
      } else if (item.status === 'completed') {
        return 'green has-text-white'
      } else if (item.status === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
