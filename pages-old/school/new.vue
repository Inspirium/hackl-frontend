<template>
  <div class="p-b-75">
    <PageHeader :title="$t('Nova grupa')" :background="'is-primary'" />
    <indicator class="m-t-20 m-b-20" :options="indicator" :active-step="activeStep" :active-tab="activeTab"></indicator>
    <b-steps v-model="activeStep" :has-navigation="false" :animated="true" class="m-t-15">
      <b-step-item step="1" :label="$t('Naziv')" class="m-t-10" :clickable="true">
        <div class="activity x-container">
          <div class="activity__reservation">
            <b-field class="has-text-centered m-t--20">
              <b-input
                v-model="newSchoolGroup.name"
                wrap="hard"
                custom-class="input__title"
                :placeholder="$t('upiiNazivGrupe')"
              ></b-input>
            </b-field>
          </div>
        </div>
        <div v-if="location.length > 0" class="p-x-16">
          <div class="label">{{ $t('Lista lokacija') }}</div>
          <div class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="item in location"
                  :key="item.id"
                  class="action__item__small fw600"
                  :class="selectedLocations.filter((x) => x.id === item.id).length > 0 ? 'active' : ''"
                  @click.stop="selectLocation(item)"
                >
                  <div class="list__content">
                    <div class="">{{ item.name }}</div>
                    <div class="fw600 has-text-black80 is-size-7 m-l-auto nowrap">{{ item.description }}</div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </b-step-item>
      <b-step-item step="2" :label="$t('logo')" class="m-t-10" :clickable="true">
        <div class="fw600 has-text-centered m-b-30 m-t--20 is-size-6 line-height-14">
          {{ $t('akoEliteMoetePostavitiLogoGrupe') }}
        </div>
        <div class="m-t--10 m-b-20">
          <cropper
            ref="cropper"
            classname="cropper"
            stencil-component="circle-stencil"
            :src="new_image"
            :stencil-props="{
              aspectRatio: 1,
            }"
            @change="change"
          ></cropper>
          <b-button
            v-show="new_image"
            class="m-t-10 center--transform"
            type="is-primary"
            icon-right="check"
            pack="fal"
            rounded
            @click="crop"
          >
            {{ $t('spremiSliku') }}
          </b-button>
          <div v-show="newSchoolGroup.image" class="align__centar__all flex__column">
            <img :src="newSchoolGroup.image" class="user_image-large m-b-15" alt="" />
            <b-button class="is-smaller" type="is-danger" rounded @click="reset"> {{ $t('ukloniSliku') }} </b-button>
          </div>
          <div
            v-show="!new_image && !newSchoolGroup.image"
            class="user_image-large align__centar__all flex__column buttons center--transform"
            @click="$refs.file.click()"
          >
            <b-icon class="" icon="camera" size="is-large" type="is-lightblue" pack="fal"> </b-icon>
            <b-button class="is-smaller m-t-10" type="is-primary" rounded> {{ $t('postaviSliku') }} </b-button>
            <span class="button hide">
              <input ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
              {{ $t('uploadImage') }}
            </span>
          </div>
        </div>
      </b-step-item>
      <b-step-item step="3" :label="$t('polaznici')" class="m-t-10" :clickable="true">
        <div class="fw600 has-text-centered m-b-5 m-t--10 is-size-5 line-height-16">
          {{
            $t('key', {
              expr: newSchoolGroup.players.length
                ? 'Broj članova u grupi: ' + newSchoolGroup.players.length
                : 'Odaberite polaznike grupe',
            })
          }}
        </div>
        <membersSearch @update="schoolMembers"></membersSearch>
      </b-step-item>
    </b-steps>
    <div class="buttons m-t-10 is-fixed">
      <b-button
        v-if="activeStep !== 0"
        :class="['m-l-10', 'fw600']"
        type="is-danger"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click.prevent="activeStep--"
      >
        {{ $t('nazad') }}
      </b-button>
      <b-button
        v-if="activeStep !== 2"
        :class="['m-l-10', 'fw600', nextArrow ? 'blur_button' : '']"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        @click.prevent="activeStep++"
      >
        {{ $t('dalje') }}
      </b-button>
      <b-button
        v-else
        :class="['m-l-10', 'fw600', nextArrow ? 'blur_button' : '']"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
        @click.prevent="submit"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalConfirmation" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmationLeave
        :title="$t('nisteSpremiliPodatkeSigurnoEliteOtii')"
        :subtitle="$t('Potvrdom će uneseni podaci biti izbrisani')"
        @discardChanges="discardChanges()"
        @closeDialog="closeDialog()"
      ></modalConfirmationLeave>
    </b-modal>
  </div>
</template>
<script>
import { Cropper } from 'vue-advanced-cropper'
import SchoolGroup from '@/models/SchoolGroup'
import membersSearch from '~/components/membersSearch'
import indicator from '~/components/IndicatorSteps'
import modalConfirmationLeave from '~/components/modal/ModalConfirmationLeave'
import PageHeader from '~/components/headers/blankBack'
import Location from '~/models/Location'

export default {
  name: 'School',
  components: {
    Cropper,
    membersSearch,
    indicator,
    modalConfirmationLeave,
    PageHeader,
  },
  data() {
    return {
      indicator: {
        steps: 3,
      },
      isModalConfirmation: false,
      isModalActive: false,
      heroImage: '/hero_school.jpg',
      activeTab: 0,
      activeStep: 0,
      activeTabPayment: 0,
      paymentList: [],
      new_image: null,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      newSchoolGroup: {
        image: null,
        name: '',
        players: [],
      },
      to: null,
      saved: false,
      loading: false,
      location: [],
      selectedLocations: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    nextArrow() {
      if (this.activeStep === 0 && this.newSchoolGroup.name === '') {
        return true
      }
      if (this.activeStep === 2 && !this.newSchoolGroup.players.length) {
        return true
      } else {
        return false
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.to || this.newSchoolGroup.name === '' || this.saved) {
      next()
    } else {
      this.to = to
      this.isModalConfirmation = true
    }
  },
  mounted() {
    this.getLocation()
  },
  methods: {
    selectLocation(item) {
      const index = this.selectedLocations.findIndex((selectedItem) => selectedItem.id === item.id)
      if (index > -1) {
        this.selectedLocations.splice(index, 1)
      } else {
        this.selectedLocations.push(item)
      }
    },
    getLocation() {
      Location.where('club', this.club.id)
        .get()
        .then((res) => {
          this.location = res.data
        })
    },
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    schoolMembers(data) {
      this.$set(this.newSchoolGroup, 'players', data)
    },
    reset() {
      this.newSchoolGroup.image = null
    },
    change({ coordinates, canvas }) {},
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.newSchoolGroup.image = canvas.toDataURL()
      this.new_image = null
    },
    uploadImage(event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.new_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    submit() {
      this.loading = true
      if (this.selectedLocations.length) {
        this.newSchoolGroup.locations = this.selectedLocations
      }
      const g = new SchoolGroup(this.newSchoolGroup)
      g.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Grupa je spremljena'),
            type: 'is-success',
          })
          this.saved = true
          this.loading = false
          this.$router.push(this.localePath('/school'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
