<template>
  <div class="">
    <div class="fw600 has-text-centered m-b-20 is-size-4 line-height-19 m-t-5">{{ $t('vremenskiRaspon') }}</div>
    <div class="buttons m-t-20">
      <b-button
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'max' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'max',
        }"
        pack="fal"
        rounded
        @click="selectedTime('max')"
      >
        {{ $t('sve') }}
      </b-button>
      <b-button
        v-if="show.day"
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'day' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'day',
        }"
        pack="fal"
        rounded
        @click="selectedTime('day')"
      >
        {{ $t('danas') }}
      </b-button>
      <transition name="slide-fade">
        <b-button
          v-if="(selectedTimeSpan === 'day' || selectedTimeSpan === 'yesterday') && show.yesterday"
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'yesterday' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'yesterday',
          }"
          pack="fal"
          rounded
          @click="selectedTime('yesterday')"
        >
          {{ $t('juer') }}
        </b-button>
      </transition>
      <b-button
        v-if="show.week"
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'week' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'week',
        }"
        pack="fal"
        rounded
        @click="selectedTime('week')"
      >
        {{ $t('tjedanDana') }}
      </b-button>
      <transition name="slide-fade">
        <b-button
          v-if="(selectedTimeSpan === 'week' || selectedTimeSpan === 'last_week') && show.last_week"
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_week' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'last_week',
          }"
          pack="fal"
          rounded
          @click="selectedTime('last_week')"
        >
          {{ $t('protekliTjedan') }}
        </b-button>
      </transition>
      <b-button
        v-if="show.month"
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'month' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'month',
        }"
        pack="fal"
        rounded
        @click="selectedTime('month')"
      >
        {{ $t('mjesecDana') }}
      </b-button>
      <transition name="slide-fade">
        <b-button
          v-if="
            (selectedTimeSpan === 'month' || selectedTimeSpan === 'this_month' || selectedTimeSpan === 'last_month') &&
            show.this_month
          "
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'this_month' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'this_month',
          }"
          pack="fal"
          rounded
          @click="selectedTime('this_month')"
        >
          {{ $t('Ovaj mjesec') }}
        </b-button>
      </transition>
      <transition name="slide-fade">
        <b-button
          v-if="
            (selectedTimeSpan === 'month' || selectedTimeSpan === 'last_month' || selectedTimeSpan === 'this_month') &&
            show.last_month
          "
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_month' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'last_month',
          }"
          pack="fal"
          rounded
          @click="selectedTime('last_month')"
        >
          {{ $t('protekliMjesec') }}
        </b-button>
      </transition>

      <b-button
        v-if="show.last_365"
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_365' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'last_365',
        }"
        pack="fal"
        rounded
        @click="selectedTime('last_365')"
      >
        {{ $t('godinaDana') }}
      </b-button>
      <transition name="slide-fade">
        <b-button
          v-if="
            (selectedTimeSpan === 'last_365' || selectedTimeSpan === 'this_year' || selectedTimeSpan === 'last_year') &&
            show.this_year
          "
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'this_year' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'this_year',
          }"
          pack="fal"
          rounded
          @click="selectedTime('this_year')"
        >
          {{ $t('ovaGodina') }}
        </b-button>
      </transition>
      <transition name="slide-fade">
        <b-button
          v-if="
            (selectedTimeSpan === 'last_365' || selectedTimeSpan === 'this_year' || selectedTimeSpan === 'last_year') &&
            show.this_year
          "
          :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'last_year' }"
          :type="{
            'is-mini-transparent': true,
            noborder: true,
            'is-primary has-text-white': selectedTimeSpan === 'last_year',
          }"
          pack="fal"
          rounded
          @click="selectedTime('last_year')"
        >
          {{ $t('prolaGodina') }}
        </b-button>
      </transition>
      <b-button
        v-if="show.custom"
        :class="{ softshadow: true, 'invert-small-button': selectedTimeSpan === 'custom' }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedTimeSpan === 'custom',
        }"
        pack="fal"
        rounded
        @click="selectedTime('custom')"
      >
        {{ $t('unesiRaspon') }}
      </b-button>
    </div>
    <div v-if="selectedTimeSpan === 'custom'" class="m-b-20 m-t--10 block">
      <!--      <div class="fw600 is-size-6 has-text-centered m-b-5">Unesi raspon</div>-->
      <b-field>
        <b-datepicker
          v-model="dates"
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

    <div
      v-if="selectedTimeSpan !== 'max' && selectedTimeSpan !== 'custom'"
      class="fw500 has-text-centered has-text-black30 is-size-55 m-t--10 flex align__centar__all"
    >
      {{
        selectedTimeSpanDateMin === selectedTimeSpanDateMax
          ? $moment(selectedTimeSpanDateMin).format('DD.MM.YYYY.')
          : $moment(selectedTimeSpanDateMin).format('DD.MM.YYYY.') +
            ' — ' +
            $moment(selectedTimeSpanDateMax).format('DD.MM.YYYY.')
      }}
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'

