<template>
  <div :class="{ 'profile-black': black }" class="players-profile hidescrollbar">
    <!--    <div class="breadcrumbs breadcrumbs-back m-t-10">-->
    <!--      <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">-->
    <!--        <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>-->
    <!--        <span class="m-r-5">Nazad</span>-->
    <!--      </a>-->
    <!--    </div>-->

    <div
      v-if="sameUser"
      class="align__centar__all flex__column is-primary has-text-white p-t-10 p-b-10 profile-black-header"
    >
      <div class="is-text-center fw600 is-size-3 p-l-10 p-r-10 has-text-centered line-height-22 m-t-5">
        {{ isReprofile.length ? $t('Ponovno se profiliraj') : $t('Profiliraj svoju igru') }}
      </div>
    </div>
    <div v-else class="align__centar__all flex__column is-primary has-text-white p-t-10 p-b-10 profile-black-header">
      <div class="is-text-center fw600 is-size-3 p-l-10 p-r-10 has-text-centered line-height-22 m-t-5">
        {{ isReprofile.length ? $t('Ponovno profiliraj igrača') : $t('Profiliraj igrača') }}
      </div>
      <div class="fw600 is-size-6 has-text-white has-text-centered m-t-5">
        {{ isReprofile.length ? $t('Doradi svoju procjenu') : $t('Jesi li dobar u procjeni igre protivnika?') }}
      </div>
    </div>
    <div
      v-if="!isReprofile.length && !sameUser"
      class="fw600 is-size-65 has-text-black50 has-text-centered gray profile-black-box"
    >
      {{ $t('profilirajIgraaIUsporediSeSDrugimKorisnicma') }}
      <div class="divider-line-1 m-t-15"></div>
    </div>
    <div v-if="player" class="align__centar__all m-b-10 m-t-10">
      <TennisImage
        :size="[42, 42]"
        :src="player.image"
        class="user_image-mediumsmall m-r-10 border__white--4 softshadow2"
        alt=""
      />
      <div class="">
        <div class="fw600 is-size-4 black">{{ player.display_name }}</div>
        <div class="fw600 is-size-65 has-text-lightblue">{{ $t('bodova2', { round: Math.round(player.rating) }) }}</div>
      </div>
    </div>
    <div class="divider-line-1 m-t-15"></div>
    <div class="p-l-5 p-r-5 p-b-150 profile-graph">
      <div
        :class="[
          'fw600',
          'has-text-centered',
          'm-b-5',
          'm-t-20',
          'is-size-4',
          'line-height-16',
          'has-text-black80',
          'black',
        ]"
      >
        {{ $t('igra3') }}
      </div>
      <div class="p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered gray">
        {{ $t('profilirajIgraevOpenitiStilIgre') }}
      </div>
      <div class="relative m-b-10">
        <div class="fw600 is-size-65 profile-indicator-shade is-size-6 m-r-5 black">{{ $t('ofenzivna') }}</div>
        <b-field :label="$t('defanzivna')">
          <b-slider v-model="play.type" :tooltip="true" size="is-large" type="is-info" indicator></b-slider>
        </b-field>
      </div>
      <b-field :label="$t('brzina')" class="m-t-30">
        <b-slider v-model="play.speed" :tooltip="true" size="is-large" type="is-info" indicator></b-slider>
      </b-field>
      <div class="divider-line-1 m-t-30"></div>
      <div
        :class="[
          'fw600',
          'has-text-centered',
          'm-b-5',
          'm-t-20',
          'is-size-4',
          'line-height-16',
          'has-text-black80',
          'black',
        ]"
      >
        {{ $t('udarci') }}
      </div>

      <div class="p-t-5 p-b-15 fw600 is-size-65 has-text-black50 has-text-centered gray">
        {{ $t('profilirajIgraeveUdaraceIspodIIzndaprosjenoObzirom') }}
      </div>
      <div class="flex align__centar__y m-b-5 justify-between">
        <div class="fw600 is-size-65 is-uppercase relative m-r-10 has-text-danger">{{ $t('ispodprosjeno') }}</div>
        <div class="fw600 is-size-65 is-uppercase relative m-l-10 has-text-darkgreen has-text-right">
          {{ $t('iznadprosjeno') }}
        </div>
      </div>
      <div class="profile-indicator-legend m-b-20 h1"></div>

      <div v-for="(option, index) in strokes" :key="index" class="relative m-t-5">
        <b-field :label="$t(strokesNames[index])">
          <!--          <div :style="indicatorWidth(index)" class="profile-indicator-shader"></div>-->
          <div class="fw600 is-size-65 profile-indicator-shade m-r-5 black">{{ Math.round(strokes[index]) }}</div>
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
      <div class="buttons m-t-30">
        <b-button v-if="black" icon-left="times" pack="fal" type="is-danger" rounded @click="$emit('close')">
          {{ $t('preskoi') }}
        </b-button>
        <b-button v-else icon-left="times" pack="fal" type="is-danger" rounded @click="$router.go(-1)">
          {{ $t('odustani') }}
        </b-button>
        <b-button pack="fal" icon-right="check" type="is-primary" rounded @click="save()">
          {{ $t('profiliraj') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import TennisImage from '@/components/TennisImage.vue'
import PlayerProfile from '~/models/PlayerProfile'

export default {
  name: 'PlayersProfileComponent',
  components: { TennisImage },
  props: {
    player: {
      type: Object,
      required: false,
      default() {},
    },
    black: {
      type: Boolean,
      required: false,
      default: false,
    },
    isReprofile: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      loading: false,
      expand: false,
      selectedProfiler: 0,
      play: {
        type: 50,
        speed: 50,
      },
      strokes: [50, 50, 50, 50, 50, 50],
      strokesNames: ['servis', 'forhand', 'backend', 'osnovna linija', 'volej', 'slice'],
      strokesAgregate: [
        [27, 55, 83, 21, 20, 75],
        [38, 47, 75, 15, 11, 60],
        [31, 62, 88, 12, 29, 50],
      ],
      strokesAgregateSum: [85, 15, 75, 54, 24, 34],
      max: 100,
      min: 0,
      roundedStrokes: [],
      sliderValue: 0,
      touched: false,
      isEditing: false,
    }
  },
  computed: {
    sameUser() {
      if (this.player !== undefined) {
        return this.user.id === this.player.id
      }
      return false
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
        this.touched = true
        this.hapticsVibrate()
      },
    },
    play: {
      deep: true,
      handler() {
        this.touched = true
        this.hapticsVibrate()
      },
    },
    isReprofile: {
      handler() {
        if (this.isReprofile.length) {
          this.play.type = this.isReprofile[0].data.play.type
          this.play.speed = this.isReprofile[0].data.play.speed
          if (this.isReprofile[0].data.strokes.length) {
            this.strokes = this.isReprofile[0].data.strokes
          }
        }
      },
    },
  },
  methods: {
    async hapticsVibrate() {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light })
      }
    },
    save() {
      if (this.touched) {
        const p = new PlayerProfile({
          player: { id: this.player.players[0].id },
          data: { play: this.play, strokes: this.roundedStrokes },
        })
        p.save()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste profilirari igrača'),
              type: 'is-success',
            })
            this.$emit('close')
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      } else {
        this.$buefy.toast.open({
          message: this.$t('Unesite vrijednosti prije spremanja profila'),
          type: 'is-danger',
          duration: 3000,
        })
      }
    },
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

      this.$emit('change', this.strokes)

      // convert to rounded values
      for (const i in this.strokes) {
        arr.push(Math.round(this.strokes[i]))
        this.roundedStrokes = arr
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
