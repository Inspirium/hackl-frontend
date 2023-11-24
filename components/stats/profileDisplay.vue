<template>
  <div>
    <div
      v-if="profiler && userWhoProfiledThisPlayer"
      class="align__centar__all flex__column is-primary has-text-white p-t-10 p-b-10 profile-black-header radius__5 m-t-15"
    >
      <div class="is-text-center fw600 is-size-3 p-l-10 p-r-10 has-text-centered line-height-22 m-t-5">
        {{ $t('igraKojiTeProfilirao') }}
      </div>
      <div class="align__centar__all m-b-10 m-t-10">
        <TennisImage
          :size="[52, 52]"
          :src="userWhoProfiledThisPlayer.image"
          class="user_image-mediumsmall m-r-10 border__white--2 softshadow2"
          alt=""
        />
        <div class="">
          <div class="fw600 is-size-4 black">{{ userWhoProfiledThisPlayer.display_name }}</div>
        </div>
      </div>
      <div v-if="true" class="buttons m-t-10">
        <b-button
          class="softshadow m-t-10 m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="chart-line"
          rounded
          @click="$router.push(localePath('/player/' + userWhoProfiledThisPlayer.id + '/profile'))"
        >
          {{ $t('profilirajIgraa') }}
        </b-button>
      </div>
    </div>

    <div v-if="playerProfile.length" class="profile-display">
      <div
        :class="['fw600', 'has-text-centered', 'm-b-0', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
      >
        {{ $t('igra3') }}
      </div>
      <div class="p-l-15 p-r-15 p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered">
        {{ $t('profilStilaIgre') }}
      </div>
      <div class="relative m-b-10 profile-display-label-top">
        <div class="fw600 is-size-65 profile-indicator-shade is-size-6 m-r-5" @click="strokesAgregateSum()">
          {{ $t('ofenzivna') }}
        </div>
        <b-field :label="$t('defanzivna')">
          <b-slider
            v-if="selectedProfiler === null"
            v-model="typeSum"
            :tooltip="true"
            disabled
            size="is-large"
            type="is-info"
            indicator
          ></b-slider>
          <b-slider
            v-else
            v-model="playerProfile[selectedProfiler].data.play.type"
            :tooltip="true"
            disabled
            size="is-large"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
        <b-field :label="$t('brzina')">
          <b-slider
            v-if="selectedProfiler === null"
            v-model="speedSum"
            :tooltip="true"
            disabled
            size="is-large"
            type="is-info"
            indicator
          ></b-slider>
          <b-slider
            v-else
            v-model="playerProfile[selectedProfiler].data.play.speed"
            :tooltip="true"
            disabled
            size="is-large"
            type="is-info"
            indicator
          ></b-slider>
        </b-field>
      </div>
      <div class="divider-line-1 m-t-0"></div>
      <div
        :class="['fw600', 'has-text-centered', 'm-b-0', 'm-t-20', 'is-size-4', 'line-height-16', 'has-text-black80']"
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
          <div class="absolute profile-agregate-thumb-triangle" :style="indicatorAgregateSum(index)"></div>
          <div class="fw600 is-size-65 profile-indicator-shade m-r-5">
            {{ Math.round(strokesAgregateSumAll[index]) }}
          </div>
          <div
            v-for="(item, i) in strokesAgregateList"
            :key="i"
            :class="[i === selectedProfiler ? 'profile-indicator-player-selected' : 'profile-indicator-player']"
            :style="indicatorAgregate(i, index)"
          ></div>
        </b-field>
      </div>
      <div class="fw600 has-text-right is-size-6 m-b-10">
        {{ $t('igraiKojiSuProfilirali') }} <span class="has-text-lightblue">({{ playerProfile.length }})</span>
      </div>
      <div class="divider-line-1"></div>
      <div
        v-if="true"
        class="justify-end"
        style="transition: 0.3s all"
        :class="expand ? 'club-logo-list-display--extend p-t-5' : 'club-logo-list-display'"
      >
        <div
          v-for="(prof, index) in profilersList"
          :key="prof.id"
          style="transition: 0.3s all"
          class="flex justify-content-end align__centar__y m-b-5 m-t-10"
          @click="expand = true"
        >
          <div style="transition: 0.3s all" class="fw600 is-size-65 has-text-black80 name m-r-10">
            {{ prof.display_name }}
          </div>
          <TennisImage
            :size="[42, 42]"
            style="transition: 0.3s all"
            :src="prof.image"
            class="user_image-small border__white softshadow"
            alt=""
          />

          <div v-if="expand" class="m-l-10">
            <div class="buttons m-b--10">
              <b-button
                class="m-t-7 softshadow"
                :class="{ 'invert-small-button': selectedProfiler === index }"
                :type="{
                  'is-mini-solo': true,
                  noborder: true,
                  'is-primary has-text-white': selectedProfiler === index,
                }"
                pack="fal"
                :icon-right="selectedProfiler === index ? 'times' : ''"
                rounded
                @click="selectedProfiler === index ? (selectedProfiler = null) : (selectedProfiler = index)"
              >
                {{ selectedProfiler === index ? $t('Prikazan') : $t('Prikaži') }}
              </b-button>
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
      <div class="divider-line-1 m-t-5"></div>
      <div v-if="true" class="buttons m-t-10">
        <b-button
          v-if="userHasProfiled.length"
          class="softshadow m-t-10 m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="repeat"
          rounded
          @click="$router.push(localePath('/player/' + player.players[0].id + '/profile'))"
        >
          {{ $t('profilirajPonovno') }}
        </b-button>
        <b-button
          v-else
          class="softshadow m-t-10 m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="chart-line"
          rounded
          @click="$router.push(localePath('/player/' + player.players[0].id + '/profile'))"
        >
          {{ user.id === player.id ? $t('Profiliraj svoju igru') : $t('Profiliraj igrača') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import PlayerProfile from '~/models/PlayerProfile'
import Player from '~/models/Player'

export default {
  name: 'PlayersProfile',
  components: {
    TennisImage,
  },
  props: {
    player: {
      type: Object,
      required: true,
      default() {},
    },
    profiler: {
      type: Number,
      required: false,
      default: null,
    },
    black: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      playerProfileRaw: [],
      loading: false,
      expand: false,
      selectedProfiler: null,
      selectedProfiler1: null,
      strokes: [50, 50, 50, 50, 50, 50],
      strokesAgregateSumAll: [0, 0, 0, 0, 0, 0],
      strokesNames: ['servis', 'forhand', 'backend', 'osnovna linija', 'volej', 'slice'],
      type: 50,
      typeSum: 0,
      speed: 0,
      speedSum: 0,
      max: 100,
      min: 0,
      selectedAnswer: [],
      sliderValue: 0,
      strokesAgregateList: [],
      userWhoProfiledThisPlayer: {},
    }
  },
  computed: {
    // omit if don't have profile values
    playerProfile() {
      return this.playerProfileRaw.filter((item) => {
        return +item.data.strokes.length
      })
    },
    sliderType() {
      if (this.sliderValue > 25 && this.sliderValue < 75) {
        return 'is-warning'
      } else if (this.sliderValue >= 75) {
        return 'is-success'
      }
      return 'is-danger'
    },
    user() {
      return this.$store.state.auth.user
    },
    userHasProfiled() {
      return this.playerProfile.filter((item) => {
        return item.owner_id === this.user.id
      })
    },
    profilersList() {
      const arrSum = []
      for (let i = 0; i < this.playerProfile.length; i++) {
        arrSum.push(this.playerProfile[i].owner)
      }
      return arrSum
    },
  },
  watch: {
    // Push to selected profiler if user has profiled
    userHasProfiled: {
      handler() {
        if (this.userHasProfiled.length) {
          const index = this.playerProfile.findIndex((item) => {
            return item.id === this.userHasProfiled[0].id
          })
          this.selectedProfiler = index
        }
      },
    },
    player: {
      immediate: true,
      handler() {
        if (Object.keys(this.player).length) {
          this.getPlayerProfile()
        }
      },
    },
  },
  mounted() {
    if (this.profiler) {
      Player.find(this.profiler).then((res) => {
        this.userWhoProfiledThisPlayer = res
      })
    }
  },
  methods: {
    userWhoProfiled() {
      if (Object.keys(this.userWhoProfiledThisPlayer).length) {
        const index = this.playerProfile.findIndex((item) => {
          return item.owner_id === this.userWhoProfiledThisPlayer.id
        })
        this.selectedProfiler = index
      }
    },
    strokesAgregate() {
      const arr = []
      for (let i = 0; i < this.playerProfile.length; i++) {
        arr.push(this.playerProfile[i].data.strokes)
      }
      this.strokesAgregateList = arr
      this.strokesAgregateSum()
      this.speedAgregateSum()
      this.typeAgregateSum()
    },
    strokesAgregateSum() {
      const arrSum = [0, 0, 0, 0, 0, 0]
      for (let i = 0; i < this.playerProfile.length; i++) {
        for (let e = 0; e < 6; e++) {
          const source = this.playerProfile[i].data.strokes[e]
          arrSum[e] = arrSum[e] + source
          if (i === this.playerProfile.length - 1 && e === 5) {
            this.strokesAgregateSumAll = arrSum
            for (let x = 0; x < 6; x++) {
              this.strokesAgregateSumAll[x] = this.strokesAgregateSumAll[x] / this.strokesAgregateList.length
            }
          }
        }
      }
    },
    speedAgregateSum() {
      const speed = []
      for (let i = 0; i < this.playerProfile.length; i++) {
        speed.push(this.playerProfile[i].data.play.speed)
        if (i === this.playerProfile.length - 1) {
          const sum = speed.reduce((partialSum, a) => partialSum + a, 0)
          const total = this.playerProfile.length
          this.speed = speed
          this.speedSum = +(sum / total).toFixed(0)
        }
      }
    },
    typeAgregateSum() {
      const type = []
      for (let i = 0; i < this.playerProfile.length; i++) {
        type.push(this.playerProfile[i].data.play.type)
        if (i === this.playerProfile.length - 1) {
          const sum = type.reduce((partialSum, a) => partialSum + a, 0)
          const total = this.playerProfile.length
          this.type = type
          this.typeSum = +(sum / total).toFixed(0)
        }
      }
    },
    getPlayerProfile() {
      const playerId = this.player.type === 'player' ? this.player.id : this.player.players[0].id
      PlayerProfile.where('player', playerId)
        .include('owner')
        .get()
        .then((res) => {
          this.playerProfileRaw = res.data
          this.strokesAgregate()
          this.userWhoProfiled()
          if (res.data.length === 0) {
            this.$emit('hideProfile')
          }
        })
    },
    indicatorWidth(index) {
      const x = this.strokesAgregateSum[index]
      return 'width:' + x + '%'
    },
    indicatorAgregateSum(index) {
      const x = 100 - this.strokesAgregateSumAll[index]
      return 'right:' + x + '%'
    },
    indicatorAgregate(i, index) {
      const x = 100 - this.strokesAgregateList[i][index]
      return 'right:' + x + '%'
    },
    indicatorAgregateSelected(index) {
      const x = 100 - this.userHasProfiled[0].data.strokes[index]
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