export default {
  name: 'TimeRange',
  components: {},
  props: {
    defaultSelected: {
      type: String,
      required: false,
      default: '',
    },
    show: {
      type: Object,
      required: false,
      default() {
        return {
          day: true,
          yesterday: true,
          week: true,
          last_week: true,
          month: true,
          this_month: true,
          last_month: true,
          last_365: true,
          this_year: true,
          last_year: true,
          custom: true,
        }
      },
    },
  },
  data() {
    return {
      selectedTimeSpan: 'max',
      selectedTimeSpanDateMin: null,
      selectedTimeSpanDateMax: null,
      dates: [],
    }
  },
  computed: {
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    reformat() {
      if (this.dates.length) {
        return (
          this.$moment(this.dates[0]).format('YYYY-MM-DD') +
          ',' +
          this.$moment(this.dates[1]).add(1, 'd').format('YYYY-MM-DD')
        )
      } else {
        return this.selectedTimeSpanDateMin + ',' + this.selectedTimeSpanDateMax
      }
    },
  },
  watch: {
    selectedTimeSpan(item) {
      if (item !== 'max' && item !== 'custom') {
        this.dates = []
        this.$emit('timespan', this.reformat)
      } else if (item === 'max') {
        this.$emit('timespan', 'Sve')
      }
    },
    dates() {
      if (this.dates.length) {
        this.selectedTimeSpanDateMin = this.dates[0]
        this.selectedTimeSpanDateMax = this.dates[1]
        this.$emit('timespan', this.reformat)
      }
    },
    defaultSelected: {
      immediate: true,
      handler() {
        if (this.defaultSelected !== '') {
          this.selectedTime(this.defaultSelected)
        }
      },
    },
  },
  methods: {
    selectedTime(span) {
      this.selectedTimeSpan = span
      switch (span) {
        case 'day':
          this.selectedTimeSpanDateMin = this.today
          this.selectedTimeSpanDateMax = this.$moment().add(1, 'd').format('YYYY-MM-DD')
          break
        case 'yesterday':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'd').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.today
          break
        case 'week':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'w').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.today
          break
        case 'last_week':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'w').startOf('w').add(1, 'd').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.$moment().subtract(1, 'w').endOf('w').add(1, 'd').format('YYYY-MM-DD')
          break
        case 'month':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'month').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.today
          break
        case 'this_month':
          this.selectedTimeSpanDateMin = this.$moment().startOf('month').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.$moment().add(1, 'd').format('YYYY-MM-DD')
          break
        case 'last_month':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.$moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
          break
        case 'last_365':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'year').startOf('day').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.today
          break
        case 'this_year':
          this.selectedTimeSpanDateMin = this.$moment().startOf('year').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.$moment().add(1, 'd').format('YYYY-MM-DD')
          break
        case 'last_year':
          this.selectedTimeSpanDateMin = this.$moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
          this.selectedTimeSpanDateMax = this.$moment().startOf('year').format('YYYY-MM-DD')
          break
      }
    },
  },
}
</script>
