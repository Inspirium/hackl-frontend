<template>
  <div v-if="schoolGroup" class="member p-b-200">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>

    <div class="member__info">
      <TennisImage :size="[180, 180]" :src="schoolGroup.image" class="user_image-large m-r-5 m-t-30" alt="" />
      <div class="title m-b-10 m-t-5">{{ schoolGroup.name }}</div>
    </div>
    <div class="buttons m-t-20">
      <b-button
        type="is-danger"
        pack="fal"
        icon-right="times"
        rounded
        :loading="loading"
        @click="isModalDeleteActiveGroup = true"
      >
        {{ $t('obriiGrupu') }}
      </b-button>
    </div>

    <div class="x-container registration">
      <b-field :label="$t('nazivKluba')" size="is-medium" class="login__input__container">
        <b-input v-model="schoolGroup.name" :placeholder="$t('upiiNazivKluba')" type="text" rounded> </b-input>
      </b-field>
      <div class="label">{{ $t('trener') }}</div>
      <div class="activity__reservation">
        <transition name="fade">
          <div class="activity__box action__buttons">
            <div v-for="trainer in schoolGroup.trainers" :key="trainer.id" class="action__item__small fw600">
              <TennisImage :size="[32, 32]" :src="trainer.image" class="user_image-small m-r-10 border__white" alt="" />
              <div>{{ trainer.display_name }}</div>
              <div
                class="m-l-auto"
                @click.stop="
                  isModalDeleteActiveTrainer = true
                  selectedTrainer = trainer
                "
              >
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="buttons m-t-20">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fas"
          icon-right="plus"
          rounded
          :loading="loadingTrainer"
          @click.prevent="isModalMembersActiveTrainer = true"
        >
          {{ $t('dodajTrenera') }}
        </b-button>
      </div>

      <div class="label">{{ $t('lanovi2') }}</div>
      <div class="activity__reservation">
        <transition name="fade">
          <div class="activity__box action__buttons">
            <div v-for="player in schoolGroup.players" :key="player.id" class="action__item__small fw600">
              <TennisImage :size="[32, 32]" :src="player.image" class="user_image-small m-r-10 border__white" alt="" />
              <div>{{ player.display_name }}</div>
              <div
                class="m-l-auto"
                @click.stop="
                  isModalDeleteActive = true
                  selectedPlayer = player
                "
              >
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="buttons m-t-20">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fas"
          icon-right="plus"
          rounded
          :loading="loadingMemeber"
          @click.prevent="isModalMembersActive = true"
        >
          {{ $t('dodajLana') }}
        </b-button>
      </div>
      <template v-if="location.length > 0">
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
      </template>
    </div>
    <div
      v-if="!isModalDeleteActive && !isModalMembersActive && !isModalDeleteActiveTrainer && !isModalDeleteActiveGroup"
      class="buttons is-fixed m-t-20"
    >
      <b-button
        type="is-danger"
        pack="fal"
        icon-left="times"
        rounded
        tag="nuxt-link"
        :to="localePath('/school/' + $route.params.id)"
      >
        {{ $t('otkai') }}
      </b-button>
      <b-button type="is-primary" pack="fal" icon-right="check" rounded :loading="loading" @click="submit">
        {{ $t('spremi') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalDeleteActiveGroup" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation :title="$t('jesteLiSigurni')" @update="deleteGroup()"></modalConfirmation>
    </b-modal>
    <b-modal
      :active.sync="isModalDeleteActive"
      :width="640"
      class="modal__confirmation"
      scroll="clip"
      @close="deletePlayer"
    >
      <modalConfirmation :title="$t('jesteLiSigurni')" @close="deletePlayer"></modalConfirmation>
    </b-modal>
    <b-modal
      :active.sync="isModalDeleteActiveTrainer"
      :width="640"
      class="modal__confirmation"
      scroll="clip"
      @close="deleteTrainer"
    >
      <modalConfirmation :title="$t('jesteLiSigurni')"></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :title="$t('dodajteIgraa')"
        :show-tennis-school="false"
        :is-player="true"
        @player="updatePlayerList($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalMembersActiveTrainer" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :title="$t('dodajteTrenera')"
        :show-tennis-school="false"
        :is-player="true"
        @player="updateTrainerList($event)"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import SchoolGroup from '@/models/SchoolGroup'
import Player from '@/models/Player'
import Trainer from '@/models/Trainer'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembersAll'
import Location from '~/models/Location'

export default {
  name: 'SchoolGroupEdit',
  components: {
    modalConfirmation,
    modalMembers,
    TennisImage,
  },
  async fetch() {
    await this.getGroups()
  },
  data() {
    return {
      loadingTrainer: false,
      loadingMemeber: false,
      isModalDeleteActive: false,
      isModalDeleteActiveTrainer: false,
      isModalDeleteActiveGroup: false,
      isModalMembersActive: false,
      isModalMembersActiveTrainer: false,
      schoolGroup: null,
      selectedPlayer: null,
      selectedTrainer: null,
      activeTab: 0,
      loading: false,
      test: '',
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
    async getGroups() {
      const id = this.$route.params.id
      this.schoolGroup = await SchoolGroup.include('players', 'locations').find(id)
      this.selectedLocations = this.schoolGroup.locations
    },
    deletePlayer() {
      this.schoolGroup.players.splice(this.schoolGroup.players.indexOf(this.selectedPlayer), 1)
      const p = new Player(this.selectedPlayer).for(this.schoolGroup)
      p.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Igrač je uklonjen iz grupe'),
          type: 'is-success',
          duration: 1000,
        })
        this.getGroups()
      })
    },
    updatePlayerList(player) {
      this.loadingMemeber = true
      const x = player.team
      const g = new SchoolGroup({ id: this.schoolGroup.id })
      g.players()
        .attach(x)
        .then((res) => {
          this.schoolGroup = res.data
          this.getGroups()
          this.loadingMemeber = false
        })
        .catch(() => {
          this.loadingMemeber = false
        })
    },
    deleteTrainer() {
      this.schoolGroup.trainers.splice(this.schoolGroup.trainers.indexOf(this.selectedTrainer), 1)
      const p = new Trainer(this.selectedTrainer).for(this.schoolGroup)
      p.delete()
    },
    updateTrainerList(player) {
      this.loadingTrainer = true
      const g = new SchoolGroup({ id: this.schoolGroup.id })
      g.trainer()
        .attach(player)
        .then((res) => {
          this.schoolGroup = res.data
          this.loadingTrainer = false
        })
        .catch(() => {
          this.loadingTrainer = false
        })
    },
    deleteGroup() {
      this.loading = true
      const g = new SchoolGroup(this.schoolGroup)
      g.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Grupa je obrisana'),
            type: 'is-success',
          })
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
    submit() {
      this.loading = true
      // const locations = this.selectedLocations.map((item) => item.id)
      const g = new SchoolGroup({
        id: this.schoolGroup.id,
        name: this.schoolGroup.name,
        locations: this.selectedLocations,
      })
      // console.log(locations)

      g.save()
        .then((res) => {
          this.schoolGroup = res.data
          this.$buefy.toast.open({
            message: this.$t('Grupa je spremljena'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/school/' + this.$route.params.id))
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

<style scoped></style>
