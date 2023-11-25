<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Izvještaji')" :background="'is-primary'" />

    <div class="activity x-container">
      <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19">{{ $t('tereni') }}</div>
      <div class="buttons">
        <b-button
          :class="{ softshadow: true, 'invert-small-button': selectedType === 'all' }"
          :type="{
            'is-bigger': true,
            noborder: true,
            'is-primary has-text-white': selectedType === 'all',
          }"
          pack="fal"
          rounded
          @click="selectedType = 'all'"
        >
          {{ $t('sviTereni') }}
        </b-button>
        <b-button
          :class="{ softshadow: true, 'invert-small-button': selectedType === 'custom' }"
          :type="{
            'is-bigger': true,
            noborder: true,
            'is-primary has-text-white': selectedType === 'custom',
          }"
          pack="fal"
          rounded
          @click="
            selectedType = 'custom'
            selectedCourtsActive = null
            getCourts()
          "
        >
          {{ $t('odaberiTerene') }}
        </b-button>
      </div>
      <div class="divider-line-1 m-t--15"></div>

      <div class="activity__reservation">
        <div v-if="selectedType === 'custom'" class="buttons m-t-5">
          <b-button
            v-for="court in courts"
            :key="court.id"
            :class="{ softshadow: true, 'invert-small-button': selectedCourts.includes(court.id) }"
            :icon-right="selectedCourts.includes(court.id) ? 'times' : ''"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedCourts.includes(court.id),
            }"
            pack="fal"
            rounded
            @click.prevent="selectCourt(court.id)"
          >
            {{ court.name }}
          </b-button>
        </div>
        <div v-else class="buttons m-t-5">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedCourtsActive === 1 }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedCourtsActive === 1,
            }"
            pack="fal"
            rounded
            @click="
              selectedCourtsActive = 1
              getCourts()
            "
          >
            {{ $t('samoAktivni') }}
          </b-button>
          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedCourtsActive === null }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedCourtsActive === null,
            }"
            pack="fal"
            rounded
            @click="
              selectedCourtsActive = null
              getCourts()
            "
          >
            {{ $t('aktivniINeaktivni') }}
          </b-button>
        </div>
        <div class="divider m-t--5"></div>
        <div class="">
          <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19 m-t-5">{{ $t('vremenskiRaspon') }}</div>
          <div class="buttons m-t-20">
            <b-button
              :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'day' }"
              :type="{
                'is-mini': true,
                noborder: true,
                'is-primary has-text-white': selectedTimeSpan === 'day',
              }"
              pack="fal"
              rounded
              @click="selectedTimeSpan = 'day'"
            >
              {{ $t('danas') }}
            </b-button>
            <transition name="slide-fade">
              <b-button
                v-if="selectedTimeSpan === 'day' || selectedTimeSpan === 'yesterday'"
                :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'yesterday' }"
                :type="{
                  'is-mini-transparent': true,
                  noborder: true,
                  'is-primary has-text-white': selectedTimeSpan === 'yesterday',
                }"
                pack="fal"
                rounded
                @click="selectedTimeSpan = 'yesterday'"
              >
                {{ $t('juer') }}
              </b-button>
            </transition>
            <b-button
              :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'week' }"
              :type="{
                'is-mini': true,
                noborder: true,
                'is-primary has-text-white': selectedTimeSpan === 'week',
              }"
              pack="fal"
              rounded
              @click="selectedTimeSpan = 'week'"
            >
              {{ $t('tjedanDana') }}
            </b-button>
            <transition name="slide-fade">
              <b-button
                v-if="selectedTimeSpan === 'week' || selectedTimeSpan === 'last_week'"
                :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_week' }"
                :type="{
                  'is-mini-transparent': true,
                  noborder: true,
                  'is-primary has-text-white': selectedTimeSpan === 'last_week',
                }"
                pack="fal"
                rounded
                @click="selectedTimeSpan = 'last_week'"
              >
                {{ $t('protekliTjedan') }}
              </b-button>
            </transition>
            <b-button
              :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'month' }"
              :type="{
                'is-mini': true,
                noborder: true,
                'is-primary has-text-white': selectedTimeSpan === 'month',
              }"
              pack="fal"
              rounded
              @click="selectedTimeSpan = 'month'"
            >
              {{ $t('mjesecDana') }}
            </b-button>
            <transition name="slide-fade">
              <b-button
                v-if="selectedTimeSpan === 'month' || selectedTimeSpan === 'last_month'"
                :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_month' }"
                :type="{
                  'is-mini-transparent': true,
                  noborder: true,
                  'is-primary has-text-white': selectedTimeSpan === 'last_month',
                }"
                pack="fal"
                rounded
                @click="selectedTimeSpan = 'last_month'"
              >
                {{ $t('protekliMjesec') }}
              </b-button>
            </transition>
            <b-button
              :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'custom' }"
              :type="{
                'is-mini': true,
                noborder: true,
                'is-primary has-text-white': selectedTimeSpan === 'custom',
              }"
              pack="fal"
              rounded
              @click="selectedTimeSpan = 'custom'"
            >
              {{ $t('unesiRaspon') }}
            </b-button>
            <div v-if="selectedTimeSpan === 'custom'" class="m-b-20">
              <div class="fw600 is-size-6 has-text-centered m-b-5">{{ $t('unesiRaspon') }}</div>
              <b-field>
                <b-datepicker
                  v-model="dateRangeStart"
                  :mobile-native="false"
                  :placeholder="$t('klikniOvdjeZaOdabir')"
                  :first-day-of-week="1"
                  trap-focus
                  rounded
                  range
                >
                </b-datepicker>
              </b-field>
            </div>
          </div>
        </div>
        <div class="buttons m-t-20">
          <b-button
            class="fw600"
            type="is-danger"
            pack="fal"
            size="is-medium"
            rounded
            tag="nuxt-link"
            :to="localePath('/admin/membership/new')"
          >
            {{ $t('izradiIzvjetaj') }}
          </b-button>
        </div>
      </div>
      <div class="divider m-t-20"></div>
      <div class="fw600 has-text-centered m-t-10 m-b-5 is-size-3 line-height-19">{{ $t('izvjetaj') }}</div>
      <div class="statistics_new m-b-10 m-t-10 p-t-10 p-b-5 softshadow is-primary">
        <div class="statistic__item">
          <div class="label--center has-text-white">{{ $t('prihodi') }}</div>
          <div class="border-top-transparent"></div>
          <div class="label__num-light is-size-4 has-text-white">
            <span class="has-text-white">{{ '5.458 €' }}</span>
          </div>
        </div>
        <div class="statistic__item">
          <div class="label--center has-text-white">{{ $t('rezervacija') }}</div>
          <div class="border-top-transparent"></div>
          <div class="label__num-light is-size-4 has-text-white">
            <span class="has-text-white">{{ '435' }}</span>
          </div>
        </div>
        <div class="statistic__item">
          <div class="label--center has-text-white">{{ $t('zauzetost') }}</div>
          <div class="border-top-transparent"></div>
          <div class="label__num-light is-size-4 has-text-white">
            <span class="has-text-white">{{ '28%' }}</span>
          </div>
        </div>
      </div>
      <div
        class="fw600 has-text-centered m-t-10 m-b-10 is-size-4 line-height-19 flex align__centar__all"
        @click="$router.push(localePath('/admin/reports/structure'))"
      >
        {{ $t('prihodiPremaTipuRezervacije') }}
        <b-icon
          icon="long-arrow-right"
          type="is-black50"
          pack="fal"
          size="is-smaller-12"
          class="m-t-5 m-l-10 linkarrow"
        ></b-icon>
      </div>
      <div class="statistic__item">
        <div v-if="Object.keys(optionsStructure).length" class="chart__donut">
          <VueApexCharts
            type="donut"
            :height="200"
            :options="optionsStructure"
            :labels="structureTypeGraphLabel"
            :series="structureTypeGraph"
          ></VueApexCharts>
        </div>
      </div>

      <div class="activity__box action__buttons m-t-10">
        <div v-for="(item, index) in structureType" :key="index" class="action__item__small fw600">
          <nuxt-link class="is-size-55 has-text-black80 m-r-5" :to="localePath('/admin/reports/structure')">{{
            item.name
          }}</nuxt-link>
          <span class="m-l-auto has-text-lightblue m-t--2">{{ item.precentage }}%</span>
          <span>
            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-5 m-r--5"> </b-icon>
          </span>
        </div>
      </div>
      <div class="fw600 has-text-centered m-t-30 m-b-10 is-size-4 line-height-19 flex align__centar__all">
        {{ $t('prihodiPoTerenu') }}
      </div>
      <div class="statistic__item">
        <div v-if="Object.keys(optionsStructure).length" class="chart__donut">
          <VueApexCharts type="donut" :height="200" :options="optionsCourts" :series="courtGraph"></VueApexCharts>
        </div>
      </div>

      <div v-for="item in courts" :key="item.id">
        <div class="fw600 has-text-centered m-t-10 is-size-55 line-height-19 flex align__centar__all">
          {{ item.name }}
          <b-icon
            icon="long-arrow-right"
            type="is-black50"
            pack="fal"
            size="is-smaller-12"
            class="m-t-5 m-l-10 linkarrow"
          ></b-icon>
        </div>
        <div class="statistics_new m-b-10 m-t-5 p-t-10 p-b-5 softshadow">
          <div class="statistic__item">
            <div class="label--center">{{ $t('prihodi') }}</div>
            <div class="label__num is-size-4">
              <span class="">{{ '5.458 €' }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('rezervacija') }}</div>
            <div class="label__num is-size-4">
              <span class="">{{ '435' }}</span>
            </div>
          </div>
          <div class="statistic__item">
            <div class="label--center">{{ $t('zauzetost') }}</div>
            <div class="label__num is-size-4">
              <span class="">{{ '28%' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import Court from '~/models/Court'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Reports',
  components: {
    PageHeader,
    VueApexCharts,
  },
  data() {
    return {
      selectedType: 'all',
      selectedCourtsActive: 1,
      selectedTimeSpan: 'day',
      selectedCourts: [],
      courts: [],
      dates: [],
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
    optionsStructure() {
      return {
        colors: ['#ff3860', '#9acd32', '#209cee', '#F18F01', '#B68CB8'],
        labels: [...this.structureTypeGraphLabel],
        chartOptions: {
          chart: {
            id: 'reservation-structure',
            type: 'pie',
            width: '100%',
            parentHeightOffset: 0,
          },
        },
        stroke: {
          show: false,
        },
        legend: {
          show: true,
          fontSize: '16px',
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: 600,
          itemMargin: {
            vertical: 5,
          },
        },
        dataLabels: {
          style: {
            fontSize: '16px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
          },
          formatter(val, opts) {
            return Math.round(val) + '%'
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.2,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '0%',
              background: 'transparent',
            },
          },
        },
      }
    },
    optionsCourts() {
      return {
        colors: ['#ff3860', '#9acd32', '#209cee', '#F18F01', '#B68CB8'],
        labels: [...this.courtGraphLabel],
        chartOptions: {
          chart: {
            id: 'reservation-structure',
            type: 'pie',
            width: '100%',
            parentHeightOffset: 0,
          },
        },
        stroke: {
          show: false,
        },
        legend: {
          show: true,
          fontSize: '16px',
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: 600,
          itemMargin: {
            vertical: 5,
          },
        },
        dataLabels: {
          style: {
            fontSize: '16px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
          },
          formatter(val, opts) {
            return Math.round(val) + '%'
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.2,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '0%',
              background: 'transparent',
            },
          },
        },
      }
    },
    structureTypeGraph() {
      const x = []
      for (let i = 0; i < this.structureType.length; i++) {
        x.push(this.structureType[i].precentage)
      }
      return x
    },
    structureTypeGraphLabel() {
      const x = []
      for (let i = 0; i < this.structureType.length; i++) {
        x.push(this.structureType[i].name)
      }
      return x
    },
    courtGraph() {
      const x = []
      for (let i = 0; i < this.courts.length; i++) {
        x.push(this.courts[i].id)
      }
      return x
    },
    courtGraphLabel() {
      const x = []
      for (let i = 0; i < this.courts.length; i++) {
        x.push(this.courts[i].name)
      }
      return x
    },
  },
  mounted() {
    this.getCourts()
  },
  methods: {
    selectCourt(item) {
      if (this.selectedCourts.includes(item)) {
        this.selectedCourts.splice(this.selectedCourts.indexOf(item), 1)
      } else {
        this.selectedCourts.push(item)
      }
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
  },
}
</script>
