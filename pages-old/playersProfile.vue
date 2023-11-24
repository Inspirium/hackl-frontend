<template>
  <div class="players-profile">
    <!--    <div class="breadcrumbs breadcrumbs-back m-t-10">-->
    <!--      <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">-->
    <!--        <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>-->
    <!--        <span class="m-r-5">Nazad</span>-->
    <!--      </a>-->
    <!--    </div>-->
    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">
      <div class="is-text-center fw600 is-size-3 p-l-10 p-r-10">{{ $t('profilirajIgraa') }}</div>
    </div>
    <div class="align__centar__all m-b-10 m-t-20">
      <TennisImage
        :size="[42, 42]"
        :src="user.image"
        class="user_image-medium m-r-10 border__white--4 softshadow2"
        alt=""
      />
      <div class="">
        <div class="fw600 is-size-4">{{ user.display_name }}</div>
        <div class="fw600 is-size-65 has-text-lightblue">
          {{ $t('bodova2', { round: Math.round(user.team.rating_club) }) }}
        </div>
      </div>
    </div>
    <div class="x-container p-l-5 p-r-5 p-b-150">
      <div
        :class="['fw600', 'has-text-centered', 'm-b-5', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
      >
        {{ $t('igra3') }}
      </div>
      <div class="p-l-15 p-r-15 p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered">
        {{ $t('profilirajIgraevOpenitiStilIgre') }}
      </div>
      <div class="relative m-b-10">
        <div class="fw600 is-size-65 profile-indicator-shade is-size-6 m-r-5">{{ $t('ofenzivna') }}</div>
        <b-field :label="$t('defanzivna')">
          <b-slider v-model="type" :tooltip="true" size="is-large" type="is-info" indicator></b-slider>
        </b-field>
      </div>
      <b-field :label="$t('brzina')">
        <b-slider v-model="speed" :tooltip="true" size="is-large" type="is-info" indicator></b-slider>
      </b-field>
      <div class="divider-line-1 m-t-0"></div>
      <div
        :class="['fw600', 'has-text-centered', 'm-b-5', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
      >
        {{ $t('udarci') }}
      </div>

      <div class="p-l-15 p-r-15 p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered">
        {{ $t('profilirajIgraeveUdaraceIspodIIzndaprosjenoObzirom') }}
      </div>
      <div class="flex align__centar__y m-b-5 justify-between">
        <div class="fw600 is-size-65 is-uppercase relative m-r-10 has-text-danger">{{ $t('ispodprosjeno') }}</div>
        <div class="fw600 is-size-65 is-uppercase relative m-l-10 has-text-darkgreen has-text-right">
          {{ $t('iznadprosjeno') }}
        </div>
      </div>
      <div class="profile-indicator-legend m-b-20 h1"></div>

      <div v-for="(option, index) in strokes" :key="index" class="relative">
        <b-field :label="$t(strokesNames[index])">
          <!--          <div :style="indicatorWidth(index)" class="profile-indicator-shader"></div>-->
          <div class="fw600 is-size-65 profile-indicator-shade m-r-5">{{ Math.round(strokes[index]) }}</div>
          <input
            :id="'slider' + index"
            v-model.number="strokes[index]"
            type="range"
            :min="min"
            :max="max"
            step="0.01"
            @input="changeStroke(index)"
          />
        </b-field>
      </div>
      <template v-if="false">
        <b-field :label="$t('servis')">
          <b-slider
            v-model="service"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>

        <b-field :label="$t('forhand')">
          <b-slider
            v-model="forhand"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
        <b-field :label="$t('backend')">
          <b-slider
            v-model="backend"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
        <b-field :label="$t('igraSOsnovneLinije')">
          <b-slider
            v-model="baseline"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>

        <b-field :label="$t('volej')">
          <b-slider
            v-model="volley"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
        <b-field :label="$t('slice')">
          <b-slider
            v-model="slice"
            :custom-formatter="(val) => val + '%'"
            :tooltip="true"
            size="is-medium"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
      </template>
    </div>
    <!--    Novi dio-->

    <div class="x-container p-l-5 p-r-5 p-b-150">
      <div
        :class="['fw600', 'has-text-centered', 'm-b-5', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
      >
        {{ $t('igra3') }}
      </div>
      <div class="p-l-15 p-r-15 p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered">
        {{ $t('profilStilaIgre') }}
      </div>
      <div class="relative m-b-10">
        <div class="fw600 is-size-65 profile-indicator-shade is-size-6 m-r-5">{{ $t('ofenzivna') }}</div>
        <b-field :label="$t('defanzivna')">
          <b-slider v-model="type" :tooltip="true" disabled size="is-large" type="is-info" indicator></b-slider>
        </b-field>
      </div>
      <b-field :label="$t('brzina')">
        <b-slider v-model="speed" :tooltip="true" disabled size="is-large" type="is-info" indicator></b-slider>
      </b-field>
      <div class="divider-line-1 m-t-0"></div>
      <div
        :class="['fw600', 'has-text-centered', 'm-b-5', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
      >
        {{ $t('udarci') }}
      </div>
      <div class="p-t-5 p-b-20 fw600 is-size-65 has-text-black50 has-text-centered">
        {{ $t('profilIgraevihUdaraca') }}
      </div>
      <div class="flex align__centar__y m-b-5 justify-between">
        <div class="fw600 is-size-65 is-uppercase relative m-r-10">{{ $t('ispodprosjeno') }}</div>
        <div class="fw600 is-size-65 is-uppercase relative m-l-10 has-text-right">{{ $t('iznadprosjeno') }}</div>
      </div>
      <div class="profile-indicator-legend m-b-20 h1"></div>

      <div v-for="(option, index) in strokes" :key="index" class="relative">
        <b-field :label="$t(strokesNames[index])">
          <div class="profile-indicator-legend m-b-20 h4"></div>
          <!--          <div class="absolute h8 m-t&#45;&#45;3" :style="indicatorWidth(index)">-->
          <!--            <div class="absolute profile-indicator-legend w100 h8" />-->
          <!--          </div>-->
          <div class="absolute profile-agregate-thumb" :style="indicatorAgregateSum(index)"></div>
          <div class="fw600 is-size-65 profile-indicator-shade m-r-5">{{ Math.round(strokesAgregateSum[index]) }}</div>
          <div
            v-for="(item, i) in strokesAgregate"
            :key="i"
            class="profile-indicator-player"
            :style="indicatorAgregate(i, index)"
          ></div>
        </b-field>
      </div>
      <div class="fw600 has-text-right is-size-6 m-b-10">{{ $t('igraiKojiSuProfilirali') }}</div>
      <div
        class="m-l-auto"
        style="transition: 0.3s all"
        :class="expand ? 'club-logo-list-display--extend' : 'club-logo-list-display'"
      >
        <div
          v-for="(profiler, index) in playerList"
          :key="profiler.id"
          style="transition: 0.3s all"
          class="flex justify-content-end align__centar__y m-b-5 m-t-10"
          @click="expand = true"
        >
          <div style="transition: 0.3s all" class="fw600 is-size-65 has-text-black80 name m-r-10">
            {{ profiler.name }}
          </div>
          <TennisImage
            :size="[42, 42]"
            style="transition: 0.3s all"
            :src="profiler.user_image"
            class="user_image-small border__white softshadow"
            alt=""
          />

          <div v-if="expand" class="m-l-10">
            <div
              class="softshadow radius__full p-l-15 p-r-15 p-t-3 p-b-3 is-size-65 fw600 transition"
              :class="[selectedProfiler === index ? ['is-primary', 'has-text-white'] : 'is-white']"
              rounded
              @click="selectedProfiler === index ? (selectedProfiler = null) : (selectedProfiler = index)"
            >
              {{ selectedProfiler === index ? $t('Odabran') : $t('Odaberi') }}
            </div>
          </div>
        </div>
        <span class="flex align__centar__y justify-content-end" :class="{ 'm-t-20': expand }" @click="expand = !expand">
          <div v-if="expand" class="fw600 has-text-danger is-size-65 is-uppercase">{{ $t('zatvori') }}</div>
          <b-icon
            class="m-l-5 transition"
            :class="{ 'm-t-0': expand, 'm-t-10': !expand }"
            pack="fal"
            size="is-smaller"
            :style="expand ? 'transform: rotate(180deg);' : ''"
            icon="chevron-down"
          />
        </span>
      </div>
    </div>
    <div class="profile-display">
      <div class="chart__donut">
        <VueApexCharts type="radar" :options="optionsSmall" :series="series"></VueApexCharts>
      </div>
    </div>
    <div class="buttons is-fixed">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button pack="fal" icon-right="check" type="is-primary" rounded @click="$parent.close()">
        {{ $t('spremi') }}
      </b-button>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import TennisImage from '@/components/TennisImage.vue'
