<template>
  <div class="p-b-150">
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
        <reports-time-range :default-selected="'this_year'" @timespan="timerange($event)" />
        <div class="divider-line-1 m-t-15"></div>
        <!--        <template>-->
        <!--          <div class="buttons m-t-20 m-b-2">-->
        <!--            <b-button-->
        <!--              :type="{-->
        <!--                'is-small': true,-->
        <!--                noborder: true,-->
        <!--                'is-danger has-text-white': showFilter,-->
        <!--              }"-->
        <!--              :class="{ softshadow: true, 'invert-small-button': showFilter }"-->
        <!--              pack="fal"-->
        <!--              :icon-right="!showFilter ? 'filter' : 'times'"-->
        <!--              rounded-->
        <!--              @click="showFilter = !showFilter"-->
        <!--            >-->
        <!--              {{ $t('filtriraj') }}-->
        <!--            </b-button>-->
        <!--          </div>-->

        <!--          <div v-if="!showFilter" class="divider-line-1 m-t-0" />-->
        <!--          <transition name="fade" mode="out-in">-->
        <!--            <div v-if="showFilter">-->
        <!--              <div class="fw600 has-text-centered w100 has-text-lightblue m-t-5 m-b-10 is-size-6">-->
        <!--                {{ $t('Vrsta plaćanja') }}-->
        <!--              </div>-->
        <!--              <div class="buttons m-t-5 m-b-5">-->
        <!--                <b-button-->
        <!--                  v-for="(item, index) in invoice_type"-->
        <!--                  :key="index"-->
        <!--                  class="m-t-5 m-b-5 m-l-5 m-r-5"-->
        <!--                  :class="{ softshadow: true, 'invert-small-button': selected_invoice_type.name === item.name }"-->
        <!--                  :type="{-->
        <!--                    'is-small': true,-->
        <!--                    noborder: true,-->
        <!--                    'is-primary has-text-white': selected_invoice_type.name === item.name,-->
        <!--                  }"-->
        <!--                  pack="fal"-->
        <!--                  rounded-->
        <!--                  @click.prevent="updateType(item)"-->
        <!--                >-->
        <!--                  {{ $t(item.name) }}-->
        <!--                </b-button>-->
        <!--              </div>-->
        <!--              <div class="divider-line-1 m-b-30"></div>-->
        <!--            </div>-->
        <!--          </transition>-->
        <!--        </template>-->

        <div class="buttons m-t-20">
          <b-button
            :loading="loading"
            class="fw600"
            type="is-primary"
            pack="fal"
            size="is-medium"
            rounded
            @click="exportReportFront()"
          >
            {{ $t('izradiIzvjetaj') }}
          </b-button>
        </div>
      </div>
      <div v-if="Object.keys(report).length" class="divider m-t-20"></div>
      <div class="statistic__item m-t-20">
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
          <span class="m-l-auto has-text-lightblue m-t--2">{{ item.totalAmount | currency }}</span>
          <!--          <span>-->
          <!--            <b-icon icon="chevron-right" type="is-black50" pack="fal" class="m-l-5 m-r&#45;&#45;5"> </b-icon>-->
          <!--          </span>-->
        </div>
      </div>
      <div v-if="Object.keys(report).length" class="buttons m-t-50">
        <b-button
          class="softshadow m-b-10"
          type="is-primary"
          pack="fal"
          icon-right="file-excel"
          size="is-medium"
          rounded
          @click="exportReport()"
        >
          {{ $t('Preuzmi Excel') }}
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import Court from '~/models/Court'
import ExportInvoice from '~/models/Export/Invoice'

export default {
  name: 'Reports',
  components: {
    VueApexCharts,
  },
  data() {
    return {
      loading: false,
      showFilter: false,
      selectedType: 'all',
      selectedCourtsActive: 1,
      selected_invoice_type: {},
      selectedTimeSpan: 'day',
      selectedCourts: [],
      courts: [],
      dates: [],
      report: '',
      payment_method: '',
      reservationTimeRange: 'Sve',
      invoice_type: [{ name: 'Sve' }, { name: 'cash' }, { name: 'card' }],
      structureType1: [
        { name: 'Gotovina', precentage: 67 },
        { name: 'Kartica', precentage: 21 },
        { name: 'AccontationAccount', precentage: 9 },
      ],
    }
  },
  computed: {
    structureType() {
      const totalAmount = Object.values(this.report).reduce((sum, method) => sum + method.amount, 0)

      return Object.entries(this.report).map(([key, method]) => ({
        name: method.method,
        percentage: parseFloat(((method.amount / totalAmount) * 100).toFixed(2)),
        totalAmount: method.total_amount,
        taxAmount: method.tax_amount,
      }))
    },
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
      const values = Object.values(this.structureType) // Assuming this.structureType1 is an object

      for (let i = 0; i < values.length; i++) {
        x.push(values[i].percentage)
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
    timerange(item) {
      if (item === 'Sve') {
        this.reservationTimeRange = ''
      } else if (item === 'Custom') {
        this.reservationTimeRange = item
      } else {
        this.reservationTimeRange = item
      }
    },
    updateType(item) {
      this.selected_invoice_type = item
      this.offset = 1
    },
    async exportReport() {
      await this.exportReportFront()
      const file = await ExportInvoice.where('club', this.$store.state.club.id)
        .where('active_between', this.reservationTimeRange)
        .whereIn('courts', this.selectedCourts)
        // .where('payment_method', this.selected_invoice_type)
        .file()
      const url = window.URL.createObjectURL(new Blob([file]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'report_invoice.xlsx')
      document.body.appendChild(link)
      link.click()
    },
    async exportReportFront() {
      try {
        this.loading = true // Set loading state to true

        const x = await ExportInvoice.where('club', this.$store.state.club.id)
          .where('active_between', this.reservationTimeRange)
          .whereIn('courts', this.selectedCourts)
          // .where('payment_method', this.selected_invoice_type)
          .get()

        this.report = x[0]
      } catch (error) {
        // Handle any errors here
        console.error(error)
      } finally {
        this.loading = false // Set loading state back to false, regardless of success or failure
      }
    },
    getReservations() {
      this.loading = true
      // const rc = new ReservationCount()
      // rc.where('active_between', this.activeReservation ? this.activeReservationSpan : this.reservationTimeRange)
      //   .limit(40)
      //   .orderBy('-inactive_reservations_count')
      //   .get()
      //   .then((res) => {
      //     this.reservations = res
      //     this.loading = false
      //   })
    },
  },
}
</script>