export default {
  name: 'PlayerGameProfile',
  components: {
    VueApexCharts,
    TennisImage,
  },
  data() {
    return {
      expand: false,
      playerList: [
        {
          id: 1,
          order: 2,
          roundOfPlay: 1,
          name: 'Andrija Kartelo',
          user_image: '/_nuxt/assets/img/user.jpg',
          powerRange: 83.43,
          isSeed: 1,
          elo: 1583,
          age: 23,
        },
        {
          id: 2,
          order: 1,
          roundOfPlay: 1,
          name: 'Marko Novak',
          user_image: '/_nuxt/assets/img/members.jpg',
          powerRange: 45.05,
          isSeed: 0,
          elo: 1583,
          age: 34,
        },
        {
          id: 3,
          order: 3,
          roundOfPlay: 1,
          name: 'Danijel Galić',
          user_image: '/_nuxt/assets/img/user.jpg',
          powerRange: 33.87,
          isSeed: 0,
          elo: 1583,
          age: 35,
        },
        {
          id: 4,
          order: 0,
          roundOfPlay: 1,
          name: 'Stjepan Drmić',
          user_image: '/_nuxt/assets/img/user.jpg',
          powerRange: 56.54,
          isSeed: 0,
          elo: 1583,
          age: 44,
        },
      ],
      selectedProfiler: 0,
      strokes: [50, 50, 50, 50, 50, 50],
      strokesAgregate: [
        [27, 55, 83, 21, 20, 75],
        [38, 47, 75, 15, 11, 60],
        [31, 62, 88, 12, 29, 50],
      ],
      strokesAgregateSum: [85, 15, 75, 54, 24, 34],
      strokesNames: ['servis', 'forhand', 'backend', 'osnovna linija', 'volej', 'slice'],
      type: 50,
      speed: 50,
      max: 100,
      min: 0,
      selectedAnswer: [],
      optionsSmall: {
        xaxis: {
          categories: ['servis', 'forhand', 'backend', 'osnovna linija', 'volej', 'slice'],
          labels: {
            show: true,
            style: {
              colors: ['#2c2c2c'],
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Quicksand, sans-serif',
            },
          },
        },
        colors: ['#ff3860', '#9acd32'],
        stroke: {
          show: false,
        },
        legend: {
          show: true,
        },
        dataLabels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
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
        labels: ['servis', 'forhand', 'backend', 'osnovna linija', 'volej', 'slice'],
      },
      series: [
        {
          name: 'Stjepan Drmić',
          strokes: [50, 50, 50, 50, 50, 50],
        },
      ],
      options: {
        labels: ['April', 'May', 'June', 'July', 'August', 'September'],
        xaxis: {
          categories: ['April', 'May', 'June', 'July', 'August', 'September'],
          labels: {
            show: true,
            style: {
              colors: ['#666666'],
              fontSize: '16px',
              fontFamily: 'Arial',
            },
          },
        },
        yaxis: {
          show: true,
          showAlways: true,
          showForNullSeries: true,
          seriesName: undefined,
          opposite: false,
          reversed: false,
          logarithmic: false,
          logBase: 10,
          tickAmount: 6,
          min: 6,
          max: 6,
          forceNiceScale: false,
          floating: false,
          decimalsInFloat: undefined,
          labels: {
            show: true,
            align: 'right',
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [],
              fontSize: '32px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          title: {
            text: undefined,
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            },
          },
          crosshairs: {
            show: true,
            position: 'back',
            stroke: {
              color: '#b6b6b6',
              width: 1,
              dashArray: 0,
            },
          },
          tooltip: {
            enabled: true,
            offsetX: 0,
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: [],
          dashArray: 0,
        },
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    nextArrow() {
      if (this.activeTab === 0) {
        return true
      }
      if (this.activeTab === 1 && this.newPayment.playerList.length) {
        return true
      }
      if (this.activeTab === 2) {
        return false
      } else {
        return false
      }
    },
  },
  watch: {
    strokes: {
      handler() {
        this.series[0].data = this.strokes
      },
    },
  },
  methods: {
    indicatorWidth(index) {
      const x = this.strokesAgregateSum[index]
      return 'width:' + x + '%'
    },
    indicatorAgregateSum(index) {
      const x = 100 - this.strokesAgregateSum[index]
      return 'right:' + x + '%'
    },
    indicatorAgregate(i, index) {
      const x = 100 - this.strokesAgregate[i][index]
      return 'right:' + x + '%'
    },
    changeStroke(slider) {
      const sum = this.strokes.reduce((sum, val) => sum + val, 0)
      const diff = sum - 300
      let remainder = 0
      const arr = []

      for (const i in this.strokes) {
        if (i !== slider) {
          // don't modify the slider which is being dragged
          let val = this.strokes[i] - diff / (this.strokes.length - 1)
          if (val < 0) {
            remainder += val
            val = 0
          }
          if (val > 100) {
            val = 100
          }
          this.$set(this.strokes, i, val)
        }
      }

      if (remainder) {
        const filteredLength = this.strokes.filter((val, key) => val > 0 && key !== slider).length
        for (const i in this.strokes) {
          if (i !== slider && this.strokes[i] > 0) {
            this.$set(this.strokes, i, this.strokes[i] + remainder / filteredLength)
          }
        }
      }

      this.$emit('input', this.strokes)

      // convert to rounded values
      for (const i in this.strokes) {
        arr.push(Math.round(this.strokes[i]))
        this.selectedAnswer = arr
      }
    },
  },
}
</script>
<style scoped>
input[type='range'] {
  background-color: transparent !important;
  width: 100%;
  height: 28px; /* thumbHeight + (2 x thumbBorderWidth)*/
  -webkit-appearance: none; /*remove the line*/
  outline: 2px;
  border: 2px; /*for firefox on android*/
  padding: 2px; /*for IE*/
  margin: -10px 0 8px;
}

/*chrome and opera*/
input[type='range']::-webkit-slider-runnable-track {
  background: linear-gradient(
    90deg,
    rgba(255, 56, 96, 1) 0%,
    rgba(32, 156, 238, 1) 44%,
    rgba(32, 156, 238, 1) 70%,
    rgba(147, 192, 61, 1) 100%
  ); /*trackColor*/
  height: 4px; /*trackHeight*/
  border-radius: 10px; /*trackHeight*/
  transition: 0.3s;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #fff; /*thumbColor*/
  width: 28px; /* thumbHeight + (2 x thumbBorderWidth)*/
  height: 28px; /* thumbHeight + (2 x thumbBorderWidth)*/
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(97, 108, 121, 0.3), 0 5px 30px 0px rgba(97, 108, 121, 0.5);
  margin-top: -12px; /* -[thumbHeight + (2 x thumbBorderWidth) - trackHeight]/2*/
  cursor: pointer;
  transition: 0.3s;
  z-index: 9;
  position: relative;
}

/*firefox*/
input[type='range']::-moz-focus-outer {
  border: 0;
}

input[type='range']::-moz-range-track {
  background: #ccc; /*trackColor*/
  height: 4px; /*trackHeight*/
  border-radius: 4px; /*trackHeight*/
  /*background isn't animatable, so can't use transition*/
}

input[type='range']:hover::-moz-range-track,
input[type='range']:focus::-moz-range-track {
  background: linear-gradient(
    90deg,
    rgba(255, 56, 96, 1) 0%,
    rgba(32, 156, 238, 1) 44%,
    rgba(32, 156, 238, 1) 70%,
    rgba(147, 192, 61, 1) 100%
  );
}

input[type='range']::-moz-range-thumb {
  -webkit-appearance: none;
  background: #fff; /*thumbColor*/
  width: 28px; /* thumbHeight + (2 x thumbBorderWidth)*/
  height: 28px; /* thumbHeight + (2 x thumbBorderWidth)*/
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(97, 108, 121, 0.3), 0 5px 30px 0px rgba(97, 108, 121, 0.5);
  margin-top: -12px; /* -[thumbHeight + (2 x thumbBorderWidth) - trackHeight]/2*/
  cursor: pointer;
  transition: 0.3s;
  z-index: 9;
  position: relative;
}

/*edge and IE*/
input[type='range']::-ms-track {
  background: red; /*trackColor*/
  height: 4px; /*trackHeight*/
  border-radius: 4px; /*trackHeight*/
  border: none;
  color: transparent;
}

input[type='range']:hover::-ms-track,
input[type='range']:focus::-ms-track {
  background: linear-gradient(
    90deg,
    rgba(255, 56, 96, 1) 0%,
    rgba(32, 156, 238, 1) 44%,
    rgba(32, 156, 238, 1) 70%,
    rgba(147, 192, 61, 1) 100%
  );
}

input[type='range']::-ms-thumb {
  background: red; /*thumbColor*/
  width: 20px; /*thumbHeight*/
  height: 20px; /*thumbHeight*/
  border-radius: 50%;
  border: none;
  margin: 0 4px 0; /*0 thumbBorderWidth 0*/
  box-shadow: 0 0 0 4px red; /*0 0 0 thumbBorderWidth #fff, box-shadow color should match the background*/
  /*cursor:pointer; doesn't work*/
}

input[type='range']::-ms-tooltip {
  display: none; /*tooltip makes thumb sliding lagy*/
}

input[type='range']::-ms-fill-lower {
  background: red; /*thumbColor*/
  border-radius: 4px; /*trackHeight*/
}
input[type='range']::-ms-fill-upper {
  background: linear-gradient(
    90deg,
    rgba(255, 56, 96, 1) 0%,
    rgba(32, 156, 238, 1) 44%,
    rgba(32, 156, 238, 1) 70%,
    rgba(147, 192, 61, 1) 100%
  );
  height: 10px;
  width: 10px;
  border-radius: 40px; /*trackHeight*/
}
input[type='range']:focus::-ms-fill-lower {
  background: linear-gradient(
    90deg,
    rgba(255, 56, 96, 1) 0%,
    rgba(32, 156, 238, 1) 44%,
    rgba(32, 156, 238, 1) 70%,
    rgba(147, 192, 61, 1) 100%
  );
}
</style>
